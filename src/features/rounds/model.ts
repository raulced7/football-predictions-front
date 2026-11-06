import type { components } from '../../api/schema';

type RoundPredictionItem = components['schemas']['RoundPredictionItem'];
type RoundResponse = components['schemas']['RoundResponse'];

export type FixtureStatus = NonNullable<components['schemas']['FixtureResponse']['status']>;

export interface Prediction {
    homeGoals: number;
    awayGoals: number;
    points: number | null;
}

export interface Match {
    id: number;
    homeTeam: string;
    awayTeam: string;
    kickoffAt: Date;
    kickoffConfirmed: boolean;
    status: FixtureStatus;
    homeGoals: number | null;
    awayGoals: number | null;
    open: boolean;
    movedFrom: string | null;
    prediction: Prediction | null;
}

export interface Round {
    id: number;
    sequence: number;
    name: string;
    startsAt: Date | null;
}

export function toMatch(item: RoundPredictionItem): Match | null {
    const fixture = item.fixture;
    if (
        !fixture?.id ||
        !fixture.homeTeam ||
        !fixture.awayTeam ||
        !fixture.kickoffAt ||
        !fixture.status
    ) {
        return null;
    }

    const prediction = item.prediction;
    const movedFrom =
        fixture.roundId !== fixture.scoringRoundId && fixture.roundName
            ? fixture.roundName.replace(/^Jornada\s+/i, 'J')
            : null;

    return {
        id: fixture.id,
        homeTeam: fixture.homeTeam,
        awayTeam: fixture.awayTeam,
        kickoffAt: new Date(fixture.kickoffAt),
        kickoffConfirmed: fixture.kickoffConfirmed ?? false,
        status: fixture.status,
        homeGoals: fixture.homeGoals ?? null,
        awayGoals: fixture.awayGoals ?? null,
        open: item.open ?? false,
        movedFrom,
        prediction:
            prediction && prediction.homeGoals != null && prediction.awayGoals != null
                ? {
                      homeGoals: prediction.homeGoals,
                      awayGoals: prediction.awayGoals,
                      points: prediction.points ?? null,
                  }
                : null,
    };
}

export function toRounds(list: RoundResponse[]): Round[] {
    return list
        .filter((round) => round.id != null && round.sequence != null)
        .map((round) => ({
            id: round.id!,
            sequence: round.sequence!,
            name: round.name ?? `Jornada ${round.sequence}`,
            startsAt: round.startsAt ? new Date(round.startsAt) : null,
        }))
        .sort((a, b) => a.sequence - b.sequence);
}

const ROUND_DURATION_MS = 4 * 24 * 60 * 60 * 1000;

/**
 * Jornada que se muestra por defecto: la última que ha empezado.
 * Si ya han pasado más de 4 días desde su inicio (ya se ha jugado), se pasa a la siguiente.
 */
export function pickCurrentRound(rounds: Round[], now = new Date()): Round | undefined {
    const current = rounds.filter((round) => round.startsAt && round.startsAt <= now).at(-1);
    if (!current?.startsAt) {
        return rounds.find((round) => round.startsAt) ?? rounds[0];
    }

    const next = rounds.find((round) => round.sequence === current.sequence + 1);
    if (next && now.getTime() - current.startsAt.getTime() > ROUND_DURATION_MS) {
        return next;
    }
    return current;
}

/** Siglas provisionales hasta tener los escudos: "Real Madrid" → "RMA", "Barça" → "BAR". */
export function teamCode(name: string): string {
    const words = name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) return '???';
    if (words.length === 1) return words[0].slice(0, 3);
    return words[0][0] + words[words.length - 1].slice(0, 2);
}
