import { useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { Input } from "../../components/Input";
import { TextArea } from "../../components/TextArea";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useCrud } from "../../hooks/useCrud";
import { planoService } from "../../services/plano.service";
import type { IPlano } from "../../models/plano.model";
import { formatarMoeda } from "../../utils/formatadores";

const VAZIO: IPlano = { nome: "", descricao: "", preco: 0, duracaoMeses: 1 };

export const PlanoPage = () => {

    const { itens, carregando, feedback, setFeedback, salvar, excluir } = useCrud<IPlano>(planoService);
    const [form, setForm] = useState<IPlano>(VAZIO);
    const [editandoId, setEditandoId] = useState<number | undefined>();
    const [idExcluir, setIdExcluir] = useState<number | null>(null);

    const limpar = () => { setForm(VAZIO); setEditandoId(undefined); };

    const handleSalvar = async () => {
        if (!form.nome.trim()) { setFeedback({ tipo: "danger", texto: "Informe o nome do plano." }); return; }
        if (form.preco <= 0) { setFeedback({ tipo: "danger", texto: "O preço deve ser maior que zero." }); return; }
        if (form.duracaoMeses < 1) { setFeedback({ tipo: "danger", texto: "A duração deve ser de pelo menos 1 mês." }); return; }
        const ok = await salvar(form, editandoId);
        if (ok) limpar();
    };

    const handleEditar = (p: IPlano) => { setForm({ ...p }); setEditandoId(p.id); };

    return (
        <div>
            <PageHeader titulo="Planos" icon="bi-box-seam-fill" descricao="Planos de assinatura da plataforma." />
            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}

            <div className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <i className={`bi ${editandoId ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
                            {editandoId ? "Editar Plano" : "Novo Plano"}
                        </div>
                        <div className="card-body">
                            <Input label="Nome" id="nome" value={form.nome} required onChange={(v) => setForm({ ...form, nome: v })} />
                            <TextArea label="Descrição" id="descricao" value={form.descricao} onChange={(v) => setForm({ ...form, descricao: v })} />
                            <Input label="Preço (R$)" id="preco" type="number" min={0} step="0.01" value={form.preco} required
                                onChange={(v) => setForm({ ...form, preco: Number(v) })} />
                            <Input label="Duração (meses)" id="duracaoMeses" type="number" min={1} value={form.duracaoMeses} required
                                onChange={(v) => setForm({ ...form, duracaoMeses: Number(v) })} />
                        </div>
                        <div className="card-footer bg-white">
                            <div className="row g-2">
                                <div className="col-6"><Button value="Salvar" icon="bi-check-lg" block onClick={handleSalvar} /></div>
                                <div className="col-6"><Button variant="secondary" value="Cancelar" icon="bi-x-lg" block onClick={limpar} /></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-8">
                    <div className="row g-3">
                        {carregando ? (
                            <div className="text-center py-4 w-100"><div className="spinner-border text-primary"></div></div>
                        ) : itens.length === 0 ? (
                            <div className="text-center text-muted py-4">Nenhum plano cadastrado.</div>
                        ) : itens.map((p) => (
                            <div className="col-12 col-md-6" key={p.id}>
                                <div className="card h-100 border-top border-4 border-warning">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h5 className="card-title">{p.nome}</h5>
                                            <div>
                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditar(p)}><i className="bi bi-pencil"></i></button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => setIdExcluir(p.id!)}><i className="bi bi-trash"></i></button>
                                            </div>
                                        </div>
                                        <p className="text-muted small">{p.descricao}</p>
                                        <h3 className="text-success mb-0">{formatarMoeda(p.preco)}</h3>
                                        <small className="text-muted">por {p.duracaoMeses} {p.duracaoMeses > 1 ? "meses" : "mês"}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ConfirmModal aberto={idExcluir !== null} titulo="Confirmar exclusão"
                mensagem="Deseja realmente excluir este plano?" onCancelar={() => setIdExcluir(null)}
                onConfirmar={() => { if (idExcluir !== null) excluir(idExcluir); setIdExcluir(null); }} />
        </div>
    );
}
