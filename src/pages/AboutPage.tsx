import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import statue from '../assets/images/hero-statue.webp';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { SectionTitle } from '../components/ui/SectionTitle';

const PRINCIPLES = [
  {
    n: 'I',
    title: 'Il concetto prima del capo',
    body: 'Ogni collezione nasce da un’idea, non da una stagione. Il capo è il supporto: quello che conta è ciò che racconta.',
  },
  {
    n: 'II',
    title: 'Scultura, non decorazione',
    body: 'Statue, anatomie, pietra spezzata. Le grafiche sono costruite come opere e stampate ad alta definizione.',
  },
  {
    n: 'III',
    title: 'Drop, non magazzino',
    body: 'Tirature limitate, numerate per capitolo. Quando un concetto è finito, lascia il posto al successivo.',
  },
];

export function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Più di un brand">
        CONCEPT è un progetto di abbigliamento che tratta ogni collezione come un capitolo: un’idea, un’immagine, pochi
        capi.
      </PageHeader>

      <section className="grain relative overflow-hidden border-y border-line">
        <div className="shell grid items-center gap-8 py-12 md:grid-cols-2 md:gap-[6vw] md:py-0">
          <Reveal className="md:py-24">
            <p className="eyebrow text-[12px] text-bone/80 md:text-[14px]">Manifesto</p>
            <p className="mt-6 font-serif text-[clamp(26px,6.6vw,34px)] font-medium leading-[1.28] text-bone md:text-[clamp(30px,3vw,48px)]">
              Indossiamo ciò che ci ha <em>incrinato</em>. Le crepe non si nascondono: si lasciano attraversare
              dall’acqua.
            </p>
            <p className="mt-7 max-w-[520px] text-[15px] leading-[1.75] text-bone/70 md:text-[16px]">
              Il nome è una dichiarazione: più di un brand, un concetto. Dark, scultoreo, essenziale. Il colore compare
              solo quando ha qualcosa da dire.
            </p>
          </Reveal>
          <div className="relative -mx-[var(--gutter)] aspect-[478/440] md:mx-0 md:-mr-[var(--gutter)]">
            <img
              src={statue}
              alt="Volto di statua classica in pietra crepata"
              loading="lazy"
              className="hero-mask absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="shell py-14 md:py-24">
        <SectionTitle>I principi</SectionTitle>
        <ol className="mt-10 grid gap-px bg-line md:mt-16 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <li key={p.n} className="bg-ink">
              <Reveal delay={i * 0.08} className="h-full px-1 py-8 md:px-9 md:py-10">
                <p className="font-serif text-[30px] italic text-smoke">{p.n}</p>
                <h3 className="mt-5 font-serif text-[19px] font-medium uppercase tracking-[0.18em] text-bone">{p.title}</h3>
                <p className="mt-4 text-[14.5px] leading-[1.7] text-bone/70">{p.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex justify-center md:mt-16">
          <Link to="/drops" className="btn btn-solid">
            Scopri i drops
            <ArrowRight className="btn-arrow h-[18px] w-[18px]" strokeWidth={1.3} />
          </Link>
        </div>
      </section>
    </>
  );
}
