import { useState, useEffect } from "react";
import { Alert } from "../../../components/Alert";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useCrud } from "../../../hooks/useCrud";
import { assinaturaService } from "../../../services/assinatura.service";
import { usuarioService } from "../../../services/usuario.service";
import { planoService } from "../../../services/plano.service";
import type { IAssinatura } from "../../../models/assinatura.model";
import type { IUsuario } from "../../../models/usuario.model";
import type { IPlano } from "../../../models/plano.model";
import { formatarData } from "../../../utils/formatadores";

export const AssinaturasTab = () => {

    const { itens, carregando, feedback, setFeedback, excluir } = useCrud<IAssinatura>(assinaturaService);
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
    const [planos, setPlanos] = useState<IPlano[]>([]);
    const [idExcluir, setIdExcluir] = useState<number | null>(null);

    useEffect(() => {
        usuarioService.listar().then(setUsuarios).catch(() => {});
        planoService.listar().then(setPlanos).catch(() => {});
    }, []);

    const nomeUsuario = (id: number) => usuarios.find((u) => u.id === id)?.nomeCompleto ?? "-";
    const nomePlano = (id: number) => planos.find((p) => p.id === id)?.nome ?? "-";

    const ativa = (dataFim: string) => new Date(dataFim) >= new Date();

    return (
        <div>
            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}
            <div className="card">
                <div className="card-header bg-dark text-white d-flex justify-content-between">
                    <span><i className="bi bi-calendar-check me-2"></i>Assinaturas</span>
                    <span className="badge bg-warning text-dark">{itens.length}</span>
                </div>
                <div className="card-body p-0">
                    {carregando ? <div className="text-center py-4"><div className="spinner-border text-primary"></div></div> : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover mb-0">
                                <thead className="table-light"><tr>
                                    <th>#</th><th>Usuário</th><th>Plano</th><th>Início</th><th>Fim</th><th>Situação</th><th className="text-end">Ações</th>
                                </tr></thead>
                                <tbody>
                                    {itens.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center text-muted py-3">Nenhuma assinatura.</td></tr>
                                    ) : itens.map((a) => (
                                        <tr key={a.id}>
                                            <td>{a.id}</td>
                                            <td>{nomeUsuario(a.idUsuario)}</td>
                                            <td>{nomePlano(a.idPlano)}</td>
                                            <td>{formatarData(a.dataInicio)}</td>
                                            <td>{formatarData(a.dataFim)}</td>
                                            <td>{ativa(a.dataFim)
                                                ? <span className="badge bg-success">Ativa</span>
                                                : <span className="badge bg-secondary">Expirada</span>}</td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => setIdExcluir(a.id!)}><i className="bi bi-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal aberto={idExcluir !== null} titulo="Confirmar exclusão"
                mensagem="Deseja realmente excluir esta assinatura?" onCancelar={() => setIdExcluir(null)}
                onConfirmar={() => { if (idExcluir !== null) excluir(idExcluir); setIdExcluir(null); }} />
        </div>
    );
}
