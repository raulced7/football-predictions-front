import { Button } from '../components/Buttons';
import { getErrorMessage } from '../api/errors';
import { useLogout } from '../features/auth/api';
import { useMe, useRemoveAvatar } from '../features/users/api';
import { Avatar } from '../features/groups/components/Avatar';
import { AvatarEditorSheet } from '../features/users/components/AvatarEditorSheet';
import { DeleteAccountSheet } from '../features/users/components/DeleteAccountSheet';
import { InstallCard } from '../features/pwa/InstallCard';
import { useRef, useState } from 'react';
import { Camera, CircleHelp, KeyRound, Trash2 } from 'lucide-react';
import { InstallGuideSheet } from '../features/pwa/InstallGuideSheet';
import { ChangePasswordSheet } from '../features/users/components/ChangePasswordSheet';

/** Fotos del carrete muy grandes las rechazamos antes de intentar abrirlas en el editor. */
const MAX_ORIGINAL_BYTES = 20 * 1024 * 1024;

export function ProfilePage() {
    const me = useMe();
    const logout = useLogout();
    const [guideOpen, setGuideOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editorSrc, setEditorSrc] = useState<string | null>(null);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const removeAvatar = useRemoveAvatar();

    function pickPhoto(file: File | undefined) {
        setPhotoError(null);
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setPhotoError('Elige una imagen.');
            return;
        }
        if (file.size > MAX_ORIGINAL_BYTES) {
            setPhotoError('La foto es demasiado grande.');
            return;
        }
        setEditorSrc(URL.createObjectURL(file));
    }

    function closeEditor() {
        if (editorSrc) URL.revokeObjectURL(editorSrc);
        setEditorSrc(null);
    }

    return (
        <main className="flex flex-col gap-6 px-5 pt-7">
            <h1 className="font-display text-[30px] font-bold tracking-tight">Perfil</h1>

            <section className="border-line-soft bg-surface flex flex-col gap-4 rounded-2xl border p-4">
                {me.isPending && <p className="text-muted">Cargando…</p>}
                {me.isError && <p className="text-coral">{getErrorMessage(me.error)}</p>}
                {me.data && (
                    <>
                        <div className="flex items-center gap-4">
                            <Avatar
                                name={me.data.displayName ?? ''}
                                imageUrl={me.data.avatarUrl}
                                size="xl"
                            />
                            <div className="flex min-w-0 flex-col gap-1">
                                <span className="font-display truncate text-xl font-bold">
                                    {me.data.displayName}
                                </span>
                                <span className="text-muted truncate text-sm">{me.data.email}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="border-line hover:bg-surface-2 flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border text-[13px] font-semibold"
                            >
                                <Camera className="size-4" aria-hidden="true" />
                                {me.data.avatarUrl ? 'Cambiar foto' : 'Añadir foto'}
                            </button>
                            {me.data.avatarUrl && (
                                <button
                                    type="button"
                                    onClick={() => removeAvatar.mutate()}
                                    disabled={removeAvatar.isPending}
                                    className="border-line text-muted hover:bg-surface-2 flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border text-[13px] font-semibold disabled:opacity-60"
                                >
                                    Quitar foto
                                </button>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(event) => {
                                pickPhoto(event.target.files?.[0]);
                                event.target.value = '';
                            }}
                        />
                        {(photoError || removeAvatar.isError) && (
                            <p role="alert" className="text-coral text-[13px]">
                                {photoError ?? getErrorMessage(removeAvatar.error)}
                            </p>
                        )}
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
                onClick={() => setDeleteOpen(true)}
                className="text-coral/80 hover:text-coral mx-auto flex items-center gap-1.5 py-2 text-[13px]"
            >
                <Trash2 className="size-4" aria-hidden="true" />
                Borrar mi cuenta
            </button>

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

            <AvatarEditorSheet imageSrc={editorSrc} onClose={closeEditor} />

            <DeleteAccountSheet open={deleteOpen} onClose={() => setDeleteOpen(false)} />
        </main>
    );
}
