
interface FilterBarProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  sortBy: 'default' | 'price-asc' | 'price-desc';
  onSortChange: (sort: 'default' | 'price-asc' | 'price-desc') => void;
}

export default function FilterBar({ 
  tags, 
  selectedTag, 
  onSelectTag, 
  sortBy, 
  onSortChange 
}: FilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <button
            onClick={() => onSelectTag(null)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedTag === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}