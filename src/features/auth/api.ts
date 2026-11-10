import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { toApiError } from '../../api/errors';
import type { components } from '../../api/schema';
import { authStore } from './authStore';

type LoginRequest = components['schemas']['LoginRequest'];
type RegisterRequest = components['schemas']['RegisterRequest'];
type VerifyEmailRequest = components['schemas']['VerifyEmailRequest'];

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
    return useMutation({
        mutationFn: async (body: RegisterRequest) => {
            const { error, response } = await api.POST('/api/auth/register', { body });
            if (error || !response.ok) {
                throw toApiError(error, response);
            }
        },
    });
}

export function useVerifyEmail() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: VerifyEmailRequest) => {
            const { data, error, response } = await api.POST('/api/auth/verify-email', { body });
            if (error || !data?.accessToken) {
                throw toApiError(error, response);
            }
            return data.accessToken;
        },
        onSuccess: (token) => {
            queryClient.clear();
            authStore.setToken(token);
        },
    });
}

export function useResendVerificationCode() {
    return useMutation({
        mutationFn: async (email: string) => {
            const { error, response } = await api.POST('/api/auth/verify-email/resend', {
                body: { email },
            });
            if (error || !response.ok) {
                throw toApiError(error, response);
            }
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
