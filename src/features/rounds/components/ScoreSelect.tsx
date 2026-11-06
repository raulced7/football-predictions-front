const GOALS = Array.from({ length: 16 }, (_, goals) => goals);

interface ScoreSelectProps {
    label: string;
    value: number | null;
    onChange: (value: number) => void;
}

export function ScoreSelect({ label, value, onChange }: ScoreSelectProps) {
    const empty = value === null;
    return (
        <label className="relative">
            <span className="sr-only">{label}</span>
            <select
                value={empty ? '' : String(value)}
                onChange={(event) => onChange(Number(event.target.value))}
                className={`font-display focus:border-lime h-14 w-12 cursor-pointer appearance-none rounded-xl text-center text-[26px] font-bold [text-align-last:center] focus:outline-none ${
                    empty
                        ? 'text-subtle border border-dashed border-[#3A4566] bg-transparent'
                        : 'border-line bg-surface-2 text-fg border'
                }`}
            >
                <option value="" disabled>
                    –
                </option>
                {GOALS.map((goals) => (
                    <option key={goals} value={goals}>
                        {goals}
                    </option>
                ))}
            </select>
        </label>
    );
}
