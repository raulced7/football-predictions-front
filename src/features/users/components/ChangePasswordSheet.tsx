import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/Buttons';
import { PasswordField } from '../../../components/PasswordField';
import { Sheet } from '../../../components/Sheet';
import { getErrorMessage } from '../../../api/errors';
import { useChangePassword } from '../api';

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Escribe tu contraseña actual'),
    newPassword: z.string().min(8, 'Mínimo 8 caracteres').max(72, 'Máximo 72 caracteres'),
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ChangePasswordSheetProps {
    open: boolean;
    onClose: () => void;
    onChanged: () => void;
}

export function ChangePasswordSheet({ open, onClose, onChanged }: ChangePasswordSheetProps) {
    const changePassword = useChangePassword();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordForm>({ resolver: zodResolver(changePasswordSchema) });

    function close() {
        reset();
        changePassword.reset();
        onClose();
    }

    return (
        <Sheet open={open} onClose={close} title="Cambiar contraseña">
            <form
                noValidate
                onSubmit={handleSubmit((values) =>
                    changePassword.mutate(values, {
                        onSuccess: () => {
                            close();
                            onChanged();
                        },
                    }),
                )}
                className="flex flex-col gap-4"
            >
                <PasswordField
                    label="Contraseña actual"
                    autoComplete="current-password"
                    error={errors.currentPassword?.message}
                    {...register('currentPassword')}
                />
                <PasswordField
                    label="Contraseña nueva"
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    error={errors.newPassword?.message}
                    {...register('newPassword')}
                />
                {changePassword.isError && (
                    <p
                        role="alert"
                        className="bg-coral/12 text-coral rounded-xl px-3.5 py-3 text-[13px]"
                    >
                        {getErrorMessage(changePassword.error)}
                    </p>
                )}
                <Button type="submit" loading={changePassword.isPending}>
                    Guardar
                </Button>
            </form>
        </Sheet>
    );
}
