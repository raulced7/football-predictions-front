import { useState } from 'react';
import { Check, LoaderCircle, Lock } from 'lucide-react';
import { TeamBadge } from '../../../components/TeamBadge';
import { getErrorMessage } from '../../../api/errors';
import { useSavePrediction } from '../api';
import type { Match } from '../model';
import { PointsBadge } from './PointsBadge';
import { ScoreSelect } from './ScoreSelect';
import { StatusPill } from './StatusPill';

interface MatchCardProps {
    match: Match;
    roundId: number;
}

export function MatchCard({ match, roundId }: MatchCardProps) {
    const save = useSavePrediction(roundId);
    const [home, setHome] = useState<number | null>(match.prediction?.homeGoals ?? null);
    const [away, setAway] = useState<number | null>(match.prediction?.awayGoals ?? null);

    const isSaved =
        match.prediction !== null &&
        match.prediction.homeGoals === home &&
        match.prediction.awayGoals === away;

    function update(nextHome: number | null, nextAway: number | null) {
        setHome(nextHome);
        setAway(nextAway);
        if (nextHome !== null && nextAway !== null) {
            save.mutate({ fixtureId: match.id, homeGoals: nextHome, awayGoals: nextAway });
        }
    }

    const hasResult = match.homeGoals !== null && match.awayGoals !== null;

    return (
        <article
            className={`bg-surface flex flex-col gap-3 rounded-2xl border p-3.5 ${
                match.open && isSaved ? 'border-lime' : 'border-line-soft'
            }`}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                    <StatusPill match={match} />
                    {match.movedFrom && (
                        <span className="bg-violet/15 flex h-5.5 items-center rounded-full px-2 text-[11px] font-semibold text-[#B9AEFF]">
                            Aplazado de la {match.movedFrom}
                        </span>
                    )}
                </span>
                <CardStatus
                    match={match}
                    isSaved={isSaved}
                    isSaving={save.isPending}
                    hasError={save.isError}
                />
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                <Team name={match.homeTeam} />
                {match.open ? (
                    <div className="flex items-center gap-2">
                        <ScoreSelect
                            label={`Goles ${match.homeTeam}`}
                            value={home}
                            onChange={(value) => update(value, away)}
                        />
                        <span className="text-muted font-bold">–</span>
                        <ScoreSelect
                            label={`Goles ${match.awayTeam}`}
                            value={away}
                            onChange={(value) => update(home, value)}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-1">
                        <span className="font-display text-[30px] font-bold tracking-wide">
                            {hasResult ? `${match.homeGoals} – ${match.awayGoals}` : '–'}
                        </span>
                        <span className="text-muted text-xs">
                            {match.prediction
                                ? `Tú: ${match.prediction.homeGoals} – ${match.prediction.awayGoals}`
                                : 'Sin pronóstico'}
                        </span>
                    </div>
                )}
                <Team name={match.awayTeam} />
            </div>

            {save.isError && (
                <p role="alert" className="text-coral text-[13px]">
                    {getErrorMessage(save.error)}
                </p>
            )}
        </article>
    );
}

function Team({ name }: { name: string }) {
    return (
        <div className="flex min-w-0 flex-col items-center gap-1.5">
            <TeamBadge name={name} />
            <span className="max-w-full truncate text-sm font-semibold">{name}</span>
        </div>
    );
}

interface CardStatusProps {
    match: Match;
    isSaved: boolean;
    isSaving: boolean;
    hasError: boolean;
}

function CardStatus({ match, isSaved, isSaving, hasError }: CardStatusProps) {
    if (match.status === 'FINISHED' && match.prediction?.points != null) {
        return <PointsBadge points={match.prediction.points} />;
    }
    if (!match.open) {
        return (
            <span className="text-muted flex items-center gap-1.5 text-xs">
                <Lock className="size-3.5" aria-hidden="true" />
                Cerrado
            </span>
        );
    }
    if (isSaving) {
        return (
            <span className="text-muted flex items-center gap-1.5 text-xs">
                <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
                Guardando…
            </span>
        );
    }
    if (hasError) {
        return <span className="text-coral text-xs font-semibold">No guardado</span>;
    }
    if (isSaved) {
        return (
            <span className="text-lime flex items-center gap-1.5 text-xs font-semibold">
                <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                Guardado
            </span>
        );
    }
    return <span className="text-muted text-xs">Sin pronóstico</span>;
}
