import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../../components/PageHeader";
import { Input } from "../../components/Input";
import { TextArea } from "../../components/TextArea";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { ConfirmModal } from "../../components/ConfirmModal";
import { mensagemErro, type FeedbackMensagem } from "../../hooks/useCrud";
import { trilhaService } from "../../services/trilha.service";
import { trilhaCursoService } from "../../services/trilha_curso.service";
import { categoriaService } from "../../services/categoria.service";
import { cursoService } from "../../services/curso.service";
import type { ITrilha } from "../../models/trilha.model";
import type { ITrilhaCurso } from "../../models/trilha_curso.model";
import type { ICategoria } from "../../models/categoria.model";
import type { ICurso } from "../../models/curso.model";

const VAZIO: ITrilha = { titulo: "", descricao: "", idCategoria: 0 };

export const TrilhaPage = () => {

    const [trilhas, setTrilhas] = useState<ITrilha[]>([]);
    const [categorias, setCategorias] = useState<ICategoria[]>([]);
    const [cursos, setCursos] = useState<ICurso[]>([]);
    const [vinculos, setVinculos] = useState<ITrilhaCurso[]>([]);

    const [carregando, setCarregando] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackMensagem | null>(null);

    const [form, setForm] = useState<ITrilha>(VAZIO);
    const [editandoId, setEditandoId] = useState<number | undefined>();
    const [idExcluir, setIdExcluir] = useState<number | null>(null);

    const [trilhaSelecionada, setTrilhaSelecionada] = useState<number>(0);
    const [cursoVinculo, setCursoVinculo] = useState<number>(0);
    const [ordemVinculo, setOrdemVinculo] = useState<number>(1);

    const carregarTrilhas = useCallback(async () => {
        setCarregando(true);
        try { setTrilhas(await trilhaService.listar()); }
        catch { setFeedback({ tipo: "danger", texto: "Erro ao carregar trilhas. A API está rodando?" }); }
        finally { setCarregando(false); }
    }, []);

    const carregarVinculos = useCallback(async () => {
        try { setVinculos(await trilhaCursoService.listar()); } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        carregarTrilhas();
        carregarVinculos();
        categoriaService.listar().then(setCategorias).catch(() => {});
        cursoService.listar().then(setCursos).catch(() => {});
    }, [carregarTrilhas, carregarVinculos]);

    const limpar = () => { setForm(VAZIO); setEditandoId(undefined); };
    const nomeCategoria = (id: number) => categorias.find((c) => c.id === id)?.nome ?? "-";
    const tituloCurso = (id: number) => cursos.find((c) => c.id === id)?.titulo ?? "-";

    const salvarTrilha = async () => {
        if (!form.titulo.trim()) { setFeedback({ tipo: "danger", texto: "Informe o título da trilha." }); return; }
        if (!form.idCategoria) { setFeedback({ tipo: "danger", texto: "Selecione uma categoria." }); return; }
        try {
            if (editandoId) await trilhaService.alterar(editandoId, form);
            else await trilhaService.inserir(form);
            setFeedback({ tipo: "success", texto: "Trilha salva com sucesso!" });
            limpar(); carregarTrilhas();
        } catch (erro) { setFeedback({ tipo: "danger", texto: `Erro ao salvar trilha: ${mensagemErro(erro)}` }); }
    };

    const editarTrilha = (t: ITrilha) => { setForm({ ...t }); setEditandoId(t.id); };

    const excluirTrilha = async (id: number) => {
        try {
            // Os vínculos Trilha x Curso são removidos em cascata pelo banco (onDelete: Cascade)
            await trilhaService.excluir(id);
            setFeedback({ tipo: "success", texto: "Trilha excluída com sucesso!" });
            carregarTrilhas(); carregarVinculos();
        } catch (erro) { setFeedback({ tipo: "danger", texto: `Erro ao excluir trilha: ${mensagemErro(erro)}` }); }
    };

    const vincularCurso = async () => {
        if (!trilhaSelecionada || !cursoVinculo) { setFeedback({ tipo: "danger", texto: "Selecione a trilha e o curso." }); return; }
        const jaExiste = vinculos.some((v) => v.idTrilha === trilhaSelecionada && v.idCurso === cursoVinculo);
        if (jaExiste) { setFeedback({ tipo: "danger", texto: "Este curso já está nesta trilha." }); return; }
        try {
            await trilhaCursoService.inserir({ idTrilha: trilhaSelecionada, idCurso: cursoVinculo, ordem: ordemVinculo });
            setFeedback({ tipo: "success", texto: "Curso vinculado à trilha!" });
            setCursoVinculo(0); setOrdemVinculo(1); carregarVinculos();
        } catch (erro) { setFeedback({ tipo: "danger", texto: `Erro ao vincular curso: ${mensagemErro(erro)}` }); }
    };

    const desvincular = async (id: number) => {
        try { await trilhaCursoService.excluir(id); carregarVinculos(); }
        catch (erro) { setFeedback({ tipo: "danger", texto: `Erro ao desvincular: ${mensagemErro(erro)}` }); }
    };

    const cursosDaTrilha = vinculos
        .filter((v) => v.idTrilha === trilhaSelecionada)
        .sort((a, b) => a.ordem - b.ordem);

    return (
        <div>
            <PageHeader titulo="Trilhas de Conhecimento" icon="bi-signpost-split-fill"
                descricao="Cadastro de trilhas e organização sequencial de cursos (Trilhas_Cursos)." />
            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}

            <div className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <i className={`bi ${editandoId ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
                            {editandoId ? "Editar Trilha" : "Nova Trilha"}
                        </div>
                        <div className="card-body">
                            <Input label="Título" id="titulo" value={form.titulo} required onChange={(v) => setForm({ ...form, titulo: v })} />
                            <TextArea label="Descrição" id="descricao" value={form.descricao} onChange={(v) => setForm({ ...form, descricao: v })} />
                            <Select label="Categoria" id="idCategoria" required value={form.idCategoria || ""}
                                opcoes={categorias.map((c) => ({ valor: c.id!, rotulo: c.nome }))}
                                onChange={(v) => setForm({ ...form, idCategoria: Number(v) })} />
                        </div>
                        <div className="card-footer bg-white">
                            <div className="row g-2">
                                <div className="col-6"><Button value="Salvar" icon="bi-check-lg" block onClick={salvarTrilha} /></div>
                                <div className="col-6"><Button variant="secondary" value="Cancelar" icon="bi-x-lg" block onClick={limpar} /></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-8">
                    <div className="card mb-4">
                        <div className="card-header bg-dark text-white d-flex justify-content-between">
                            <span><i className="bi bi-list-ul me-2"></i>Trilhas Cadastradas</span>
                            <span className="badge bg-warning text-dark">{trilhas.length}</span>
                        </div>
                        <div className="card-body p-0">
                            {carregando ? <div className="text-center py-4"><div className="spinner-border text-primary"></div></div> : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover mb-0">
                                        <thead className="table-light"><tr>
                                            <th>#</th><th>Título</th><th>Categoria</th><th className="text-end">Ações</th>
                                        </tr></thead>
                                        <tbody>
                                            {trilhas.length === 0 ? (
                                                <tr><td colSpan={4} className="text-center text-muted py-3">Nenhuma trilha.</td></tr>
                                            ) : trilhas.map((t) => (
                                                <tr key={t.id}>
                                                    <td>{t.id}</td>
                                                    <td>{t.titulo}</td>
                                                    <td><span className="badge bg-secondary">{nomeCategoria(t.idCategoria)}</span></td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => editarTrilha(t)}><i className="bi bi-pencil"></i></button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => setIdExcluir(t.id!)}><i className="bi bi-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Trilhas_Cursos */}
                    <div className="card">
                        <div className="card-header bg-info text-white"><i className="bi bi-diagram-3 me-2"></i>Cursos da Trilha (sequência)</div>
                        <div className="card-body">
                            <div className="row g-2 align-items-end">
                                <div className="col-12 col-md-5">
                                    <Select label="Trilha" id="trilhaSel" value={trilhaSelecionada || ""}
                                        opcoes={trilhas.map((t) => ({ valor: t.id!, rotulo: t.titulo }))}
                                        onChange={(v) => setTrilhaSelecionada(Number(v))} />
                                </div>
                                <div className="col-7 col-md-4">
                                    <Select label="Curso" id="cursoVinc" value={cursoVinculo || ""}
                                        opcoes={cursos.map((c) => ({ valor: c.id!, rotulo: c.titulo }))}
                                        onChange={(v) => setCursoVinculo(Number(v))} />
                                </div>
                                <div className="col-3 col-md-2">
                                    <Input label="Ordem" id="ordemVinc" type="number" min={1} value={ordemVinculo}
                                        onChange={(v) => setOrdemVinculo(Number(v))} />
                                </div>
                                <div className="col-2 col-md-1 mb-3">
                                    <Button value="" icon="bi-plus-lg" block onClick={vincularCurso} />
                                </div>
                            </div>

                            {trilhaSelecionada > 0 && (
                                <table className="table table-sm table-hover mt-2">
                                    <thead className="table-light"><tr><th>Ordem</th><th>Curso</th><th className="text-end">Ação</th></tr></thead>
                                    <tbody>
                                        {cursosDaTrilha.length === 0 ? (
                                            <tr><td colSpan={3} className="text-center text-muted">Nenhum curso vinculado.</td></tr>
                                        ) : cursosDaTrilha.map((v) => (
                                            <tr key={v.id}>
                                                <td>{v.ordem}</td>
                                                <td>{tituloCurso(v.idCurso)}</td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => desvincular(v.id!)}><i className="bi bi-x-lg"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal aberto={idExcluir !== null} titulo="Confirmar exclusão"
                mensagem="Excluir a trilha também removerá os vínculos de cursos. Continuar?"
                onCancelar={() => setIdExcluir(null)}
                onConfirmar={() => { if (idExcluir !== null) excluirTrilha(idExcluir); setIdExcluir(null); }} />
        </div>
    );
}
