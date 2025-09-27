import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { Product } from '@/types/product';
import { ProductFormData, ProductFilters } from '@/types/admin';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import { toast } from 'sonner';
import { LogOut, Plus, Package, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ⬅️ add this

const AdminDashboard = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate(); // ⬅️ hook for navigation
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    priceMin: 0,
    priceMax: 1000,
    tags: '',
    isTopSeller: null
  });

  const { 
    products, 
    loading, 
    error, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    fetchProducts 
  } = useSupabaseProducts(filters);

  const handleAddProduct = async (productData: ProductFormData) => {
    try {
      await addProduct(productData);
      toast.success('Product added successfully!');
      setShowProductForm(false);
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleUpdateProduct = async (productData: ProductFormData) => {
    if (!editingProduct) return;
    
    try {
      await updateProduct(editingProduct.id, productData);
      toast.success('Product updated successfully!');
      setEditingProduct(null);
      setShowProductForm(false);
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        toast.success('Product deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleFilter = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/', { replace: true }); // ⬅️ go directly to Home page
  };

  // Calculate stats
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.in_stock).length;
  const topSellerProducts = products.filter(p => p.average_rating && p.average_rating >= 4).length;
  const averagePrice = products.length > 0 
    ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your products and store</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inStockProducts}</div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Sellers</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{topSellerProducts}</div>
                </CardContent>
              </Card> */}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Product Management */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>
                      Add, edit, and manage your product catalog
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowProductForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="text-red-500 mb-4">
                    Error: {error}
                  </div>
                )}
                
                <ProductTable
                  products={products}
                  loading={loading}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onFilter={handleFilter}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View your store performance and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Analytics dashboard coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ProductForm
              product={editingProduct}
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={() => {
                setShowProductForm(false);
                setEditingProduct(null);
              }}
              isLoading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;