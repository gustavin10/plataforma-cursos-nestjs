import { API_URL } from "./config";
import type { IUsuarioLogado } from "../models/usuario.model";

const CHAVE_TOKEN = "token";
const CHAVE_USUARIO = "usuario";

interface RespostaLogin {
    access_token: string;
    usuario: IUsuarioLogado;
}

// Guarda o token JWT no localStorage e expõe os dados do usuário logado.
export const authService = {

    async login(email: string, senha: string): Promise<IUsuarioLogado> {
        const resposta = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });
        if (!resposta.ok) {
            const corpo = await resposta.json().catch(() => null);
            throw new Error(corpo?.message ?? "Não foi possível fazer login.");
        }
        const dados: RespostaLogin = await resposta.json();
        localStorage.setItem(CHAVE_TOKEN, dados.access_token);
        localStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados.usuario));
        return dados.usuario;
    },

    logout() {
        localStorage.removeItem(CHAVE_TOKEN);
        localStorage.removeItem(CHAVE_USUARIO);
    },

    getToken(): string | null {
        return localStorage.getItem(CHAVE_TOKEN);
    },

    getUsuario(): IUsuarioLogado | null {
        const dados = localStorage.getItem(CHAVE_USUARIO);
        return dados ? JSON.parse(dados) : null;
    },

    estaAutenticado(): boolean {
        return !!this.getToken();
    },
};
