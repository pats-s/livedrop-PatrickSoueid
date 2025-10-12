import { useState, useEffect } from 'react';
import { SearchBar, FilterBar } from '../components/molecules';
import { ProductGrid } from '../components/organisms';
import { Spinner } from '../components/atoms';
import { listProducts, searchProducts, filterByTag, sortByPrice, getAllTags } from '../lib/api';
import type { Product } from '../lib/api';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load products and tags on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, tagsData] = await Promise.all([
          listProducts(),
          getAllTags(),
        ]);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setTags(tagsData);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    try {
      const results = await searchProducts(query);
      applyFiltersAndSort(results, selectedTag, sortBy);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tag filter
  const handleTagSelect = async (tag: string | null) => {
    setSelectedTag(tag);
    setIsLoading(true);
    try {
      let results: Product[];
      if (tag) {
        results = await filterByTag(tag);
        // Also apply search if active
        if (searchQuery) {
          results = results.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
      } else {
        results = searchQuery ? await searchProducts(searchQuery) : await listProducts();
      }
      applyFiltersAndSort(results, tag, sortBy);
    } catch (error) {
      console.error('Filter failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sort
  const handleSortChange = (sort: 'default' | 'price-asc' | 'price-desc') => {
    setSortBy(sort);
    applyFiltersAndSort(filteredProducts, selectedTag, sort);
  };

  // Apply filters and sorting
  const applyFiltersAndSort = (
    productsList: Product[],
    tag: string | null,
    sort: 'default' | 'price-asc' | 'price-desc'
  ) => {
    let result = [...productsList];

    if (sort !== 'default') {
      result = sortByPrice(result, sort === 'price-asc' ? 'asc' : 'desc');
    }

    setFilteredProducts(result);
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
        {/* Search */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Filters */}
        <FilterBar
          tags={tags}
          selectedTag={selectedTag}
          onSelectTag={handleTagSelect}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Results count */}
        <div className="mt-6 mb-4">
          <p className="text-sm text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </div>
  );
}