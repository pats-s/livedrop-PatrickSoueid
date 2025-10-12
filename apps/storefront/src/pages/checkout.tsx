

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/atoms';
import { OrderSummary } from '../components/molecules';
import { useCartStore } from '../lib/store';
import { placeOrder } from '../lib/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const clearCart = useCartStore((state) => state.clearCart);
  const [isProcessing, setIsProcessing] = useState(false);
  const isPlacingOrder = useRef(false);

  useEffect(() => {
    if (items.length === 0 && !isPlacingOrder.current) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const handlePlaceOrder = async () => {
    isPlacingOrder.current = true;
    setIsProcessing(true);
    
    try {
      console.log('Placing order with items:', items);
      const order = await placeOrder(items);
      console.log('Order created:', order);
      
      clearCart();
      console.log('Cart cleared, navigating to order:', order.orderId);
      
      // Navigate immediately
      navigate(`/order/${order.orderId}`, { replace: true });
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
      setIsProcessing(false);
      isPlacingOrder.current = false;
    }
  };

  if (items.length === 0 && !isPlacingOrder.current) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form (Stub) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <Input label="Full Name" placeholder="John Doe" fullWidth />
                  <Input label="Email" type="email" placeholder="john@example.com" fullWidth />
                  <Input label="Address" placeholder="123 Main St" fullWidth />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" placeholder="New York" fullWidth />
                    <Input label="ZIP Code" placeholder="10001" fullWidth />
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

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.title} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <OrderSummary
                subtotal={subtotal}
                total={subtotal}
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