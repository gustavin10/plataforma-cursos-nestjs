export type StatusProgresso = "Não Iniciado" | "Em Progresso" | "Concluído";

export interface IProgressoAula {
    id?: number;
    idUsuario: number;
    idAula: number;
    dataConclusao: string | null;
    status: StatusProgresso;
}
