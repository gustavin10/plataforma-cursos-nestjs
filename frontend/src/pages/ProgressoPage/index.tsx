import { useState, useEffect } from "react";
import { PageHeader } from "../../components/PageHeader";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { useCrud } from "../../hooks/useCrud";
import { progressoAulaService } from "../../services/progresso_aula.service";
import { usuarioService } from "../../services/usuario.service";
import { aulaService } from "../../services/aula.service";
import type { IProgressoAula, StatusProgresso } from "../../models/progresso_aula.model";
import type { IUsuario } from "../../models/usuario.model";
import type { IAula } from "../../models/aula.model";
import { formatarData, dataHoje } from "../../utils/formatadores";

const STATUS: { valor: StatusProgresso; rotulo: string }[] = [
    { valor: "Não Iniciado", rotulo: "Não Iniciado" },
    { valor: "Em Progresso", rotulo: "Em Progresso" },
    { valor: "Concluído", rotulo: "Concluído" },
];

export const ProgressoPage = () => {

    const { itens, carregando, feedback, setFeedback, salvar, excluir } = useCrud<IProgressoAula>(progressoAulaService);
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
    const [aulas, setAulas] = useState<IAula[]>([]);
    const [form, setForm] = useState<IProgressoAula>({ idUsuario: 0, idAula: 0, dataConclusao: null, status: "Não Iniciado" });
    const [editandoId, setEditandoId] = useState<number | undefined>();

    useEffect(() => {
        usuarioService.listar().then((us) => setUsuarios(us.filter((u) => u.perfil === "aluno"))).catch(() => {});
        aulaService.listar().then(setAulas).catch(() => {});
    }, []);

    const limpar = () => { setForm({ idUsuario: 0, idAula: 0, dataConclusao: null, status: "Não Iniciado" }); setEditandoId(undefined); };
    const nomeUsuario = (id: number) => usuarios.find((u) => u.id === id)?.nomeCompleto ?? "-";
    const tituloAula = (id: number) => aulas.find((a) => a.id === id)?.titulo ?? "-";

    const handleSalvar = async () => {
        if (!form.idUsuario || !form.idAula) { setFeedback({ tipo: "danger", texto: "Selecione o aluno e a aula." }); return; }
        const conclusao = form.status === "Concluído" ? (form.dataConclusao || dataHoje()) : null;
        const ok = await salvar({ ...form, dataConclusao: conclusao }, editandoId);
        if (ok) limpar();
    };

    const handleEditar = (p: IProgressoAula) => { setForm({ ...p }); setEditandoId(p.id); };

    const corStatus = (s: StatusProgresso) =>
        s === "Concluído" ? "success" : s === "Em Progresso" ? "warning" : "secondary";

    return (
        <div>
            <PageHeader titulo="Progresso das Aulas" icon="bi-graph-up-arrow" descricao="Controle de conclusão de aulas por aluno." />
            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}

            <div className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <i className={`bi ${editandoId ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
                            {editandoId ? "Editar Progresso" : "Registrar Progresso"}
                        </div>
                        <div className="card-body">
                            <Select label="Aluno" id="idUsuario" required value={form.idUsuario || ""}
                                opcoes={usuarios.map((u) => ({ valor: u.id!, rotulo: u.nomeCompleto }))}
                                onChange={(v) => setForm({ ...form, idUsuario: Number(v) })} />
                            <Select label="Aula" id="idAula" required value={form.idAula || ""}
                                opcoes={aulas.map((a) => ({ valor: a.id!, rotulo: a.titulo }))}
                                onChange={(v) => setForm({ ...form, idAula: Number(v) })} />
                            <Select label="Status" id="status" required value={form.status}
                                opcoes={STATUS} placeholder=""
                                onChange={(v) => setForm({ ...form, status: v as StatusProgresso })} />
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
                    <div className="card">
                        <div className="card-header bg-dark text-white d-flex justify-content-between">
                            <span><i className="bi bi-list-ul me-2"></i>Progresso Registrado</span>
                            <span className="badge bg-warning text-dark">{itens.length}</span>
                        </div>
                        <div className="card-body p-0">
                            {carregando ? <div className="text-center py-4"><div className="spinner-border text-primary"></div></div> : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover mb-0">
                                        <thead className="table-light"><tr>
                                            <th>#</th><th>Aluno</th><th>Aula</th><th>Status</th><th>Conclusão</th><th className="text-end">Ações</th>
                                        </tr></thead>
                                        <tbody>
                                            {itens.length === 0 ? (
                                                <tr><td colSpan={6} className="text-center text-muted py-3">Nenhum registro.</td></tr>
                                            ) : itens.map((p) => (
                                                <tr key={p.id}>
                                                    <td>{p.id}</td>
                                                    <td>{nomeUsuario(p.idUsuario)}</td>
                                                    <td>{tituloAula(p.idAula)}</td>
                                                    <td><span className={`badge bg-${corStatus(p.status)}`}>{p.status}</span></td>
                                                    <td>{formatarData(p.dataConclusao)}</td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditar(p)}><i className="bi bi-pencil"></i></button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => excluir(p.id!)}><i className="bi bi-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
