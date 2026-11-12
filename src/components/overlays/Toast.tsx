import { useEffect, useState } from 'react';
import { useUI } from '../../store/ui';

export function Toast() {
  const { toast } = useUI();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (toast) setMessage(toast);
  }, [toast]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(24px,env(safe-area-inset-bottom))] z-[70] flex justify-center px-5">
      <div
        role="status"
        aria-live="polite"
        data-open={toast !== null}
        className="toast pointer-events-auto border border-line bg-raised px-5 py-3.5 text-center text-[11px] font-normal uppercase tracking-[0.2em] text-bone shadow-[0_18px_50px_rgba(0,0,0,0.6)]"
      >
        {message}
      </div>
    </div>
  );
}
