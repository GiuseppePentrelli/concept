import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Collection } from '../../data/types';

interface Props {
  collection: Collection;
  onNotify?: () => void;
}

export function CollectionCard({ collection, onNotify }: Props) {
  const upcoming = collection.status === 'upcoming';

  const content = (
    <>
      <div className="absolute inset-x-0 top-0 h-[71%] overflow-hidden">
        <img
          src={collection.image}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className={`h-full w-full object-cover transition-[transform,filter] duration-[900ms] ease-out group-hover:scale-[1.045] group-hover:brightness-[1.14] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
            upcoming ? 'object-[14%_50%] brightness-[0.62] contrast-[1.1]' : ''
          }`}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-black" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-[6.2cqw] text-center">
        <p
          className="font-serif text-[clamp(9px,3.5cqw,15px)] font-medium uppercase tracking-[0.38em] text-bone/90"
          style={{ marginRight: '-0.38em' }}
        >
          {collection.number}:
        </p>
        <h3
          className={`mt-[1.6cqw] font-serif text-[clamp(15px,6.3cqw,27px)] font-medium uppercase leading-tight tracking-[0.17em] ${
            collection.spectrum ? 'spectrum' : 'text-bone'
          }`}
          style={{ marginRight: '-0.17em' }}
        >
          {collection.title}
        </h3>
        <span className="mt-[5.2cqw] inline-flex items-center gap-[3.4cqw] font-sans text-[clamp(8.5px,3.05cqw,12.5px)] font-medium uppercase tracking-[0.3em] text-bone">
          {upcoming ? 'Avvisami' : 'Scopri'}
          <ArrowRight
            className="h-[1.3em] w-[1.3em] transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none"
            strokeWidth={1.4}
          />
        </span>
        <span className="mt-[3.6cqw] block h-px w-[34cqw] origin-center bg-gradient-to-r from-transparent via-bone to-transparent transition-transform duration-500 ease-out group-hover:scale-x-[1.35] motion-reduce:transition-none" />
      </div>
    </>
  );

  const className =
    'group @container relative block aspect-[216/279] w-full overflow-hidden border border-[#3b3b3b] bg-black text-left transition-[border-color] duration-500 ease-out hover:border-[#6b6b6b] active:opacity-90';

  if (upcoming) {
    return (
      <button type="button" className={className} onClick={onNotify} aria-label={`${collection.number}: in arrivo. Avvisami`}>
        {content}
      </button>
    );
  }

  return (
    <Link
      to={`/drops/${collection.slug}`}
      className={className}
      aria-label={`${collection.number}: ${collection.title}. Scopri la collezione`}
      draggable={false}
    >
      {content}
    </Link>
  );
}
