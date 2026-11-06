import createClient from 'openapi-fetch';
import { authStore } from '../features/auth/authStore';
import type { paths } from './schema';

export const api = createClient<paths>({
    baseUrl: import.meta.env.VITE_API_URL ?? '',
});

api.use({
    onRequest({ request }) {
        const token = authStore.getToken();
        if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
        }
        return request;
    },
    onResponse({ response }) {
        if (response.status === 401 && authStore.getToken()) {
            authStore.clear();
        }
        return response;
    },
});
