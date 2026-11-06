import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { toApiError } from '../../api/errors';
import { toMatch, toRounds, type Match } from './model';

export function useOpenSeasons() {
    return useQuery({
        queryKey: ['seasons', 'open'],
        staleTime: 5 * 60_000,
        queryFn: async () => {
            const { data, error, response } = await api.GET('/api/seasons');
            if (error || !data) throw toApiError(error, response);
            return data;
        },
    });
}

export function useSeasonRounds(seasonId: number | undefined) {
    return useQuery({
        queryKey: ['seasons', seasonId, 'rounds'],
        enabled: seasonId != null,
        staleTime: 5 * 60_000,
        queryFn: async () => {
            const { data, error, response } = await api.GET('/api/seasons/{seasonId}/rounds', {
                params: { path: { seasonId: seasonId! } },
            });
            if (error || !data) throw toApiError(error, response);
            return toRounds(data);
        },
    });
}

export function useMyRound(roundId: number | undefined) {
    return useQuery({
        queryKey: ['my-round', roundId],
        enabled: roundId != null,
        // Mientras haya partidos en juego, se refresca cada minuto
        refetchInterval: (query) =>
            query.state.data?.some((match) => match.status === 'LIVE') ? 60_000 : false,
        queryFn: async () => {
            const { data, error, response } = await api.GET(
                '/api/rounds/{roundId}/predictions/me',
                {
                    params: { path: { roundId: roundId! } },
                },
            );
            if (error || !data) throw toApiError(error, response);
            return data.map(toMatch).filter((match): match is Match => match !== null);
        },
    });
}

interface SavePredictionInput {
    fixtureId: number;
    homeGoals: number;
    awayGoals: number;
}

export function useSavePrediction(roundId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ fixtureId, homeGoals, awayGoals }: SavePredictionInput) => {
            const { data, error, response } = await api.PUT(
                '/api/fixtures/{fixtureId}/prediction',
                {
                    params: { path: { fixtureId } },
                    body: { homeGoals, awayGoals },
                },
            );
            if (error || !data) throw toApiError(error, response);
            return data;
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['my-round', roundId] }),
    });
}
