import { useParams } from 'react-router';
import { getErrorMessage } from '../../api/errors';
import { useAuth } from '../../features/auth/useAuth';
import { useGroup, useGroupRoundPredictions } from '../../features/groups/api';
import { FixturePredictionsCard } from '../../features/groups/components/FixturePredictionsCard';
import { RoundSwitcher } from '../../features/rounds/components/RoundSwitcher';
import { useSelectedRound } from '../../features/rounds/useSelectedRound';

export function GroupPredictionsPage() {
    const groupId = Number(useParams().groupId);
    const { user } = useAuth();
    const detail = useGroup(groupId);
    const { round, goToRound, firstSequence, lastSequence } = useSelectedRound(
        detail.data?.group.seasonId,
    );
    const predictions = useGroupRoundPredictions(groupId, round?.id);
    const memberCount = detail.data?.group.memberCount ?? 0;

    return (
        <main className="flex flex-col gap-3 px-5 pt-3.5 pb-6">
            <RoundSwitcher
                round={round}
                firstSequence={firstSequence}
                lastSequence={lastSequence}
                onChange={goToRound}
            />

            {predictions.isError && (
                <p className="text-coral pt-6 text-center">{getErrorMessage(predictions.error)}</p>
            )}
            {(predictions.isPending || !round) &&
                !predictions.isError &&
                [0, 1].map((index) => (
                    <div
                        key={index}
                        className="border-line-soft bg-surface h-40 animate-pulse rounded-2xl border"
                    />
                ))}
            {predictions.data?.length === 0 && (
                <p className="text-muted pt-8 text-center">
                    Esta jornada todavía no tiene partidos.
                </p>
            )}
            {predictions.data?.map((item) => (
                <FixturePredictionsCard
                    key={item.match.id}
                    item={item}
                    memberCount={memberCount}
                    myUserId={user?.id}
                />
            ))}
        </main>
    );
}
