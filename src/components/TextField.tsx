import { useId, type ComponentProps, type ReactNode } from 'react';

interface TextFieldProps extends ComponentProps<'input'> {
  label: string;
  error?: string;
  hint?: ReactNode;
  endAdornment?: ReactNode;
}

export function TextField({ label, error, hint, endAdornment, id, ...props }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const hasMessage = Boolean(error || hint);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-[13px] font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          className={`bg-surface text-fg placeholder:text-subtle focus:border-lime h-13 w-full rounded-2xl border px-4 text-base outline-none ${endAdornment ? 'pr-14' : ''} ${error ? 'border-coral' : 'border-line'}`}
          {...props}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-1 flex items-center">{endAdornment}</div>
        )}
      </div>
      {error ? (
        <p id={messageId} className="text-coral text-[13px]">
          {error}
        </p>
      ) : (
        hint && (
          <div id={messageId} className="text-[13px]">
            {hint}
          </div>
        )
      )}
    </div>
  );
}
