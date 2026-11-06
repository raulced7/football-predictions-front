import { useState, type ComponentProps } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TextField } from './TextField';

type PasswordFieldProps = Omit<ComponentProps<typeof TextField>, 'type' | 'endAdornment'>;

export function PasswordField(props: PasswordFieldProps) {
    const [visible, setVisible] = useState(false);
    const Icon = visible ? EyeOff : Eye;

    return (
        <TextField
            {...props}
            type={visible ? 'text' : 'password'}
            endAdornment={
                <button
                    type="button"
                    onClick={() => setVisible((current) => !current)}
                    aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={visible}
                    className="text-muted hover:text-fg flex size-11 items-center justify-center rounded-xl"
                >
                    <Icon className="size-5" aria-hidden="true" />
                </button>
            }
        />
    );
}
