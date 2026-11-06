import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { toApiError } from '../../api/errors';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data, error, response } = await api.GET('/api/users/me');
      if (error || !data) {
        throw toApiError(error, response);
      }
      return data;
    },
  });
}
