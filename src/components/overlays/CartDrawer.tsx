import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X } from 'lucide-react';
import { useUI } from '../../store/ui';
import { useCart, MAX_QTY, type ResolvedLine } from '../../store/cart';
import { getCollection } from '../../data/collections';
import { FREE_SHIPPING_THRESHOLD } from '../../data/products';
import { formatPrice } from '../../lib/format';
import { useOverlay } from '../../lib/useOverlay';
import { Backdrop } from './Backdrop';
import { QuantityStepper } from '../ui/QuantityStepper';
import { EASE_DRAWER, EASE_OUT } from '../../lib/motion';

function Line({ line, onNavigate }: { line: ResolvedLine; onNavigate: () => void }) {
  const { setQuantity, remove } = useCart();
  const collection = getCollection(line.product.collection);

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className="flex gap-4 border-b border-line-soft py-5"
    >
      <Link
        to={`/prodotto/${line.product.slug}`}
        onClick={onNavigate}
        className="product-stage relative block h-[104px] w-[84px] shrink-0 overflow-hidden border border-line-soft"
        aria-label={line.product.name}
      >
        <img src={line.product.images[0].src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-serif text-[10px] font-medium uppercase tracking-[0.3em] text-bone/70">{collection?.number}:</p>
            <p className="mt-0.5 font-serif text-[15px] font-medium uppercase tracking-[0.16em] text-bone">{collection?.title}</p>
          </div>
          <p className="shrink-0 text-[14px] tabular-nums text-bone">{formatPrice(line.lineTotal)}</p>
        </div>
        <p className="mt-1 text-[12.5px] text-ash">
          {line.product.kind} · Taglia {line.size}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            max={MAX_QTY}
            onChange={(q) => setQuantity(line.productId, line.size, q)}
            label={`Quantità ${line.product.name}`}
          />
          <button
            type="button"
            onClick={() => remove(line.productId, line.size)}
            className="py-2 text-[11px] uppercase tracking-[0.2em] text-ash underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-bone"
            aria-label={`Rimuovi ${line.product.name} taglia ${line.size}`}
          >
            Rimuovi
          </button>
        </div>
      </div>
    </motion.li>
  );
}

export function CartDrawer() {
  const { overlay, close } = useUI();
  const { lines, subtotal, count } = useCart();
  const isOpen = overlay === 'cart';
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [checkout, setCheckout] = useState(false);
  useOverlay(isOpen, close, panelRef);

  useEffect(() => {
    if (!isOpen) setCheckout(false);
  }, [isOpen]);

  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 110 || info.velocity.x > 520) close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClick={close} />
          <motion.aside
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Carrello"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col border-l border-line bg-[#0c0c0c] outline-none"
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%', transition: { duration: 0.28, ease: EASE_DRAWER } }}
            transition={{ duration: 0.5, ease: EASE_DRAWER }}
            drag={reduced ? false : 'x'}
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.7 }}
            onDragEnd={onDragEnd}
          >
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line pl-6 pr-3">
              <h2 className="display text-[19px] tracking-[0.3em]">
                Carrello <span className="ml-1 font-sans text-[12px] tracking-normal text-ash">({count})</span>
              </h2>
              <button type="button" className="icon-btn" onClick={close} aria-label="Chiudi il carrello" data-autofocus>
                <X size={24} strokeWidth={1.3} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <ShoppingBag size={40} strokeWidth={1} className="text-smoke" />
                <p className="display mt-6 text-[21px] tracking-[0.24em]">Il carrello è vuoto</p>
                <p className="mt-3 max-w-[260px] text-[14px] leading-relaxed text-ash">
                  Ogni concetto inizia da una scelta. Scopri il primo drop.
                </p>
                <Link to="/shop" onClick={close} className="btn btn-outline mt-8">
                  Vai allo shop
                </Link>
              </div>
            ) : checkout ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <p className="label text-ash">Checkout dimostrativo</p>
                <p className="display mt-4 text-[22px] leading-snug tracking-[0.2em]">Qui inizierebbe il pagamento</p>
                <p className="mt-4 max-w-[300px] text-[14px] leading-relaxed text-ash">
                  Questo è un prototipo: nessun ordine viene creato e nessun dato viene inviato. Totale simulato{' '}
                  <span className="text-bone">{formatPrice(subtotal)}</span>.
                </p>
                <button type="button" className="btn btn-outline mt-8" onClick={() => setCheckout(false)}>
                  Torna al carrello
                </button>
              </div>
            ) : (
              <>
                <div className="border-b border-line-soft px-6 py-4">
                  <p className="text-[12.5px] text-bone/85" aria-live="polite">
                    {missing > 0 ? (
                      <>
                        Ti mancano <span className="text-white">{formatPrice(missing)}</span> per la spedizione gratuita
                      </>
                    ) : (
                      'Hai sbloccato la spedizione gratuita'
                    )}
                  </p>
                  <div className="mt-2.5 h-px w-full bg-line">
                    <div
                      className="h-px origin-left bg-bone transition-transform duration-500 ease-out"
                      style={{ transform: `scaleX(${progress})` }}
                    />
                  </div>
                </div>

                <ul className="flex-1 overflow-y-auto overscroll-contain px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <Line key={`${line.productId}-${line.size}`} line={line} onNavigate={close} />
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="shrink-0 border-t border-line px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="label text-bone/85">Subtotale</span>
                    <span className="text-[20px] tabular-nums text-bone" aria-live="polite">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] text-ash">Spedizione e imposte calcolate al checkout (demo).</p>
                  <button type="button" className="btn btn-solid mt-5 w-full" onClick={() => setCheckout(true)}>
                    Procedi al checkout
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-3 w-full py-2.5 text-center text-[11px] uppercase tracking-[0.24em] text-ash transition-colors duration-200 hover:text-bone"
                  >
                    Continua lo shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
