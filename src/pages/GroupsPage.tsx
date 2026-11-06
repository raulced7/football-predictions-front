import { useState } from 'react';
import { LogIn, Plus } from 'lucide-react';
import { Button } from '../components/Buttons';
import { getErrorMessage } from '../api/errors';
import { useMyGroups } from '../features/groups/api';
import { CreateGroupSheet } from '../features/groups/components/CreateGroupSheet';
import { GroupCard } from '../features/groups/components/GroupCard';
import { JoinGroupSheet } from '../features/groups/components/JoinGroupSheet';

export function GroupsPage() {
    const groups = useMyGroups();
    const [sheet, setSheet] = useState<'create' | 'join' | null>(null);

    const active = groups.data?.filter((group) => !group.readOnly) ?? [];
    const finished = groups.data?.filter((group) => group.readOnly) ?? [];

    return (
        <div className="flex flex-col">
            <header className="flex flex-col gap-4.5 px-5 pt-7 pb-4">
                <h1 className="font-display text-[30px] font-bold tracking-tight">Mis grupos</h1>
                <div className="grid grid-cols-2 gap-2.5">
                    <Button onClick={() => setSheet('create')}>
                        <Plus className="size-4.5" strokeWidth={2.5} aria-hidden="true" />
                        Crear grupo
                    </Button>
                    <Button variant="secondary" onClick={() => setSheet('join')}>
                        <LogIn className="size-4.5" aria-hidden="true" />
                        Unirme
                    </Button>
                </div>
            </header>

            <main className="flex flex-col gap-3 px-5 pb-6">
                {groups.isPending &&
                    [0, 1].map((index) => (
                        <div
                            key={index}
                            className="border-line-soft bg-surface h-32 animate-pulse rounded-[18px] border"
                        />
                    ))}
                {groups.isError && (
                    <p className="text-coral pt-6 text-center">{getErrorMessage(groups.error)}</p>
                )}
                {groups.isSuccess && groups.data.length === 0 && (
                    <div className="flex flex-col items-center gap-2 pt-10 text-center">
                        <p className="font-display text-lg font-bold">
                            Todavía no estás en ningún grupo
                        </p>
                        <p className="text-muted max-w-72 text-sm">
                            Crea uno y pásale el código a tus amigos, o únete con el código que te
                            hayan enviado.
                        </p>
                    </div>
                )}

                {active.length > 0 && (
                    <section className="flex flex-col gap-3">
                        <h2 className="text-muted mt-1 text-xs font-semibold tracking-[0.08em] uppercase">
                            Temporada en curso
                        </h2>
                        {active.map((group) => (
                            <GroupCard key={group.id} group={group} />
                        ))}
                    </section>
                )}
                {finished.length > 0 && (
                    <section className="flex flex-col gap-3">
                        <h2 className="text-muted mt-3 text-xs font-semibold tracking-[0.08em] uppercase">
                            Temporadas anteriores
                        </h2>
                        {finished.map((group) => (
                            <GroupCard key={group.id} group={group} />
                        ))}
                    </section>
                )}
            </main>

            <CreateGroupSheet open={sheet === 'create'} onClose={() => setSheet(null)} />
            <JoinGroupSheet open={sheet === 'join'} onClose={() => setSheet(null)} />
        </div>
    );
}
