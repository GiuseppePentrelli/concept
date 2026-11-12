import { motion } from 'motion/react';
import type { Product } from '../../data/types';
import { ProductCard } from './ProductCard';
import { EASE_OUT } from '../../lib/motion';

export function ProductGrid({ products, trimOdd = false }: { products: Product[]; trimOdd?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3.5 gap-y-9 md:gap-x-7 md:gap-y-14 lg:grid-cols-3">
      {products.map((product, i) => (
        <motion.li
          key={product.id}
          className={trimOdd && products.length % 2 === 1 && i === products.length - 1 ? 'max-lg:hidden' : undefined}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: (i % 3) * 0.07 }}
        >
          <ProductCard product={product} />
        </motion.li>
      ))}
    </ul>
  );
}
