import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { toApiError } from '../../api/errors';
import type { components } from '../../api/schema';
import { authStore } from '../auth/authStore';

export function useMe() {
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const { data, error, response } = await api.GET('/api/users/me');
            if (error || !data) {
                throw toApiError(error, response);
            }
            return data;
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: async (body: { currentPassword: string; newPassword: string }) => {
            const { error, response } = await api.PUT('/api/users/me/password', { body });
            if (error || !response.ok) {
                throw toApiError(error, response);
            }
        },
    });
}

type UserResponse = components['schemas']['UserResponse'];

/** La foto sale en el perfil, en los miembros del grupo y en las clasificaciones. */
function useRefreshAfterAvatarChange() {
    const queryClient = useQueryClient();
    return (user?: UserResponse) => {
        if (user) queryClient.setQueryData(['me'], user);
        else void queryClient.invalidateQueries({ queryKey: ['me'] });
        void queryClient.invalidateQueries({ queryKey: ['groups'] });
    };
}

export function useUploadAvatar() {
    const refresh = useRefreshAfterAvatarChange();
    return useMutation({
        mutationFn: async (photo: Blob) => {
            const { data, error, response } = await api.POST('/api/users/me/avatar', {
                body: { file: '' },
                bodySerializer: () => {
                    const formData = new FormData();
                    formData.append('file', photo, 'avatar.jpg');
                    return formData;
                },
            });
            if (error || !data) {
                throw toApiError(error, response);
            }
            return data;
        },
        onSuccess: (user) => refresh(user),
    });
}

export function useRemoveAvatar() {
    const refresh = useRefreshAfterAvatarChange();
    return useMutation({
        mutationFn: async () => {
            const { error, response } = await api.DELETE('/api/users/me/avatar');
            if (error || !response.ok) {
                throw toApiError(error, response);
            }
        },
        onSuccess: () => refresh(),
    });
}

export function useDeleteAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (password: string) => {
            const { error, response } = await api.DELETE('/api/users/me', {
                body: { password },
            });
            if (error || !response.ok) {
                throw toApiError(error, response);
            }
        },
        onSuccess: () => {
            authStore.clear();
            queryClient.clear();
        },
    });
}
