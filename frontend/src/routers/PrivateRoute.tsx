import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../services/auth.service";

// Só renderiza a página se existir um token JWT salvo; senão, redireciona para o login.
export const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    if (!authService.estaAutenticado()) {
        return <Navigate to="/login" replace state={{ de: location.pathname }} />;
    }
    return <>{children}</>;
}
