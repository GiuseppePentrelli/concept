interface Props {
  id: 'instagram' | 'tiktok' | 'youtube';
  className?: string;
}

export function SocialIcon({ id, className = 'h-[22px] w-[22px]' }: Props) {
  if (id === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (id === 'tiktok') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M14.2 2h3.1c.3 2.4 1.7 4 4 4.300v3.200c-1.500 0-2.900-.4-4-1.200v7.100a6.100 6.100 0 1 1-6.100-6.100c.3 0 .7 0 1 .1v3.300a2.900 2.900 0 1 0 2 2.700V2Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.200a2.700 2.700 0 0 0-1.900-1.900C18 4.800 12 4.800 12 4.800s-6 0-7.700.5A2.700 2.700 0 0 0 2.400 7.200C2 8.900 2 12 2 12s0 3.100.4 4.800a2.700 2.700 0 0 0 1.900 1.900c1.700.5 7.700.5 7.700.5s6 0 7.700-.5a2.700 2.700 0 0 0 1.900-1.900c.4-1.700.4-4.800.4-4.800s0-3.100-.4-4.800ZM10 15.200V8.800l5.500 3.200L10 15.200Z" />
    </svg>
  );
}
