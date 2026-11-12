interface MarkProps {
  className?: string;
}

export function LogoMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <path
        fill="currentColor"
        d="M32 1C32.9 21.5 36.5 27.6 63 31C36.5 34.2 33 40.5 32 63C31 40.5 27.5 34.2 1 31C27.5 27.6 31.1 21.5 32 1Z"
      />
      <path fill="#090909" d="M32 21.5C34.1 26.4 34.2 34.6 32 42.5C29.8 34.6 29.9 26.4 32 21.5Z" />
      <path
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        d="M19.5 22.5C24.5 26 25.5 35 20.5 40.5M44.5 22.5C39.5 26 38.5 35 43.500 40.5"
      />
    </svg>
  );
}

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { mark: 'h-7 w-7', text: 'text-[11px] tracking-[0.5em] mt-0.5' },
  md: { mark: 'h-9 w-9', text: 'text-[13px] tracking-[0.52em] mt-1' },
  lg: { mark: 'h-[54px] w-[54px]', text: 'text-[21px] tracking-[0.56em] mt-1.5' },
};

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const s = SIZES[size];
  return (
    <span className={`inline-flex flex-col items-center text-bone ${className}`}>
      <LogoMark className={s.mark} />
      <span className={`font-serif font-medium uppercase leading-none ${s.text}`} style={{ marginRight: '-0.5em' }}>
        Concept
      </span>
    </span>
  );
}
