import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { toApiError } from '../../api/errors';
import {
    toFixturePredictions,
    toGroup,
    toGroupDetail,
    toStandings,
    type FixturePredictions,
} from './model';

export function useMyGroups() {
    return useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            const { data, error, response } = await api.GET('/api/groups');
            if (error || !data) throw toApiError(error, response);
            return data.map(toGroup);
        },
    });
}

export function useGroup(groupId: number) {
    return useQuery({
        queryKey: ['groups', groupId],
        queryFn: async () => {
            const { data, error, response } = await api.GET('/api/groups/{groupId}', {
                params: { path: { groupId } },
            });
            if (error || !data) throw toApiError(error, response);
            return toGroupDetail(data);
        },
    });
}

export function useGroupStandings(groupId: number) {
    return useQuery({
        queryKey: ['groups', groupId, 'standings'],
        queryFn: async () => {
            const { data, error, response } = await api.GET('/api/groups/{groupId}/standings', {
                params: { path: { groupId } },
            });
            if (error || !data) throw toApiError(error, response);
            return toStandings(data);
        },
    });
}

export function useGroupRoundStandings(groupId: number, roundId: number | undefined) {
    return useQuery({
        queryKey: ['groups', groupId, 'standings', 'round', roundId],
        enabled: roundId != null,
        queryFn: async () => {
            const { data, error, response } = await api.GET(
                '/api/groups/{groupId}/standings/rounds/{roundId}',
                {
                    params: { path: { groupId, roundId: roundId! } },
                },
            );
            if (error || !data) throw toApiError(error, response);
            return toStandings(data);
        },
    });
}

export function useGroupRoundPredictions(groupId: number, roundId: number | undefined) {
    return useQuery({
        queryKey: ['groups', groupId, 'predictions', roundId],
        enabled: roundId != null,
        refetchInterval: (query) =>
            query.state.data?.some((item) => item.match.status === 'LIVE') ? 60_000 : false,
        queryFn: async () => {
            const { data, error, response } = await api.GET(
                '/api/groups/{groupId}/rounds/{roundId}/predictions',
                {
                    params: { path: { groupId, roundId: roundId! } },
                },
            );
            if (error || !data) throw toApiError(error, response);
            return data
                .map(toFixturePredictions)
                .filter((item): item is FixturePredictions => item !== null)
                .sort((a, b) => a.match.kickoffAt.getTime() - b.match.kickoffAt.getTime());
        },
    });
}

export function useCreateGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: { name: string; seasonId: number }) => {
            const { data, error, response } = await api.POST('/api/groups', { body });
            if (error || !data) throw toApiError(error, response);
            return toGroup(data);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
    });
}

export function useJoinGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (inviteCode: string) => {
            const { data, error, response } = await api.POST('/api/groups/join', {
                body: { inviteCode },
            });
            if (error || !data) throw toApiError(error, response);
            return toGroup(data);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
    });
}

export function useLeaveGroup(groupId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { error, response } = await api.DELETE('/api/groups/{groupId}/members/me', {
                params: { path: { groupId } },
            });
            if (error || !response.ok) throw toApiError(error, response);
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['groups', groupId] });
            return queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
}

export function useDeleteGroup(groupId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { error, response } = await api.DELETE('/api/groups/{groupId}', {
                params: { path: { groupId } },
            });
            if (error || !response.ok) throw toApiError(error, response);
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['groups', groupId] });
            return queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
}
