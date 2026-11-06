export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

function defaultMessage(status: number): string {
    if (status === 401) return 'Tu sesión ha caducado. Vuelve a entrar.';
    if (status === 403) return 'No tienes permiso para hacer esto.';
    if (status === 404) return 'No se ha encontrado lo que buscabas.';
    if (status >= 500) return 'El servidor ha tenido un problema. Inténtalo de nuevo.';
    return 'Algo ha ido mal. Inténtalo de nuevo.';
}

export function toApiError(error: unknown, response: Response): ApiError {
    const detail =
        typeof error === 'object' &&
        error !== null &&
        'detail' in error &&
        typeof error.detail === 'string'
            ? error.detail
            : undefined;
    return new ApiError(response.status, detail ?? defaultMessage(response.status));
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    return 'No se ha podido conectar con el servidor.';
}
