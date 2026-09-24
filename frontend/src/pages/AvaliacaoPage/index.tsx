import { useState, useEffect } from "react";
import { PageHeader } from "../../components/PageHeader";
import { Select } from "../../components/Select";
import { TextArea } from "../../components/TextArea";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useCrud } from "../../hooks/useCrud";
import { avaliacaoService } from "../../services/avaliacao.service";
import { usuarioService } from "../../services/usuario.service";
import { cursoService } from "../../services/curso.service";
import type { IAvaliacao } from "../../models/avaliacao.model";
import type { IUsuario } from "../../models/usuario.model";
import type { ICurso } from "../../models/curso.model";
import { formatarData, dataHoje } from "../../utils/formatadores";

const VAZIO: IAvaliacao = { idUsuario: 0, idCurso: 0, nota: 5, comentario: "", dataAvaliacao: dataHoje() };

export const AvaliacaoPage = () => {

    const { itens, carregando, feedback, setFeedback, salvar, excluir } = useCrud<IAvaliacao>(avaliacaoService);
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
    const [cursos, setCursos] = useState<ICurso[]>([]);
    const [form, setForm] = useState<IAvaliacao>(VAZIO);
    const [editandoId, setEditandoId] = useState<number | undefined>();
    const [idExcluir, setIdExcluir] = useState<number | null>(null);

    useEffect(() => {
        usuarioService.listar().then(setUsuarios).catch(() => {});
        cursoService.listar().then(setCursos).catch(() => {});
    }, []);

    const limpar = () => { setForm({ ...VAZIO, dataAvaliacao: dataHoje() }); setEditandoId(undefined); };
    const nomeUsuario = (id: number) => usuarios.find((u) => u.id === id)?.nomeCompleto ?? "-";
    const tituloCurso = (id: number) => cursos.find((c) => c.id === id)?.titulo ?? "-";

    const handleSalvar = async () => {
        if (!form.idUsuario || !form.idCurso) { setFeedback({ tipo: "danger", texto: "Selecione o aluno e o curso." }); return; }
        const ok = await salvar({ ...form, comentario: form.comentario || null }, editandoId);
        if (ok) limpar();
    };

    const handleEditar = (a: IAvaliacao) => { setForm({ ...a, comentario: a.comentario ?? "" }); setEditandoId(a.id); };

    const estrelas = (nota: number) => (
        <span className="text-warning">
            {[1, 2, 3, 4, 5].map((n) => <i key={n} className={`bi ${n <= nota ? "bi-star-fill" : "bi-star"}`}></i>)}
        </span>
    );

    return (
        <div>
            <PageHeader titulo="Avaliações" icon="bi-star-fill" descricao="Avaliações dos alunos sobre os cursos." />
            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}

            <div className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <i className={`bi ${editandoId ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
                            {editandoId ? "Editar Avaliação" : "Nova Avaliação"}
                        </div>
                        <div className="card-body">
                            <Select label="Aluno" id="idUsuario" required value={form.idUsuario || ""}
                                opcoes={usuarios.map((u) => ({ valor: u.id!, rotulo: u.nomeCompleto }))}
                                onChange={(v) => setForm({ ...form, idUsuario: Number(v) })} />
                            <Select label="Curso" id="idCurso" required value={form.idCurso || ""}
                                opcoes={cursos.map((c) => ({ valor: c.id!, rotulo: c.titulo }))}
                                onChange={(v) => setForm({ ...form, idCurso: Number(v) })} />
                            <Select label="Nota" id="nota" required value={form.nota} placeholder=""
                                opcoes={[1, 2, 3, 4, 5].map((n) => ({ valor: n, rotulo: `${n} estrela${n > 1 ? "s" : ""}` }))}
                                onChange={(v) => setForm({ ...form, nota: Number(v) as IAvaliacao["nota"] })} />
                            <TextArea label="Comentário" id="comentario" value={form.comentario ?? ""}
                                onChange={(v) => setForm({ ...form, comentario: v })} />
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
                            <span><i className="bi bi-list-ul me-2"></i>Avaliações</span>
                            <span className="badge bg-warning text-dark">{itens.length}</span>
                        </div>
                        <div className="card-body p-0">
                            {carregando ? <div className="text-center py-4"><div className="spinner-border text-primary"></div></div> : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover mb-0">
                                        <thead className="table-light"><tr>
                                            <th>#</th><th>Aluno</th><th>Curso</th><th>Nota</th><th>Comentário</th><th>Data</th><th className="text-end">Ações</th>
                                        </tr></thead>
                                        <tbody>
                                            {itens.length === 0 ? (
                                                <tr><td colSpan={7} className="text-center text-muted py-3">Nenhuma avaliação.</td></tr>
                                            ) : itens.map((a) => (
                                                <tr key={a.id}>
                                                    <td>{a.id}</td>
                                                    <td>{nomeUsuario(a.idUsuario)}</td>
                                                    <td>{tituloCurso(a.idCurso)}</td>
                                                    <td>{estrelas(a.nota)}</td>
                                                    <td className="text-muted small">{a.comentario || "-"}</td>
                                                    <td>{formatarData(a.dataAvaliacao)}</td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditar(a)}><i className="bi bi-pencil"></i></button>
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
                </div>
            </div>

            <ConfirmModal aberto={idExcluir !== null} titulo="Confirmar exclusão"
                mensagem="Deseja realmente excluir esta avaliação?" onCancelar={() => setIdExcluir(null)}
                onConfirmar={() => { if (idExcluir !== null) excluir(idExcluir); setIdExcluir(null); }} />
        </div>
    );
}
