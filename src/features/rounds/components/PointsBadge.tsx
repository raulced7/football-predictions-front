export function PointsBadge({ points }: { points: number }) {
    if (points >= 3) {
        return (
            <span className="bg-lime text-ink flex h-6 items-center rounded-full px-2.5 text-xs font-bold">
                +{points} · Exacto
            </span>
        );
    }
    if (points > 0) {
        return (
            <span className="bg-violet/20 flex h-6 items-center rounded-full px-2.5 text-xs font-bold text-[#C7BEFF]">
                +{points}
            </span>
        );
    }
    return (
        <span className="bg-surface-2 text-muted flex h-6 items-center rounded-full px-2.5 text-xs font-bold">
            0
        </span>
    );
}
