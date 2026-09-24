import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { authService } from "../../services/auth.service";
import { mensagemErro } from "../../hooks/useCrud";

export const LoginPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState<string | null>(null);
    const [entrando, setEntrando] = useState(false);

    // Mensagem enviada pela tela de cadastro após criar a conta
    const mensagemCadastro = (location.state as { cadastrado?: boolean } | null)?.cadastrado
        ? "Conta criada com sucesso! Faça login para continuar."
        : null;

    if (authService.estaAutenticado()) {
        return <Navigate to="/" replace />;
    }

    const handleEntrar = async (e: FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !senha) {
            setErro("Informe o e-mail e a senha.");
            return;
        }
        setEntrando(true);
        try {
            await authService.login(email.trim(), senha);
            navigate("/", { replace: true });
        } catch (e) {
            setErro(mensagemErro(e));
        } finally {
            setEntrando(false);
        }
    };

    return (
        <div className="tela-auth">
            <div className="card tela-auth-card">
                <div className="card-header bg-dark text-white text-center py-3">
                    <h4 className="mb-0 d-flex align-items-center justify-content-center gap-2">
                        <i className="bi bi-mortarboard-fill text-warning"></i>
                        Gustavo Milhomem Cursos
                    </h4>
                    <small className="text-white-50">Acesse sua conta</small>
                </div>
                <form className="card-body" onSubmit={handleEntrar}>
                    {mensagemCadastro && !erro && <Alert tipo="success" mensagem={mensagemCadastro} onFechar={() => navigate(".", { replace: true, state: null })} />}
                    {erro && <Alert tipo="danger" mensagem={erro} onFechar={() => setErro(null)} />}

                    <Input label="E-mail" id="email" type="email" value={email} required
                        placeholder="seu@email.com" onChange={setEmail} />
                    <Input label="Senha" id="senha" type="password" value={senha} required
                        onChange={setSenha} />

                    <Button type="submit" value={entrando ? "Entrando..." : "Entrar"} icon="bi-box-arrow-in-right"
                        variant="warning" block disabled={entrando} />
                </form>
                <div className="card-footer bg-white text-center">
                    Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
                </div>
            </div>
        </div>
    );
}
