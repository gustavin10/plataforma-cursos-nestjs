export interface IAvaliacao {
    id?: number;
    idUsuario: number;
    idCurso: number;
    nota: 1 | 2 | 3 | 4 | 5;
    comentario: string | null;
    dataAvaliacao: string;
}
