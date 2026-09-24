import { useState, useEffect, useCallback } from "react";
import type { ApiService } from "../services/api";

export interface FeedbackMensagem {
    tipo: "success" | "danger";
    texto: string;
}

// Extrai a mensagem de erro devolvida pela API (ex.: "E-mail já cadastrado.")
export function mensagemErro(erro: unknown): string {
    return erro instanceof Error ? erro.message : "erro desconhecido.";
}

// Hook reutilizável que encapsula o ciclo CRUD (carregar, salvar, excluir)
// para qualquer entidade que use a ApiService genérica (API NestJS).
export function useCrud<T extends { id?: number }>(service: ApiService<T>) {

    const [itens, setItens] = useState<T[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackMensagem | null>(null);

    const carregar = useCallback(async () => {
        setCarregando(true);
        try {
            const dados = await service.listar();
            setItens(dados);
        } catch (erro) {
            setFeedback({ tipo: "danger", texto: `Erro ao carregar dados: ${mensagemErro(erro)} Verifique se a API está rodando.` });
        } finally {
            setCarregando(false);
        }
    }, [service]);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const salvar = useCallback(async (entidade: T, id?: number) => {
        try {
            if (id) {
                await service.alterar(id, entidade);
                setFeedback({ tipo: "success", texto: "Registro alterado com sucesso!" });
            } else {
                await service.inserir(entidade);
                setFeedback({ tipo: "success", texto: "Registro inserido com sucesso!" });
            }
            await carregar();
            return true;
        } catch (erro) {
            setFeedback({ tipo: "danger", texto: `Erro ao salvar o registro: ${mensagemErro(erro)}` });
            return false;
        }
    }, [service, carregar]);

    const excluir = useCallback(async (id: number) => {
        try {
            await service.excluir(id);
            setFeedback({ tipo: "success", texto: "Registro excluído com sucesso!" });
            await carregar();
        } catch (erro) {
            setFeedback({ tipo: "danger", texto: `Erro ao excluir o registro: ${mensagemErro(erro)}` });
        }
    }, [service, carregar]);

    return { itens, carregando, feedback, setFeedback, carregar, salvar, excluir };
}
