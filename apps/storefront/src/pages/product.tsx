import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Badge, Spinner } from '../components/atoms';
import { RelatedProducts } from '../components/organisms';
import { getProductById, getProducts } from '../lib/api';
import { useStore } from '../lib/store';
import { formatCurrency } from '../lib/format';
import type { Product } from '../lib/api';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Get related products (same category)
        const relatedResponse = await getProducts({
          category: productData.category,
          limit: 4
        });
        setRelatedProducts(relatedResponse.products.filter((p: Product) => p._id !== id));
      } catch (error) {
        console.error('Failed to load product:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isOutOfStock = product.stock === 0;
  const maxQuantity = Math.min(product.stock, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Catalog
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                <Badge
                  variant={product.stock === 0 ? 'danger' : product.stock < 5 ? 'warning' : 'success'}
                >
                  {product.stock === 0 ? 'Out of Stock' : product.stock < 5 ? 'Low Stock' : 'In Stock'}
                </Badge>
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>

              {!isOutOfStock && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>

        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}