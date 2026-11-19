import { useState } from 'react';
import { BellRing } from 'lucide-react';
import { Button } from '../../components/Buttons';
import { InstallGuideSheet } from '../pwa/InstallGuideSheet';
import { usePushNotifications } from './usePushNotifications';

const DISMISSED_KEY = 'fp.pushCardDismissed';

function wasDismissed() {
    try {
        return localStorage.getItem(DISMISSED_KEY) === 'true';
    } catch {
        return false;
    }
}

/**
 * Invita a activar los avisos desde la pantalla de jornada. Con "Ahora no" desaparece para siempre
 * (en este dispositivo); siempre se pueden activar desde el perfil.
 */
export function PushCard() {
    const push = usePushNotifications();
    const [dismissed, setDismissed] = useState(wasDismissed);
    const [guideOpen, setGuideOpen] = useState(false);

    function dismiss() {
        setDismissed(true);
        try {
            localStorage.setItem(DISMISSED_KEY, 'true');
        } catch {
            // Si no se puede guardar, como mucho volverá a salir otro día
        }
    }

    if (dismissed || (push.status !== 'off' && push.status !== 'needs-install')) return null;

    const needsInstall = push.status === 'needs-install';

    return (
        <section
            aria-labelledby="push-card-title"
            className="border-line-soft bg-surface flex flex-col gap-3 rounded-2xl border p-4"
        >
            <div className="flex items-start gap-3">
                <span className="bg-lime/12 flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <BellRing className="text-lime size-5" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-0.5">
                    <h2 id="push-card-title" className="text-[15px] font-semibold">
                        ¿Te avisamos?
                    </h2>
                    <p className="text-muted text-[13px] leading-snug">
                        {needsInstall
                            ? 'Para recibir avisos en el iPhone, añade Golify a tu pantalla de inicio.'
                            : 'Antes de cada jornada si te falta algún pronóstico, y al acabar con tus puntos.'}
                    </p>
                </div>
            </div>

            {push.error && (
                <p role="alert" className="text-coral text-[13px]">
                    {push.error}
                </p>
            )}

            <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={dismiss}>
                    Ahora no
                </Button>
                {needsInstall ? (
                    <Button className="flex-1" onClick={() => setGuideOpen(true)}>
                        Ver cómo
                    </Button>
                ) : (
                    <Button
                        className="flex-1"
                        loading={push.busy}
                        onClick={() => void push.enable()}
                    >
                        Activar
                    </Button>
                )}
            </div>

            {needsInstall && (
                <InstallGuideSheet open={guideOpen} onClose={() => setGuideOpen(false)} />
            )}
        </section>
    );
}
