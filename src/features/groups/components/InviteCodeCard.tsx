import { useState } from 'react';
import { Copy, Share2 } from 'lucide-react';
import { Button } from '../../../components/Buttons';
import type { Group } from '../model';

export function InviteCodeCard({ group }: { group: Group }) {
    const [feedback, setFeedback] = useState<string | null>(null);
    const inviteUrl = `${window.location.origin}/unirse/${group.inviteCode}`;

    async function copy(text: string, message: string) {
        try {
            await navigator.clipboard.writeText(text);
            setFeedback(message);
        } catch {
            setFeedback('No se ha podido copiar. Copia el código a mano.');
        }
    }

    async function share() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Únete a ${group.name}`,
                    text: `Únete al grupo "${group.name}" con el código ${group.inviteCode}`,
                    url: inviteUrl,
                });
            } catch {
                // El usuario ha cerrado el menú de compartir
            }
            return;
        }
        await copy(inviteUrl, 'Enlace de invitación copiado');
    }

    return (
        <section
            aria-label="Código de invitación"
            className="border-line-soft bg-surface flex flex-col gap-3.5 rounded-[18px] border p-4.5"
        >
            <span className="text-muted text-[13px] font-semibold">Código de invitación</span>
            <span className="font-display text-lime text-[34px] font-bold tracking-[0.18em]">
                {group.inviteCode}
            </span>
            <div className="grid grid-cols-2 gap-2.5">
                <Button
                    variant="secondary"
                    className="h-11"
                    onClick={() => copy(group.inviteCode, 'Código copiado')}
                >
                    <Copy className="size-4" aria-hidden="true" />
                    Copiar
                </Button>
                <Button className="h-11" onClick={share}>
                    <Share2 className="size-4" aria-hidden="true" />
                    Compartir
                </Button>
            </div>
            <p aria-live="polite" className="text-muted h-4 text-[13px]">
                {feedback}
            </p>
        </section>
    );
}
