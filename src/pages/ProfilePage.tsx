import { Button } from '../components/Buttons';
import { getErrorMessage } from '../api/errors';
import { useLogout } from '../features/auth/api';
import { useMe } from '../features/users/api';
import { InstallCard } from '../features/pwa/InstallCard';
import { useState } from 'react';
import { CircleHelp, KeyRound } from 'lucide-react';
import { InstallGuideSheet } from '../features/pwa/InstallGuideSheet';
import { ChangePasswordSheet } from '../features/users/components/ChangePasswordSheet';

export function ProfilePage() {
    const me = useMe();
    const logout = useLogout();
    const [guideOpen, setGuideOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);

    return (
        <main className="flex flex-col gap-6 px-5 pt-7">
            <h1 className="font-display text-[30px] font-bold tracking-tight">Perfil</h1>

            <section className="border-line-soft bg-surface flex flex-col gap-1 rounded-2xl border p-4">
                {me.isPending && <p className="text-muted">Cargando…</p>}
                {me.isError && <p className="text-coral">{getErrorMessage(me.error)}</p>}
                {me.data && (
                    <>
                        <span className="font-display text-xl font-bold">
                            {me.data.displayName}
                        </span>
                        <span className="text-muted text-sm">{me.data.email}</span>
                    </>
                )}
            </section>

            <InstallCard onShowGuide={() => setGuideOpen(true)} />

            <div className="flex flex-col gap-2">
                <Button
                    variant="secondary"
                    onClick={() => {
                        setPasswordChanged(false);
                        setPasswordOpen(true);
                    }}
                >
                    <KeyRound className="size-4" aria-hidden="true" />
                    Cambiar contraseña
                </Button>
                {passwordChanged && (
                    <p role="status" className="text-lime text-center text-[13px]">
                        Contraseña cambiada.
                    </p>
                )}
            </div>

            <Button variant="danger" onClick={logout}>
                Cerrar sesión
            </Button>

            <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="text-muted hover:text-fg mx-auto flex items-center gap-1.5 py-2 text-[13px]"
            >
                <CircleHelp className="size-4" aria-hidden="true" />
                Cómo añadir la app a la pantalla de inicio
            </button>

            <InstallGuideSheet open={guideOpen} onClose={() => setGuideOpen(false)} />

            <ChangePasswordSheet
                open={passwordOpen}
                onClose={() => setPasswordOpen(false)}
                onChanged={() => setPasswordChanged(true)}
            />
        </main>
    );
}
