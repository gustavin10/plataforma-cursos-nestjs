import { authService } from "./auth.service";
import { API_URL } from "./config";

export { API_URL };

// Datas do PostgreSQL chegam como "2025-01-10T00:00:00.000Z".
// Convertemos para "2025-01-10" para funcionar com os inputs type="date" das telas.
const DATA_ISO = /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/;

function normalizarDatas<R>(dados: R): R {
    if (Array.isArray(dados)) return dados.map(normalizarDatas) as R;
    if (dados && typeof dados === "object") {
        const saida: Record<string, unknown> = {};
        for (const [chave, valor] of Object.entries(dados)) {
            saida[chave] = typeof valor === "string" && DATA_ISO.test(valor) ? valor.substring(0, 10) : valor;
        }
        return saida as R;
    }
    return dados;
}

// Faz a requisição enviando o token JWT (Bearer) e trata os erros da API.
export async function requisicao<R>(caminho: string, opcoes: RequestInit = {}): Promise<R> {
    const token = authService.getToken();
    const resposta = await fetch(`${API_URL}${caminho}`, {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...opcoes.headers,
        },
    });

    // Token ausente, inválido ou expirado: encerra a sessão e volta para o login
    if (resposta.status === 401 && caminho !== "/auth/login") {
        authService.logout();
        window.location.href = "/login";
        throw new Error("Sessão expirada. Faça login novamente.");
    }

    if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => null);
        const mensagem = Array.isArray(corpo?.message) ? corpo.message.join(" ") : corpo?.message;
        throw new Error(mensagem || `Erro ${resposta.status} na requisição.`);
    }

    if (resposta.status === 204) return undefined as R;
    const texto = await resposta.text();
    return normalizarDatas(texto ? JSON.parse(texto) : undefined) as R;
}

// Classe genérica de CRUD reutilizável por qualquer entidade.
// Centraliza o consumo da API NestJS seguindo o padrão de service layer.
export class ApiService<T extends { id?: number }> {

    private readonly recurso: string;

    constructor(recurso: string) {
        this.recurso = recurso;
    }

    private get caminho(): string {
        return `/${this.recurso}`;
    }

    listar(): Promise<T[]> {
        return requisicao<T[]>(this.caminho);
    }

    buscarPorId(id: number): Promise<T> {
        return requisicao<T>(`${this.caminho}/${id}`);
    }

    inserir(entidade: T): Promise<T> {
        return requisicao<T>(this.caminho, {
            method: "POST",
            body: JSON.stringify(entidade),
        });
    }

    alterar(id: number, entidade: T): Promise<T> {
        return requisicao<T>(`${this.caminho}/${id}`, {
            method: "PATCH",
            body: JSON.stringify(entidade),
        });
    }

    excluir(id: number): Promise<void> {
        return requisicao<void>(`${this.caminho}/${id}`, { method: "DELETE" });
    }
}
