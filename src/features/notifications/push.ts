import { isIos, isStandalone } from '../pwa/useInstallPrompt';
import { deleteSubscription, saveSubscription } from './api';

/**
 * - supported: el navegador puede recibir avisos
 * - needs-install: iPhone con la app abierta en Safari; los avisos solo funcionan con la app instalada
 * - unsupported: navegador sin soporte
 */
export type PushSupport = 'supported' | 'needs-install' | 'unsupported';

export function pushSupport(): PushSupport {
    const supported =
        'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    if (supported) return 'supported';
    return isIos() && !isStandalone() ? 'needs-install' : 'unsupported';
}

async function registration() {
    if (!('serviceWorker' in navigator)) return undefined;
    return navigator.serviceWorker.getRegistration();
}

export async function currentSubscription() {
    const reg = await registration();
    return (await reg?.pushManager.getSubscription()) ?? null;
}

/** La clave pública VAPID llega en base64url; el navegador la quiere en bytes. */
function toBytes(base64Url: string) {
    const base64 = (base64Url + '='.repeat((4 - (base64Url.length % 4)) % 4))
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const raw = atob(base64);
    const bytes = new Uint8Array(new ArrayBuffer(raw.length));
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    return bytes;
}

export class PushPermissionDenied extends Error {
    constructor() {
        super('Has bloqueado los avisos.');
    }
}

/** Pide permiso (tiene que llamarse al pulsar un botón) y registra este dispositivo en el servidor. */
export async function enablePush(publicKey: string) {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        throw new PushPermissionDenied();
    }
    const reg = await registration();
    if (!reg) {
        throw new Error('La app aún se está preparando. Inténtalo de nuevo en unos segundos.');
    }
    const subscription =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: toBytes(publicKey),
        }));
    await saveSubscription(subscription);
}

/** Deja de recibir avisos en este dispositivo. Si falla la llamada al servidor, se borra igualmente aquí. */
export async function disablePush() {
    const subscription = await currentSubscription();
    if (!subscription) return;
    try {
        await deleteSubscription(subscription.endpoint);
    } finally {
        await subscription.unsubscribe();
    }
}
