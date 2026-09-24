import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { CheckoutTab } from "./CheckoutTab";
import { AssinaturasTab } from "./AssinaturasTab";
import { PagamentosTab } from "./PagamentosTab";

export const FinanceiroPage = () => {
    return (
        <div>
            <PageHeader titulo="Financeiro" icon="bi-credit-card-2-front-fill"
                descricao="Checkout de planos, assinaturas e pagamentos." />

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <NavLink to="/financeiro/checkout" className={({ isActive }) => `nav-link ${isActive ? "active" : "text-dark"}`}>
                        <i className="bi bi-cart-check me-1"></i>Checkout
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/financeiro/assinaturas" className={({ isActive }) => `nav-link ${isActive ? "active" : "text-dark"}`}>
                        <i className="bi bi-calendar-check me-1"></i>Assinaturas
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/financeiro/pagamentos" className={({ isActive }) => `nav-link ${isActive ? "active" : "text-dark"}`}>
                        <i className="bi bi-receipt me-1"></i>Pagamentos
                    </NavLink>
                </li>
            </ul>

            <Routes>
                <Route index element={<Navigate to="checkout" replace />} />
                <Route path="checkout" element={<CheckoutTab />} />
                <Route path="assinaturas" element={<AssinaturasTab />} />
                <Route path="pagamentos" element={<PagamentosTab />} />
            </Routes>
        </div>
    );
}
