import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { useUI } from '../../store/ui';
import { searchProducts } from '../../data/products';
import { getCollection, liveCollections } from '../../data/collections';
import { formatPrice } from '../../lib/format';
import { useOverlay } from '../../lib/useOverlay';
import { EASE_OUT } from '../../lib/motion';

const SUGGESTIONS = ['Felpa', 'T-shirt', 'Set You Free', 'Cage'];

export function SearchOverlay() {
  const { overlay, close } = useUI();
  const isOpen = overlay === 'search';
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  useOverlay(isOpen, close, panelRef);

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const results = useMemo(() => searchProducts(query), [query]);
  const hasQuery = query.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Ricerca"
          className="fixed inset-0 z-50 overflow-y-auto bg-ink/[0.97] outline-none backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            className="shell pb-16 pt-5 lg:pt-10"
            initial={{ y: -14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <div className="flex justify-end">
              <button type="button" className="icon-btn -mr-2.5" onClick={close} aria-label="Chiudi la ricerca">
                <X size={26} strokeWidth={1.3} />
              </button>
            </div>

            <div className="mx-auto max-w-[860px]">
              <label htmlFor="search-input" className="label text-ash">
                Cerca nel catalogo
              </label>
              <div className="mt-3 flex items-center gap-4 border-b border-bone/60 pb-3 transition-colors duration-200 focus-within:border-bone">
                <Search size={24} strokeWidth={1.3} className="shrink-0 text-bone/80" />
                <input
                  id="search-input"
                  data-autofocus
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Felpa, concept, collezione…"
                  autoComplete="off"
                  enterKeyHint="search"
                  className="min-w-0 flex-1 bg-transparent font-serif text-[26px] tracking-[0.06em] text-bone placeholder:text-smoke md:text-[38px] [&::-webkit-search-cancel-button]:hidden"
                />
                <kbd className="hidden border border-line px-2 py-1 font-sans text-[10px] tracking-[0.14em] text-ash md:block">
                  ESC
                </kbd>
              </div>

              {!hasQuery && (
                <div className="mt-8">
                  <p className="label !text-[10px] text-smoke">Suggerimenti</p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuery(s)}
                        className="border border-line px-4 py-2.5 text-[12px] uppercase tracking-[0.2em] text-bone/85 transition-[border-color,transform] duration-150 ease-out hover:border-ash active:scale-[0.97]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="label mt-10 !text-[10px] text-smoke">Collezioni</p>
                  <ul className="mt-2">
                    {liveCollections.map((c) => (
                      <li key={c.slug} className="border-b border-line-soft">
                        <Link
                          to={`/drops/${c.slug}`}
                          onClick={close}
                          className="group flex items-center justify-between py-4 font-serif text-[17px] uppercase tracking-[0.2em] text-bone/90 hover:text-white"
                        >
                          <span>
                            <span className="text-ash">{c.number}:</span> {c.title}
                          </span>
                          <ArrowRight
                            size={18}
                            strokeWidth={1.3}
                            className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasQuery && (
                <div className="mt-8" aria-live="polite">
                  <p className="label !text-[10px] text-smoke">
                    {results.length} {results.length === 1 ? 'risultato' : 'risultati'} per «{query.trim()}»
                  </p>
                  {results.length === 0 ? (
                    <p className="mt-6 text-[15px] leading-relaxed text-ash">
                      Nessun capo corrisponde alla ricerca. Prova con «felpa», «t-shirt» o il nome di un concept.
                    </p>
                  ) : (
                    <ul className="mt-3">
                      {results.map((product) => {
                        const collection = getCollection(product.collection);
                        return (
                          <li key={product.id} className="border-b border-line-soft">
                            <Link
                              to={`/prodotto/${product.slug}`}
                              onClick={close}
                              className="group flex items-center gap-5 py-3.5"
                            >
                              <span className="product-stage relative block h-[76px] w-[62px] shrink-0 overflow-hidden border border-line-soft">
                                <img src={product.images[0].src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-serif text-[16px] uppercase tracking-[0.18em] text-bone group-hover:text-white">
                                  {collection?.title}
                                </span>
                                <span className="mt-0.5 block text-[13px] text-ash">
                                  {product.kind} · {collection?.number}
                                </span>
                              </span>
                              <span className="text-[15px] tabular-nums text-bone">{formatPrice(product.price)}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
