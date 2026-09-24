export interface InputProp {
    label: string;
    type?: string;
    placeholder?: string;
    id: string;
    value: string | number;
    required?: boolean;
    min?: number;
    step?: string;
    onChange: (valor: string) => void;
}

export const Input = ({
    label,
    type = "text",
    id,
    placeholder,
    value,
    required = false,
    min,
    step,
    onChange,
}: InputProp) => {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">
                {label} {required && <span className="text-danger">*</span>}
            </label>
            <input
                type={type}
                className="form-control"
                id={id}
                placeholder={placeholder}
                value={value}
                required={required}
                min={min}
                step={step}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
