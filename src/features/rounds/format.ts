const dayFormatter = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
});
const timeFormatter = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' });
const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'short' });

export function formatDay(date: Date): string {
    const text = dayFormatter.format(date).replace(',', '');
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatTime(date: Date): string {
    return timeFormatter.format(date);
}

export function dayKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function formatDateRange(dates: Date[]): string {
    if (dates.length === 0) return '';
    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    if (first.getMonth() === last.getMonth()) {
        return first.getDate() === last.getDate()
            ? `${first.getDate()} ${monthFormatter.format(first)}`
            : `${first.getDate()} – ${last.getDate()} ${monthFormatter.format(last)}`;
    }
    return `${first.getDate()} ${monthFormatter.format(first)} – ${last.getDate()} ${monthFormatter.format(last)}`;
}
