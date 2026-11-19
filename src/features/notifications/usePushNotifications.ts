import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/errors';
import { usePushConfig } from './api';
import { currentSubscription, disablePush, enablePush, pushSupport } from './push';

export type PushStatus =
    | 'loading'
    | 'unavailable' // el servidor no tiene avisos configurados
    | 'unsupported'
    | 'needs-install'
    | 'denied'
    | 'off'
    | 'on';

export function usePushNotifications() {
    const config = usePushConfig();
    const support = pushSupport();
    const [subscribed, setSubscribed] = useState<boolean | null>(null);
    const [permission, setPermission] = useState<NotificationPermission | null>(() =>
        support === 'supported' ? Notification.permission : null,
    );
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (support !== 'supported') return;
        let cancelled = false;
        void currentSubscription()
            .then((subscription) => !cancelled && setSubscribed(subscription !== null))
            .catch(() => !cancelled && setSubscribed(false));
        return () => {
            cancelled = true;
        };
    }, [support]);

    async function enable() {
        if (!config.data?.publicKey) return;
        setBusy(true);
        setError(null);
        try {
            await enablePush(config.data.publicKey);
            setSubscribed(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : getErrorMessage(err));
        } finally {
            setPermission(Notification.permission);
            setBusy(false);
        }
    }

    async function disable() {
        setBusy(true);
        setError(null);
        try {
            await disablePush();
            setSubscribed(false);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setBusy(false);
        }
    }

    let status: PushStatus;
    if (config.isPending) status = 'loading';
    else if (!config.data?.enabled) status = 'unavailable';
    else if (support !== 'supported') status = support;
    else if (permission === 'denied') status = 'denied';
    else if (subscribed === null) status = 'loading';
    else status = subscribed && permission === 'granted' ? 'on' : 'off';

    return { status, busy, error, enable, disable };
}
