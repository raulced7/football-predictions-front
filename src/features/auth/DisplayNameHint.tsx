import { Check, LoaderCircle, X } from 'lucide-react';
import type { AvailabilityStatus } from './displayName';

export function DisplayNameHint({ status }: { status: AvailabilityStatus }) {
  if (status === 'checking') {
    return (
      <span className="text-muted flex items-center gap-1.5">
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        Comprobando…
      </span>
    );
  }
  if (status === 'available') {
    return (
      <span className="text-lime flex items-center gap-1.5">
        <Check className="size-4" aria-hidden="true" />
        Disponible
      </span>
    );
  }
  if (status === 'taken') {
    return (
      <span role="alert" className="text-coral flex items-center gap-1.5">
        <X className="size-4" aria-hidden="true" />
        Ese nombre ya está en uso
      </span>
    );
  }
  return <span className="text-muted">Único en toda la app. 3-20 caracteres.</span>;
}
