import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
  showAddToCart?: boolean;
  showQuickView?: boolean;
}

const variantClasses = {
  default: 'group cursor-pointer',
  compact: 'group cursor-pointer',
  featured: 'group cursor-pointer bg-accent/5 border-accent/20',
};

const ProductCard = ({
  product,
  onAddToCart,
  onQuickView,
  className,
  variant = 'default',
  showAddToCart = true,
  showQuickView = false,
}: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <Card className={cn(variantClasses[variant], className)}>
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="product-card-image relative">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="image-primary w-full h-full object-cover"
            loading="lazy"
          />

          {/* Stock Badge */}
          {!product.in_stock && (
            <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-medium">
              Out of Stock
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className={cn(
          'text-center',
          variant === 'compact' ? 'p-3' : 'p-4'
        )}>
          <h3 className="product-card-title">
            {product.name}
          </h3>
          <p className="product-card-price">
            ${product.price.toFixed(2)}
          </p>
          
          {variant === 'featured' && product.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {product.description}
            </p>
          )}
          
          {showAddToCart && variant !== 'compact' && (
            <Button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="eco-button mt-4 w-full text-xs"
              size="sm"
            >
              {product.in_stock ? 'ADD TO CART' : 'OUT OF STOCK'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;