import { Crown } from 'lucide-react';
import type { StandingEntry } from '../model';
import { Avatar } from './Avatar';

interface PodiumProps {
    entries: StandingEntry[];
    myUserId: string | undefined;
}

const heights = ['h-26', 'h-19', 'h-15'];

export function Podium({ entries, myUserId }: PodiumProps) {
    const [first, second, third] = entries;
    const columns = [
        { entry: second, rank: 1 },
        { entry: first, rank: 0 },
        { entry: third, rank: 2 },
    ];

    return (
        <ol aria-label="Podio" className="grid grid-cols-3 items-end gap-2 pt-2">
            {columns.map(({ entry, rank }) => {
                if (!entry) return <li key={rank} />;
                const isMe = String(entry.userId) === myUserId;
                const isFirst = rank === 0;
                return (
                    <li key={entry.userId} className="flex flex-col items-center gap-2">
                        {isFirst && <Crown className="text-lime size-5.5" aria-hidden="true" />}
                        <Avatar
                            name={entry.displayName}
                            size={isFirst ? 'lg' : 'md'}
                            highlighted={isMe}
                        />
                        <span className="max-w-full truncate text-[13px] font-semibold">
                            {entry.displayName}
                            {isMe && ' (tú)'}
                        </span>
                        <div
                            className={`flex w-full flex-col items-center justify-center gap-0.5 rounded-t-[14px] rounded-b-md ${heights[rank]} ${
                                isFirst ? 'bg-lime text-ink' : 'bg-surface-2'
                            }`}
                        >
                            <span
                                className={`font-display font-bold ${isFirst ? 'text-[26px]' : 'text-[22px]'}`}
                            >
                                {entry.position}
                            </span>
                            <span className={`text-xs ${isFirst ? 'font-semibold' : 'text-muted'}`}>
                                {entry.points} pts
                            </span>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
