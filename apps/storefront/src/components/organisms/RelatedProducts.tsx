import { ProductCard } from '../molecules';
import { useStore } from '../../lib/store';
import type { Product } from '../../lib/api';

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

export default function RelatedProducts({ products, title = 'Related Products' }: RelatedProductsProps) {
  const addItem = useStore((state) => state.addToCart);

  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={addItem}
          />
        ))}
      </div>
    </section>
  );
}