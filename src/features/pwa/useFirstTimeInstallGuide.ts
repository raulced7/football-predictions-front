import { useState } from 'react';
import { isStandalone } from './useInstallPrompt';

const STORAGE_KEY = 'fp.installGuideSeen';

function hasSeenGuide() {
    try {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
        // Navegación privada o almacenamiento bloqueado: mejor no insistir
        return true;
    }
}

/**
 * La guía se abre sola la primera vez que se entra en la app desde cada navegador, salvo si ya
 * está instalada. Se guarda por dispositivo a propósito: instalar la app también es por dispositivo.
 */
export function useFirstTimeInstallGuide() {
    const [open, setOpen] = useState(() => !isStandalone() && !hasSeenGuide());

    function close() {
        setOpen(false);
        try {
            localStorage.setItem(STORAGE_KEY, 'true');
        } catch {
            // Si no se puede guardar, como mucho se volverá a mostrar otro día
        }
    }

    return { open, close };
}
