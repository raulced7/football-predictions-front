import type { ComponentProps } from 'react';
import { LoaderCircle } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'link';

const variants: Record<Variant, string> = {
  primary: 'bg-lime font-bold text-ink hover:bg-lime-soft',
  secondary: 'border border-line bg-surface font-semibold text-fg hover:bg-surface-2',
  danger: 'border border-coral/50 bg-transparent font-semibold text-coral hover:bg-coral/10',
  link: 'bg-transparent font-semibold text-lime hover:text-lime-soft',
};

interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-[15px] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
