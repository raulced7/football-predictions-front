import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { toApiError } from '../../api/errors';
import { toGroup, toGroupDetail, toStandings } from './model';

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
