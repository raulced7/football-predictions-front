import { useSyncExternalStore } from 'react';
import { authStore, decodeToken, isExpired } from './authStore';

export function useAuth() {
  const token = useSyncExternalStore(authStore.subscribe, authStore.getToken);
  const claims = token ? decodeToken(token) : null;
  const isAuthenticated = claims !== null && !isExpired(claims);

  return {
    isAuthenticated,
    user: isAuthenticated
      ? {
          id: claims.sub,
          name: claims.name ?? '',
          isAdmin: claims.roles?.includes('ADMIN') ?? false,
        }
      : null,
  };
}
