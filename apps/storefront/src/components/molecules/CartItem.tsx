import { Button } from '../atoms';
import { formatCurrency } from '../../lib/format';
import type { CartItem as CartItemType } from '../../lib/store';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  const itemTotal = product.price * quantity;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
        <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
        
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            aria-label="Decrease quantity"
          >
            −
          </Button>
          
          <span className="w-12 text-center font-medium">{quantity}</span>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            disabled={quantity >= product.stockQty}
            aria-label="Increase quantity"
          >
            +
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(product.id)}
            className="ml-auto"
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-gray-900">{formatCurrency(itemTotal)}</p>
      </div>
    </div>
  );
}