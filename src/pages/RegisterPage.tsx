import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { z } from 'zod';
import { Button } from '../components/Buttons';
import { TextField } from '../components/TextField';
import { getErrorMessage } from '../api/errors';
import { useRegister } from '../features/auth/api';
import { PasswordField } from '../components/PasswordField';
import { displayNameSchema, useDisplayNameAvailability } from '../features/auth/displayName';
import { DisplayNameHint } from '../features/auth/DisplayNameHint';

const registerSchema = z.object({
  displayName: displayNameSchema,
  email: z.email('Introduce un email válido').max(255),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(72, 'Máximo 72 caracteres'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });
  const availability = useDisplayNameAvailability(watch('displayName') ?? '');

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-between px-6 pt-12 pb-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[34px] leading-tight font-bold tracking-tight">
            Crea tu cuenta
          </h1>
          <p className="text-muted text-[15px] leading-relaxed">
            Únete a la porra de tus amigos en menos de un minuto.
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit((values) => registerUser.mutate(values))}
          className="flex flex-col gap-4"
        >
          <TextField
            label="Nombre de usuario"
            autoComplete="username"
            placeholder="Cómo te verán en los grupos"
            error={errors.displayName?.message}
            hint={<DisplayNameHint status={availability} />}
            {...register('displayName')}
          />
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <PasswordField
            label="Contraseña"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            error={errors.password?.message}
            {...register('password')}
          />
          {registerUser.isError && (
            <p role="alert" className="bg-coral/12 text-coral rounded-xl px-3.5 py-3 text-[13px]">
              {getErrorMessage(registerUser.error)}
            </p>
          )}
          <Button
            type="submit"
            loading={registerUser.isPending}
            disabled={availability === 'taken'}
            className="mt-1 h-13.5"
          >
            Crear cuenta
          </Button>
        </form>
      </div>

      <p className="text-muted mt-8 text-center text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-lime hover:text-lime-soft font-semibold">
          Entra
        </Link>
      </p>
    </main>
  );
}
