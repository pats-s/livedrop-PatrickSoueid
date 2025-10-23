import { Link } from 'react-router-dom';
import { Button } from '../atoms';
import { CartItem, OrderSummary } from '../molecules';
import { useStore } from '../../lib/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useStore((state) => state.cart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeItem = useStore((state) => state.removeFromCart);
  const subtotal = useStore((state) => state.getTotal());

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 p-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-200 rounded-lg p-1 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button onClick={onClose}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            <OrderSummary
              subtotal={subtotal}
              total={subtotal}
            />
            <Link to="/checkout" onClick={onClose}>
              <Button variant="primary" fullWidth size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}