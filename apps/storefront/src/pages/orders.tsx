import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/atoms';

export default function OrdersPage() {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/order/${orderId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 mb-6">
            Enter your order ID to check the status of your order.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Order ID"
              placeholder="ORD7X9K2M4"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              fullWidth
            />
            <Button type="submit" variant="primary" fullWidth>
              Track Order
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}