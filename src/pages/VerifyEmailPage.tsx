import { useEffect, useState, type ChangeEvent } from 'react';
import { Link, Navigate, useLocation, useSearchParams } from 'react-router';
import { MailCheck } from 'lucide-react';
import { Button } from '../components/Buttons';
import { getErrorMessage } from '../api/errors';
import { useResendVerificationCode, useVerifyEmail } from '../features/auth/api';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

interface VerifyState {
    from?: string;
    /** Venimos del registro: el código se acaba de enviar y no se puede pedir otro todavía. */
    justSent?: boolean;
}

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') ?? '';
    const state = (useLocation().state as VerifyState | null) ?? {};

    const verify = useVerifyEmail();
    const resend = useResendVerificationCode();
    const [code, setCode] = useState('');
    const [cooldown, setCooldown] = useState(state.justSent ? RESEND_COOLDOWN_SECONDS : 0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    if (!email) return <Navigate to="/login" replace />;

    function submit(value: string) {
        if (value.length === CODE_LENGTH && !verify.isPending) {
            verify.mutate({ email, code: value });
        }
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        // Solo números: así también funciona al pegar "123 456" o el código con espacios
        const value = event.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH);
        setCode(value);
        if (verify.isError) verify.reset();
        // Al completar los 6 dígitos se envía solo, sin tener que pulsar el botón
        if (value.length === CODE_LENGTH) submit(value);
    }

    function handleResend() {
        resend.mutate(email, {
            onSuccess: () => {
                setCode('');
                verify.reset();
                setCooldown(RESEND_COOLDOWN_SECONDS);
            },
        });
    }

    return (
        <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-between px-6 pt-14 pb-8">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-5">
                    <span className="bg-lime/12 flex size-16 items-center justify-center rounded-[18px]">
                        <MailCheck className="text-lime size-8" aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-2">
                        <h1 className="font-display text-[30px] leading-tight font-bold tracking-tight">
                            Revisa tu correo
                        </h1>
                        <p className="text-muted text-[15px] leading-relaxed">
                            {state.justSent
                                ? 'Te hemos enviado un código de 6 dígitos a '
                                : 'Tu cuenta aún no está verificada. Escribe el código que te enviamos a '}
                            <span className="text-fg font-semibold wrap-anywhere">{email}</span>
                            {state.justSent ? '. Caduca en 15 minutos.' : ' o pide uno nuevo.'}
                        </p>
                    </div>
                </div>

                <form
                    noValidate
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit(code);
                    }}
                    className="flex flex-col gap-4"
                >
                    <label htmlFor="verification-code" className="text-[13px] font-semibold">
                        Código
                    </label>
                    <input
                        id="verification-code"
                        value={code}
                        onChange={handleChange}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="\d*"
                        placeholder="000000"
                        autoFocus
                        aria-invalid={verify.isError ? true : undefined}
                        aria-describedby={verify.isError ? 'verification-error' : undefined}
                        className={`bg-surface font-display placeholder:text-line h-16 w-full rounded-2xl border text-center text-[32px] font-bold tracking-[0.5em] outline-none ${
                            verify.isError ? 'border-coral' : 'border-line focus:border-lime'
                        }`}
                    />
                    {verify.isError && (
                        <p
                            id="verification-error"
                            role="alert"
                            className="bg-coral/12 text-coral rounded-xl px-3.5 py-3 text-[13px]"
                        >
                            {getErrorMessage(verify.error)}
                        </p>
                    )}
                    <Button
                        type="submit"
                        loading={verify.isPending}
                        disabled={code.length < CODE_LENGTH}
                        className="mt-1 h-13.5"
                    >
                        Verificar y entrar
                    </Button>
                </form>

                <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-muted text-sm">¿No te ha llegado? Mira también en spam.</p>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={cooldown > 0 || resend.isPending}
                        className="text-lime hover:text-lime-soft disabled:text-subtle h-10 text-sm font-semibold"
                    >
                        {cooldown > 0 ? `Reenviar código en ${cooldown} s` : 'Reenviar código'}
                    </button>
                    {resend.isSuccess && cooldown > 0 && (
                        <p role="status" className="text-muted text-xs">
                            Te hemos enviado un código nuevo.
                        </p>
                    )}
                    {resend.isError && (
                        <p role="alert" className="text-coral text-xs">
                            {getErrorMessage(resend.error)}
                        </p>
                    )}
                </div>
            </div>

            <p className="text-muted mt-8 text-center text-sm">
                <Link
                    to="/login"
                    state={state.from ? { from: state.from } : undefined}
                    className="text-lime hover:text-lime-soft font-semibold"
                >
                    Volver a entrar
                </Link>
            </p>
        </main>
    );
}
