import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../../components/PageHeader";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { ConfirmModal } from "../../components/ConfirmModal";
import { mensagemErro, type FeedbackMensagem } from "../../hooks/useCrud";
import { cursoService } from "../../services/curso.service";
import { moduloService } from "../../services/modulo.service";
import { aulaService } from "../../services/aula.service";
import type { ICurso } from "../../models/curso.model";
import type { IModulo } from "../../models/modulo.model";
import type { IAula, TipoConteudo } from "../../models/aula.model";

const TIPOS = [
    { valor: "Vídeo", rotulo: "Vídeo" },
    { valor: "Texto", rotulo: "Texto" },
    { valor: "Quiz", rotulo: "Quiz" },
];

export const ConteudoPage = () => {

    const [cursos, setCursos] = useState<ICurso[]>([]);
    const [modulos, setModulos] = useState<IModulo[]>([]);
    const [aulas, setAulas] = useState<IAula[]>([]);

    const [cursoSelecionado, setCursoSelecionado] = useState<number>(0);
    const [moduloSelecionado, setModuloSelecionado] = useState<number>(0);
    const [feedback, setFeedback] = useState<FeedbackMensagem | null>(null);

    const [formModulo, setFormModulo] = useState<IModulo>({ idCurso: 0, titulo: "", ordem: 1 });
    const [editandoModulo, setEditandoModulo] = useState<number | undefined>();

    const [formAula, setFormAula] = useState<IAula>({
        idModulo: 0, titulo: "", tipoConteudo: "Vídeo", urlConteudo: "", duracaoMinutos: 0, ordem: 1,
    });
    const [editandoAula, setEditandoAula] = useState<number | undefined>();

    const [excluir, setExcluir] = useState<{ tipo: "modulo" | "aula"; id: number } | null>(null);

    useEffect(() => { cursoService.listar().then(setCursos).catch(() => {}); }, []);

    const carregarModulos = useCallback(async (idCurso: number) => {
        const todos = await moduloService.listar();
        setModulos(todos.filter((m) => m.idCurso === idCurso).sort((a, b) => a.ordem - b.ordem));
    }, []);

    const carregarAulas = useCallback(async (idModulo: number) => {
        const todas = await aulaService.listar();
        setAulas(todas.filter((a) => a.idModulo === idModulo).sort((a, b) => a.ordem - b.ordem));
    }, []);

    useEffect(() => {
        if (cursoSelecionado) {
            carregarModulos(cursoSelecionado);
            setFormModulo({ idCurso: cursoSelecionado, titulo: "", ordem: 1 });
        } else {
            setModulos([]);
        }
        setModuloSelecionado(0);
        setAulas([]);
    }, [cursoSelecionado, carregarModulos]);

    useEffect(() => {
        if (moduloSelecionado) {
            carregarAulas(moduloSelecionado);
            setFormAula((f) => ({ ...f, idModulo: moduloSelecionado }));
        } else {
            setAulas([]);
        }
    }, [moduloSelecionado, carregarAulas]);

    // ---- Módulos ----
    const salvarModulo = async () => {
        if (!cursoSelecionado) { setFeedback({ tipo: "danger", texto: "Selecione um curso primeiro." }); return; }
        if (!formModulo.titulo.trim()) { setFeedback({ tipo: "danger", texto: "Informe o título do módulo." }); return; }
        try {
            if (editandoModulo) await moduloService.alterar(editandoModulo, formModulo);
            else await moduloService.inserir(formModulo);
            setFeedback({ tipo: "success", texto: "Módulo salvo com sucesso!" });
            setFormModulo({ idCurso: cursoSelecionado, titulo: "", ordem: modulos.length + 1 });
            setEditandoModulo(undefined);
            carregarModulos(cursoSelecionado);
        } catch (erro) { setFeedback({ tipo: "danger", texto: `Erro ao salvar módulo: ${mensagemErro(erro)}` }); }
    };

    const editarModulo = (m: IModulo) => { setFormModulo({ ...m }); setEditandoModulo(m.id); };

    // ---- Aulas ----
    const salvarAula = async () => {
        if (!moduloSelecionado) { setFeedback({ tipo: "danger", texto: "Selecione um módulo primeiro." }); return; }
        if (!formAula.titulo.trim()) { setFeedback({ tipo: "danger", texto: "Informe o título da aula." }); return; }
        try {
            if (editandoAula) await aulaService.alterar(editandoAula, formAula);
            else await aulaService.inserir(formAula);
            setFeedback({ tipo: "success", texto: "Aula salva com sucesso!" });
            setFormAula({ idModulo: moduloSelecionado, titulo: "", tipoConteudo: "Vídeo", urlConteudo: "", duracaoMinutos: 0, ordem: aulas.length + 1 });
            setEditandoAula(undefined);
            carregarAulas(moduloSelecionado);
        } catch (erro) { setFeedback({ tipo: "danger", texto: `Erro ao salvar aula: ${mensagemErro(erro)}` }); }
    };

    const editarAula = (a: IAula) => { setFormAula({ ...a }); setEditandoAula(a.id); };

    const confirmarExclusao = async () => {
        if (!excluir) return;
        try {
            if (excluir.tipo === "modulo") { await moduloService.excluir(excluir.id); carregarModulos(cursoSelecionado); }
            else { await aulaService.excluir(excluir.id); carregarAulas(moduloSelecionado); }
            setFeedback({ tipo: "success", texto: "Registro excluído com sucesso!" });
        } catch (erro) { setFeedback({ tipo: "danger", texto: `Erro ao excluir: ${mensagemErro(erro)}` }); }
        setExcluir(null);
    };

    return (
        <div>
            <PageHeader titulo="Módulos & Aulas" icon="bi-collection-play-fill"
                descricao="Estrutura de conteúdo: Curso > Módulos > Aulas, respeitando a ordem." />

            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}

            <div className="card mb-4">
                <div className="card-body">
                    <Select label="Selecione o Curso" id="curso" value={cursoSelecionado || ""}
                        opcoes={cursos.map((c) => ({ valor: c.id!, rotulo: c.titulo }))}
                        placeholder="Escolha um curso para gerenciar o conteúdo..."
                        onChange={(v) => setCursoSelecionado(Number(v))} />
                </div>
            </div>

            {cursoSelecionado > 0 && (
                <div className="row g-4">
                    {/* MÓDULOS */}
                    <div className="col-12 col-lg-6">
                        <div className="card h-100">
                            <div className="card-header bg-success text-white"><i className="bi bi-folder2-open me-2"></i>Módulos do Curso</div>
                            <div className="card-body">
                                <div className="row g-2 align-items-end mb-3">
                                    <div className="col-7"><Input label="Título do Módulo" id="tituloModulo" value={formModulo.titulo}
                                        onChange={(v) => setFormModulo({ ...formModulo, titulo: v })} /></div>
                                    <div className="col-3"><Input label="Ordem" id="ordemModulo" type="number" min={1} value={formModulo.ordem}
                                        onChange={(v) => setFormModulo({ ...formModulo, ordem: Number(v) })} /></div>
                                    <div className="col-2 mb-3"><Button value="" icon="bi-plus-lg" block onClick={salvarModulo} /></div>
                                </div>
                                <table className="table table-sm table-hover">
                                    <thead className="table-light"><tr><th>Ordem</th><th>Título</th><th className="text-end">Ações</th></tr></thead>
                                    <tbody>
                                        {modulos.length === 0 ? (
                                            <tr><td colSpan={3} className="text-center text-muted">Nenhum módulo.</td></tr>
                                        ) : modulos.map((m) => (
                                            <tr key={m.id} className={moduloSelecionado === m.id ? "table-warning" : ""}>
                                                <td>{m.ordem}</td>
                                                <td role="button" onClick={() => setModuloSelecionado(m.id!)}>
                                                    {m.titulo} {moduloSelecionado === m.id && <i className="bi bi-arrow-right-circle-fill text-warning"></i>}
                                                </td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => editarModulo(m)}><i className="bi bi-pencil"></i></button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => setExcluir({ tipo: "modulo", id: m.id! })}><i className="bi bi-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <small className="text-muted">Clique no título de um módulo para gerenciar suas aulas.</small>
                            </div>
                        </div>
                    </div>

                    {/* AULAS */}
                    <div className="col-12 col-lg-6">
                        <div className="card h-100">
                            <div className="card-header bg-info text-white"><i className="bi bi-play-circle me-2"></i>Aulas do Módulo</div>
                            <div className="card-body">
                                {moduloSelecionado === 0 ? (
                                    <p className="text-muted text-center my-4"><i className="bi bi-arrow-left-circle me-1"></i>Selecione um módulo ao lado.</p>
                                ) : (
                                    <>
                                        <Input label="Título da Aula" id="tituloAula" value={formAula.titulo}
                                            onChange={(v) => setFormAula({ ...formAula, titulo: v })} />
                                        <div className="row">
                                            <div className="col-6"><Select label="Tipo" id="tipoConteudo" value={formAula.tipoConteudo} opcoes={TIPOS}
                                                onChange={(v) => setFormAula({ ...formAula, tipoConteudo: v as TipoConteudo })} /></div>
                                            <div className="col-3"><Input label="Min." id="duracao" type="number" min={0} value={formAula.duracaoMinutos}
                                                onChange={(v) => setFormAula({ ...formAula, duracaoMinutos: Number(v) })} /></div>
                                            <div className="col-3"><Input label="Ordem" id="ordemAula" type="number" min={1} value={formAula.ordem}
                                                onChange={(v) => setFormAula({ ...formAula, ordem: Number(v) })} /></div>
                                        </div>
                                        <Input label="URL do Conteúdo" id="urlConteudo" value={formAula.urlConteudo}
                                            placeholder="https://..." onChange={(v) => setFormAula({ ...formAula, urlConteudo: v })} />
                                        <Button value={editandoAula ? "Atualizar Aula" : "Adicionar Aula"} icon="bi-check-lg" block onClick={salvarAula} />

                                        <table className="table table-sm table-hover mt-3">
                                            <thead className="table-light"><tr><th>#</th><th>Título</th><th>Tipo</th><th className="text-end">Ações</th></tr></thead>
                                            <tbody>
                                                {aulas.length === 0 ? (
                                                    <tr><td colSpan={4} className="text-center text-muted">Nenhuma aula.</td></tr>
                                                ) : aulas.map((a) => (
                                                    <tr key={a.id}>
                                                        <td>{a.ordem}</td>
                                                        <td>{a.titulo}</td>
                                                        <td><span className="badge bg-secondary">{a.tipoConteudo}</span></td>
                                                        <td className="text-end">
                                                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => editarAula(a)}><i className="bi bi-pencil"></i></button>
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => setExcluir({ tipo: "aula", id: a.id! })}><i className="bi bi-trash"></i></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal aberto={excluir !== null} titulo="Confirmar exclusão"
                mensagem={`Deseja realmente excluir ${excluir?.tipo === "modulo" ? "este módulo" : "esta aula"}?`}
                onCancelar={() => setExcluir(null)} onConfirmar={confirmarExclusao} />
        </div>
    );
}
