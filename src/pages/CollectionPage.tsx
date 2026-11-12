import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { getCollection, liveCollections } from '../data/collections';
import { productsByCollection } from '../data/products';
import { ProductGrid } from '../components/product/ProductGrid';
import { SectionTitle } from '../components/ui/SectionTitle';
import { NotFoundPage } from './NotFoundPage';
import { EASE_OUT } from '../lib/motion';

export function CollectionPage() {
  const { slug = '' } = useParams();
  const collection = getCollection(slug);
  if (!collection || collection.status !== 'live') return <NotFoundPage />;

  const items = productsByCollection(collection.slug);
  const index = liveCollections.findIndex((c) => c.slug === collection.slug);
  const prev = liveCollections[(index - 1 + liveCollections.length) % liveCollections.length];
  const next = liveCollections[(index + 1) % liveCollections.length];

  return (
    <>
      <section className="shell grid items-center gap-8 pb-14 pt-8 md:grid-cols-[1.05fr_1fr] md:gap-[6vw] md:pb-24 md:pt-14">
        <motion.div
          className="relative mx-auto aspect-[212/197] w-full max-w-[700px] overflow-hidden border border-[#3b3b3b] bg-black"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
        >
          <img
            src={collection.image}
            alt={`Artwork ${collection.number}: ${collection.title}`}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </motion.div>
        <div className="text-center md:text-left">
          <nav aria-label="Percorso" className="mb-6 flex justify-center gap-2.5 text-[12.5px] text-ash md:justify-start">
            <Link to="/" className="link-quiet">
              Home
            </Link>
            <span aria-hidden="true">›</span>
            <Link to="/drops" className="link-quiet">
              Drop
            </Link>
          </nav>
          <p className="eyebrow text-[12px] text-bone/85 md:text-[15px]">{collection.number}:</p>
          <h1 className="display mt-3 overflow-hidden text-[clamp(30px,8.6vw,42px)] tracking-[0.18em] md:text-[clamp(36px,4.2vw,66px)] md:tracking-[0.22em]">
            <motion.span
              className={`block ${collection.spectrum ? 'spectrum' : ''}`}
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.15 }}
            >
              {collection.title}
            </motion.span>
          </h1>
          <span aria-hidden="true" className="mx-auto mt-6 block h-px w-24 bg-bone/80 md:mx-0" />
          <p className="mt-6 font-serif text-[20px] italic text-bone/85 md:text-[24px]">{collection.tagline}</p>
          <p className="mx-auto mt-4 max-w-[500px] text-[15px] leading-[1.7] text-bone/70 md:mx-0 md:text-[16px]">
            {collection.description}
          </p>
        </div>
      </section>

      <section className="shell pb-16 md:pb-24" aria-label={`Capi della collezione ${collection.title}`}>
        <SectionTitle>I capi</SectionTitle>
        <div className="mt-9 md:mt-14">
          <ProductGrid products={items} />
        </div>
      </section>

      <nav aria-label="Altre collezioni" className="border-t border-line">
        <div className="shell grid grid-cols-2">
          <Link to={`/drops/${prev.slug}`} className="group flex flex-col items-start gap-2 border-r border-line py-8 pr-4 md:py-12">
            <span className="label inline-flex items-center gap-3 !text-[10px] text-ash">
              <ArrowLeft size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:-translate-x-1.5" />
              Precedente
            </span>
            <span className="font-serif text-[15px] uppercase tracking-[0.18em] text-bone md:text-[22px]">{prev.title}</span>
          </Link>
          <Link to={`/drops/${next.slug}`} className="group flex flex-col items-end gap-2 py-8 pl-4 text-right md:py-12">
            <span className="label inline-flex items-center gap-3 !text-[10px] text-ash">
              Successiva
              <ArrowRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
            </span>
            <span className="font-serif text-[15px] uppercase tracking-[0.18em] text-bone md:text-[22px]">{next.title}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
