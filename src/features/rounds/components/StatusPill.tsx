import { formatTime } from '../format';
import type { Match } from '../model';

export function StatusPill({ match }: { match: Match }) {
    if (match.status === 'LIVE') {
        return (
            <span className="bg-coral/15 flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold text-[#FF8A78]">
                <span className="bg-coral size-1.5 rounded-full" aria-hidden="true" />
                En juego
            </span>
        );
    }

    const labels: Record<Exclude<Match['status'], 'LIVE' | 'SCHEDULED'>, string> = {
        FINISHED: 'Final',
        POSTPONED: 'Aplazado',
        SUSPENDED: 'Suspendido',
        CANCELLED: 'Cancelado',
    };

    if (match.status === 'SCHEDULED') {
        return (
            <span
                className={`text-xs font-semibold ${match.kickoffConfirmed ? 'text-fg' : 'text-muted'}`}
            >
                {match.kickoffConfirmed ? formatTime(match.kickoffAt) : 'Hora por confirmar'}
            </span>
        );
    }
    return <span className="text-muted text-xs font-semibold">{labels[match.status]}</span>;
}
