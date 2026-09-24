import { useState, useEffect } from "react";
import { PageHeader } from "../../components/PageHeader";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useCrud } from "../../hooks/useCrud";
import { certificadoService } from "../../services/certificado.service";
import { usuarioService } from "../../services/usuario.service";
import { cursoService } from "../../services/curso.service";
import { trilhaService } from "../../services/trilha.service";
import type { ICertificado } from "../../models/certificado.model";
import type { IUsuario } from "../../models/usuario.model";
import type { ICurso } from "../../models/curso.model";
import type { ITrilha } from "../../models/trilha.model";
import { formatarData, dataHoje, gerarCodigoVerificacao } from "../../utils/formatadores";

const VAZIO: ICertificado = { idUsuario: 0, idCurso: 0, idTrilha: null, codigoVerificacao: "", dataEmissao: dataHoje() };

export const CertificadoPage = () => {

    const { itens, carregando, feedback, setFeedback, salvar, excluir } = useCrud<ICertificado>(certificadoService);
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
    const [cursos, setCursos] = useState<ICurso[]>([]);
    const [trilhas, setTrilhas] = useState<ITrilha[]>([]);
    const [form, setForm] = useState<ICertificado>(VAZIO);
    const [idExcluir, setIdExcluir] = useState<number | null>(null);
    const [visualizar, setVisualizar] = useState<ICertificado | null>(null);

    useEffect(() => {
        usuarioService.listar().then(setUsuarios).catch(() => {});
        cursoService.listar().then(setCursos).catch(() => {});
        trilhaService.listar().then(setTrilhas).catch(() => {});
    }, []);

    const limpar = () => setForm({ ...VAZIO, dataEmissao: dataHoje() });
    const nomeUsuario = (id: number) => usuarios.find((u) => u.id === id)?.nomeCompleto ?? "-";
    const tituloCurso = (id: number) => cursos.find((c) => c.id === id)?.titulo ?? "-";
    const tituloTrilha = (id: number | null) => id ? (trilhas.find((t) => t.id === id)?.titulo ?? "-") : null;

    const handleEmitir = async () => {
        if (!form.idUsuario || !form.idCurso) { setFeedback({ tipo: "danger", texto: "Selecione o aluno e o curso." }); return; }
        const certificado = { ...form, codigoVerificacao: form.codigoVerificacao || gerarCodigoVerificacao() };
        const ok = await salvar(certificado);
        if (ok) limpar();
    };

    return (
        <div>
            <PageHeader titulo="Certificados" icon="bi-patch-check-fill" descricao="Emissão de certificados com código de verificação." />
            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}

            <div className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white"><i className="bi bi-award me-2"></i>Emitir Certificado</div>
                        <div className="card-body">
                            <Select label="Aluno" id="idUsuario" required value={form.idUsuario || ""}
                                opcoes={usuarios.map((u) => ({ valor: u.id!, rotulo: u.nomeCompleto }))}
                                onChange={(v) => setForm({ ...form, idUsuario: Number(v) })} />
                            <Select label="Curso" id="idCurso" required value={form.idCurso || ""}
                                opcoes={cursos.map((c) => ({ valor: c.id!, rotulo: c.titulo }))}
                                onChange={(v) => setForm({ ...form, idCurso: Number(v) })} />
                            <Select label="Trilha (opcional)" id="idTrilha" value={form.idTrilha ?? ""}
                                opcoes={trilhas.map((t) => ({ valor: t.id!, rotulo: t.titulo }))}
                                placeholder="Nenhuma"
                                onChange={(v) => setForm({ ...form, idTrilha: v ? Number(v) : null })} />
                            <div className="alert alert-light border small mb-0">
                                <i className="bi bi-info-circle me-1"></i>
                                O código de verificação é gerado automaticamente na emissão.
                            </div>
                        </div>
                        <div className="card-footer bg-white">
                            <Button value="Emitir Certificado" icon="bi-patch-check" block onClick={handleEmitir} />
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-8">
                    <div className="card">
                        <div className="card-header bg-dark text-white d-flex justify-content-between">
                            <span><i className="bi bi-list-ul me-2"></i>Certificados Emitidos</span>
                            <span className="badge bg-warning text-dark">{itens.length}</span>
                        </div>
                        <div className="card-body p-0">
                            {carregando ? <div className="text-center py-4"><div className="spinner-border text-primary"></div></div> : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover mb-0">
                                        <thead className="table-light"><tr>
                                            <th>#</th><th>Aluno</th><th>Curso</th><th>Código</th><th>Emissão</th><th className="text-end">Ações</th>
                                        </tr></thead>
                                        <tbody>
                                            {itens.length === 0 ? (
                                                <tr><td colSpan={6} className="text-center text-muted py-3">Nenhum certificado.</td></tr>
                                            ) : itens.map((c) => (
                                                <tr key={c.id}>
                                                    <td>{c.id}</td>
                                                    <td>{nomeUsuario(c.idUsuario)}</td>
                                                    <td>{tituloCurso(c.idCurso)}</td>
                                                    <td><code className="small">{c.codigoVerificacao}</code></td>
                                                    <td>{formatarData(c.dataEmissao)}</td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-outline-success me-1" onClick={() => setVisualizar(c)}><i className="bi bi-eye"></i></button>
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

            {/* Modal de visualização do certificado */}
            {visualizar && (
                <>
                    <div className="modal fade show d-block" tabIndex={-1}>
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body p-0">
                                    <div className="border border-3 border-warning m-3 p-5 text-center" style={{ background: "#fffdf5" }}>
                                        <i className="bi bi-mortarboard-fill text-warning" style={{ fontSize: "3rem" }}></i>
                                        <h2 className="mt-3">Certificado de Conclusão</h2>
                                        <p className="text-muted">Gustavo Milhomem Cursos certifica que</p>
                                        <h3 className="text-primary">{nomeUsuario(visualizar.idUsuario)}</h3>
                                        <p className="text-muted">concluiu com êxito o curso</p>
                                        <h4>{tituloCurso(visualizar.idCurso)}</h4>
                                        {tituloTrilha(visualizar.idTrilha) && (
                                            <p className="text-muted">Trilha: {tituloTrilha(visualizar.idTrilha)}</p>
                                        )}
                                        <hr className="w-50 mx-auto my-4" />
                                        <p className="mb-1">Emitido em {formatarData(visualizar.dataEmissao)}</p>
                                        <p className="mb-0">Código de verificação: <code>{visualizar.codigoVerificacao}</code></p>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setVisualizar(null)}>Fechar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            <ConfirmModal aberto={idExcluir !== null} titulo="Confirmar exclusão"
                mensagem="Deseja realmente excluir este certificado?" onCancelar={() => setIdExcluir(null)}
                onConfirmar={() => { if (idExcluir !== null) excluir(idExcluir); setIdExcluir(null); }} />
        </div>
    );
}
