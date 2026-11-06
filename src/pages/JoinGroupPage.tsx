import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { LoaderCircle } from 'lucide-react';
import { getErrorMessage } from '../api/errors';
import { useJoinGroup } from '../features/groups/api';

/** Ruta /unirse/:inviteCode: el enlace que se comparte por WhatsApp. */
export function JoinGroupPage() {
    const { inviteCode = '' } = useParams();
    const navigate = useNavigate();
    const joinGroup = useJoinGroup();
    const started = useRef(false);

    useEffect(() => {
        // En desarrollo, StrictMode ejecuta los efectos dos veces: así solo se une una vez
        if (started.current) return;
        started.current = true;
        joinGroup.mutate(inviteCode.toUpperCase(), {
            onSuccess: (group) => navigate(`/grupos/${group.id}`, { replace: true }),
        });
    }, [inviteCode, joinGroup, navigate]);

    return (
        <main className="flex flex-col items-center gap-3 px-5 pt-20 text-center">
            {joinGroup.isError ? (
                <>
                    <p className="font-display text-lg font-bold">
                        No te hemos podido unir al grupo
                    </p>
                    <p className="text-coral text-sm">{getErrorMessage(joinGroup.error)}</p>
                    <Link to="/grupos" className="text-lime mt-2 font-semibold">
                        Ir a mis grupos
                    </Link>
                </>
            ) : (
                <>
                    <LoaderCircle className="text-lime size-8 animate-spin" aria-hidden="true" />
                    <p className="text-muted">Uniéndote al grupo…</p>
                </>
            )}
        </main>
    );
}
