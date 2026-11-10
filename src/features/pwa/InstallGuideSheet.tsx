import { Button } from '../../components/Buttons';
import { Sheet } from '../../components/Sheet';
import { InstallGuide } from './InstallGuide';

interface InstallGuideSheetProps {
    open: boolean;
    onClose: () => void;
}

export function InstallGuideSheet({ open, onClose }: InstallGuideSheetProps) {
    return (
        <Sheet open={open} onClose={onClose} title="Añade Golify a tu móvil">
            <p className="text-muted -mt-2 text-sm">
                Tenla en la pantalla de inicio y ábrela como una app, a pantalla completa.
            </p>
            <InstallGuide />
            <Button onClick={onClose}>Entendido</Button>
        </Sheet>
    );
}
