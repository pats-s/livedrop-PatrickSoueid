import { Link } from 'react-router-dom';
import { Button, Badge } from '../atoms';
import { formatCurrency, getStockStatus } from '../../lib/format';
import type { Product } from '../../lib/api';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stockQty === 0;
  const isLowStock = product.stockQty > 0 && product.stockQty < 5;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/p/${product.id}`}>
        <div className="aspect-square bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/p/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-1 hover:text-blue-600 line-clamp-2">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          {isLowStock && (
            <Badge variant="warning" size="sm">
              {getStockStatus(product.stockQty)}
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="danger" size="sm">
              Out of Stock
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="default" size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          fullWidth
          disabled={isOutOfStock}
          onClick={() => onAddToCart(product)}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}