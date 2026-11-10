import { useEffect, useState } from 'react';

/** Cuenta atrás en segundos, para no dejar pedir otro código hasta que pase el tiempo de espera. */
export function useCooldown(initialSeconds = 0) {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        if (seconds <= 0) return;
        const timer = setTimeout(() => setSeconds((current) => current - 1), 1000);
        return () => clearTimeout(timer);
    }, [seconds]);

    return { seconds, start: setSeconds };
}
