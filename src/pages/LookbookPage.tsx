import { Link } from 'react-router-dom';
import { liveCollections } from '../data/collections';
import { productsByCollection } from '../data/products';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';

export function LookbookPage() {
  return (
    <>
      <PageHeader eyebrow="Drop 00" title="Lookbook">
        Le immagini dei primi tre concetti. Gli scatti indossati verranno aggiunti con il servizio fotografico.
      </PageHeader>
      <div className="shell space-y-14 pb-20 md:space-y-24 md:pb-28">
        {liveCollections.map((c) => (
          <Reveal key={c.slug}>
            <section aria-label={`${c.number}: ${c.title}`}>
              <div className="mb-5 flex items-baseline justify-between border-b border-line pb-4">
                <h2 className="font-serif text-[16px] uppercase tracking-[0.2em] text-bone md:text-[22px]">
                  <span className="text-ash">{c.number}:</span> {c.title}
                </h2>
                <Link to={`/drops/${c.slug}`} className="label link-quiet !text-[10px]">
                  Collezione
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-[1.4fr_1fr_1fr] md:gap-5">
                <div className="col-span-2 aspect-[212/197] overflow-hidden border border-line-soft bg-black md:col-span-1 md:aspect-auto">
                  <img src={c.image} alt={`Artwork ${c.title}`} loading="lazy" className="h-full w-full object-cover" />
                </div>
                {productsByCollection(c.slug).map((p) => (
                  <Link
                    key={p.id}
                    to={`/prodotto/${p.slug}`}
                    className="product-stage group relative block aspect-[308/340] overflow-hidden border border-line-soft"
                    aria-label={p.name}
                  >
                    <img
                      src={p.images[0].src}
                      alt={p.images[0].alt}
                      loading="lazy"
                      className="product-shot absolute inset-0 h-full w-full object-contain transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </>
  );
}
