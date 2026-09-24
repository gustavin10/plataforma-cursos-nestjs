import { useState, useEffect } from "react";
import { Select } from "../../../components/Select";
import { Button } from "../../../components/Button";
import { Alert } from "../../../components/Alert";
import { mensagemErro, type FeedbackMensagem } from "../../../hooks/useCrud";
import { usuarioService } from "../../../services/usuario.service";
import { planoService } from "../../../services/plano.service";
import { assinaturaService } from "../../../services/assinatura.service";
import { pagamentoService } from "../../../services/pagamento.service";
import type { IUsuario } from "../../../models/usuario.model";
import type { IPlano } from "../../../models/plano.model";
import type { MetodoPagamento } from "../../../models/pagamento.model";
import { formatarMoeda, dataHoje, gerarIdTransacao } from "../../../utils/formatadores";

const METODOS = [
    { valor: "Cartão de Crédito", rotulo: "Cartão de Crédito" },
    { valor: "Boleto", rotulo: "Boleto" },
    { valor: "Pix", rotulo: "Pix" },
];

// Soma N meses a uma data ISO e devolve em ISO
function adicionarMeses(dataIso: string, meses: number): string {
    const d = new Date(dataIso + "T00:00:00");
    d.setMonth(d.getMonth() + meses);
    return d.toISOString().substring(0, 10);
}

export const CheckoutTab = () => {

    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
    const [planos, setPlanos] = useState<IPlano[]>([]);
    const [idUsuario, setIdUsuario] = useState<number>(0);
    const [idPlano, setIdPlano] = useState<number>(0);
    const [metodo, setMetodo] = useState<MetodoPagamento>("Pix");
    const [feedback, setFeedback] = useState<FeedbackMensagem | null>(null);
    const [processando, setProcessando] = useState(false);

    useEffect(() => {
        usuarioService.listar().then(setUsuarios).catch(() => {});
        planoService.listar().then(setPlanos).catch(() => {});
    }, []);

    const planoSelecionado = planos.find((p) => p.id === idPlano);

    const finalizar = async () => {
        if (!idUsuario || !idPlano || !planoSelecionado) {
            setFeedback({ tipo: "danger", texto: "Selecione o usuário e o plano." });
            return;
        }
        setProcessando(true);
        try {
            const inicio = dataHoje();
            const fim = adicionarMeses(inicio, planoSelecionado.duracaoMeses);

            // 1) cria a assinatura
            const assinatura = await assinaturaService.inserir({
                idUsuario, idPlano, dataInicio: inicio, dataFim: fim,
            });

            // 2) cria o pagamento vinculado à assinatura
            await pagamentoService.inserir({
                idAssinatura: assinatura.id!,
                valorPago: planoSelecionado.preco,
                dataPagamento: inicio,
                metodoPagamento: metodo,
                idTransacaoGateway: gerarIdTransacao(),
            });

            setFeedback({ tipo: "success", texto: `Assinatura criada e pagamento de ${formatarMoeda(planoSelecionado.preco)} confirmado!` });
            setIdUsuario(0); setIdPlano(0); setMetodo("Pix");
        } catch (erro) {
            setFeedback({ tipo: "danger", texto: `Erro ao processar o checkout: ${mensagemErro(erro)}` });
        } finally {
            setProcessando(false);
        }
    };

    return (
        <div>
            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}

            <div className="row g-4">
                <div className="col-12 col-lg-5">
                    <div className="card">
                        <div className="card-header bg-success text-white"><i className="bi bi-cart-check me-2"></i>Checkout de Assinatura</div>
                        <div className="card-body">
                            <Select label="Usuário" id="idUsuario" required value={idUsuario || ""}
                                opcoes={usuarios.map((u) => ({ valor: u.id!, rotulo: u.nomeCompleto }))}
                                onChange={(v) => setIdUsuario(Number(v))} />
                            <Select label="Plano" id="idPlano" required value={idPlano || ""}
                                opcoes={planos.map((p) => ({ valor: p.id!, rotulo: `${p.nome} — ${formatarMoeda(p.preco)}` }))}
                                onChange={(v) => setIdPlano(Number(v))} />
                            <Select label="Método de Pagamento" id="metodo" required value={metodo} placeholder=""
                                opcoes={METODOS} onChange={(v) => setMetodo(v as MetodoPagamento)} />
                        </div>
                        <div className="card-footer bg-white">
                            <Button value={processando ? "Processando..." : "Finalizar Pagamento"} icon="bi-lock-fill"
                                variant="success" block disabled={processando} onClick={finalizar} />
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="card h-100">
                        <div className="card-header bg-dark text-white"><i className="bi bi-receipt-cutoff me-2"></i>Resumo do Pedido</div>
                        <div className="card-body">
                            {!planoSelecionado ? (
                                <p className="text-muted text-center my-5"><i className="bi bi-arrow-left-circle me-1"></i>Selecione um plano para ver o resumo.</p>
                            ) : (
                                <>
                                    <table className="table">
                                        <tbody>
                                            <tr><th>Plano</th><td>{planoSelecionado.nome}</td></tr>
                                            <tr><th>Descrição</th><td className="text-muted">{planoSelecionado.descricao}</td></tr>
                                            <tr><th>Duração</th><td>{planoSelecionado.duracaoMeses} {planoSelecionado.duracaoMeses > 1 ? "meses" : "mês"}</td></tr>
                                            <tr><th>Método</th><td>{metodo}</td></tr>
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-between align-items-center border-top pt-3">
                                        <h5 className="mb-0">Total</h5>
                                        <h3 className="text-success mb-0">{formatarMoeda(planoSelecionado.preco)}</h3>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
