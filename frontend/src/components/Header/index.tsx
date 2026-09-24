import { useNavigate } from "react-router-dom";
import { Nav } from "../Nav";
import { authService } from "../../services/auth.service";

export const Header = () => {

    const navigate = useNavigate();
    const usuario = authService.getUsuario();

    const sair = () => {
        authService.logout();
        navigate("/login", { replace: true });
    };

    return (
        <nav className="navbar navbar-dark bg-dark sticky-top shadow-sm">
            <div className="container-fluid">
                <button
                    className="btn btn-dark"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasMenu"
                    aria-controls="offcanvasMenu"
                >
                    <i className="bi bi-list fs-4"></i>
                </button>

                <span className="navbar-brand mb-0 h1 d-flex align-items-center gap-2">
                    <i className="bi bi-mortarboard-fill text-warning"></i>
                    Gustavo Milhomem Cursos
                </span>

                <div className="d-flex align-items-center gap-3">
                    {usuario && (
                        <span className="text-white-50 small d-none d-md-inline">
                            <i className="bi bi-person-circle me-1"></i>
                            {usuario.nomeCompleto} <span className="badge bg-secondary ms-1">{usuario.perfil}</span>
                        </span>
                    )}
                    <button className="btn btn-outline-warning btn-sm" type="button" onClick={sair}>
                        <i className="bi bi-box-arrow-right me-1"></i>Sair
                    </button>
                </div>

                <div
                    className="offcanvas offcanvas-start bg-dark text-white"
                    tabIndex={-1}
                    id="offcanvasMenu"
                    aria-labelledby="offcanvasMenuLabel"
                >
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title text-warning d-flex align-items-center gap-2" id="offcanvasMenuLabel">
                            <i className="bi bi-mortarboard-fill"></i>
                            Gustavo Milhomem Cursos
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="offcanvas"
                            aria-label="Fechar"
                        ></button>
                    </div>
                    <hr className="m-0" />
                    <div className="offcanvas-body">
                        <Nav />
                    </div>
                </div>
            </div>
        </nav>
    );
}
