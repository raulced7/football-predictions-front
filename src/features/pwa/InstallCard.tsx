import { Download, Share } from 'lucide-react';
import { Button } from '../../components/Buttons';
import { useInstallPrompt } from './useInstallPrompt';

export function InstallCard() {
    const installPrompt = useInstallPrompt();

    if (installPrompt.mode === 'installed' || installPrompt.mode === 'unavailable') return null;

    return (
        <section
            aria-labelledby="install-title"
            className="border-line-soft bg-surface flex flex-col gap-3 rounded-2xl border p-4"
        >
            <div className="flex items-center gap-3">
                <span className="bg-lime/12 flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <Download className="text-lime size-5" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-0.5">
                    <h2 id="install-title" className="text-[15px] font-semibold">
                        Instala la app
                    </h2>
                    <p className="text-muted text-xs">
                        Ábrela desde la pantalla de inicio, a pantalla completa.
                    </p>
                </div>
            </div>

            {installPrompt.mode === 'prompt' ? (
                <Button onClick={() => void installPrompt.install()}>Instalar</Button>
            ) : (
                <p className="text-muted text-sm leading-relaxed">
                    En Safari, toca{' '}
                    <Share className="text-fg inline size-4 align-[-3px]" aria-label="Compartir" />{' '}
                    y después{' '}
                    <span className="text-fg font-semibold">«Añadir a pantalla de inicio»</span>.
                </p>
            )}
        </section>
    );
}
