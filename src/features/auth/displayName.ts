import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '../../api/client';
import { toApiError } from '../../api/errors';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

// Misma regla que el backend: 3-20 caracteres, letras, números, espacios, '.', '_' o '-',
// empezando y terminando por letra o número.
export const DISPLAY_NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} ._-]{1,18}[\p{L}\p{N}]$/u;

export const displayNameSchema = z
  .string()
  .trim()
  .regex(
    DISPLAY_NAME_PATTERN,
    'Entre 3 y 20 caracteres: letras, números, espacios, puntos, guiones o _',
  );

export type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'taken';

export function useDisplayNameAvailability(rawName: string): AvailabilityStatus {
  const name = rawName.trim();
  const debouncedName = useDebouncedValue(name);
  const isValid = DISPLAY_NAME_PATTERN.test(debouncedName);

  const query = useQuery({
    queryKey: ['display-name-availability', debouncedName.toLowerCase()],
    enabled: isValid,
    staleTime: 10_000,
    queryFn: async () => {
      const { data, error, response } = await api.GET('/api/auth/display-name-availability', {
        params: { query: { name: debouncedName } },
      });
      if (error || !data) {
        throw toApiError(error, response);
      }
      return data.available ?? false;
    },
  });

  if (!DISPLAY_NAME_PATTERN.test(name)) return 'idle';
  if (name !== debouncedName || query.isPending) return 'checking';
  if (query.isError) return 'idle';
  return query.data ? 'available' : 'taken';
}
