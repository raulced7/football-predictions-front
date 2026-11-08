import { useState } from 'react';
import type { Team } from '../features/rounds/model';

interface TeamBadgeProps {
    team: Team;
    size?: 'sm' | 'md';
}

const sizes = {
    sm: { box: 'size-5', text: 'text-[7px]', px: 20 },
    md: { box: 'size-10', text: 'text-[11px]', px: 40 },
};

export function TeamBadge({ team, size = 'md' }: TeamBadgeProps) {
    // Si el escudo no carga (sin conexión, URL rota…), volvemos a las siglas
    const [failedUrl, setFailedUrl] = useState<string | null>(null);
    const { box, text, px } = sizes[size];

    if (team.crestUrl && team.crestUrl !== failedUrl) {
        return (
            <img
                src={team.crestUrl}
                alt=""
                width={px}
                height={px}
                loading="lazy"
                decoding="async"
                onError={() => setFailedUrl(team.crestUrl)}
                className={`${box} shrink-0 object-contain`}
            />
        );
    }
    return (
        <span
            aria-hidden="true"
            className={`border-line bg-surface-2 flex shrink-0 items-center justify-center rounded-full border font-bold tracking-wide ${box} ${text}`}
        >
            {size === 'sm' ? team.code.slice(0, 1) : team.code}
        </span>
    );
}
