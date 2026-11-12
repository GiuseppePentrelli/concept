import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { categories, products } from '../data/products';
import type { CategoryId } from '../data/types';
import { PageHeader } from '../components/ui/PageHeader';
import { ProductGrid } from '../components/product/ProductGrid';

type Sort = 'featured' | 'price-asc' | 'price-desc';

const SORTS: { id: Sort; label: string }[] = [
  { id: 'featured', label: 'In evidenza' },
  { id: 'price-asc', label: 'Prezzo crescente' },
  { id: 'price-desc', label: 'Prezzo decrescente' },
];

export function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState<Sort>('featured');
  const raw = params.get('cat');
  const active = categories.some((c) => c.id === raw) ? (raw as CategoryId) : null;

  const list = useMemo(() => {
    const filtered = active ? products.filter((p) => p.category === active) : [...products];
    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [active, sort]);

  const select = (id: CategoryId | null) => setParams(id ? { cat: id } : {}, { replace: true, preventScrollReset: true });

  const filters: { id: CategoryId | null; label: string }[] = [{ id: null, label: 'Tutti' }, ...categories];

  return (
    <>
      <PageHeader eyebrow="Concept Drop 00" title="Shop">
        Capi oversize in cotone pesante, stampati con le grafiche dei primi tre concetti.
      </PageHeader>

      <div className="shell pb-20 md:pb-28">
        <div className="mb-8 flex flex-col gap-4 border-y border-line-soft py-2 md:mb-12 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar -mx-[var(--gutter)] flex gap-1 overflow-x-auto px-[var(--gutter)] md:mx-0 md:px-0" role="group" aria-label="Filtra per categoria">
            {filters.map((f) => {
              const selected = f.id === active;
              return (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => select(f.id)}
                  className={`relative shrink-0 px-3.5 py-3 text-[11px] uppercase tracking-[0.26em] transition-colors duration-200 first:pl-0 ${
                    selected ? 'text-bone' : 'text-smoke hover:text-ash'
                  }`}
                >
                  {f.label}
                  <span
                    className="absolute bottom-1.5 left-3.5 right-[calc(0.875rem+0.26em)] h-px origin-left bg-bone transition-transform duration-300 ease-out [button:first-child>&]:left-0"
                    style={{ transform: selected ? 'scaleX(1)' : 'scaleX(0)' }}
                  />
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-smoke">
            Ordina
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 cursor-pointer border border-line bg-ink px-3 text-[12px] normal-case tracking-[0.04em] text-bone"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {list.length > 0 ? (
          <ProductGrid key={`${active}-${sort}`} products={list} />
        ) : (
          <div className="flex flex-col items-center border border-line-soft px-6 py-20 text-center">
            <p className="label text-ash">Prossimamente</p>
            <p className="display mt-4 text-[24px] tracking-[0.22em]">Accessori in arrivo</p>
            <p className="mt-4 max-w-[380px] text-[14.5px] leading-relaxed text-ash">
              Gli accessori CONCEPT arriveranno con i prossimi drop. Iscriviti alla newsletter per sapere quando.
            </p>
            <Link to="/shop" className="btn btn-outline mt-8">
              Vedi tutti i capi
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
