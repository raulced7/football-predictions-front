import { useState, type ReactNode } from 'react';
import { Ellipsis, EllipsisVertical, Share, SquarePlus } from 'lucide-react';
import { isIos } from './useInstallPrompt';

type Platform = 'android' | 'ios';

interface Step {
    illustration: ReactNode;
    text: ReactNode;
}

const steps: Record<Platform, Step[]> = {
    android: [
        {
            illustration: <IconTile icon={<EllipsisVertical className="size-5" />} />,
            text: (
                <>
                    Abre Golify en <strong>Chrome</strong> y toca el menú <strong>⋮</strong>, arriba
                    a la derecha.
                </>
            ),
        },
        {
            illustration: <IconTile icon={<SquarePlus className="size-5" />} />,
            text: (
                <>
                    Toca <strong>«Añadir a pantalla de inicio»</strong> (en algunos móviles pone{' '}
                    <strong>«Instalar aplicación»</strong>).
                </>
            ),
        },
        {
            illustration: <ButtonTile label="Instalar" />,
            text: (
                <>
                    Confírmalo con <strong>«Instalar»</strong>. Golify aparecerá en tu pantalla de
                    inicio como una app más.
                </>
            ),
        },
    ],
    ios: [
        {
            illustration: <IconTile icon={<Share className="size-5" />} />,
            text: (
                <>
                    Abre Golify en <strong>Safari</strong> y toca <strong>Compartir</strong>. Si no
                    lo ves, toca antes{' '}
                    <Ellipsis className="inline size-4 align-[-3px]" aria-label="Más" />.
                </>
            ),
        },
        {
            illustration: <IconTile icon={<SquarePlus className="size-5" />} />,
            text: (
                <>
                    Desliza hacia abajo y toca <strong>«Añadir a pantalla de inicio»</strong>.
                </>
            ),
        },
        {
            illustration: <ButtonTile label="Añadir" />,
            text: (
                <>
                    Toca <strong>«Añadir»</strong>, arriba a la derecha. Golify aparecerá en tu
                    pantalla de inicio como una app más.
                </>
            ),
        },
    ],
};

const platformNames: Record<Platform, string> = { android: 'Android', ios: 'iPhone' };

export function InstallGuide() {
    const [platform, setPlatform] = useState<Platform>(() => (isIos() ? 'ios' : 'android'));

    return (
        <div className="flex flex-col gap-4">
            <div
                role="tablist"
                aria-label="Sistema del móvil"
                className="border-line-soft bg-ink grid grid-cols-2 rounded-[14px] border p-1"
            >
                {(['android', 'ios'] as const).map((option) => (
                    <button
                        key={option}
                        type="button"
                        role="tab"
                        id={`install-tab-${option}`}
                        aria-selected={platform === option}
                        aria-controls="install-steps"
                        onClick={() => setPlatform(option)}
                        className={`h-10 rounded-[10px] text-sm font-semibold ${
                            platform === option ? 'bg-line text-fg' : 'text-muted hover:text-fg'
                        }`}
                    >
                        {platformNames[option]}
                    </button>
                ))}
            </div>

            <ol
                id="install-steps"
                role="tabpanel"
                aria-labelledby={`install-tab-${platform}`}
                className="flex flex-col gap-3"
            >
                {steps[platform].map((step, index) => (
                    <li key={index} className="flex items-center gap-3.5">
                        <span className="relative shrink-0">
                            {step.illustration}
                            <span
                                aria-hidden="true"
                                className="bg-lime text-ink absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center rounded-full text-[11px] font-bold"
                            >
                                {index + 1}
                            </span>
                        </span>
                        <p className="text-muted [&_strong]:text-fg text-sm leading-relaxed [&_strong]:font-semibold">
                            {step.text}
                        </p>
                    </li>
                ))}
            </ol>

            {platform === 'ios' && (
                <p className="bg-violet/10 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed text-[#C7BEFF]">
                    En iPhone funciona mejor desde Safari: en otros navegadores la opción puede no
                    aparecer.
                </p>
            )}
        </div>
    );
}

/** Imita el botón del navegador que hay que tocar. */
function IconTile({ icon }: { icon: ReactNode }) {
    return (
        <span
            aria-hidden="true"
            className="border-line bg-surface-2 text-fg flex size-12 items-center justify-center rounded-xl border"
        >
            {icon}
        </span>
    );
}

function ButtonTile({ label }: { label: string }) {
    return (
        <span
            aria-hidden="true"
            className="border-line bg-surface-2 text-lime flex size-12 items-center justify-center rounded-xl border text-[10px] font-bold"
        >
            {label}
        </span>
    );
}
