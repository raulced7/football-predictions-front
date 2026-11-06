import { Outlet } from 'react-router';
import { BottomNav } from '../components/BottomNav';

export function AppLayout() {
    return (
        <div className="mx-auto min-h-dvh max-w-md pb-[calc(4rem+env(safe-area-inset-bottom))]">
            <Outlet />
            <BottomNav />
        </div>
    );
}
