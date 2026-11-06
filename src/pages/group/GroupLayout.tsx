import { Link, NavLink, Outlet, useParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { getErrorMessage } from '../../api/errors';
import { useGroup } from '../../features/groups/api';

const tabs = [
    { to: 'clasificacion', label: 'Clasificación' },
    { to: 'pronosticos', label: 'Pronósticos' },
    { to: 'grupo', label: 'Grupo' },
];

export function GroupLayout() {
    const groupId = Number(useParams().groupId);
    const detail = useGroup(groupId);
    const group = detail.data?.group;

    return (
        <div className="flex flex-col">
            <header className="flex flex-col gap-3.5 px-5 pt-4">
                <div className="flex items-center gap-3">
                    <Link
                        to="/grupos"
                        aria-label="Volver a mis grupos"
                        className="border-line bg-surface flex size-11 shrink-0 items-center justify-center rounded-xl border"
                    >
                        <ChevronLeft className="size-5" aria-hidden="true" />
                    </Link>
                    <div className="flex min-w-0 flex-col gap-0.5">
                        <h1 className="font-display truncate text-[22px] font-bold">
                            {group?.name ?? '…'}
                        </h1>
                        {group && (
                            <span className="text-muted text-[13px]">
                                {group.competitionName} · {group.seasonName} · {group.memberCount}{' '}
                                {group.memberCount === 1 ? 'miembro' : 'miembros'}
                                {group.readOnly && ' · Finalizada'}
                            </span>
                        )}
                    </div>
                </div>
                <nav
                    aria-label="Secciones del grupo"
                    className="border-line-soft grid grid-cols-3 border-b"
                >
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            className={({ isActive }) =>
                                `flex h-11 items-center justify-center border-b-2 text-sm font-semibold ${
                                    isActive
                                        ? 'border-lime text-fg'
                                        : 'text-muted hover:text-fg border-transparent'
                                }`
                            }
                        >
                            {tab.label}
                        </NavLink>
                    ))}
                </nav>
            </header>

            {detail.isError ? (
                <p className="text-coral px-5 pt-10 text-center">{getErrorMessage(detail.error)}</p>
            ) : (
                <Outlet />
            )}
        </div>
    );
}
