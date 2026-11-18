import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/Buttons';
import { PasswordField } from '../../../components/PasswordField';
import { Sheet } from '../../../components/Sheet';
import { getErrorMessage } from '../../../api/errors';
import { useDeleteAccount } from '../api';

const deleteAccountSchema = z.object({
    password: z.string().min(1, 'Escribe tu contraseña'),
});

type DeleteAccountForm = z.infer<typeof deleteAccountSchema>;

interface DeleteAccountSheetProps {
    open: boolean;
    onClose: () => void;
}

export function DeleteAccountSheet({ open, onClose }: DeleteAccountSheetProps) {
    const deleteAccount = useDeleteAccount();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DeleteAccountForm>({ resolver: zodResolver(deleteAccountSchema) });

    function close() {
        reset();
        deleteAccount.reset();
        onClose();
    }

    return (
        <Sheet open={open} onClose={close} title="Borrar mi cuenta">
            <div className="text-muted flex flex-col gap-2 text-[14px] leading-relaxed">
                <p>Se borrará todo y no se puede deshacer:</p>
                <ul className="flex list-disc flex-col gap-1 pl-5">
                    <li>Tu cuenta, tu foto y todos tus pronósticos.</li>
                    <li>Desaparecerás de las clasificaciones de tus grupos.</li>
                    <li>
                        Los grupos que creaste pasan al miembro más antiguo. Si estabas solo, se
                        borran.
                    </li>
                </ul>
            </div>
            <form
                noValidate
                onSubmit={handleSubmit(({ password }) => deleteAccount.mutate(password))}
                className="flex flex-col gap-4"
            >
                <PasswordField
                    label="Tu contraseña"
                    autoComplete="current-password"
                    error={errors.password?.message}
                    {...register('password')}
                />
                {deleteAccount.isError && (
                    <p
                        role="alert"
                        className="bg-coral/12 text-coral rounded-xl px-3.5 py-3 text-[13px]"
                    >
                        {getErrorMessage(deleteAccount.error)}
                    </p>
                )}
                <Button type="submit" variant="danger" loading={deleteAccount.isPending}>
                    Borrar mi cuenta para siempre
                </Button>
            </form>
        </Sheet>
    );
}
