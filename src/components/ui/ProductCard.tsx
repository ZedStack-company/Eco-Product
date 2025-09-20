import { Product } from '../../store/slices/productsSlice';
import { useAppDispatch } from '../../hooks';
import { addToCart } from '../../store/slices/cartSlice';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="product-card">
      <div className="product-card-image">
        <img
          src={product.image}
          alt={product.name}
          className="image-primary w-full h-full object-cover"
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={product.name}
            className="image-secondary w-full h-full object-cover"
          />
        )}
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