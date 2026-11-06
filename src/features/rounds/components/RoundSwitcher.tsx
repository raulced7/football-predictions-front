import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Round } from '../model';

interface RoundSwitcherProps {
    round: Round | undefined;
    firstSequence: number;
    lastSequence: number;
    onChange: (sequence: number) => void;
}

export function RoundSwitcher({
    round,
    firstSequence,
    lastSequence,
    onChange,
}: RoundSwitcherProps) {
    return (
        <div className="flex items-center justify-between">
            <button
                type="button"
                aria-label="Jornada anterior"
                disabled={!round || round.sequence <= firstSequence}
                onClick={() => round && onChange(round.sequence - 1)}
                className="border-line bg-surface flex size-10 items-center justify-center rounded-[10px] border disabled:opacity-40"
            >
                <ChevronLeft className="size-4.5" aria-hidden="true" />
            </button>
            <span className="font-display text-lg font-bold">{round?.name ?? '…'}</span>
            <button
                type="button"
                aria-label="Jornada siguiente"
                disabled={!round || round.sequence >= lastSequence}
                onClick={() => round && onChange(round.sequence + 1)}
                className="border-line bg-surface flex size-10 items-center justify-center rounded-[10px] border disabled:opacity-40"
            >
                <ChevronRight className="size-4.5" aria-hidden="true" />
            </button>
        </div>
    );
}
