import { teamCode } from '../features/rounds/model';

interface TeamBadgeProps {
    name: string;
    crestUrl?: string | null;
}

export function TeamBadge({ name, crestUrl }: TeamBadgeProps) {
    if (crestUrl) {
        return <img src={crestUrl} alt="" className="size-10 object-contain" />;
    }
    return (
        <span
            aria-hidden="true"
            className="border-line bg-surface-2 flex size-10 items-center justify-center rounded-full border text-[11px] font-bold tracking-wide"
        >
            {teamCode(name)}
        </span>
    );
}
