import { Bell } from 'lucide-react';
import { usePushNotifications } from './usePushNotifications';

const explanations = {
    'needs-install': 'Añade la app a la pantalla de inicio para recibir avisos.',
    denied: 'Has bloqueado los avisos. Puedes permitirlos en los ajustes del navegador.',
    unsupported: 'Este navegador no admite avisos.',
} as const;

/** Fila del perfil para activar o desactivar los avisos en este dispositivo. */
export function PushSetting() {
    const push = usePushNotifications();

    if (push.status === 'loading' || push.status === 'unavailable') return null;

    const on = push.status === 'on';
    const canToggle = push.status === 'on' || push.status === 'off';
    const description =
        push.status === 'on' || push.status === 'off'
            ? 'Recordatorio antes de cada jornada y resumen al acabar.'
            : explanations[push.status];

    return (
        <section className="border-line-soft bg-surface flex flex-col gap-2 rounded-2xl border p-4">
            <div className="flex items-center gap-3">
                <Bell className="text-muted size-5 shrink-0" aria-hidden="true" />
                <div className="flex grow flex-col gap-0.5">
                    <span id="push-setting-label" className="text-[15px] font-semibold">
                        Avisos de jornada
                    </span>
                    <span className="text-muted text-xs">{description}</span>
                </div>
                {canToggle && (
                    <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        aria-labelledby="push-setting-label"
                        disabled={push.busy}
                        onClick={() => void (on ? push.disable() : push.enable())}
                        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60 ${on ? 'bg-lime' : 'bg-line'}`}
                    >
                        <span
                            aria-hidden="true"
                            className={`bg-ink absolute top-1 left-1 size-5 rounded-full transition-transform ${on ? 'translate-x-5' : ''}`}
                        />
                    </button>
                )}
            </div>
            {push.error && (
                <p role="alert" className="text-coral text-[13px]">
                    {push.error}
                </p>
            )}
        </section>
    );
}
