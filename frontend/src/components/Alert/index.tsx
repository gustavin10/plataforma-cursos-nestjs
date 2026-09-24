export interface AlertProp {
    tipo: "success" | "danger" | "warning" | "info";
    mensagem: string;
    onFechar: () => void;
}

export const Alert = ({ tipo, mensagem, onFechar }: AlertProp) => {
    return (
        <div className={`alert alert-${tipo} alert-dismissible d-flex align-items-center`} role="alert">
            <i className={`bi me-2 ${tipo === "success" ? "bi-check-circle-fill" : tipo === "danger" ? "bi-exclamation-triangle-fill" : "bi-info-circle-fill"}`}></i>
            <div>{mensagem}</div>
            <button type="button" className="btn-close" aria-label="Fechar" onClick={onFechar}></button>
        </div>
    );
}
