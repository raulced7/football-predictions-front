import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../../components/Buttons';
import { Sheet } from '../../components/Sheet';
import { getErrorMessage } from '../../api/errors';
import { useAuth } from '../../features/auth/useAuth';
import { useDeleteGroup, useGroup, useLeaveGroup } from '../../features/groups/api';
import { InviteCodeCard } from '../../features/groups/components/InviteCodeCard';
import { initials } from '../../features/groups/model';

const joinedFormatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });

export function GroupInfoPage() {
    const groupId = Number(useParams().groupId);
    const navigate = useNavigate();
    const { user } = useAuth();
    const detail = useGroup(groupId);
    const leave = useLeaveGroup(groupId);
    const remove = useDeleteGroup(groupId);
    const [confirming, setConfirming] = useState(false);

    if (!detail.data) {
        return <div className="bg-surface mx-5 mt-4 h-48 animate-pulse rounded-[18px]" />;
    }

    const { group, members } = detail.data;
    const isOwner = String(group.ownerId) === user?.id;
    const action = isOwner ? remove : leave;
    const canLeave = isOwner || !group.readOnly;

    function confirm() {
        action.mutate(undefined, { onSuccess: () => navigate('/grupos', { replace: true }) });
    }

    return (
        <main className="flex flex-col gap-4 px-5 pt-4 pb-6">
            {!group.readOnly && <InviteCodeCard group={group} />}

            <section aria-label="Miembros" className="flex flex-col gap-2.5">
                <h2 className="text-muted text-xs font-semibold tracking-[0.08em] uppercase">
                    Miembros · {members.length}
                </h2>
                <ul className="border-line-soft bg-surface overflow-hidden rounded-2xl border">
                    {members.map((member) => {
                        const isMe = String(member.userId) === user?.id;
                        return (
                            <li
                                key={member.userId}
                                className="border-line-soft flex items-center gap-3 border-b px-3.5 py-3 last:border-b-0"
                            >
                                <span
                                    aria-hidden="true"
                                    className={`bg-surface-2 flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                        isMe ? 'border-lime border-2' : ''
                                    }`}
                                >
                                    {initials(member.displayName)}
                                </span>
                                <span className="flex min-w-0 grow flex-col gap-0.5">
                                    <span className="truncate text-[15px] font-semibold">
                                        {member.displayName}
                                        {isMe && ' (tú)'}
                                    </span>
                                    {member.joinedAt && (
                                        <span className="text-muted text-xs">
                                            Desde el {joinedFormatter.format(member.joinedAt)}
                                        </span>
                                    )}
                                </span>
                                {member.userId === group.ownerId && (
                                    <span className="bg-violet/15 flex h-5.5 items-center rounded-full px-2 text-[11px] font-semibold text-[#B9AEFF]">
                                        Dueño
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </section>

            {canLeave && (
                <section aria-label="Zona peligrosa" className="flex flex-col gap-2">
                    <Button variant="danger" onClick={() => setConfirming(true)}>
                        {isOwner ? 'Eliminar grupo' : 'Salir del grupo'}
                    </Button>
                    <p className="text-muted text-center text-xs leading-relaxed">
                        {isOwner
                            ? 'Solo el dueño puede eliminarlo. Los pronósticos de cada miembro no se borran.'
                            : 'Tus pronósticos se conservan: si vuelves a unirte, recuperas tus puntos.'}
                    </p>
                </section>
            )}

            <Sheet
                open={confirming}
                onClose={() => setConfirming(false)}
                title={isOwner ? '¿Eliminar el grupo?' : '¿Salir del grupo?'}
            >
                <p className="text-muted text-[15px] leading-relaxed">
                    {isOwner
                        ? `"${group.name}" desaparecerá para todos sus miembros. No se puede deshacer.`
                        : `Dejarás de ver la clasificación de "${group.name}".`}
                </p>
                {action.isError && (
                    <p
                        role="alert"
                        className="bg-coral/12 text-coral rounded-xl px-3.5 py-3 text-[13px]"
                    >
                        {getErrorMessage(action.error)}
                    </p>
                )}
                <div className="grid grid-cols-2 gap-2.5">
                    <Button variant="secondary" onClick={() => setConfirming(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" loading={action.isPending} onClick={confirm}>
                        {isOwner ? 'Eliminar' : 'Salir'}
                    </Button>
                </div>
            </Sheet>
        </main>
    );
}
