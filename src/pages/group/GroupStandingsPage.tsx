import { useParams, useSearchParams } from 'react-router';
import { getErrorMessage } from '../../api/errors';
import { useAuth } from '../../features/auth/useAuth';
import { useGroup, useGroupRoundStandings, useGroupStandings } from '../../features/groups/api';
import { Podium } from '../../features/groups/components/Podium';
import { StandingsList } from '../../features/groups/components/StandingsList';
import { RoundSwitcher } from '../../features/rounds/components/RoundSwitcher';
import { useSelectedRound } from '../../features/rounds/useSelectedRound';

export function GroupStandingsPage() {
    const groupId = Number(useParams().groupId);
    const { user } = useAuth();
    const detail = useGroup(groupId);
    const { round, goToRound, firstSequence, lastSequence } = useSelectedRound(
        detail.data?.group.seasonId,
    );

    const [searchParams, setSearchParams] = useSearchParams();
    const view = searchParams.get('vista') === 'jornada' ? 'round' : 'general';

    const general = useGroupStandings(groupId);
    const byRound = useGroupRoundStandings(groupId, view === 'round' ? round?.id : undefined);
    const standings = view === 'general' ? general : byRound;

    function changeView(next: 'general' | 'round') {
        setSearchParams((current) => {
            const params = new URLSearchParams(current);
            if (next === 'round') params.set('vista', 'jornada');
            else params.delete('vista');
            return params;
        });
    }

    const entries = standings.data ?? [];
    const withPodium = entries.length >= 3;

    return (
        <main className="flex flex-col gap-4 px-5 pt-4 pb-6">
            <div
                role="tablist"
                aria-label="Tipo de clasificación"
                className="border-line-soft bg-surface grid grid-cols-2 rounded-[14px] border p-1"
            >
                {(['general', 'round'] as const).map((option) => (
                    <button
                        key={option}
                        type="button"
                        role="tab"
                        aria-selected={view === option}
                        onClick={() => changeView(option)}
                        className={`h-10 rounded-[10px] text-sm font-semibold ${
                            view === option ? 'bg-line text-fg' : 'text-muted hover:text-fg'
                        }`}
                    >
                        {option === 'general' ? 'General' : 'Por jornada'}
                    </button>
                ))}
            </div>

            {view === 'round' && (
                <RoundSwitcher
                    round={round}
                    firstSequence={firstSequence}
                    lastSequence={lastSequence}
                    onChange={goToRound}
                />
            )}

            {standings.isError && (
                <p className="text-coral pt-6 text-center">{getErrorMessage(standings.error)}</p>
            )}
            {standings.isPending && !standings.isError && (
                <div className="border-line-soft bg-surface h-64 animate-pulse rounded-2xl border" />
            )}

            {standings.isSuccess && (
                <>
                    {withPodium && <Podium entries={entries.slice(0, 3)} myUserId={user?.id} />}
                    <StandingsList
                        entries={withPodium ? entries.slice(3) : entries}
                        myUserId={user?.id}
                        label={withPodium ? 'Resto de la clasificación' : 'Clasificación'}
                    />
                </>
            )}
        </main>
    );
}
