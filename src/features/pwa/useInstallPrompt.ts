import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone() {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        // Safari en iOS
        ('standalone' in navigator && navigator.standalone === true)
    );
}

function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function useInstallPrompt() {
    const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
    const [installed, setInstalled] = useState(isStandalone);

    useEffect(() => {
        function onBeforeInstall(event: Event) {
            event.preventDefault();
            setDeferred(event as BeforeInstallPromptEvent);
        }
        function onInstalled() {
            setInstalled(true);
            setDeferred(null);
        }
        window.addEventListener('beforeinstallprompt', onBeforeInstall);
        window.addEventListener('appinstalled', onInstalled);
        return () => {
            window.removeEventListener('beforeinstallprompt', onBeforeInstall);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    async function install() {
        if (!deferred) return;
        await deferred.prompt();
        await deferred.userChoice;
        setDeferred(null);
    }

    if (installed) return { mode: 'installed' as const };
    if (deferred) return { mode: 'prompt' as const, install };
    if (isIos()) return { mode: 'ios' as const };
    return { mode: 'unavailable' as const };
}
