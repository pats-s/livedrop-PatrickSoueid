import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connectToOrderStream } from '../lib/sse-client';

export default function OrderStatusPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveUpdates, setLiveUpdates] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    setLiveUpdates(true);
    
    const cleanup = connectToOrderStream(
      orderId,
      (data) => {
        console.log('📡 SSE Update:', data);
        // Update order state with new data
        setOrder((prev: any) => ({
          ...prev,
          ...data
        }));
        setLoading(false);
      },
      () => {
        console.log('✅ Order stream completed');
        setLiveUpdates(false);
      },
      (error) => {
        console.error('❌ SSE error:', error);
        setLiveUpdates(false);
        setLoading(false);
      }
    );

    return cleanup;
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-2">Order Status</h1>
        <p className="text-gray-600 mb-8">Order #{order.orderId}</p>

        {liveUpdates && (
          <div className="bg-green-50 border border-green-200 rounded p-3 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-700">Live updates active - no refresh needed!</span>
          </div>
        )}

        {/* Status Timeline */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {statusSteps.map((step, idx) => (
              <div key={step} className="flex-1 text-center">
                <div
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-all duration-500 ${
                    idx <= currentIndex
                      ? 'bg-green-500 text-white scale-110'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {idx <= currentIndex ? '✓' : idx + 1}
                </div>
                <p className="text-sm font-medium">{step}</p>
              </div>
            ))}
          </div>
          <div className="relative h-2 bg-gray-200 rounded">
            <div
              className="absolute h-2 bg-green-500 rounded transition-all duration-1000 ease-in-out"
              style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-lg font-semibold text-green-600">{order.status}</p>
          </div>

          {order.carrier && (
            <div>
              <p className="text-sm text-gray-600">Carrier</p>
              <p className="text-lg font-semibold">{order.carrier}</p>
            </div>
          )}

          {order.trackingNumber && (
            <div>
              <p className="text-sm text-gray-600">Tracking Number</p>
              <p className="text-lg font-semibold">{order.trackingNumber}</p>
            </div>
          )}

          {order.estimatedDelivery && (
            <div>
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="text-lg font-semibold">
                {new Date(order.estimatedDelivery).toLocaleDateString()}
              </p>
            </div>
          )}

          {order.total && (
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
            </div>
          )}

          {order.updatedAt && (
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-sm text-gray-500">
                {new Date(order.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Items */}
        {order.items && order.items.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between py-2">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}