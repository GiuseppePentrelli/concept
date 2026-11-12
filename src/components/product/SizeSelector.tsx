import type { Size } from '../../data/types';

interface Props {
  sizes: Size[];
  soldOut?: Size[];
  value: Size;
  onChange: (size: Size) => void;
  onOpenGuide: () => void;
}

export function SizeSelector({ sizes, soldOut = [], value, onChange, onOpenGuide }: Props) {
  return (
    <fieldset>
      <div className="flex items-baseline justify-between">
        <legend className="text-[15px] text-bone/90">Taglia</legend>
        <button
          type="button"
          onClick={onOpenGuide}
          className="py-1 text-[12.5px] text-ash underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-bone"
        >
          Guida alle taglie
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2.5 sm:gap-3" role="radiogroup" aria-label="Taglia">
        {sizes.map((size) => {
          const unavailable = soldOut.includes(size);
          const selected = size === value;
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={unavailable ? `${size}, esaurita` : size}
              disabled={unavailable}
              onClick={() => onChange(size)}
              className={`relative grid h-11 min-w-[48px] flex-1 place-items-center border px-2 font-sans text-[13px] font-normal tracking-[0.08em] transition-[border-color,background-color,color,transform] duration-150 ease-out active:scale-[0.96] sm:h-10 sm:min-w-[58px] sm:flex-none ${
                selected
                  ? 'border-bone bg-white/[0.07] text-white shadow-[inset_0_0_0_1px_var(--color-bone)]'
                  : unavailable
                    ? 'cursor-not-allowed border-line-soft text-smoke line-through'
                    : 'border-line text-bone/90 hover:border-ash'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
