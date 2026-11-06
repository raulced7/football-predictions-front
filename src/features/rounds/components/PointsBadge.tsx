interface PointsBadgeProps {
    points: number;
    compact?: boolean;
}

export function PointsBadge({ points, compact = false }: PointsBadgeProps) {
    const base = 'flex h-6 items-center justify-center rounded-full px-2.5 text-xs font-bold';
    if (points >= 3) {
        return (
            <span className={`${base} bg-lime text-ink`}>
                {compact ? `+${points}` : `+${points} · Exacto`}
            </span>
        );
    }
    if (points > 0) {
        return <span className={`${base} bg-violet/20 text-[#C7BEFF]`}>+{points}</span>;
    }
    return <span className={`${base} bg-surface-2 text-muted`}>0</span>;
}
