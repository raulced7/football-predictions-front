const STORAGE_KEY = 'fp.accessToken';

type Listener = () => void;

const listeners = new Set<Listener>();

function readStoredToken(): string | null {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

let token = readStoredToken();

function emit() {
    listeners.forEach((listener) => listener());
}

export const authStore = {
    getToken(): string | null {
        return token;
    },

    setToken(next: string) {
        token = next;
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Sin almacenamiento (modo privado): la sesión dura hasta recargar
        }
        emit();
    },

    clear() {
        token = null;
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // Nada que borrar
        }
        emit();
    },

    subscribe(listener: Listener) {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    },
};

export interface TokenClaims {
    sub: string;
    name?: string;
    roles?: string[];
    exp: number;
}

export function decodeToken(value: string): TokenClaims | null {
    try {
        const payload = value.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const bytes = Uint8Array.from(atob(payload), (char) => char.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes)) as TokenClaims;
    } catch {
        return null;
    }
}

export function isExpired(claims: TokenClaims): boolean {
    return claims.exp * 1000 <= Date.now();
}
