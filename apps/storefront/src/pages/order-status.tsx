/**
 * Order Status Page (FIXED)
 * Location: /apps/storefront/src/pages/order-status.tsx
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Badge, Spinner } from '../components/atoms';
import { getOrderStatus } from '../lib/api';
import { formatDateTime, maskId } from '../lib/format';
import type { OrderStatus } from '../lib/api';

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      console.log('Loading order status for ID:', id); // Debug log
      
      if (!id) {
        console.error('No order ID provided'); // Debug log
        setError('No order ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const orderData = await getOrderStatus(id);
        console.log('Order data received:', orderData); // Debug log
        
        if (!orderData) {
          setError('Order not found');
        } else {
          setOrder(orderData);
        }
      } catch (err) {
        console.error('Error loading order:', err); // Debug log
        setError('Failed to load order status');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to find this order'}</p>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: OrderStatus['status']) => {
    switch (status) {
      case 'Placed':
        return 'info';
      case 'Packed':
        return 'warning';
      case 'Shipped':
        return 'warning';
      case 'Delivered':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Order ID */}
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Order ID</h2>
            <p className="text-lg font-mono font-bold text-gray-900">{order.orderId}</p>
            <p className="text-xs text-gray-500 mt-1">Keep this ID for tracking your order</p>
          </div>

          {/* Status */}
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-2">Current Status</h2>
            <Badge variant={getStatusBadgeVariant(order.status)} size="md">
              {order.status}
            </Badge>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-3">Order Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  order.status === 'Placed' || order.status === 'Packed' || 
                  order.status === 'Shipped' || order.status === 'Delivered'
                    ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">Order Placed</p>
                  <p className="text-sm text-gray-600">{formatDateTime(order.placedAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  order.status === 'Packed' || order.status === 'Shipped' || 
                  order.status === 'Delivered'
                    ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">Order Packed</p>
                  <p className="text-sm text-gray-600">
                    {order.status === 'Placed' ? 'Pending' : 'Complete'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  order.status === 'Shipped' || order.status === 'Delivered'
                    ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">Order Shipped</p>
                  <p className="text-sm text-gray-600">
                    {order.status === 'Placed' || order.status === 'Packed' 
                      ? 'Pending' 
                      : order.carrier && order.trackingNumber
                        ? `${order.carrier}: ${order.trackingNumber}`
                        : 'Complete'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">Delivered</p>
                  <p className="text-sm text-gray-600">
                    {order.status === 'Delivered' 
                      ? 'Complete' 
                      : order.estimatedDelivery
                        ? `Est. ${formatDateTime(order.estimatedDelivery)}`
                        : 'Pending'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200">
            <Link to="/">
              <Button variant="primary" fullWidth>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}