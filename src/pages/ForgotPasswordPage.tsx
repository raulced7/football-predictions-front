import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useSearchParams } from 'react-router';
import { KeyRound } from 'lucide-react';
import { z } from 'zod';
import { Button } from '../components/Buttons';
import { CODE_LENGTH, CodeInput } from '../components/CodeInput';
import { PasswordField } from '../components/PasswordField';
import { TextField } from '../components/TextField';
import { getErrorMessage } from '../api/errors';
import { useConfirmPasswordReset, useRequestPasswordReset } from '../features/auth/api';
import { useCooldown } from '../hooks/useCooldown';

const RESEND_COOLDOWN_SECONDS = 60;

const emailSchema = z.object({
    email: z.email('Introduce un email válido'),
});

const resetSchema = z.object({
    code: z.string().regex(/^\d{6}$/, `El código tiene ${CODE_LENGTH} dígitos`),
    newPassword: z.string().min(8, 'Mínimo 8 caracteres').max(72, 'Máximo 72 caracteres'),
});

type EmailForm = z.infer<typeof emailSchema>;
type ResetForm = z.infer<typeof resetSchema>;

/**
 * Dos pasos en la misma pantalla: primero el email (se envía el código) y después el código
 * con la contraseña nueva. Al terminar, el usuario entra directamente.
 */
export function ForgotPasswordPage() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [email, setEmail] = useState<string | null>(null);

    const requestReset = useRequestPasswordReset();
    const confirmReset = useConfirmPasswordReset();
    const cooldown = useCooldown();

    const emailForm = useForm<EmailForm>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: searchParams.get('email') ?? '' },
    });
    const resetForm = useForm<ResetForm>({
        resolver: zodResolver(resetSchema),
        defaultValues: { code: '', newPassword: '' },
    });

    function sendCode(address: string) {
        requestReset.mutate(address, {
            onSuccess: () => {
                setEmail(address);
                cooldown.start(RESEND_COOLDOWN_SECONDS);
            },
        });
    }

    return (
        <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-between px-6 pt-14 pb-8">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-5">
                    <span className="bg-lime/12 flex size-16 items-center justify-center rounded-[18px]">
                        <KeyRound className="text-lime size-8" aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-2">
                        <h1 className="font-display text-[30px] leading-tight font-bold tracking-tight">
                            {email ? 'Nueva contraseña' : '¿Has olvidado tu contraseña?'}
                        </h1>
                        <p className="text-muted text-[15px] leading-relaxed">
                            {email ? (
                                <>
                                    Si hay una cuenta con{' '}
                                    <span className="text-fg font-semibold wrap-anywhere">
                                        {email}
                                    </span>
                                    , te hemos enviado un código. Escríbelo junto con tu contraseña
                                    nueva.
                                </>
                            ) : (
                                'Escribe tu email y te enviaremos un código para elegir una contraseña nueva.'
                            )}
                        </p>
                    </div>
                </div>

                {!email ? (
                    <form
                        noValidate
                        onSubmit={emailForm.handleSubmit((values) => sendCode(values.email))}
                        className="flex flex-col gap-4"
                    >
                        <TextField
                            label="Email"
                            type="email"
                            autoComplete="email"
                            placeholder="tu@email.com"
                            error={emailForm.formState.errors.email?.message}
                            {...emailForm.register('email')}
                        />
                        {requestReset.isError && (
                            <p
                                role="alert"
                                className="bg-coral/12 text-coral rounded-xl px-3.5 py-3 text-[13px]"
                            >
                                {getErrorMessage(requestReset.error)}
                            </p>
                        )}
                        <Button
                            type="submit"
                            loading={requestReset.isPending}
                            className="mt-1 h-13.5"
                        >
                            Enviar código
                        </Button>
                    </form>
                ) : (
                    <>
                        <form
                            noValidate
                            onSubmit={resetForm.handleSubmit((values) =>
                                confirmReset.mutate({ email, ...values }),
                            )}
                            className="flex flex-col gap-4"
                        >
                            <Controller
                                control={resetForm.control}
                                name="code"
                                render={({ field, fieldState }) => (
                                    <CodeInput
                                        id="reset-code"
                                        label="Código"
                                        value={field.value}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            if (confirmReset.isError) confirmReset.reset();
                                        }}
                                        error={fieldState.error?.message}
                                        autoFocus
                                    />
                                )}
                            />
                            <PasswordField
                                label="Contraseña nueva"
                                autoComplete="new-password"
                                placeholder="Mínimo 8 caracteres"
                                error={resetForm.formState.errors.newPassword?.message}
                                {...resetForm.register('newPassword')}
                            />
                            {confirmReset.isError && (
                                <p
                                    role="alert"
                                    className="bg-coral/12 text-coral rounded-xl px-3.5 py-3 text-[13px]"
                                >
                                    {getErrorMessage(confirmReset.error)}
                                </p>
                            )}
                            <Button
                                type="submit"
                                loading={confirmReset.isPending}
                                className="mt-1 h-13.5"
                            >
                                Cambiar contraseña y entrar
                            </Button>
                        </form>

                        <div className="flex flex-col items-center gap-1 text-center">
                            <button
                                type="button"
                                onClick={() => sendCode(email)}
                                disabled={cooldown.seconds > 0 || requestReset.isPending}
                                className="text-lime hover:text-lime-soft disabled:text-subtle h-10 text-sm font-semibold"
                            >
                                {cooldown.seconds > 0
                                    ? `Reenviar código en ${cooldown.seconds} s`
                                    : 'Reenviar código'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail(null);
                                    resetForm.reset();
                                    confirmReset.reset();
                                }}
                                className="text-muted hover:text-fg h-10 text-sm"
                            >
                                Usar otro email
                            </button>
                        </div>
                    </>
                )}
            </div>

            <p className="text-muted mt-8 text-center text-sm">
                <Link
                    to="/login"
                    state={location.state}
                    className="text-lime hover:text-lime-soft font-semibold"
                >
                    Volver a entrar
                </Link>
            </p>
        </main>
    );
}
