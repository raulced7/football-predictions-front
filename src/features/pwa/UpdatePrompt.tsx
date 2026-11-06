import { RefreshCw } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;

/** Avisa cuando hay una versión nueva desplegada y deja que el usuario decida cuándo recargar. */
export function UpdatePrompt() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(_url, registration) {
            // Una app instalada puede pasar días abierta: comprobamos si hay versión nueva cada hora
            if (registration) {
                setInterval(() => void registration.update(), UPDATE_CHECK_INTERVAL);
            }
        },
    });

    if (!needRefresh) return null;

    return (
        <div
            role="status"
            className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-md px-4"
        >
            <div className="border-line bg-surface-2 flex w-full items-center gap-3 rounded-2xl border py-2.5 pr-2.5 pl-4 shadow-lg shadow-black/40">
                <RefreshCw className="text-lime size-4.5 shrink-0" aria-hidden="true" />
                <span className="grow text-sm font-semibold">Hay una versión nueva</span>
                <button
                    type="button"
                    onClick={() => setNeedRefresh(false)}
                    className="text-muted hover:text-fg h-9 rounded-[10px] px-3 text-sm font-semibold"
                >
                    Luego
                </button>
                <button
                    type="button"
                    onClick={() => void updateServiceWorker(true)}
                    className="bg-lime text-ink h-9 rounded-[10px] px-3.5 text-sm font-bold"
                >
                    Actualizar
                </button>
            </div>
        </div>
    );
}
