import { useState, useEffect } from 'react';
import { Product, Review } from '@/types/product';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { ReviewService } from '@/services/reviewService';

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
  const [hovered, setHovered] = useState(false);
  const [secondaryLoaded, setSecondaryLoaded] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(5);
  const [reviewCount, setReviewCount] = useState<number>(0);

  const primaryImage = product.images?.[0] || product.image_url || '/placeholder.svg';
  const secondaryImage = product.images?.[1];
  const hasMultipleImages = product.images && product.images.length > 1;

  useEffect(() => {
    if (hasMultipleImages && secondaryImage) {
      const img = new Image();
      img.src = secondaryImage;
      img.onload = () => setSecondaryLoaded(true);
    }
  }, [hasMultipleImages, secondaryImage]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviews: Review[] = await ReviewService.getProductReviews(product.id);
        setReviewCount(reviews.length);
        if (reviews.length > 0) {
          const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
          setAverageRating(Math.round(avg));
        } else {
          setAverageRating(5);
        }
      } catch (error) {
        console.error('Failed to fetch product reviews', error);
        setAverageRating(5);
        setReviewCount(0);
      }
    };
    fetchReviews();
  }, [product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  const renderStars = (rating: number, count: number) => (
    <div className="flex justify-center items-center space-x-1 mt-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
      {count > 0 && (
        <span className="text-xs text-muted-foreground ml-1">
          ({count})
        </span>
      )}
    </div>
  );

  return (<>
      <Card
        className={cn(variantClasses[variant], className)}
        onMouseEnter={() => hasMultipleImages && setHovered(true)}
        onMouseLeave={() => hasMultipleImages && setHovered(false)}
      >
        <CardContent className="p-0">
          <Link to={`/product/${product.id}`}>
          <div className="relative w-full aspect-square overflow-hidden">
            <img
              src={primaryImage}
              alt={product.name}
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
                hovered && hasMultipleImages ? 'opacity-0' : 'opacity-100'
              )}
              loading="lazy"
            />
            {hasMultipleImages && secondaryLoaded && (
              <img
                src={secondaryImage!}
                alt={`${product.name} - alternate`}
                className={cn(
                  'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
                  hovered ? 'opacity-100' : 'opacity-0'
                )}
                loading="lazy"
              />
            )}
            {!product.in_stock && (
              <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-medium">
                Out of Stock
              </div>
            )}
          </div>

          <div className={cn('text-center', variant === 'compact' ? 'p-3' : 'p-4')}>
            <h3 className="product-card-title">{product.name}</h3>
            <p className="product-card-price">${product.price.toFixed(2)}</p>
            {renderStars(averageRating, reviewCount)}
            {variant === 'featured' && product.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {product.description}
              </p>
            )}</div>

          </Link>
            <div>
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
      </>
  );
};

export default ProductCard;
