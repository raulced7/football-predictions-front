import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { toApiError } from '../../api/errors';
import type { components } from '../../api/schema';
import { authStore } from './authStore';

type LoginRequest = components['schemas']['LoginRequest'];
type RegisterRequest = components['schemas']['RegisterRequest'];

async function login(body: LoginRequest): Promise<string> {
    const { data, error, response } = await api.POST('/api/auth/login', { body });
    if (error || !data?.accessToken) {
        throw toApiError(error, response);
    }
    return data.accessToken;
}

export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: login,
        onSuccess: (token) => {
            queryClient.clear();
            authStore.setToken(token);
        },
    });
}

export function useRegister() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: RegisterRequest) => {
            const { error, response } = await api.POST('/api/auth/register', { body });
            if (error || !response.ok) {
                throw toApiError(error, response);
            }
            return login({ email: body.email, password: body.password });
        },
        onSuccess: (token) => {
            queryClient.clear();
            authStore.setToken(token);
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    return () => {
        authStore.clear();
        queryClient.clear();
    };
}
