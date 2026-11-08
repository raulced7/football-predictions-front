import { BallIcon } from './icons';

/** Pantalla mientras se descarga la primera página de la app. */
export function AppLoader() {
    return (
        <div role="status" className="flex min-h-dvh items-center justify-center">
            <BallIcon className="text-lime size-10 animate-spin [animation-duration:1.6s]" />
            <span className="sr-only">Cargando…</span>
        </div>
    );
}
