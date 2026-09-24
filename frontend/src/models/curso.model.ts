export type NivelCurso = "Iniciante" | "Intermediário" | "Avançado";

export interface ICurso {
    id?: number;
    titulo: string;
    descricao: string;
    idInstrutor: number;
    idCategoria: number;
    nivel: NivelCurso;
    dataPublicacao: string;
    totalAulas: number;
    totalHoras: number;
}
