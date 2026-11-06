import { useId, type ComponentProps } from 'react';

interface TextFieldProps extends ComponentProps<'input'> {
  label: string;
  error?: string;
}

export function TextField({ label, error, id, ...props }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-[13px] font-semibold">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`bg-surface text-fg placeholder:text-subtle focus:border-lime h-13 rounded-2xl border px-4 text-base outline-none ${error ? 'border-coral' : 'border-line'}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-coral text-[13px]">
          {error}
        </p>
      )}
    </div>
  );
}
