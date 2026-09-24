export interface ConfirmModalProp {
    aberto: boolean;
    titulo: string;
    mensagem: string;
    onConfirmar: () => void;
    onCancelar: () => void;
}

export const ConfirmModal = ({ aberto, titulo, mensagem, onConfirmar, onCancelar }: ConfirmModalProp) => {
    if (!aberto) return null;

    return (
        <>
            <div className="modal fade show d-block" tabIndex={-1} role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>
                                {titulo}
                            </h5>
                            <button type="button" className="btn-close" onClick={onCancelar}></button>
                        </div>
                        <div className="modal-body">
                            <p className="mb-0">{mensagem}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onCancelar}>Cancelar</button>
                            <button type="button" className="btn btn-danger" onClick={onConfirmar}>Excluir</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}
