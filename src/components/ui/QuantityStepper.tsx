import { Minus, Plus } from 'lucide-react';

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
  label?: string;
}

export function QuantityStepper({ value, min = 1, max = 9, onChange, size = 'md', label = 'Quantità' }: Props) {
  const h = size === 'md' ? 'h-[52px]' : 'h-9';
  const w = size === 'md' ? 'w-11' : 'w-9';
  return (
    <div className={`inline-flex items-stretch border border-line ${h}`} role="group" aria-label={label}>
      <button
        type="button"
        className={`grid ${w} place-items-center text-bone transition-[opacity,transform] duration-150 ease-out active:scale-90 disabled:opacity-30`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Diminuisci quantità"
      >
        <Minus size={14} strokeWidth={1.5} />
      </button>
      <span
        className="grid min-w-7 place-items-center text-[15px] tabular-nums"
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>
      <button
        type="button"
        className={`grid ${w} place-items-center text-bone transition-[opacity,transform] duration-150 ease-out active:scale-90 disabled:opacity-30`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Aumenta quantità"
      >
        <Plus size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
