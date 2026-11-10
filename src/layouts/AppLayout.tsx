import { Outlet } from 'react-router';
import { BottomNav } from '../components/BottomNav';
import { InstallGuideSheet } from '../features/pwa/InstallGuideSheet';
import { useFirstTimeInstallGuide } from '../features/pwa/useFirstTimeInstallGuide';

export function AppLayout() {
    const installGuide = useFirstTimeInstallGuide();

    return (
        <div className="mx-auto min-h-dvh max-w-md pb-[calc(4rem+env(safe-area-inset-bottom))]">
            <Outlet />
            <BottomNav />
            <InstallGuideSheet open={installGuide.open} onClose={installGuide.close} />
        </div>
    );
}
