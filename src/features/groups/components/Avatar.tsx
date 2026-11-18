import { useState } from 'react';
import { initials } from '../model';

interface AvatarProps {
    name: string;
    imageUrl?: string | null;
    highlighted?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
    sm: 'size-9 text-xs',
    md: 'size-13 text-base',
    lg: 'size-15 text-[17px]',
    xl: 'size-20 text-2xl',
};

/** Foto de perfil si la hay; si no (o si no carga), las iniciales. */
export function Avatar({ name, imageUrl, highlighted = false, size = 'sm' }: AvatarProps) {
    const [failedUrl, setFailedUrl] = useState<string | null>(null);
    const border = highlighted
        ? 'border-lime border-2'
        : size === 'sm'
          ? ''
          : 'border-line border-2';
    const showImage = imageUrl && imageUrl !== failedUrl;

    return (
        <span
            aria-hidden="true"
            className={`bg-surface-2 flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold ${sizes[size]} ${border}`}
        >
            {showImage ? (
                <img
                    src={imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailedUrl(imageUrl)}
                    className="size-full object-cover"
                />
            ) : (
                initials(name)
            )}
        </span>
    );
}
