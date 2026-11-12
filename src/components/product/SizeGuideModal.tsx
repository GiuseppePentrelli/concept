import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { SIZE_CHART } from '../../data/products';
import type { Size } from '../../data/types';
import { useOverlay } from '../../lib/useOverlay';
import { Backdrop } from '../overlays/Backdrop';
import { EASE_OUT } from '../../lib/motion';

interface Props {
  open: boolean;
  onClose: () => void;
  selected: Size;
}

export function SizeGuideModal({ open, onClose, selected }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose, panelRef);

  return (
    <AnimatePresence>
      {open && (
        <>
          <Backdrop onClick={onClose} />
          <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4">
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="size-guide-title"
              className="pointer-events-auto max-h-[88svh] w-full max-w-[560px] overflow-y-auto border border-line bg-surface p-6 outline-none sm:p-9"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.16, ease: 'easeOut' } }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="label text-ash">Fit oversize</p>
                  <h2 id="size-guide-title" className="display mt-2 text-[24px] tracking-[0.24em]">
                    Guida alle taglie
                  </h2>
                </div>
                <button type="button" className="icon-btn -mr-3 -mt-3" onClick={onClose} aria-label="Chiudi" data-autofocus>
                  <X size={22} strokeWidth={1.3} />
                </button>
              </div>

              <table className="mt-7 w-full border-collapse text-left text-[14px]">
                <caption className="sr-only">Misure del capo in centimetri</caption>
                <thead>
                  <tr className="border-b border-line">
                    {['Taglia', 'Torace', 'Lunghezza', 'Manica'].map((h) => (
                      <th key={h} scope="col" className="label pb-3 !text-[10px] font-normal text-ash">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {SIZE_CHART.map((row) => (
                    <tr
                      key={row.size}
                      className={`border-b border-line-soft ${row.size === selected ? 'bg-white/[0.05] text-white' : 'text-bone/85'}`}
                    >
                      <th scope="row" className="py-3 pl-2 font-normal">
                        {row.size}
                        {row.size === selected && <span className="ml-2 text-[11px] text-ash">selezionata</span>}
                      </th>
                      <td className="py-3">{row.chest} cm</td>
                      <td className="py-3">{row.length} cm</td>
                      <td className="py-3">{row.sleeve} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-5 text-[12.5px] leading-relaxed text-ash">
                Misure prese sul capo steso, con tolleranza di ±1,5 cm. Tabella dimostrativa: i valori definitivi verranno
                confermati con la produzione.
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
