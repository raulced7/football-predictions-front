import { Link } from 'react-router';
import { Trophy } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { useGroupStandings } from '../api';
import type { Group } from '../model';

export function GroupCard({ group }: { group: Group }) {
    const { user } = useAuth();
    const standings = useGroupStandings(group.id);
    const me = standings.data?.find((entry) => String(entry.userId) === user?.id);
    const isOwner = String(group.ownerId) === user?.id;
    const meta = `${group.competitionName} · ${group.seasonName}`;

    if (group.readOnly) {
        return (
            <Link
                to={`/grupos/${group.id}`}
                className="border-line-soft flex items-center justify-between gap-3 rounded-[18px] border p-4"
            >
                <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-display truncate text-[17px] font-bold text-[#C9D0E0]">
                        {group.name}
                    </span>
                    <span className="text-muted text-[13px]">{meta} · Finalizada</span>
                </span>
                {me && (
                    <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#C9D0E0]">
                        <Trophy className="size-4" aria-hidden="true" />
                        {me.position}º
                    </span>
                )}
            </Link>
        );
    }

    return (
        <Link
            to={`/grupos/${group.id}`}
            className="border-line-soft bg-surface flex flex-col gap-3.5 rounded-[18px] border p-4"
        >
            <span className="flex items-start justify-between gap-3">
                <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-display truncate text-xl font-bold">{group.name}</span>
                    <span className="text-muted text-[13px]">
                        {meta} · {group.memberCount}{' '}
                        {group.memberCount === 1 ? 'miembro' : 'miembros'}
                    </span>
                </span>
                {isOwner && (
                    <span className="bg-violet/15 flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-semibold text-[#B9AEFF]">
                        Dueño
                    </span>
                )}
            </span>
            <span className="border-line flex items-center justify-between border-t pt-3">
                <span className="flex items-baseline gap-2">
                    <span className="font-display text-lime text-[28px] font-bold">
                        {me ? `${me.position}º` : '–'}
                    </span>
                    <span className="text-muted text-[13px]">de {group.memberCount}</span>
                </span>
                <span className="font-display text-xl font-bold">
                    {me ? `${me.points} pts` : ''}
                </span>
            </span>
        </Link>
    );
}
