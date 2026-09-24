// Formata data ISO (yyyy-mm-dd) para o padrão brasileiro dd/mm/aaaa
export function formatarData(dataIso: string | null | undefined): string {
    if (!dataIso) return "-";
    const apenasData = dataIso.substring(0, 10);
    const partes = apenasData.split("-");
    if (partes.length !== 3) return dataIso;
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
}

// Formata número para moeda brasileira (R$ 10.000,50)
export function formatarMoeda(valor: number): string {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

// Data de hoje em formato ISO (yyyy-mm-dd) para inputs date
export function dataHoje(): string {
    return new Date().toISOString().substring(0, 10);
}

// Gera um código de verificação aleatório para certificados
export function gerarCodigoVerificacao(): string {
    const bloco = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    return `GM-${bloco()}-${bloco()}-${bloco()}`;
}

// Gera um ID de transação simulado para o gateway de pagamento
export function gerarIdTransacao(): string {
    return `TXN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
}
