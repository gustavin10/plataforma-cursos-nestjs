import { useState, useEffect } from "react";
import { Alert } from "../../../components/Alert";
import { useCrud } from "../../../hooks/useCrud";
import { pagamentoService } from "../../../services/pagamento.service";
import { assinaturaService } from "../../../services/assinatura.service";
import { usuarioService } from "../../../services/usuario.service";
import type { IPagamento } from "../../../models/pagamento.model";
import type { IAssinatura } from "../../../models/assinatura.model";
import type { IUsuario } from "../../../models/usuario.model";
import { formatarData, formatarMoeda } from "../../../utils/formatadores";

export const PagamentosTab = () => {

    const { itens, carregando, feedback, setFeedback } = useCrud<IPagamento>(pagamentoService);
    const [assinaturas, setAssinaturas] = useState<IAssinatura[]>([]);
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);

    useEffect(() => {
        assinaturaService.listar().then(setAssinaturas).catch(() => {});
        usuarioService.listar().then(setUsuarios).catch(() => {});
    }, []);

    const usuarioDaAssinatura = (idAssinatura: number) => {
        const ass = assinaturas.find((a) => a.id === idAssinatura);
        if (!ass) return "-";
        return usuarios.find((u) => u.id === ass.idUsuario)?.nomeCompleto ?? "-";
    };

    const total = itens.reduce((soma, p) => soma + p.valorPago, 0);

    return (
        <div>
            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}

            <div className="card mb-3 border-success">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <span className="text-muted"><i className="bi bi-cash-stack me-2"></i>Total arrecadado</span>
                    <h4 className="text-success mb-0">{formatarMoeda(total)}</h4>
                </div>
            </div>

            <div className="card">
                <div className="card-header bg-dark text-white d-flex justify-content-between">
                    <span><i className="bi bi-receipt me-2"></i>Pagamentos</span>
                    <span className="badge bg-warning text-dark">{itens.length}</span>
                </div>
                <div className="card-body p-0">
                    {carregando ? <div className="text-center py-4"><div className="spinner-border text-primary"></div></div> : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover mb-0">
                                <thead className="table-light"><tr>
                                    <th>#</th><th>Usuário</th><th>Valor</th><th>Data</th><th>Método</th><th>Transação</th>
                                </tr></thead>
                                <tbody>
                                    {itens.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center text-muted py-3">Nenhum pagamento.</td></tr>
                                    ) : itens.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{usuarioDaAssinatura(p.idAssinatura)}</td>
                                            <td className="text-success fw-semibold">{formatarMoeda(p.valorPago)}</td>
                                            <td>{formatarData(p.dataPagamento)}</td>
                                            <td><span className="badge bg-info">{p.metodoPagamento}</span></td>
                                            <td><code className="small">{p.idTransacaoGateway}</code></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
