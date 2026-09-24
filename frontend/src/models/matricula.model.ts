export interface IMatricula {
    id?: number;
    idUsuario: number;
    idCurso: number;
    dataMatricula: string;
    dataConclusao: string | null;
}
