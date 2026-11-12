import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DROP, collections } from '../data/collections';
import { productsByCollection } from '../data/products';
import { StormBanner } from '../components/home/StormBanner';
import { Reveal } from '../components/ui/Reveal';
import { SectionTitle } from '../components/ui/SectionTitle';

export function DropsPage() {
  return (
    <>
      <StormBanner to="/shop" cta="Acquista il drop" />

      <div className="shell pb-20 pt-12 md:pb-28 md:pt-20">
        <Reveal>
          <SectionTitle as="h1">I concetti del drop</SectionTitle>
          <p className="mx-auto mt-6 max-w-[640px] text-center text-[15px] leading-[1.7] text-bone/75 md:text-[16px]">
            {DROP.description}
          </p>
        </Reveal>

        <ol className="mt-12 space-y-12 md:mt-20 md:space-y-24">
          {collections.map((c, i) => {
            const live = c.status === 'live';
            const count = productsByCollection(c.slug).length;
            return (
              <li key={c.slug}>
                <Reveal>
                  <article
                    className={`grid items-center gap-7 md:grid-cols-2 md:gap-[6vw] ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
                  >
                    <div className="group relative mx-auto aspect-[212/197] w-full max-w-[620px] overflow-hidden border border-[#3b3b3b] bg-black">
                      <img
                        src={c.image}
                        alt={live ? `Artwork ${c.number}: ${c.title}` : ''}
                        loading="lazy"
                        className={`h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none ${
                          live ? '' : 'object-[14%_50%] brightness-[0.55]'
                        }`}
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-smoke">0{i + 1} / 0{collections.length}</p>
                      <p className="eyebrow mt-4 text-[12px] text-bone/85 md:text-[14px]">{c.number}:</p>
                      <h2
                        className={`display mt-2 text-[clamp(26px,7.4vw,34px)] tracking-[0.18em] md:text-[clamp(30px,3.3vw,52px)] ${
                          c.spectrum ? 'spectrum inline-block' : ''
                        }`}
                      >
                        {c.title}
                      </h2>
                      <p className="mt-4 font-serif text-[19px] italic text-bone/85 md:text-[22px]">{c.tagline}</p>
                      <p className="mx-auto mt-4 max-w-[480px] text-[14.5px] leading-[1.7] text-bone/70 md:mx-0 md:text-[15.5px]">
                        {c.description}
                      </p>
                      {live ? (
                        <Link to={`/drops/${c.slug}`} className="btn btn-outline mt-7">
                          Scopri · {count} capi
                          <ArrowRight className="btn-arrow h-[18px] w-[18px]" strokeWidth={1.3} />
                        </Link>
                      ) : (
                        <p className="label mt-7 inline-block border border-line px-6 py-4 text-ash">Prossimamente</p>
                      )}
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
