import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { toApiError } from '../../api/errors';
import type { components } from '../../api/schema';

type PushSubscriptionRequest = components['schemas']['PushSubscriptionRequest'];

/** Si el servidor no tiene los avisos configurados, la app no los ofrece. */
export function usePushConfig() {
    return useQuery({
        queryKey: ['push-config'],
        queryFn: async () => {
            const { data, error, response } = await api.GET('/api/push/config');
            if (error || !data) {
                throw toApiError(error, response);
            }
            return { enabled: data.enabled === true, publicKey: data.publicKey ?? null };
        },
        staleTime: Infinity,
    });
}

export async function saveSubscription(subscription: PushSubscription) {
    const json = subscription.toJSON();
    const body: PushSubscriptionRequest = {
        endpoint: subscription.endpoint,
        keys: { p256dh: json.keys?.p256dh ?? '', auth: json.keys?.auth ?? '' },
    };
    const { error, response } = await api.PUT('/api/push/subscriptions', { body });
    if (error || !response.ok) {
        throw toApiError(error, response);
    }
}

export async function deleteSubscription(endpoint: string) {
    const { error, response } = await api.DELETE('/api/push/subscriptions', { body: { endpoint } });
    if (error || !response.ok) {
        throw toApiError(error, response);
    }
}
