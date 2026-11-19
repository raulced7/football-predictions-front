import { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Button } from '../../../components/Buttons';
import { Sheet } from '../../../components/Sheet';
import { getErrorMessage } from '../../../api/errors';
import { useUploadAvatar } from '../api';
import { cropToJpeg } from '../cropImage';

interface AvatarEditorSheetProps {
    /** URL local (blob:) de la foto elegida; null si el editor está cerrado. */
    imageSrc: string | null;
    onClose: () => void;
}

export function AvatarEditorSheet({ imageSrc, onClose }: AvatarEditorSheetProps) {
    const upload = useUploadAvatar();
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [area, setArea] = useState<Area | null>(null);
    const [prepareError, setPrepareError] = useState<string | null>(null);

    function close() {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setPrepareError(null);
        upload.reset();
        onClose();
    }

    async function save() {
        if (!imageSrc || !area) return;
        setPrepareError(null);
        try {
            const photo = await cropToJpeg(imageSrc, area);
            upload.mutate(photo, { onSuccess: close });
        } catch (error) {
            setPrepareError(
                error instanceof Error ? error.message : 'No se ha podido preparar la foto.',
            );
        }
    }

    const errorMessage = prepareError ?? (upload.isError ? getErrorMessage(upload.error) : null);

    return (
        <Sheet open={imageSrc !== null} onClose={close} title="Tu foto">
            {imageSrc && (
                <div className="bg-ink relative aspect-square w-full overflow-hidden rounded-2xl">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(_, pixels) => setArea(pixels)}
                    />
                </div>
            )}
            <label className="text-muted flex items-center gap-3 text-[13px]">
                Zoom
                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="accent-lime flex-1"
                />
            </label>
            <p className="text-muted -mt-2 text-[13px]">Arrastra la foto para encuadrarla.</p>
            {errorMessage && (
                <p
                    role="alert"
                    className="bg-coral/12 text-coral rounded-xl px-3.5 py-3 text-[13px]"
                >
                    {errorMessage}
                </p>
            )}
            <Button onClick={save} loading={upload.isPending} disabled={!area}>
                Guardar foto
            </Button>
        </Sheet>
    );
}
