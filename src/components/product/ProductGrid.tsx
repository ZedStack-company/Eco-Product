import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import Grid from '@/components/ui/Grid';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  cardVariant?: 'default' | 'compact' | 'featured';
  showQuickView?: boolean;
}

const ProductGrid = ({
  products,
  loading = false,
  onAddToCart,
  onQuickView,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  className,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your filters or search terms",
  emptyAction,
  cardVariant = 'default',
  showQuickView = false,
}: ProductGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        icon={<Package size={48} />}
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      <Grid
        cols={1}
        gap="lg"
        responsive={{
          sm: 2,
          md: 3,
          lg: 4,
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            variant={cardVariant}
            showQuickView={showQuickView}
          />
        ))}
      </Grid>
      
      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button
            onClick={onLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
          >
            {loadingMore ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              'Load More Products'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;