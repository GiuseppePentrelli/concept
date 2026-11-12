import { useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { SocialIcon } from '../ui/SocialIcon';
import { NAV_LINKS, SOCIAL_LINKS } from '../../data/site';
import { useUI } from '../../store/ui';
import { useOverlay } from '../../lib/useOverlay';
import { EASE_DRAWER, EASE_OUT } from '../../lib/motion';

const SECONDARY = [
  { label: 'Lookbook', to: '/lookbook' },
  { label: 'Contatti', to: '/info/contatti' },
];

export function MobileNavigation() {
  const { overlay, close, open, user, notify } = useUI();
  const isOpen = overlay === 'menu';
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useOverlay(isOpen, close, panelRef);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink outline-none lg:hidden"
          initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
          exit={{ opacity: 0, transition: { duration: 0.22, ease: 'easeOut' } }}
          transition={{ duration: 0.6, ease: EASE_DRAWER }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 90% 50% at 80% 0%, rgba(120,120,120,0.16), transparent 70%), radial-gradient(ellipse 80% 40% at 0% 100%, rgba(90,90,90,0.12), transparent 70%)',
            }}
          />
          <div className="relative flex h-[76px] shrink-0 items-center justify-between pl-2 pr-1.5">
            <button type="button" className="icon-btn" onClick={close} aria-label="Chiudi il menu">
              <X size={26} strokeWidth={1.3} />
            </button>
            <Link to="/" onClick={close} className="absolute left-1/2 -translate-x-1/2" aria-label="Homepage">
              <Logo size="md" />
            </Link>
          </div>

          <nav className="relative flex flex-1 flex-col justify-center px-8 py-8" aria-label="Navigazione principale">
            <ul className="space-y-1">
              {NAV_LINKS.map((link, i) => (
                <li key={link.to} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '105%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.75, ease: EASE_OUT, delay: 0.16 + i * 0.07 }}
                  >
                    <Link
                      to={link.to}
                      onClick={close}
                      className="display flex items-baseline gap-5 py-2 text-[44px] tracking-[0.2em] text-bone active:opacity-60"
                    >
                      <span className="font-sans text-[10px] tracking-[0.3em] text-smoke">0{i + 1}</span>
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12"
            >
              <div className="hairline mb-7 opacity-60" />
              <ul className="space-y-4">
                <li>
                  <button type="button" className="label text-bone/80" onClick={() => open('account')}>
                    {user ? 'Il tuo profilo' : 'Accedi / Registrati'}
                  </button>
                </li>
                {SECONDARY.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} onClick={close} className="label text-bone/80">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative flex items-center justify-between px-8 pb-[max(28px,env(safe-area-inset-bottom))]"
          >
            <div className="-ml-2.5 flex">
              {SOCIAL_LINKS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="icon-btn"
                  aria-label={s.label}
                  onClick={() => notify(`${s.label}: profilo non collegato nella demo`)}
                >
                  <SocialIcon id={s.id} />
                </button>
              ))}
            </div>
            <span className="label !text-[9px] text-smoke">Drop 00</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
