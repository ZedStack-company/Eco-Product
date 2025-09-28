import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import PageSection from '@/components/layout/PageSection';
import { XCircle, Home, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { getOrderBySessionId, OrderDetails } from '@/services/orderService';

const PaymentFailedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order details from URL params
    const urlParams = new URLSearchParams(location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      getOrderBySessionId(sessionId).then(order => {
        setOrderDetails(order);
        setLoading(false);
      }).catch(error => {
        console.error('Error fetching order:', error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [location]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetryPayment = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <PageSection padding="xl">
        <PageContainer maxWidth="md" className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </PageContainer>
      </PageSection>
    );
  }

  if (!orderDetails) {
    return (
      <PageSection padding="xl">
        <PageContainer maxWidth="md" className="text-center">
          <h1 className="heading-lg mb-6">Order Not Found</h1>
          <p className="text-body mb-8">We couldn't find your order details.</p>
          <Button onClick={handleGoHome} size="lg">
            Go Home
          </Button>
        </PageContainer>
      </PageSection>
    );
  }

  return (
    <PageSection padding="lg">
      <PageContainer maxWidth="2xl">
        <div className="text-center mb-8">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="heading-lg text-red-600 mb-2">Payment Failed</h1>
          <p className="text-body">Unfortunately, your payment could not be processed at this time.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p><strong>Name:</strong> {orderDetails.customer_name}</p>
                <p><strong>Email:</strong> {orderDetails.customer_email}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Order Information</h3>
                <p><strong>Order ID:</strong> {orderDetails.id}</p>
                <p><strong>Date:</strong> {new Date(orderDetails.created_at).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span className="text-red-600 capitalize">{orderDetails.status}</span></p>
              </div>
            </div>
            {orderDetails.error_message && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  <strong>Error:</strong> {orderDetails.error_message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.unit_amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      Total: {formatCurrency(item.unit_amount * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t-2">
                <h3 className="text-lg font-semibold">Total Amount</h3>
                <h3 className="text-lg font-semibold">{formatCurrency(orderDetails.total)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleRetryPayment} size="lg" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button onClick={handleGoHome} size="lg" variant="outline" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
          <p className="text-blue-700 text-sm">
            If you continue to experience issues, please contact our support team. Your items have been saved and you can complete your purchase at any time.
          </p>
        </div>
      </PageContainer>
    </PageSection>
  );
};

export default PaymentFailedPage;
