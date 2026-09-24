export interface TextAreaProp {
    label: string;
    id: string;
    value: string;
    placeholder?: string;
    rows?: number;
    onChange: (valor: string) => void;
}

export const TextArea = ({
    label,
    id,
    value,
    placeholder,
    rows = 3,
    onChange,
}: TextAreaProp) => {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">{label}</label>
            <textarea
                className="form-control"
                id={id}
                rows={rows}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
