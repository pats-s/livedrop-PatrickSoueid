import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/atoms';
import { OrderSummary } from '../components/molecules';
import { useStore } from '../lib/store';
import { createOrder } from '../lib/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const getTotal = useStore((state) => state.getTotal);
  const clearCart = useStore((state) => state.clearCart);
  const customer = useStore((state) => state.customer);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPlacingOrder = useRef(false);


  useEffect(() => {
    if (!customer) {
      navigate('/login');
    }
  }, [customer, navigate]);

  useEffect(() => {
    if (cart.length === 0 && !isPlacingOrder.current) {
      navigate('/cart');
    }
  }, [cart.length, navigate]);

  const handlePlaceOrder = async () => {
    if (!customer) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    setError(null);
    isPlacingOrder.current = true;

    try {
      const orderData = {
        customerId: customer._id,
        customerEmail: customer.email,
        items: cart.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        total: getTotal()
      };

      const response = await createOrder(orderData);
      clearCart();
      navigate(`/orders/${response.order.orderId}`);
    } catch (err) {
      setError('Failed to place order. Please try again.');
      isPlacingOrder.current = false;
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isPlacingOrder.current) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <Input label="Full Name" placeholder={customer?.name || "John Doe"} fullWidth />
                  <Input label="Email" type="email" placeholder={customer?.email || "john@example.com"} fullWidth />
                  <Input label="Address" placeholder="123 Main St" fullWidth />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" placeholder="Beirut" fullWidth />
                    <Input label="ZIP Code" placeholder="1234" fullWidth />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
                  <p className="text-sm">Payment processing is not implemented in this demo.</p>
                  <p className="text-sm mt-2">Click "Place Order" to complete your mock purchase.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <OrderSummary
                subtotal={getTotal()}
                total={getTotal()}
              />
              
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="mt-4"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}