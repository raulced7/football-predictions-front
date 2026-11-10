import type { ChangeEvent } from 'react';

export const CODE_LENGTH = 6;

interface CodeInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    autoFocus?: boolean;
}

/** Campo para el código de 6 dígitos que llega por correo. */
export function CodeInput({ id, label, value, onChange, error, autoFocus }: CodeInputProps) {
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        // Solo números: así también funciona al pegar "123 456" o el código con espacios
        onChange(event.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH));
    }

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-[13px] font-semibold">
                {label}
            </label>
            <input
                id={id}
                value={value}
                onChange={handleChange}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d*"
                placeholder="000000"
                autoFocus={autoFocus}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`bg-surface font-display placeholder:text-line h-16 w-full rounded-2xl border text-center text-[32px] font-bold tracking-[0.5em] outline-none ${
                    error ? 'border-coral' : 'border-line focus:border-lime'
                }`}
            />
            {error && (
                <p id={`${id}-error`} role="alert" className="text-coral text-xs">
                    {error}
                </p>
            )}
        </div>
    );
}
