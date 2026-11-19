import { useEffect } from 'react';
import { usePushConfig, saveSubscription } from './api';
import { currentSubscription, pushSupport } from './push';

/**
 * Al abrir la app, vuelve a mandar al servidor la suscripción de este dispositivo. El navegador puede
 * renovarla por su cuenta y así el servidor siempre tiene la buena. Si ya la tenía, no hace nada.
 */
export function usePushSync() {
    const config = usePushConfig();
    const enabled = config.data?.enabled === true;

    useEffect(() => {
        if (!enabled || pushSupport() !== 'supported' || Notification.permission !== 'granted')
            return;
        void currentSubscription()
            .then((subscription) => subscription && saveSubscription(subscription))
            .catch(() => {
                // Sin conexión o similar: se volverá a intentar la próxima vez que se abra la app
            });
    }, [enabled]);
}
