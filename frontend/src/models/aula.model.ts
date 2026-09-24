export type TipoConteudo = "Vídeo" | "Texto" | "Quiz";

export interface IAula {
    id?: number;
    idModulo: number;
    titulo: string;
    tipoConteudo: TipoConteudo;
    urlConteudo: string;
    duracaoMinutos: number;
    ordem: number;
}
