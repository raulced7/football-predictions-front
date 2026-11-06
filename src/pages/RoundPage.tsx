import { useSearchParams } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/Buttons';
import { getErrorMessage } from '../api/errors';
import { useMyRound, useOpenSeasons, useSeasonRounds } from '../features/rounds/api';
import { MatchCard } from '../features/rounds/components/MatchCard';
import { RoundSummary } from '../features/rounds/components/RoundSummary';
import { dayKey, formatDateRange, formatDay } from '../features/rounds/format';
import { pickCurrentRound, type Match } from '../features/rounds/model';

export function RoundPage() {
    const seasons = useOpenSeasons();
    const season = seasons.data?.[0];
    const rounds = useSeasonRounds(season?.id);

    const [searchParams, setSearchParams] = useSearchParams();
    const requestedSequence = Number(searchParams.get('jornada'));
    const round =
        rounds.data?.find((candidate) => candidate.sequence === requestedSequence) ??
        (rounds.data ? pickCurrentRound(rounds.data) : undefined);

    const matches = useMyRound(round?.id);

    const firstSequence = rounds.data?.[0]?.sequence ?? 1;
    const lastSequence = rounds.data?.at(-1)?.sequence ?? 1;

    function goToRound(sequence: number) {
        setSearchParams({ jornada: String(sequence) });
    }

    if (seasons.isError || rounds.isError) {
        return (
            <ErrorState
                message={getErrorMessage(seasons.error ?? rounds.error)}
                onRetry={() => seasons.refetch()}
            />
        );
    }
    if (seasons.isSuccess && !season) {
        return (
            <p className="text-muted px-5 pt-10 text-center">No hay ninguna temporada en juego.</p>
        );
    }

    return (
        <div className="flex flex-col">
            <header className="flex flex-col gap-4 px-5 pt-5 pb-3">
                <div className="flex items-center justify-between">
                    <span className="border-line bg-surface flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-semibold">
                        <span className="bg-lime size-2 rounded-full" aria-hidden="true" />
                        {season ? `${season.competitionName} · ${season.name}` : '…'}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        aria-label="Jornada anterior"
                        disabled={!round || round.sequence <= firstSequence}
                        onClick={() => round && goToRound(round.sequence - 1)}
                        className="border-line bg-surface flex size-11 items-center justify-center rounded-xl border disabled:opacity-40"
                    >
                        <ChevronLeft className="size-5" aria-hidden="true" />
                    </button>
                    <div className="flex flex-col items-center gap-0.5">
                        <h1 className="font-display text-[28px] font-bold tracking-tight">
                            {round?.name ?? 'Jornada'}
                        </h1>
                        <span className="text-muted h-5 text-[13px]">
                            {matches.data
                                ? formatDateRange(matches.data.map((match) => match.kickoffAt))
                                : ''}
                        </span>
                    </div>
                    <button
                        type="button"
                        aria-label="Jornada siguiente"
                        disabled={!round || round.sequence >= lastSequence}
                        onClick={() => round && goToRound(round.sequence + 1)}
                        className="border-line bg-surface flex size-11 items-center justify-center rounded-xl border disabled:opacity-40"
                    >
                        <ChevronRight className="size-5" aria-hidden="true" />
                    </button>
                </div>

                {matches.data && matches.data.length > 0 && <RoundSummary matches={matches.data} />}
            </header>

            <main className="flex flex-col gap-2.5 px-5 pb-6">
                {matches.isError && (
                    <ErrorState
                        message={getErrorMessage(matches.error)}
                        onRetry={() => matches.refetch()}
                    />
                )}
                {(matches.isPending || !round) && !matches.isError && <MatchSkeletons />}
                {matches.data?.length === 0 && (
                    <p className="text-muted pt-8 text-center">
                        Esta jornada todavía no tiene partidos.
                    </p>
                )}
                {matches.data &&
                    round &&
                    groupByDay(matches.data).map((group) => (
                        <section key={group.key} className="flex flex-col gap-2.5">
                            <h2 className="text-muted mt-2 text-xs font-semibold tracking-[0.08em] uppercase">
                                {group.label}
                            </h2>
                            {group.matches.map((match) => (
                                <MatchCard
                                    key={`${match.id}-${match.prediction?.homeGoals}-${match.prediction?.awayGoals}`}
                                    match={match}
                                    roundId={round.id}
                                />
                            ))}
                        </section>
                    ))}
            </main>
        </div>
    );
}

function groupByDay(matches: Match[]) {
    const groups = new Map<string, { key: string; label: string; matches: Match[] }>();
    for (const match of [...matches].sort(
        (a, b) => a.kickoffAt.getTime() - b.kickoffAt.getTime(),
    )) {
        const key = dayKey(match.kickoffAt);
        if (!groups.has(key)) {
            groups.set(key, { key, label: formatDay(match.kickoffAt), matches: [] });
        }
        groups.get(key)!.matches.push(match);
    }
    return [...groups.values()];
}

function MatchSkeletons() {
    return (
        <div className="flex flex-col gap-2.5" aria-label="Cargando partidos">
            {[0, 1, 2].map((index) => (
                <div
                    key={index}
                    className="border-line-soft bg-surface h-34 animate-pulse rounded-2xl border"
                />
            ))}
        </div>
    );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center gap-3 px-5 pt-10 text-center">
            <p className="text-coral">{message}</p>
            <Button variant="secondary" onClick={onRetry}>
                Reintentar
            </Button>
        </div>
    );
}
