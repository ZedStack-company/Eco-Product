import { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';

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