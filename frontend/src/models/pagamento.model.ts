export type MetodoPagamento = "Cartão de Crédito" | "Boleto" | "Pix";

export interface IPagamento {
    id?: number;
    idAssinatura: number;
    valorPago: number;
    dataPagamento: string;
    metodoPagamento: MetodoPagamento;
    idTransacaoGateway: string;
}
