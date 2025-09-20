import { Product } from '../../store/slices/productsSlice';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  className?: string;
}

const ProductGrid = ({ products, className = '' }: ProductGridProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;