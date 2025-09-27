import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterState {
  category: string | null;
  sortBy: string;
  searchQuery: string;
  priceRange: [number, number];
  inStock: boolean | null;
}

interface ProductFiltersProps {
  categories?: string[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
  showSearch?: boolean;
  showPriceRange?: boolean;
  showStockFilter?: boolean;
  showCategoryFilter?: boolean;  // Add this line
}

const ProductFilters = ({
  categories,
  filters,
  onFiltersChange,
  className,
  showSearch = true,
  showPriceRange = false,
  showStockFilter = false,
  showCategoryFilter = false,  // Add this here
}: ProductFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: null,
      sortBy: 'name',
      searchQuery: '',
      priceRange: [0, 1000],
      inStock: null,
    });
  };

  const hasActiveFilters = 
    filters.category !== null || 
    filters.searchQuery !== '' || 
    filters.inStock !== null;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Category Filter */}
            {showCategoryFilter && (
              <Select 
                value={filters.category || 'all'} 
                onValueChange={(value) => updateFilter('category', value === 'all' ? null : value)}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {(categories ?? []).filter(cat => cat !== 'All').map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}


          {/* Sort */}
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => updateFilter('sortBy', value)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              {/* <SelectItem value="newest">Newest First</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Toggle */}
        {(showPriceRange || showStockFilter) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (showPriceRange || showStockFilter) && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
          {/* Stock Filter */}
          {showStockFilter && (
            <Select 
              value={filters.inStock === null ? 'all' : filters.inStock ? 'true' : 'false'} 
              onValueChange={(value) => updateFilter('inStock', value === 'all' ? null : value === 'true')}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="true">In Stock</SelectItem>
                <SelectItem value="false">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Price Range - You can implement a proper range slider here */}
          {showPriceRange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Price:</span>
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => updateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                className="w-20"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                className="w-20"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;