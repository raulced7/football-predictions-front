import { useSearchParams } from 'react-router';
import { useSeasonRounds } from './api';
import { pickCurrentRound } from './model';

/** Jornada elegida en la URL (?jornada=12) o, si no hay ninguna, la jornada actual. */
export function useSelectedRound(seasonId: number | undefined) {
    const rounds = useSeasonRounds(seasonId);
    const [searchParams, setSearchParams] = useSearchParams();
    const requested = Number(searchParams.get('jornada'));

    const round =
        rounds.data?.find((candidate) => candidate.sequence === requested) ??
        (rounds.data ? pickCurrentRound(rounds.data) : undefined);

    function goToRound(sequence: number) {
        setSearchParams((current) => {
            const next = new URLSearchParams(current);
            next.set('jornada', String(sequence));
            return next;
        });
    }

    return {
        rounds,
        round,
        goToRound,
        firstSequence: rounds.data?.[0]?.sequence ?? 1,
        lastSequence: rounds.data?.at(-1)?.sequence ?? 1,
    };
}
