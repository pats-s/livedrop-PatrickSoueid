import { ProductCard } from '../molecules';
import { useStore } from '../../lib/store';
import type { Product } from '../../lib/api';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const addItem = useStore((state) => state.addToCart);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={addItem}
        />
      ))}
    </div>
  );
}