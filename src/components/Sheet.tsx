import { useEffect, useId, useRef, type ReactNode } from 'react';

interface SheetProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onClose={onClose}
            onClick={(event) => {
                if (event.target === dialogRef.current) onClose();
            }}
            className="text-fg fixed inset-x-0 top-auto bottom-0 m-0 w-full max-w-none bg-transparent p-0 backdrop:bg-black/60"
        >
            <div className="border-line-soft bg-surface mx-auto flex max-w-md flex-col gap-5 rounded-t-3xl border px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                <span className="bg-line mx-auto h-1 w-10 rounded-full" aria-hidden="true" />
                <h2 id={titleId} className="font-display text-[22px] font-bold">
                    {title}
                </h2>
                {children}
            </div>
        </dialog>
    );
}
