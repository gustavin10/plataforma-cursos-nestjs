import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { PrivateRoute } from "./PrivateRoute";
import { LoginPage } from "../pages/LoginPage";
import { CadastroPage } from "../pages/CadastroPage";
import { HomePage } from "../pages/HomePage";
import { UsuarioPage } from "../pages/UsuarioPage";
import { CategoriaPage } from "../pages/CategoriaPage";
import { CursoPage } from "../pages/CursoPage";
import { ConteudoPage } from "../pages/ConteudoPage";
import { MatriculaPage } from "../pages/MatriculaPage";
import { ProgressoPage } from "../pages/ProgressoPage";
import { AvaliacaoPage } from "../pages/AvaliacaoPage";
import { TrilhaPage } from "../pages/TrilhaPage";
import { CertificadoPage } from "../pages/CertificadoPage";
import { PlanoPage } from "../pages/PlanoPage";
import { FinanceiroPage } from "../pages/FinanceiroPage";

// Layout das páginas internas (menu + conteúdo), exibido apenas para usuários logados
const LayoutPrivado = () => (
    <PrivateRoute>
        <Header />
        <main className="conteudo-principal">
            <Outlet />
        </main>
    </PrivateRoute>
);

export const AppRouter = () => {
    return (
        <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />

            {/* Rotas protegidas: exigem o token JWT */}
            <Route element={<LayoutPrivado />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/usuarios" element={<UsuarioPage />} />
                <Route path="/categorias" element={<CategoriaPage />} />
                <Route path="/cursos" element={<CursoPage />} />
                <Route path="/conteudo" element={<ConteudoPage />} />
                <Route path="/matriculas" element={<MatriculaPage />} />
                <Route path="/progresso" element={<ProgressoPage />} />
                <Route path="/avaliacoes" element={<AvaliacaoPage />} />
                <Route path="/trilhas" element={<TrilhaPage />} />
                <Route path="/certificados" element={<CertificadoPage />} />
                <Route path="/planos" element={<PlanoPage />} />
                <Route path="/financeiro/*" element={<FinanceiroPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
