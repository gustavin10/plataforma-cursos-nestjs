export interface OpcaoSelect {
    valor: string | number;
    rotulo: string;
}

export interface SelectProp {
    label: string;
    id: string;
    value: string | number;
    opcoes: OpcaoSelect[];
    required?: boolean;
    placeholder?: string;
    onChange: (valor: string) => void;
}

export const Select = ({
    label,
    id,
    value,
    opcoes,
    required = false,
    placeholder = "Selecione...",
    onChange,
}: SelectProp) => {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">
                {label} {required && <span className="text-danger">*</span>}
            </label>
            <select
                className="form-select"
                id={id}
                value={value}
                required={required}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">{placeholder}</option>
                {opcoes.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                        {opcao.rotulo}
                    </option>
                ))}
            </select>
        </div>
    );
}
