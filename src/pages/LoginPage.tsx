import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { z } from 'zod';
import { Button } from '../components/Buttons';
import { TextField } from '../components/TextField';
import { BallIcon } from '../components/icons';
import { getErrorMessage } from '../api/errors';
import { useLogin } from '../features/auth/api';

const loginSchema = z.object({
  email: z.email('Introduce un email válido'),
  password: z.string().min(1, 'Introduce tu contraseña'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-between px-6 pt-18 pb-8">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <div className="bg-lime text-ink flex size-16 items-center justify-center rounded-[18px]">
            <BallIcon className="size-9" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-[34px] leading-tight font-bold tracking-tight">
              La porra de tu grupo, jornada a jornada
            </h1>
            <p className="text-muted text-[15px] leading-relaxed">
              Pronostica cada partido, suma puntos y presume de clasificación.
            </p>
          </div>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit((values) => login.mutate(values))}
          className="flex flex-col gap-4"
        >
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <TextField
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            error={errors.password?.message}
            {...register('password')}
          />
          {login.isError && (
            <p role="alert" className="bg-coral/12 text-coral rounded-xl px-3.5 py-3 text-[13px]">
              {getErrorMessage(login.error)}
            </p>
          )}
          <Button type="submit" loading={login.isPending} className="mt-1 h-13.5">
            Entrar
          </Button>
        </form>
      </div>

      <p className="text-muted text-center text-sm">
        ¿Todavía no tienes cuenta?{' '}
        <Link to="/registro" className="text-lime hover:text-lime-soft font-semibold">
          Regístrate
        </Link>
      </p>
    </main>
  );
}
