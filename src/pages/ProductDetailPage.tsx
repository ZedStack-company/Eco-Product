import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Plus, Minus, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/hooks/useCart';
import { supabaseProductService } from '@/services/supabaseProductService';
import { ReviewService } from '@/services/reviewService';
import { Product, Review } from '@/types/product';
import { toast } from 'sonner';
import ProductGrid from '@/components/ui/ProductGrid';
import PageContainer from '@/components/layout/PageContainer';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    user_name: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Fetch product details
      const products = await supabaseProductService.getAllProducts();
      const foundProduct = products.find(p => p.id === id);
      
      if (!foundProduct) {
        toast.error('Product not found');
        return;
      }
      
      setProduct(foundProduct);
      
      // Fetch reviews
      const productReviews = await ReviewService.getProductReviews(id);
      setReviews(productReviews);
      
      // Fetch related products
      const categoryProducts = await supabaseProductService.getProductsByCategory(foundProduct.category, 8);
      const related = categoryProducts.filter(p => p.id !== id).slice(0, 4);
      setRelatedProducts(related);
      
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || !product.in_stock) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !reviewForm.user_name.trim() || !reviewForm.comment.trim()) {
      toast.error('Please fill in all review fields');
      return;
    }
    
    try {
      const newReview = await ReviewService.addReview({
        product_id: product.id,
        user_name: reviewForm.user_name,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      if (newReview) {
        setReviews(prev => [newReview, ...prev]);
        setReviewForm({ user_name: '', rating: 5, comment: '' });
        toast.success('Review added successfully!');
      }
    } catch (error) {
      toast.error('Failed to add review');
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate?.(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer>
        <div className="text-center py-16 my-20">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <PageContainer className="py-8 my-20">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={product.images?.[selectedImageIndex] || product.image_url || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {product.is_under_20 && (
                <Badge variant="secondary">Under $20</Badge>
              )}
              {product.is_new_arrival && (
                <Badge variant="outline">New Arrival</Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              {renderStars(Math.round(averageRating))}
              <span className="text-sm text-muted-foreground">
                ({reviews.length} reviews)
              </span>
            </div>
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
              >
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              {/* <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Shipping & Returns</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {/* <p>• Free shipping on orders over $75</p> */}
              <p>• Standard delivery: 3-5 business days</p>
              <p>• Express delivery: 1-2 business days</p>
              <p>• 30-day return policy</p>
              <p>• Free returns on all orders</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Featuring Brand</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Eco-friendly and sustainable products</p>
              <p>Handcrafted with care</p>
              <p>Supporting local artisans</p>
              <p>Carbon-neutral shipping</p>
              <p>Recyclable packaging</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {/* Review Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reviewer-name">Your Name</Label>
                  <Input
                    id="reviewer-name"
                    value={reviewForm.user_name}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, user_name: e.target.value }))}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="mt-2">
                    {renderStars(reviewForm.rating, true, (rating) => 
                      setReviewForm(prev => ({ ...prev, rating }))
                    )}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="review-comment">Review</Label>
                <Textarea
                  id="review-comment"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                  required
                />
              </div>
              <Button type="submit">Submit Review</Button>
            </form>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold">{review.user_name}</span>
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </PageContainer>
  );
};

export default ProductDetailPage;