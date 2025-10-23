import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { getCustomerOrders } from '../lib/api';
import { Spinner, Badge } from '../components/atoms';

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const customer = useStore((state) => state.customer);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!customer) {
      navigate('/login');
      return;
    }

    loadOrders();
  }, [customer, navigate]);

  const loadOrders = async () => {
    if (!customer) return;

    try {
      const response = await getCustomerOrders(customer.email);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order.orderId}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order {order.orderId}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      order.status === 'DELIVERED' ? 'success' :
                      order.status === 'SHIPPED' ? 'info' :
                      order.status === 'PROCESSING' ? 'warning' :
                      'default'
                    }
                  >
                    {order.status}
                  </Badge>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium">{order.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {order.estimatedDelivery && (
                  <div className="mt-4 text-sm text-gray-600">
                    Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}