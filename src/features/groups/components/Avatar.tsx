import { initials } from '../model';

interface AvatarProps {
    name: string;
    highlighted?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const sizes = {
    sm: 'size-9 text-xs',
    md: 'size-13 text-base',
    lg: 'size-15 text-[17px]',
};

export function Avatar({ name, highlighted = false, size = 'sm' }: AvatarProps) {
    return (
        <span
            aria-hidden="true"
            className={`bg-surface-2 flex shrink-0 items-center justify-center rounded-full font-bold ${sizes[size]} ${
                highlighted ? 'border-lime border-2' : size === 'sm' ? '' : 'border-line border-2'
            }`}
        >
            {initials(name)}
        </span>
    );
}
