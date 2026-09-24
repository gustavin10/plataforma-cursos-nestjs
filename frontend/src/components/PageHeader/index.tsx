export interface PageHeaderProp {
    titulo: string;
    icon: string;
    descricao?: string;
}

export const PageHeader = ({ titulo, icon, descricao }: PageHeaderProp) => {
    return (
        <div className="mb-4">
            <h3 className="d-flex align-items-center gap-2 text-dark">
                <i className={`bi ${icon} text-warning`}></i>
                {titulo}
            </h3>
            {descricao && <p className="text-muted mb-2">{descricao}</p>}
            <hr />
        </div>
    );
}
