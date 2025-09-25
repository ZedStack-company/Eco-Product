import { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-card">
      <div className="product-card-image">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="image-primary w-full h-full object-cover"
        />
      </div>
      
      <div className="text-center">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-price">${product.price}</p>
        
        <button
          onClick={handleAddToCart}
          className="eco-button mt-4 w-full"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ProductCard;