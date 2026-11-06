import type { Match } from '../model';

export function RoundSummary({ matches }: { matches: Match[] }) {
    const points = matches.reduce((total, match) => total + (match.prediction?.points ?? 0), 0);
    const exact = matches.filter((match) => match.prediction?.points === 3).length;
    const predicted = matches.filter((match) => match.prediction !== null).length;

    return (
        <dl className="border-line-soft bg-surface grid grid-cols-3 rounded-2xl border px-3 py-3.5">
            <div className="flex flex-col-reverse items-center gap-0.5">
                <dt className="text-muted text-xs">puntos</dt>
                <dd className="font-display text-lime text-2xl font-bold">{points}</dd>
            </div>
            <div className="border-line flex flex-col-reverse items-center gap-0.5 border-x">
                <dt className="text-muted text-xs">exactos</dt>
                <dd className="font-display text-2xl font-bold">{exact}</dd>
            </div>
            <div className="flex flex-col-reverse items-center gap-0.5">
                <dt className="text-muted text-xs">pronosticados</dt>
                <dd className="font-display text-2xl font-bold">
                    {predicted}
                    <span className="text-muted text-base">/{matches.length}</span>
                </dd>
            </div>
        </dl>
    );
}
