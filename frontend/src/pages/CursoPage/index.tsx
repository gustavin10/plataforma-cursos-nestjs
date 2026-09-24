import { useState, useEffect } from "react";
import { PageHeader } from "../../components/PageHeader";
import { Input } from "../../components/Input";
import { TextArea } from "../../components/TextArea";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useCrud } from "../../hooks/useCrud";
import { cursoService } from "../../services/curso.service";
import { categoriaService } from "../../services/categoria.service";
import { usuarioService } from "../../services/usuario.service";
import type { ICurso, NivelCurso } from "../../models/curso.model";
import type { ICategoria } from "../../models/categoria.model";
import type { IUsuario } from "../../models/usuario.model";
import { formatarData, dataHoje } from "../../utils/formatadores";

const VAZIO: ICurso = {
    titulo: "", descricao: "", idInstrutor: 0, idCategoria: 0,
    nivel: "Iniciante", dataPublicacao: dataHoje(), totalAulas: 0, totalHoras: 0,
};

const NIVEIS = [
    { valor: "Iniciante", rotulo: "Iniciante" },
    { valor: "Intermediário", rotulo: "Intermediário" },
    { valor: "Avançado", rotulo: "Avançado" },
];

export const CursoPage = () => {

    const { itens, carregando, feedback, setFeedback, salvar, excluir } = useCrud<ICurso>(cursoService);

    const [categorias, setCategorias] = useState<ICategoria[]>([]);
    const [instrutores, setInstrutores] = useState<IUsuario[]>([]);
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [form, setForm] = useState<ICurso>(VAZIO);
    const [editandoId, setEditandoId] = useState<number | undefined>(undefined);
    const [idExcluir, setIdExcluir] = useState<number | null>(null);

    useEffect(() => {
        categoriaService.listar().then(setCategorias).catch(() => {});
        usuarioService.listar().then((us) => setInstrutores(us.filter((u) => u.perfil !== "aluno"))).catch(() => {});
    }, []);

    const limpar = () => { setForm({ ...VAZIO, dataPublicacao: dataHoje() }); setEditandoId(undefined); };

    const nomeCategoria = (id: number) => categorias.find((c) => c.id === id)?.nome ?? "-";
    const nomeInstrutor = (id: number) => instrutores.find((u) => u.id === id)?.nomeCompleto ?? "-";

    const handleSalvar = async () => {
        if (!form.titulo.trim()) { setFeedback({ tipo: "danger", texto: "O título é obrigatório." }); return; }
        if (!form.idCategoria) { setFeedback({ tipo: "danger", texto: "Selecione uma categoria." }); return; }
        if (!form.idInstrutor) { setFeedback({ tipo: "danger", texto: "Selecione um instrutor." }); return; }
        const ok = await salvar(form, editandoId);
        if (ok) limpar();
    };

    const handleEditar = (c: ICurso) => { setForm({ ...c }); setEditandoId(c.id); };

    const cursosFiltrados = filtroCategoria
        ? itens.filter((c) => c.idCategoria === Number(filtroCategoria))
        : itens;

    return (
        <div>
            <PageHeader titulo="Cursos" icon="bi-journal-bookmark-fill" descricao="Cadastro de cursos com instrutor e categoria." />

            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}

            <div className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <i className={`bi ${editandoId ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
                            {editandoId ? "Editar Curso" : "Novo Curso"}
                        </div>
                        <div className="card-body">
                            <Input label="Título" id="titulo" value={form.titulo} required onChange={(v) => setForm({ ...form, titulo: v })} />
                            <TextArea label="Descrição" id="descricao" value={form.descricao} onChange={(v) => setForm({ ...form, descricao: v })} />
                            <Select label="Categoria" id="idCategoria" required value={form.idCategoria || ""}
                                opcoes={categorias.map((c) => ({ valor: c.id!, rotulo: c.nome }))}
                                onChange={(v) => setForm({ ...form, idCategoria: Number(v) })} />
                            <Select label="Instrutor" id="idInstrutor" required value={form.idInstrutor || ""}
                                opcoes={instrutores.map((u) => ({ valor: u.id!, rotulo: u.nomeCompleto }))}
                                onChange={(v) => setForm({ ...form, idInstrutor: Number(v) })} />
                            <Select label="Nível" id="nivel" required value={form.nivel} opcoes={NIVEIS}
                                onChange={(v) => setForm({ ...form, nivel: v as NivelCurso })} />
                            <Input label="Data de Publicação" id="dataPublicacao" type="date" value={form.dataPublicacao}
                                onChange={(v) => setForm({ ...form, dataPublicacao: v })} />
                            <div className="row">
                                <div className="col-6">
                                    <Input label="Total de Aulas" id="totalAulas" type="number" min={0} value={form.totalAulas}
                                        onChange={(v) => setForm({ ...form, totalAulas: Number(v) })} />
                                </div>
                                <div className="col-6">
                                    <Input label="Total de Horas" id="totalHoras" type="number" min={0} value={form.totalHoras}
                                        onChange={(v) => setForm({ ...form, totalHoras: Number(v) })} />
                                </div>
                            </div>
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
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <span><i className="bi bi-list-ul me-2"></i>Cursos Cadastrados</span>
                            <select className="form-select form-select-sm w-auto" value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}>
                                <option value="">Todas as categorias</option>
                                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                            </select>
                        </div>
                        <div className="card-body p-0">
                            {carregando ? (
                                <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th><th>Título</th><th>Categoria</th><th>Instrutor</th><th>Nível</th><th>Publicação</th><th className="text-end">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cursosFiltrados.length === 0 ? (
                                                <tr><td colSpan={7} className="text-center text-muted py-3">Nenhum curso encontrado.</td></tr>
                                            ) : cursosFiltrados.map((c) => (
                                                <tr key={c.id}>
                                                    <td>{c.id}</td>
                                                    <td>{c.titulo}</td>
                                                    <td><span className="badge bg-secondary">{nomeCategoria(c.idCategoria)}</span></td>
                                                    <td className="text-muted">{nomeInstrutor(c.idInstrutor)}</td>
                                                    <td>{c.nivel}</td>
                                                    <td>{formatarData(c.dataPublicacao)}</td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditar(c)}><i className="bi bi-pencil"></i></button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => setIdExcluir(c.id!)}><i className="bi bi-trash"></i></button>
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
                mensagem="Deseja realmente excluir este curso?"
                onCancelar={() => setIdExcluir(null)}
                onConfirmar={() => { if (idExcluir !== null) excluir(idExcluir); setIdExcluir(null); }} />
        </div>
    );
}
