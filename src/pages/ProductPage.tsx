import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getProduct, products } from '../data/products';
import { getCollection } from '../data/collections';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductInfo } from '../components/product/ProductInfo';
import { ProductGrid } from '../components/product/ProductGrid';
import { SectionTitle } from '../components/ui/SectionTitle';
import { NotFoundPage } from './NotFoundPage';

export function ProductPage() {
  const { slug = '' } = useParams();
  const product = getProduct(slug);
  if (!product) return <NotFoundPage />;

  const collection = getCollection(product.collection);
  const related = [
    ...products.filter((p) => p.collection === product.collection && p.id !== product.id),
    ...products.filter((p) => p.collection !== product.collection && p.category === product.category),
  ].slice(0, 3);

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: 'Drop', to: '/drops' },
    { label: `${collection?.number}: ${collection?.title}`, to: `/drops/${collection?.slug}` },
  ];

  return (
    <>
      <div
        className="relative overflow-x-clip"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(40,40,40,0.5), transparent 75%)' }}
      >
        <div className="mx-auto w-full max-w-[1480px] px-5 pb-14 sm:px-8 lg:px-[var(--gutter)] lg:pb-24">
          <nav aria-label="Percorso" className="hidden pt-4 sm:block lg:pt-6">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] tracking-[0.04em] text-bone/70">
              {crumbs.map((crumb) => (
                <li key={crumb.to} className="flex items-center gap-3">
                  <Link to={crumb.to} className="py-1 transition-colors duration-200 hover:text-white">
                    {crumb.label}
                  </Link>
                  <ChevronRight size={12} strokeWidth={1.5} aria-hidden="true" />
                </li>
              ))}
              <li aria-current="page" className="py-1 text-bone">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="mt-2 grid gap-7 sm:mt-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:items-start lg:gap-[5vw]">
            <ProductGallery images={product.images} />
            <div className="sm:px-1 lg:sticky lg:top-[110px] lg:max-w-[560px] lg:pt-[4%]">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>
      </div>

      <section className="shell border-t border-line-soft pb-16 pt-12 md:pb-24 md:pt-16" aria-label="Altri capi">
        <SectionTitle>Completa il concetto</SectionTitle>
        <div className="mt-9 md:mt-14">
          <ProductGrid products={related} trimOdd />
        </div>
      </section>
    </>
  );
}
