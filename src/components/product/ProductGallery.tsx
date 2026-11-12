import { useEffect, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../data/types';
import { EASE_OUT } from '../../lib/motion';

interface Props {
  images: Product['images'];
}

export function ProductGallery({ images }: Props) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  useEffect(() => setIndex(0), [images]);

  const go = (direction: number) => setIndex((i) => (i + direction + count) % count);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -48 || info.velocity.x < -420) go(1);
    else if (info.offset.x > 48 || info.velocity.x > 420) go(-1);
  };

  return (
    <div className="flex items-start gap-4 lg:gap-7">
      <ul className="hidden w-[76px] shrink-0 flex-col gap-3 pt-[5%] sm:flex lg:w-[92px] lg:gap-4">
        {images.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Mostra immagine ${i + 1} di ${count}`}
              aria-current={i === index}
              className={`product-stage relative block aspect-[52/72] w-full overflow-hidden border transition-[border-color,opacity] duration-200 ease-out active:opacity-70 ${
                i === index ? 'border-bone' : 'border-line hover:border-ash'
              }`}
            >
              <img src={image.src} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
              {i === index && <span className="pointer-events-none absolute inset-0 border border-bone" />}
            </button>
          </li>
        ))}
      </ul>

      <div className="relative min-w-0 flex-1" role="group" aria-roledescription="carosello" aria-label="Immagini del prodotto">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-6%]"
          style={{
            background:
              'radial-gradient(ellipse 58% 54% at 50% 48%, rgba(135,135,135,0.34), rgba(70,70,70,0.15) 46%, transparent 74%)',
          }}
        />
        <motion.div
          className="relative aspect-[308/326] touch-pan-y"
          drag={count > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          dragSnapToOrigin
          onDragEnd={onDragEnd}
        >
          <AnimatePresence initial={false}>
            <motion.img
              key={images[index].src}
              src={images[index].src}
              alt={images[index].alt}
              draggable={false}
              className="product-shot absolute inset-0 h-full w-full select-none object-contain"
              initial={{ opacity: 0, scale: 1.025, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            />
          </AnimatePresence>
        </motion.div>

        {count > 1 && (
          <>
            <button
              type="button"
              className="icon-btn absolute left-[-6px] top-1/2 -translate-y-1/2 sm:left-0"
              onClick={() => go(-1)}
              aria-label="Immagine precedente"
            >
              <ChevronLeft size={26} strokeWidth={1.2} />
            </button>
            <button
              type="button"
              className="icon-btn absolute right-[-6px] top-1/2 -translate-y-1/2 sm:right-0"
              onClick={() => go(1)}
              aria-label="Immagine successiva"
            >
              <ChevronRight size={26} strokeWidth={1.2} />
            </button>
            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 sm:hidden" aria-hidden="true">
              {images.map((image, i) => (
                <span
                  key={image.src}
                  className={`h-px w-6 transition-colors duration-300 ${i === index ? 'bg-bone' : 'bg-line'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
