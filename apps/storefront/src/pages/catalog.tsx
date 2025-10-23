import { useState, useEffect } from 'react';
import { SearchBar, FilterBar } from '../components/molecules';
import { ProductGrid } from '../components/organisms';
import { Spinner } from '../components/atoms';
import { getProducts, getAllTags } from '../lib/api';
import type { Product } from '../lib/api';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial data
  useEffect(() => {
    loadProducts();
    loadTags();
  }, []);

  // Reload when filters change
  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedTag, sortBy]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getProducts({
        search: searchQuery || undefined,
        tag: selectedTag || undefined,
        sort: sortBy === 'default' ? undefined : 'price',
        order: sortBy === 'price-asc' ? 'asc' : sortBy === 'price-desc' ? 'desc' : undefined,
        limit: 100
      });
      setProducts(response.products);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tagsData = await getAllTags();
      setTags(tagsData);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const handleSortChange = (sort: 'default' | 'price-asc' | 'price-desc') => {
    setSortBy(sort);
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <FilterBar
          tags={tags}
          selectedTag={selectedTag}
          onSelectTag={handleTagSelect}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        <div className="mt-6 mb-4">
          <p className="text-sm text-gray-600">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}