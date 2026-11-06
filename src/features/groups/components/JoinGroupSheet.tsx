import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { Button } from '../../../components/Buttons';
import { Sheet } from '../../../components/Sheet';
import { TextField } from '../../../components/TextField';
import { getErrorMessage } from '../../../api/errors';
import { useJoinGroup } from '../api';

const joinGroupSchema = z.object({
    inviteCode: z
        .string()
        .trim()
        .min(1, 'Escribe el código que te han pasado')
        .max(12, 'El código es demasiado largo'),
});

type JoinGroupFormValues = z.infer<typeof joinGroupSchema>;

export function JoinGroupSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
        <Sheet open={open} onClose={onClose} title="Unirme a un grupo">
            {open && <JoinGroupForm onClose={onClose} />}
        </Sheet>
    );
}

function JoinGroupForm({ onClose }: { onClose: () => void }) {
    const navigate = useNavigate();
    const joinGroup = useJoinGroup();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<JoinGroupFormValues>({ resolver: zodResolver(joinGroupSchema) });

    return (
        <form
            noValidate
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(({ inviteCode }) =>
                joinGroup.mutate(inviteCode.toUpperCase(), {
                    onSuccess: (group) => {
                        onClose();
                        navigate(`/grupos/${group.id}`);
                    },
                }),
            )}
        >
            <TextField
                label="Código de invitación"
                placeholder="K7M2QX9P"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                error={errors.inviteCode?.message}
                {...register('inviteCode')}
            />
            {joinGroup.isError && (
                <p
                    role="alert"
                    className="bg-coral/12 text-coral rounded-xl px-3.5 py-3 text-[13px]"
                >
                    {getErrorMessage(joinGroup.error)}
                </p>
            )}
            <div className="grid grid-cols-2 gap-2.5">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" loading={joinGroup.isPending}>
                    Unirme
                </Button>
            </div>
        </form>
    );
}
