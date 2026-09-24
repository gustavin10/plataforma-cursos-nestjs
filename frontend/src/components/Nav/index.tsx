import { NavLink } from "react-router-dom";
import { Offcanvas } from "bootstrap";

interface ItemNav {
    to: string;
    rotulo: string;
    icon: string;
}

const itens: ItemNav[] = [
    { to: "/", rotulo: "Home", icon: "bi-house-door-fill" },
    { to: "/usuarios", rotulo: "Usuários", icon: "bi-people-fill" },
    { to: "/categorias", rotulo: "Categorias", icon: "bi-tags-fill" },
    { to: "/cursos", rotulo: "Cursos", icon: "bi-journal-bookmark-fill" },
    { to: "/conteudo", rotulo: "Módulos & Aulas", icon: "bi-collection-play-fill" },
    { to: "/matriculas", rotulo: "Matrículas", icon: "bi-card-checklist" },
    { to: "/progresso", rotulo: "Progresso", icon: "bi-graph-up-arrow" },
    { to: "/avaliacoes", rotulo: "Avaliações", icon: "bi-star-fill" },
    { to: "/trilhas", rotulo: "Trilhas", icon: "bi-signpost-split-fill" },
    { to: "/certificados", rotulo: "Certificados", icon: "bi-patch-check-fill" },
    { to: "/planos", rotulo: "Planos", icon: "bi-box-seam-fill" },
    { to: "/financeiro", rotulo: "Financeiro", icon: "bi-credit-card-2-front-fill" },
];

export const Nav = () => {

    // Fecha o menu lateral (offcanvas) ao navegar, usando a API do Bootstrap.
    // Evitamos o data-bs-dismiss porque ele conflita com a navegação do React Router.
    const fecharMenu = () => {
        const elemento = document.getElementById("offcanvasMenu");
        if (elemento) {
            const instancia = Offcanvas.getInstance(elemento) ?? new Offcanvas(elemento);
            instancia.hide();
        }
    };

    return (
        <ul className="nav flex-column">
            {itens.map((item) => (
                <li className="nav-item" key={item.to}>
                    <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        onClick={fecharMenu}
                        className={({ isActive }) =>
                            `nav-link text-white d-flex align-items-center gap-2 rounded px-3 py-2 ${isActive ? "bg-warning text-dark fw-semibold" : ""}`
                        }
                    >
                        <i className={`bi ${item.icon}`}></i>
                        {item.rotulo}
                    </NavLink>
                </li>
            ))}
        </ul>
    );
}
