import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Ruler, Shirt, Truck } from 'lucide-react';
import type { Product, Size } from '../../data/types';
import { getCollection } from '../../data/collections';
import { formatPrice } from '../../lib/format';
import { useCart, MAX_QTY } from '../../store/cart';
import { useUI } from '../../store/ui';
import { SizeSelector } from './SizeSelector';
import { QuantityStepper } from '../ui/QuantityStepper';
import { Accordion, type AccordionItem } from './Accordion';
import { SizeGuideModal } from './SizeGuideModal';
import { WishButton } from './WishButton';
import { EASE_OUT } from '../../lib/motion';

const ICONS = { dettagli: Shirt, taglie: Ruler, spedizione: Truck };

const defaultSize = (product: Product): Size =>
  !product.soldOut?.includes('M') ? 'M' : (product.sizes.find((s) => !product.soldOut?.includes(s)) ?? 'M');

export function ProductInfo({ product }: { product: Product }) {
  const collection = getCollection(product.collection);
  const { add } = useCart();
  const { open } = useUI();
  const [size, setSize] = useState<Size>(() => defaultSize(product));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setSize(defaultSize(product));
    setQuantity(1);
    setAdded(false);
  }, [product]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const addToCart = () => {
    if (added) return;
    add(product.id, size, quantity);
    setAdded(true);
    timers.current.push(
      window.setTimeout(() => open('cart'), 520),
      window.setTimeout(() => setAdded(false), 1900),
    );
  };

  const accordionItems: AccordionItem[] = product.details.map((detail) => ({
    id: detail.id,
    title: detail.title,
    icon: ICONS[detail.id],
    content: (
      <>
        <ul className="space-y-1.5">
          {detail.body.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
        {detail.id === 'taglie' && (
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="mt-4 border-b border-bone/60 pb-0.5 text-[12px] uppercase tracking-[0.22em] text-bone transition-colors duration-200 hover:border-white hover:text-white"
          >
            Apri la tabella taglie
          </button>
        )}
      </>
    ),
  }));

  return (
    <div className="flex flex-col">
      <header className="order-1">
        <p className="font-serif text-[11.5px] font-medium uppercase tracking-[0.42em] text-bone/90 sm:text-[14px]">
          {collection?.number}:
        </p>
        <h1
          className={`mt-2 font-serif text-[22px] font-medium uppercase leading-tight tracking-[0.36em] sm:mt-2.5 sm:text-[30px] sm:tracking-[0.46em] text-bone`}
        >
          {collection?.title}
        </h1>
        <p className="mt-2.5 text-[14px] tracking-[0.1em] text-bone/90 sm:mt-3 sm:text-[17px]">{product.kind}</p>
        <p className="mt-4 text-[22px] font-normal tabular-nums tracking-[0.02em] text-bone sm:mt-6 sm:text-[29px]">
          {formatPrice(product.price)}
        </p>
      </header>

      <div className="order-3 mt-6 space-y-0.5 text-[14.5px] leading-[1.55] text-bone/85 sm:order-2 sm:mt-5 sm:text-[15px]">
        {product.description.map((row) => (
          <p key={row}>{row}</p>
        ))}
      </div>

      <div className="order-4 mt-6 sm:order-3 sm:mt-7">
        <SizeSelector
          sizes={product.sizes}
          soldOut={product.soldOut}
          value={size}
          onChange={setSize}
          onOpenGuide={() => setGuideOpen(true)}
        />
      </div>

      <div className="order-2 mt-5 flex items-center gap-3 sm:order-4 sm:mt-8 sm:gap-5">
        <div className="hidden sm:block">
          <QuantityStepper value={quantity} max={MAX_QTY} onChange={setQuantity} />
        </div>
        <button
          type="button"
          onClick={addToCart}
          className="btn btn-solid min-w-0 flex-1 overflow-hidden !px-4 !text-[11px] sm:!text-[12.5px]"
          aria-live="polite"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={added ? 'added' : 'idle'}
              className="inline-flex items-center gap-2.5"
              initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
              transition={{ duration: 0.24, ease: EASE_OUT }}
            >
              {added ? (
                <>
                  <Check size={15} strokeWidth={2} /> Aggiunto
                </>
              ) : (
                'Aggiungi al carrello'
              )}
            </motion.span>
          </AnimatePresence>
        </button>
        <WishButton productId={product.id} size={30} className="shrink-0" />
      </div>

      <div className="order-5 mt-6 flex items-center justify-between sm:hidden">
        <span className="text-[15px] text-bone/90">Quantità</span>
        <QuantityStepper value={quantity} max={MAX_QTY} onChange={setQuantity} size="sm" />
      </div>

      <div className="order-6 mt-8 sm:mt-9">
        <Accordion items={accordionItems} />
      </div>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} selected={size} />
    </div>
  );
}
