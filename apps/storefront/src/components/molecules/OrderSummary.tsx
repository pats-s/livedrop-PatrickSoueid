import { formatCurrency } from '../../lib/format';

interface OrderSummaryProps {
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
}

export default function OrderSummary({ subtotal, tax = 0, shipping = 0, total }: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      </div>
      
      {tax > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
      )}
      
      {shipping > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">{formatCurrency(shipping)}</span>
        </div>
      )}
      
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-lg text-gray-900">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}