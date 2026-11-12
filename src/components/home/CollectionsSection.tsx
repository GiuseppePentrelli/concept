import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { collections } from '../../data/collections';
import { CollectionCard } from './CollectionCard';
import { SectionTitle } from '../ui/SectionTitle';
import { Reveal } from '../ui/Reveal';
import { EASE_OUT } from '../../lib/motion';

export function CollectionsSection() {
  const scroller = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const step = (direction: number) => {
    const el = scroller.current;
    const card = el?.querySelector('li');
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direction * (card.clientWidth + gap), behavior: reduced ? 'auto' : 'smooth' });
  };

  const goToNewsletter = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('newsletter')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  };

  const arrow =
    'icon-btn absolute top-1/2 z-10 hidden -translate-y-1/2 disabled:pointer-events-none disabled:opacity-20 lg:inline-grid';

  return (
    <section aria-labelledby="collezioni-title" className="relative z-10 -mt-1 pb-8 pt-3 md:pb-[2.6vw] md:pt-0">
      <Reveal>
        <div id="collezioni-title">
          <SectionTitle>Le nostre collezioni</SectionTitle>
        </div>
      </Reveal>

      <div className="relative mx-auto mt-6 max-w-[1680px] md:mt-[2.3vw]">
        <button
          type="button"
          className={`${arrow} left-[calc(var(--gutter)/2-22px)]`}
          onClick={() => step(-1)}
          disabled={edges.start}
          aria-label="Collezioni precedenti"
        >
          <ChevronLeft size={26} strokeWidth={1.2} />
        </button>

        <ul
          ref={scroller}
          onScroll={measure}
          className="no-scrollbar flex snap-x snap-mandatory gap-3.5 overflow-x-auto overscroll-x-contain scroll-px-[var(--gutter)] px-[var(--gutter)] md:gap-[2.35vw] lg:mx-[var(--gutter)] lg:scroll-px-0 lg:px-0"
        >
          {collections.map((collection, i) => (
            <motion.li
              key={collection.slug}
              className="w-[70%] shrink-0 snap-start sm:w-[44%] lg:w-[calc((100%-2*2.35vw)/3)]"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: Math.min(i, 2) * 0.08 }}
            >
              <CollectionCard collection={collection} onNotify={goToNewsletter} />
            </motion.li>
          ))}
        </ul>

        <button
          type="button"
          className={`${arrow} right-[calc(var(--gutter)/2-22px)]`}
          onClick={() => step(1)}
          disabled={edges.end}
          aria-label="Collezioni successive"
        >
          <ChevronRight size={26} strokeWidth={1.2} />
        </button>
      </div>
    </section>
  );
}
