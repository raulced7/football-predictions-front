import type { StandingEntry } from '../model';
import { Avatar } from './Avatar';

interface StandingsListProps {
    entries: StandingEntry[];
    myUserId: string | undefined;
    label: string;
}

export function StandingsList({ entries, myUserId, label }: StandingsListProps) {
    if (entries.length === 0) return null;

    return (
        <ol
            aria-label={label}
            className="border-line-soft bg-surface overflow-hidden rounded-2xl border"
        >
            {entries.map((entry, index) => {
                const isMe = String(entry.userId) === myUserId;
                const tied =
                    entries[index - 1]?.position === entry.position ||
                    entries[index + 1]?.position === entry.position;
                return (
                    <li
                        key={entry.userId}
                        className={`border-line-soft grid grid-cols-[28px_36px_minmax(0,1fr)_auto] items-center gap-3 border-b px-3.5 py-3 last:border-b-0 ${
                            isMe ? 'bg-lime/8' : ''
                        }`}
                    >
                        <span className="font-display text-muted text-center text-base font-bold">
                            {entry.position}
                        </span>
                        <Avatar name={entry.displayName} highlighted={isMe} />
                        <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="truncate text-[15px] font-semibold">
                                {entry.displayName}
                                {isMe && ' (tú)'}
                            </span>
                            <span className="text-muted text-xs">
                                {entry.exactHits} {entry.exactHits === 1 ? 'exacto' : 'exactos'}
                                {tied && ' · empate'}
                            </span>
                        </span>
                        <span className="font-display text-lg font-bold">{entry.points}</span>
                    </li>
                );
            })}
        </ol>
    );
}
