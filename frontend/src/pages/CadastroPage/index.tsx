import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { authService } from "../../services/auth.service";
import { usuarioService } from "../../services/usuario.service";
import { mensagemErro } from "../../hooks/useCrud";
import { dataHoje } from "../../utils/formatadores";

// Cadastro público: usa a rota POST /usuarios, que não exige token.
export const CadastroPage = () => {

    const navigate = useNavigate();
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const [erro, setErro] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);

    if (authService.estaAutenticado()) {
        return <Navigate to="/" replace />;
    }

    const handleCadastrar = async (e: FormEvent) => {
        e.preventDefault();
        if (!nomeCompleto.trim() || !email.trim()) {
            setErro("Nome e e-mail são obrigatórios.");
            return;
        }
        if (senha.length < 6) {
            setErro("A senha deve ter no mínimo 6 caracteres.");
            return;
        }
        if (senha !== confirmacao) {
            setErro("As senhas não conferem.");
            return;
        }
        setSalvando(true);
        try {
            await usuarioService.inserir({
                nomeCompleto: nomeCompleto.trim(),
                email: email.trim(),
                senha,
                perfil: "aluno",
                dataCadastro: dataHoje(),
            });
            navigate("/login", { state: { cadastrado: true } });
        } catch (e) {
            setErro(mensagemErro(e));
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="tela-auth">
            <div className="card tela-auth-card">
                <div className="card-header bg-dark text-white text-center py-3">
                    <h4 className="mb-0 d-flex align-items-center justify-content-center gap-2">
                        <i className="bi bi-person-plus-fill text-warning"></i>
                        Criar conta
                    </h4>
                    <small className="text-white-50">Cadastro de aluno</small>
                </div>
                <form className="card-body" onSubmit={handleCadastrar}>
                    {erro && <Alert tipo="danger" mensagem={erro} onFechar={() => setErro(null)} />}

                    <Input label="Nome Completo" id="nomeCompleto" value={nomeCompleto} required onChange={setNomeCompleto} />
                    <Input label="E-mail" id="email" type="email" value={email} required onChange={setEmail} />
                    <Input label="Senha" id="senha" type="password" value={senha} required
                        placeholder="Mínimo de 6 caracteres" onChange={setSenha} />
                    <Input label="Confirmar Senha" id="confirmacao" type="password" value={confirmacao} required
                        onChange={setConfirmacao} />

                    <Button type="submit" value={salvando ? "Cadastrando..." : "Cadastrar"} icon="bi-check-lg"
                        variant="warning" block disabled={salvando} />
                </form>
                <div className="card-footer bg-white text-center">
                    Já tem conta? <Link to="/login">Entrar</Link>
                </div>
            </div>
        </div>
    );
}
