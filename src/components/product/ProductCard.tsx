import { Link } from 'react-router-dom';
import type { Product } from '../../data/types';
import { getCollection } from '../../data/collections';
import { formatPrice } from '../../lib/format';
import { WishButton } from './WishButton';

export function ProductCard({ product }: { product: Product }) {
  const collection = getCollection(product.collection);

  return (
    <article className="group relative">
      <Link to={`/prodotto/${product.slug}`} className="block" aria-label={`${product.name}, ${formatPrice(product.price)}`}>
        <div className="product-stage relative aspect-[308/340] overflow-hidden border border-line-soft transition-[border-color] duration-500 ease-out group-hover:border-line">
          <img
            src={product.images[0].src}
            alt={product.images[0].alt}
            loading="lazy"
            decoding="async"
            className="product-shot absolute inset-0 h-full w-full object-contain transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-serif text-[10px] font-medium uppercase tracking-[0.34em] text-bone/75 md:text-[11.5px]">
              {collection?.number}:
            </p>
            <h3
              className={`mt-1 font-serif text-[15px] font-medium uppercase leading-snug tracking-[0.2em] md:text-[19px] ${
                collection?.spectrum ? 'spectrum inline-block' : 'text-bone'
              }`}
            >
              {collection?.title}
            </h3>
            <p className="mt-1 text-[13px] tracking-[0.06em] text-ash md:text-[14px]">{product.kind}</p>
          </div>
          <p className="shrink-0 pt-0.5 text-[14px] tabular-nums text-bone md:text-[16px]">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <WishButton productId={product.id} size={20} className="absolute right-1 top-1" />
    </article>
  );
}
