import { useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useCrud } from "../../hooks/useCrud";
import { usuarioService } from "../../services/usuario.service";
import type { IUsuario } from "../../models/usuario.model";
import { formatarData, dataHoje } from "../../utils/formatadores";

const VAZIO: IUsuario = {
    nomeCompleto: "",
    email: "",
    senha: "",
    perfil: "aluno",
    dataCadastro: dataHoje(),
};

const PERFIS = [
    { valor: "administrador", rotulo: "Administrador" },
    { valor: "instrutor", rotulo: "Instrutor" },
    { valor: "aluno", rotulo: "Aluno" },
];

export const UsuarioPage = () => {

    const { itens, carregando, feedback, setFeedback, salvar, excluir } = useCrud<IUsuario>(usuarioService);

    const [form, setForm] = useState<IUsuario>(VAZIO);
    const [editandoId, setEditandoId] = useState<number | undefined>(undefined);
    const [idExcluir, setIdExcluir] = useState<number | null>(null);

    const limpar = () => {
        setForm({ ...VAZIO, dataCadastro: dataHoje() });
        setEditandoId(undefined);
    };

    const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSalvar = async () => {
        if (!form.nomeCompleto.trim() || !form.email.trim()) {
            setFeedback({ tipo: "danger", texto: "Nome e e-mail são obrigatórios." });
            return;
        }
        if (!validarEmail(form.email)) {
            setFeedback({ tipo: "danger", texto: "Informe um e-mail válido." });
            return;
        }
        const emailDuplicado = itens.some((u) => u.email === form.email && u.id !== editandoId);
        if (emailDuplicado) {
            setFeedback({ tipo: "danger", texto: "Já existe um usuário com este e-mail." });
            return;
        }
        const senha = form.senha?.trim() ?? "";
        if (!editandoId && !senha) {
            setFeedback({ tipo: "danger", texto: "A senha é obrigatória no cadastro." });
            return;
        }
        if (senha && senha.length < 6) {
            setFeedback({ tipo: "danger", texto: "A senha deve ter no mínimo 6 caracteres." });
            return;
        }
        // Na edição, senha em branco significa "manter a senha atual"
        const { senha: _senha, ...semSenha } = form;
        const ok = await salvar(senha ? { ...form, senha } : semSenha, editandoId);
        if (ok) limpar();
    };

    const handleEditar = (u: IUsuario) => {
        setForm({ ...u, senha: "" });
        setEditandoId(u.id);
    };

    const badgePerfil = (perfil: string) => {
        const mapa: Record<string, string> = { administrador: "danger", instrutor: "primary", aluno: "success" };
        return <span className={`badge bg-${mapa[perfil]}`}>{perfil}</span>;
    };

    return (
        <div>
            <PageHeader titulo="Usuários" icon="bi-people-fill" descricao="Cadastro de alunos, instrutores e administradores." />

            {feedback && <Alert tipo={feedback.tipo} mensagem={feedback.texto} onFechar={() => setFeedback(null)} />}

            <div className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <i className={`bi ${editandoId ? "bi-pencil-square" : "bi-person-plus"} me-2`}></i>
                            {editandoId ? "Editar Usuário" : "Novo Usuário"}
                        </div>
                        <div className="card-body">
                            <Input label="Nome Completo" id="nomeCompleto" value={form.nomeCompleto} required
                                onChange={(v) => setForm({ ...form, nomeCompleto: v })} />
                            <Input label="E-mail" id="email" type="email" value={form.email} required
                                onChange={(v) => setForm({ ...form, email: v })} />
                            <Input label="Senha" id="senha" type="password" value={form.senha ?? ""}
                                placeholder={editandoId ? "Deixe em branco para manter" : "Mínimo de 6 caracteres"}
                                onChange={(v) => setForm({ ...form, senha: v })} />
                            <Select label="Perfil" id="perfil" value={form.perfil} opcoes={PERFIS} required
                                onChange={(v) => setForm({ ...form, perfil: v as IUsuario["perfil"] })} />
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
                            <span><i className="bi bi-list-ul me-2"></i>Usuários Cadastrados</span>
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
                                                <th>#</th><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Cadastro</th><th className="text-end">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {itens.length === 0 ? (
                                                <tr><td colSpan={6} className="text-center text-muted py-3">Nenhum usuário cadastrado.</td></tr>
                                            ) : itens.map((u) => (
                                                <tr key={u.id}>
                                                    <td>{u.id}</td>
                                                    <td>{u.nomeCompleto}</td>
                                                    <td className="text-muted">{u.email}</td>
                                                    <td>{badgePerfil(u.perfil)}</td>
                                                    <td>{formatarData(u.dataCadastro)}</td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditar(u)}><i className="bi bi-pencil"></i></button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => setIdExcluir(u.id!)}><i className="bi bi-trash"></i></button>
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
                mensagem="Deseja realmente excluir este usuário?"
                onCancelar={() => setIdExcluir(null)}
                onConfirmar={() => { if (idExcluir !== null) excluir(idExcluir); setIdExcluir(null); }}
            />
        </div>
    );
}
