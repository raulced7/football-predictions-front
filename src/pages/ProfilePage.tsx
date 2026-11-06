import { Button } from '../components/Buttons';
import { getErrorMessage } from '../api/errors';
import { useLogout } from '../features/auth/api';
import { useMe } from '../features/users/api';
import { InstallCard } from '../features/pwa/InstallCard';

export function ProfilePage() {
    const me = useMe();
    const logout = useLogout();

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

            <InstallCard />

            <Button variant="danger" onClick={logout}></Button>

            <Button variant="danger" onClick={logout}>
                Cerrar sesión
            </Button>
        </main>
    );
}
