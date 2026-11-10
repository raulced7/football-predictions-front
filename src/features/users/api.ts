import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../api/client';
import { toApiError } from '../../api/errors';

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
