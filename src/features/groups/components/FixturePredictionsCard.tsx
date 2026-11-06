import { useState } from 'react';
import { Lock } from 'lucide-react';
import { PointsBadge } from '../../rounds/components/PointsBadge';
import { StatusPill } from '../../rounds/components/StatusPill';
import type { FixturePredictions } from '../model';

const VISIBLE_PREDICTIONS = 5;

interface FixturePredictionsCardProps {
    item: FixturePredictions;
    memberCount: number;
    myUserId: string | undefined;
}

export function FixturePredictionsCard({
    item,
    memberCount,
    myUserId,
}: FixturePredictionsCardProps) {
    const [expanded, setExpanded] = useState(false);
    const { match, revealed, predictedCount } = item;
    const hasResult = match.homeGoals !== null && match.awayGoals !== null;

    // Primero tu pronóstico; después, de más a menos puntos
    const predictions = [...item.predictions].sort((a, b) => {
        if (String(a.userId) === myUserId) return -1;
        if (String(b.userId) === myUserId) return 1;
        return (b.points ?? -1) - (a.points ?? -1) || a.displayName.localeCompare(b.displayName);
    });
    const visible = expanded ? predictions : predictions.slice(0, VISIBLE_PREDICTIONS);

    return (
        <article className="border-line-soft bg-surface overflow-hidden rounded-2xl border">
            <div className="bg-surface-2 flex items-center justify-between gap-3 px-3.5 py-3">
                <span className="min-w-0 truncate text-sm font-semibold">
                    {match.homeTeam}
                    <span
                        className={`font-display mx-1.5 font-bold ${hasResult ? '' : 'text-muted'}`}
                    >
                        {hasResult ? `${match.homeGoals} – ${match.awayGoals}` : 'vs'}
                    </span>
                    {match.awayTeam}
                </span>
                <StatusPill match={match} />
            </div>

            {!revealed ? (
                <div className="flex items-center gap-3.5 px-3.5 py-4">
                    <span className="bg-surface-2 flex size-11 shrink-0 items-center justify-center rounded-xl">
                        <Lock className="text-muted size-5" aria-hidden="true" />
                    </span>
                    <div className="flex min-w-0 grow flex-col gap-2">
                        <span className="text-sm font-semibold">Ocultos hasta el inicio</span>
                        <div
                            role="progressbar"
                            aria-label="Miembros que han pronosticado"
                            aria-valuemin={0}
                            aria-valuemax={memberCount}
                            aria-valuenow={predictedCount}
                            className="bg-surface-2 h-1.5 overflow-hidden rounded-full"
                        >
                            <div
                                className="bg-lime h-1.5 rounded-full"
                                style={{
                                    width: `${memberCount > 0 ? (predictedCount / memberCount) * 100 : 0}%`,
                                }}
                            />
                        </div>
                        <span className="text-muted text-xs">
                            {predictedCount} de {memberCount} han pronosticado
                        </span>
                    </div>
                </div>
            ) : predictions.length === 0 ? (
                <p className="text-muted px-3.5 py-4 text-sm">Nadie pronosticó este partido.</p>
            ) : (
                <>
                    <ul className="px-3.5 py-1">
                        {visible.map((prediction) => {
                            const isMe = String(prediction.userId) === myUserId;
                            return (
                                <li
                                    key={prediction.userId}
                                    className="border-line-soft grid h-10 grid-cols-[minmax(0,1fr)_auto_48px] items-center gap-3 border-b last:border-b-0"
                                >
                                    <span
                                        className={`truncate text-sm ${isMe ? 'font-semibold' : ''}`}
                                    >
                                        {prediction.displayName}
                                        {isMe && ' (tú)'}
                                    </span>
                                    <span className="font-display text-[15px] font-bold">
                                        {prediction.homeGoals} – {prediction.awayGoals}
                                    </span>
                                    <span className="justify-self-end">
                                        {prediction.points === null ? (
                                            <span className="text-muted text-xs">—</span>
                                        ) : (
                                            <PointsBadge points={prediction.points} compact />
                                        )}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                    {predictions.length > VISIBLE_PREDICTIONS && (
                        <button
                            type="button"
                            onClick={() => setExpanded((current) => !current)}
                            className="border-line-soft text-lime h-11 w-full border-t text-[13px] font-semibold"
                        >
                            {expanded ? 'Ver menos' : `Ver los ${predictions.length} pronósticos`}
                        </button>
                    )}
                </>
            )}
        </article>
    );
}
