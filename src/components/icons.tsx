import type { ComponentProps } from 'react';

/** El balón del logo, en versión de trazo para la barra de navegación. */
export function BallIcon(props: ComponentProps<'svg'>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <circle cx="12" cy="12" r="9" />
            <path
                d="M12 8.76 15.42 11.25 14.12 15.27 9.88 15.27 8.58 11.25Z"
                fill="currentColor"
                strokeWidth={1.5}
            />
            <path
                d="M12 8.76V3M15.42 11.25 20.66 9.55M14.12 15.27 17.12 19.4M9.88 15.27 6.88 19.4M8.58 11.25 3.34 9.55"
                strokeWidth={1.5}
            />
        </svg>
    );
}
