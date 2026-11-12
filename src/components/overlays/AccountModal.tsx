import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useUI } from '../../store/ui';
import { isValidEmail } from '../../lib/format';
import { useOverlay } from '../../lib/useOverlay';
import { Backdrop } from './Backdrop';
import { LogoMark } from '../ui/Logo';
import { EASE_OUT } from '../../lib/motion';

type Mode = 'login' | 'register';

const field =
  'h-[50px] w-full border border-line bg-transparent px-4 text-[16px] text-bone placeholder:text-smoke transition-colors duration-200 focus:border-bone md:text-[14.5px]';

export function AccountModal() {
  const { overlay, close, user, signIn, signOut, notify } = useUI();
  const isOpen = overlay === 'account';
  const panelRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  useOverlay(isOpen, close, panelRef);

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValidEmail(email)) return setError('Inserisci un indirizzo email valido.');
    if (password.length < 6) return setError('La password deve avere almeno 6 caratteri.');
    signIn(email.trim());
    notify(mode === 'login' ? 'Accesso simulato' : 'Registrazione simulata');
    setError('');
    setPassword('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClick={close} />
          <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4">
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="account-title"
              className="pointer-events-auto relative max-h-[92svh] w-full max-w-[440px] overflow-y-auto border border-line bg-surface px-6 pb-8 pt-10 outline-none sm:px-10"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.16, ease: 'easeOut' } }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
            >
              <button type="button" className="icon-btn absolute right-1.5 top-1.5" onClick={close} aria-label="Chiudi">
                <X size={22} strokeWidth={1.3} />
              </button>

              <div className="flex flex-col items-center text-center">
                <LogoMark className="h-10 w-10 text-bone" />
                <h2 id="account-title" className="display mt-4 text-[23px] tracking-[0.3em]" style={{ marginRight: '-0.3em' }}>
                  {user ? 'Il tuo profilo' : mode === 'login' ? 'Accedi' : 'Registrati'}
                </h2>
              </div>

              {user ? (
                <div className="mt-7 text-center">
                  <p className="text-[14.5px] leading-relaxed text-bone/85">
                    Sessione dimostrativa attiva come
                    <br />
                    <span className="text-white">{user.email}</span>
                  </p>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-ash">
                    Ordini, indirizzi e preferiti saranno disponibili con il vero e-commerce.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline mt-7 w-full"
                    onClick={() => {
                      signOut();
                      notify('Sessione chiusa');
                    }}
                  >
                    Esci
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-7 grid grid-cols-2 border-b border-line" role="tablist" aria-label="Accesso o registrazione">
                    {(['login', 'register'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        role="tab"
                        aria-selected={mode === m}
                        onClick={() => {
                          setMode(m);
                          setError('');
                        }}
                        className={`relative pb-3 text-[11px] uppercase tracking-[0.26em] transition-colors duration-200 ${
                          mode === m ? 'text-bone' : 'text-smoke hover:text-ash'
                        }`}
                      >
                        {m === 'login' ? 'Accedi' : 'Registrati'}
                        <span
                          className="absolute inset-x-0 -bottom-px h-px origin-center bg-bone transition-transform duration-300 ease-out"
                          style={{ transform: mode === m ? 'scaleX(1)' : 'scaleX(0)' }}
                        />
                      </button>
                    ))}
                  </div>

                  <form onSubmit={submit} noValidate className="mt-6 space-y-3.5">
                    <div>
                      <label htmlFor="account-email" className="sr-only">
                        Email
                      </label>
                      <input
                        id="account-email"
                        data-autofocus
                        type="email"
                        autoComplete="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        className={field}
                      />
                    </div>
                    <div>
                      <label htmlFor="account-password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="account-password"
                        type="password"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError('');
                        }}
                        className={field}
                      />
                    </div>
                    <p role="alert" className="min-h-[18px] text-[12.5px] text-[#d98b81]">
                      {error}
                    </p>
                    <button type="submit" className="btn btn-solid w-full">
                      {mode === 'login' ? 'Accedi' : 'Crea account'}
                    </button>
                  </form>

                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => notify('Recupero password non attivo nella demo')}
                      className="mx-auto mt-4 block py-1.5 text-[12.5px] text-ash underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-bone"
                    >
                      Password dimenticata?
                    </button>
                  )}
                  <p className="mt-5 text-center text-[11.5px] leading-relaxed text-smoke">
                    Autenticazione simulata: le credenziali non vengono inviate né salvate.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
