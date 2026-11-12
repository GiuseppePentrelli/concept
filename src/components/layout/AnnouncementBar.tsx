import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PROMO_MESSAGES } from '../../data/site';
import { EASE_OUT } from '../../lib/motion';

export function AnnouncementBar() {
  const [state, setState] = useState({ index: 0, direction: 1 });
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const go = useCallback((direction: number) => {
    setState((prev) => ({
      index: (prev.index + direction + PROMO_MESSAGES.length) % PROMO_MESSAGES.length,
      direction,
    }));
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => go(1), 6000);
    return () => window.clearInterval(id);
  }, [paused, reduced, go, state.index]);

  return (
    <div
      className="promo-bar grain relative z-30"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label="Promozioni"
    >
      <div className="mx-auto flex h-10 max-w-[820px] items-center justify-between px-1 lg:h-[46px]">
        <button type="button" className="icon-btn !h-10 !w-10" onClick={() => go(-1)} aria-label="Messaggio precedente">
          <ChevronLeft size={15} strokeWidth={1.5} />
        </button>
        <div className="relative h-full flex-1 overflow-hidden" aria-live="polite">
          <AnimatePresence initial={false} custom={state.direction} mode="popLayout">
            <motion.p
              key={state.index}
              custom={state.direction}
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-center font-sans text-[8.5px] font-medium uppercase tracking-[0.13em] text-bone/90 sm:text-[11px] sm:tracking-[0.28em]"
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 18 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -18 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              {PROMO_MESSAGES[state.index]}
            </motion.p>
          </AnimatePresence>
        </div>
        <button type="button" className="icon-btn !h-10 !w-10" onClick={() => go(1)} aria-label="Messaggio successivo">
          <ChevronRight size={15} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
