import { NavLink } from 'react-router';
import { User, Users } from 'lucide-react';
import { BallIcon } from './icons';

const items = [
  { to: '/', label: 'Jornada', icon: BallIcon, end: true },
  { to: '/grupos', label: 'Grupos', icon: Users, end: false },
  { to: '/perfil', label: 'Perfil', icon: User, end: false },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Navegación principal"
      className="border-line-soft bg-ink/95 fixed inset-x-0 bottom-0 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-3">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex h-full flex-col items-center justify-center gap-1 text-xs font-semibold ${isActive ? 'text-lime' : 'text-muted hover:text-fg'}`
              }
            >
              <Icon className="size-6" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
