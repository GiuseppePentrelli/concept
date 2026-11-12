import { useId, useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { isValidEmail } from '../../lib/format';

type Status = 'idle' | 'error' | 'success';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const id = useId();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setEmail('');
  };

  return (
    <div id="newsletter" className="scroll-mt-32">
      <h3 className="font-serif text-[15px] font-semibold uppercase tracking-[0.14em] text-bone">Resta aggiornato</h3>
      <p className="mt-3.5 max-w-[300px] text-[14px] leading-[1.55] text-bone/85">
        Iscriviti alla newsletter per non perdere i prossimi drop.
      </p>
      <form onSubmit={submit} noValidate className="mt-5 max-w-[330px]">
        <div
          className={`flex h-[46px] items-center border transition-colors duration-200 focus-within:border-bone ${
            status === 'error' ? 'border-[#c96a5f]' : 'border-bone/70'
          }`}
        >
          <label htmlFor={id} className="sr-only">
            La tua email
          </label>
          <input
            id={id}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== 'idle') setStatus('idle');
            }}
            placeholder="La tua email"
            aria-invalid={status === 'error'}
            aria-describedby={`${id}-msg`}
            className="h-full min-w-0 flex-1 bg-transparent px-4 text-[16px] text-bone placeholder:text-ash md:text-[14px]"
          />
          <button type="submit" className="icon-btn !h-[44px] !w-[48px]" aria-label="Iscriviti alla newsletter">
            <ArrowRight size={18} strokeWidth={1.4} />
          </button>
        </div>
        <p id={`${id}-msg`} role="status" aria-live="polite" className="mt-2.5 min-h-[18px] text-[12.5px] leading-snug">
          {status === 'error' && <span className="text-[#d98b81]">Inserisci un indirizzo email valido.</span>}
          {status === 'success' && (
            <span className="inline-flex items-center gap-2 text-bone/85">
              <Check size={13} strokeWidth={1.8} />
              Iscrizione simulata: nessun dato è stato inviato.
            </span>
          )}
        </p>
      </form>
    </div>
  );
}
