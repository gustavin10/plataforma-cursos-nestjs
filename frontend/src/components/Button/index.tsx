export interface ButtonProp {
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "dark";
    value: string;
    type?: "button" | "submit" | "reset";
    icon?: string;
    size?: "sm" | "lg";
    block?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

export const Button = ({
    variant = "primary",
    value = "Button",
    type = "button",
    icon,
    size,
    block = false,
    disabled = false,
    onClick,
}: ButtonProp) => {

    const classes = [
        "btn",
        `btn-${variant}`,
        size ? `btn-${size}` : "",
    ].filter(Boolean).join(" ");

    const botao = (
        <button className={classes} type={type} onClick={onClick} disabled={disabled}>
            {icon && <i className={`bi ${icon} me-1`}></i>}
            {value}
        </button>
    );

    if (block) {
        return <div className="d-grid gap-2">{botao}</div>;
    }

    return botao;
}
