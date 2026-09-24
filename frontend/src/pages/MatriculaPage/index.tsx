import { useState, useEffect } from "react";
import { PageHeader } from "../../components/PageHeader";
import { Select } from "../../components/Select";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useCrud } from "../../hooks/useCrud";
import { matriculaService } from "../../services/matricula.service";
import { usuarioService } from "../../services/usuario.service";
import { cursoService } from "../../services/curso.service";
import type { IMatricula } from "../../models/matricula.model";
import type { IUsuario } from "../../models/usuario.model";
import type { ICurso } from "../../models/curso.model";
import { formatarData, dataHoje } from "../../utils/formatadores";

const VAZIO: IMatricula = { idUsuario: 0, idCurso: 0, dataMatricula: dataHoje(), dataConclusao: null };

export const MatriculaPage = () => {

    const { itens, carregando, feedback, setFeedback, salvar, excluir } = useCrud<IMatricula>(matriculaService);
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
    const [cursos, setCursos] = useState<ICurso[]>([]);
    const [form, setForm] = useState<IMatricula>(VAZIO);
    const [editandoId, setEditandoId] = useState<number | undefined>();
    const [idExcluir, setIdExcluir] = useState<number | null>(null);

    useEffect(() => {
        usuarioService.listar().then((us) => setUsuarios(us.filter((u) => u.perfil === "aluno"))).catch(() => {});
        cursoService.listar().then(setCursos).catch(() => {});
    }, []);

    const limpar = () => { setForm({ ...VAZIO, dataMatricula: dataHoje() }); setEditandoId(undefined); };
    const nomeUsuario = (id: number) => usuarios.find((u) => u.id === id)?.nomeCompleto ?? "-";
    const tituloCurso = (id: number) => cursos.find((c) => c.id === id)?.titulo ?? "-";

    const handleSalvar = async () => {
        if (!form.idUsuario || !form.idCurso) { setFeedback({ tipo: "danger", texto: "Selecione o aluno e o curso." }); return; }
        const duplicada = itens.some((m) => m.idUsuario === form.idUsuario && m.idCurso === form.idCurso && m.id !== editandoId);
        if (duplicada) { setFeedback({ tipo: "danger", texto: "Este aluno já está matriculado neste curso." }); return; }
        const ok = await salvar({ ...form, dataConclusao: form.dataConclusao || null }, editandoId);
        if (ok) limpar();
    };

    const handleEditar = (m: IMatricula) => { setForm({ ...m }); setEditandoId(m.id); };

    return (
        <div>
            <PageHeader titulo="Matrículas" icon="bi-card-checklist" descricao="Matrícula de alunos em cursos." />
            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}

            <div className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <i className={`bi ${editandoId ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
                            {editandoId ? "Editar Matrícula" : "Nova Matrícula"}
                        </div>
                        <div className="card-body">
                            <Select label="Aluno" id="idUsuario" required value={form.idUsuario || ""}
                                opcoes={usuarios.map((u) => ({ valor: u.id!, rotulo: u.nomeCompleto }))}
                                onChange={(v) => setForm({ ...form, idUsuario: Number(v) })} />
                            <Select label="Curso" id="idCurso" required value={form.idCurso || ""}
                                opcoes={cursos.map((c) => ({ valor: c.id!, rotulo: c.titulo }))}
                                onChange={(v) => setForm({ ...form, idCurso: Number(v) })} />
                            <Input label="Data da Matrícula" id="dataMatricula" type="date" value={form.dataMatricula}
                                onChange={(v) => setForm({ ...form, dataMatricula: v })} />
                            <Input label="Data de Conclusão" id="dataConclusao" type="date" value={form.dataConclusao ?? ""}
                                onChange={(v) => setForm({ ...form, dataConclusao: v || null })} />
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
                            <span><i className="bi bi-list-ul me-2"></i>Matrículas</span>
                            <span className="badge bg-warning text-dark">{itens.length}</span>
                        </div>
                        <div className="card-body p-0">
                            {carregando ? <div className="text-center py-4"><div className="spinner-border text-primary"></div></div> : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover mb-0">
                                        <thead className="table-light"><tr>
                                            <th>#</th><th>Aluno</th><th>Curso</th><th>Matrícula</th><th>Conclusão</th><th>Status</th><th className="text-end">Ações</th>
                                        </tr></thead>
                                        <tbody>
                                            {itens.length === 0 ? (
                                                <tr><td colSpan={7} className="text-center text-muted py-3">Nenhuma matrícula.</td></tr>
                                            ) : itens.map((m) => (
                                                <tr key={m.id}>
                                                    <td>{m.id}</td>
                                                    <td>{nomeUsuario(m.idUsuario)}</td>
                                                    <td>{tituloCurso(m.idCurso)}</td>
                                                    <td>{formatarData(m.dataMatricula)}</td>
                                                    <td>{formatarData(m.dataConclusao)}</td>
                                                    <td>{m.dataConclusao
                                                        ? <span className="badge bg-success">Concluído</span>
                                                        : <span className="badge bg-warning text-dark">Em andamento</span>}</td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditar(m)}><i className="bi bi-pencil"></i></button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => setIdExcluir(m.id!)}><i className="bi bi-trash"></i></button>
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

            <ConfirmModal aberto={idExcluir !== null} titulo="Confirmar exclusão"
                mensagem="Deseja realmente excluir esta matrícula?" onCancelar={() => setIdExcluir(null)}
                onConfirmar={() => { if (idExcluir !== null) excluir(idExcluir); setIdExcluir(null); }} />
        </div>
    );
}
