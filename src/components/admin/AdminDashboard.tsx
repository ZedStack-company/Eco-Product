import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { Product } from '@/types/product';
import { ProductFilters } from '@/types/admin';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { currentAdmin, logout } = useAdmin();
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: 'All',
    priceMin: 0,
    priceMax: 1000,
    tags: '',
    isTopSeller: null
  });
  
  const { products, loading, addProduct, updateProduct, deleteProduct, fetchProducts } = useSupabaseProducts(filters);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const handleAddProduct = async (productData: any) => {
    const success = await addProduct(productData);
    if (success) {
      setShowForm(false);
    }
  };

  const handleUpdateProduct = async (productData: any) => {
    if (selectedProduct) {
      const success = await updateProduct(selectedProduct.id, productData);
      if (success) {
        setSelectedProduct(null);
        setShowForm(false);
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(productId);
      if (success) {
        toast.success('Product deleted successfully');
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleFilter = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const handleLogout = () => {
    logout();
    window.location.reload(); // Refresh to show login modal
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {currentAdmin?.username}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    In Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {products.filter(p => p.inStock).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Featured
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {products.filter(p => p.featured).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Top Sellers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {products.filter(p => p.tags?.includes('top-seller')).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Add Product Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Product Management</h2>
              <Button onClick={() => { setSelectedProduct(null); setShowForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Product Form */}
            {showForm && (
              <ProductForm
                product={selectedProduct}
                onSubmit={selectedProduct ? handleUpdateProduct : handleAddProduct}
                onCancel={() => { setShowForm(false); setSelectedProduct(null); }}
              />
            )}

            {/* Products Table */}
            <ProductTable
              products={products}
              loading={loading}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onFilter={handleFilter}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;