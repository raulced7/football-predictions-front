import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { Button } from '../../../components/Buttons';
import { Sheet } from '../../../components/Sheet';
import { TextField } from '../../../components/TextField';
import { getErrorMessage } from '../../../api/errors';
import { useOpenSeasons } from '../../rounds/api';
import { useCreateGroup } from '../api';

const createGroupSchema = z.object({
    name: z.string().trim().min(1, 'Ponle un nombre al grupo').max(50, 'Máximo 50 caracteres'),
    seasonId: z.string().min(1, 'Elige una competición'),
});

type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

interface Season {
    id: number;
    label: string;
}

export function CreateGroupSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
    const seasons = useOpenSeasons();
    const options: Season[] =
        seasons.data
            ?.filter((season) => season.id != null)
            .map((season) => ({
                id: season.id!,
                label: `${season.competitionName} · ${season.name}`,
            })) ?? [];

    return (
        <Sheet open={open} onClose={onClose} title="Crear grupo">
            {/* El formulario se monta al abrir: así empieza siempre vacío y con la temporada ya cargada */}
            {open && options.length > 0 && <CreateGroupForm seasons={options} onClose={onClose} />}
            {open && seasons.isSuccess && options.length === 0 && (
                <p className="text-muted">No hay ninguna temporada abierta ahora mismo.</p>
            )}
        </Sheet>
    );
}

function CreateGroupForm({ seasons, onClose }: { seasons: Season[]; onClose: () => void }) {
    const navigate = useNavigate();
    const createGroup = useCreateGroup();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateGroupFormValues>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: { name: '', seasonId: String(seasons[0].id) },
    });

    return (
        <form
            noValidate
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(({ name, seasonId }) =>
                createGroup.mutate(
                    { name, seasonId: Number(seasonId) },
                    {
                        onSuccess: (group) => {
                            onClose();
                            navigate(`/grupos/${group.id}/grupo`);
                        },
                    },
                ),
            )}
        >
            <TextField
                label="Nombre del grupo"
                placeholder="Los de siempre"
                autoComplete="off"
                error={errors.name?.message}
                {...register('name')}
            />
            <div className="flex flex-col gap-2">
                <label htmlFor="create-group-season" className="text-[13px] font-semibold">
                    Competición
                </label>
                <select
                    id="create-group-season"
                    className="border-line bg-surface-2 text-fg focus:border-lime h-13 rounded-2xl border px-4 text-base outline-none"
                    {...register('seasonId')}
                >
                    {seasons.map((season) => (
                        <option key={season.id} value={season.id}>
                            {season.label}
                        </option>
                    ))}
                </select>
                {errors.seasonId && (
                    <p className="text-coral text-[13px]">{errors.seasonId.message}</p>
                )}
            </div>
            {createGroup.isError && (
                <p
                    role="alert"
                    className="bg-coral/12 text-coral rounded-xl px-3.5 py-3 text-[13px]"
                >
                    {getErrorMessage(createGroup.error)}
                </p>
            )}
            <div className="grid grid-cols-2 gap-2.5">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" loading={createGroup.isPending}>
                    Crear
                </Button>
            </div>
        </form>
    );
}
