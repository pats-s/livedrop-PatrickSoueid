
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms';
import { CartItem, OrderSummary } from '../components/molecules';
import { useStore } from '../lib/store';

export default function CartPage() {
  const navigate = useNavigate();
  const items = useStore((state) => state.cart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeItem = useStore((state) => state.removeFromCart);
  const subtotal = useStore((state) => state.getTotal());


  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link to="/">
            <Button variant="primary" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <OrderSummary
                subtotal={subtotal}
                total={subtotal}
              />
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="mt-4"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
              <Link to="/">
                <Button variant="ghost" size="md" fullWidth className="mt-2">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}