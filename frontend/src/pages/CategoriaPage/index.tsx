import { useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { Input } from "../../components/Input";
import { TextArea } from "../../components/TextArea";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useCrud } from "../../hooks/useCrud";
import { categoriaService } from "../../services/categoria.service";
import type { ICategoria } from "../../models/categoria.model";

const VAZIO: ICategoria = { nome: "", descricao: "" };

export const CategoriaPage = () => {

    const { itens, carregando, feedback, setFeedback, salvar, excluir } = useCrud<ICategoria>(categoriaService);

    const [form, setForm] = useState<ICategoria>(VAZIO);
    const [editandoId, setEditandoId] = useState<number | undefined>(undefined);
    const [idExcluir, setIdExcluir] = useState<number | null>(null);

    const limpar = () => {
        setForm(VAZIO);
        setEditandoId(undefined);
    };

    const handleSalvar = async () => {
        if (!form.nome.trim()) {
            setFeedback({ tipo: "danger", texto: "O nome da categoria é obrigatório." });
            return;
        }
        const ok = await salvar(form, editandoId);
        if (ok) limpar();
    };

    const handleEditar = (categoria: ICategoria) => {
        setForm({ nome: categoria.nome, descricao: categoria.descricao });
        setEditandoId(categoria.id);
    };

    return (
        <div>
            <PageHeader titulo="Categorias" icon="bi-tags-fill" descricao="Cadastro de categorias de cursos e trilhas." />

            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}

            <div className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <i className={`bi ${editandoId ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
                            {editandoId ? "Editar Categoria" : "Nova Categoria"}
                        </div>
                        <div className="card-body">
                            <Input
                                label="Nome"
                                id="nome"
                                value={form.nome}
                                required
                                placeholder="Ex: Programação"
                                onChange={(v) => setForm({ ...form, nome: v })}
                            />
                            <TextArea
                                label="Descrição"
                                id="descricao"
                                value={form.descricao}
                                placeholder="Breve descrição da categoria"
                                onChange={(v) => setForm({ ...form, descricao: v })}
                            />
                        </div>
                        <div className="card-footer bg-white">
                            <div className="row g-2">
                                <div className="col-6">
                                    <Button value="Salvar" icon="bi-check-lg" block onClick={handleSalvar} />
                                </div>
                                <div className="col-6">
                                    <Button variant="secondary" value="Cancelar" icon="bi-x-lg" block onClick={limpar} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-8">
                    <div className="card">
                        <div className="card-header bg-dark text-white d-flex justify-content-between">
                            <span><i className="bi bi-list-ul me-2"></i>Categorias Cadastradas</span>
                            <span className="badge bg-warning text-dark">{itens.length}</span>
                        </div>
                        <div className="card-body p-0">
                            {carregando ? (
                                <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Nome</th>
                                                <th>Descrição</th>
                                                <th className="text-end">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {itens.length === 0 ? (
                                                <tr><td colSpan={4} className="text-center text-muted py-3">Nenhuma categoria cadastrada.</td></tr>
                                            ) : itens.map((cat) => (
                                                <tr key={cat.id}>
                                                    <td>{cat.id}</td>
                                                    <td>{cat.nome}</td>
                                                    <td className="text-muted">{cat.descricao || "-"}</td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditar(cat)}>
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => setIdExcluir(cat.id!)}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
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

            <ConfirmModal
                aberto={idExcluir !== null}
                titulo="Confirmar exclusão"
                mensagem="Deseja realmente excluir esta categoria?"
                onCancelar={() => setIdExcluir(null)}
                onConfirmar={() => {
                    if (idExcluir !== null) excluir(idExcluir);
                    setIdExcluir(null);
                }}
            />
        </div>
    );
}
