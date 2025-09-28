import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import PageSection from '@/components/layout/PageSection';
import { CheckCircle, Printer, Home } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { getOrderBySessionId, OrderDetails } from '@/services/orderService';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order details from URL params
    const urlParams = new URLSearchParams(location.search);
    const sessionId = urlParams.get('session_id');
    
    console.log('PaymentSuccessPage - Session ID:', sessionId);
    
    if (sessionId) {
      // Try to fetch order data with retry logic
      const fetchOrderWithRetry = async (retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
            const order = await getOrderBySessionId(sessionId);
            if (order) {
              setOrderDetails(order);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
          }
          
          // Wait 2 seconds before retry
          if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        
        // If all retries failed, show a message
        setLoading(false);
      };
      
      fetchOrderWithRetry();
    } else {
      console.log('No session ID found in URL');
      setLoading(false);
    }
  }, [location]);

  const handlePrint = () => {
    window.print();
  };

  const handleGoHome = () => {
    navigate('/');
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
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="heading-lg text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-body mb-8">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Order details are being processed and will be available shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleGoHome} size="lg" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>
          </div>
        </PageContainer>
      </PageSection>
    );
  }

  return (
    <PageSection padding="lg">
      <PageContainer maxWidth="2xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="heading-lg text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-body">Thank you for your order. Your payment has been processed successfully.</p>
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
                <p><strong>Status:</strong> <span className="text-green-600 capitalize">{orderDetails.status}</span></p>
              </div>
            </div>
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
          <Button onClick={handlePrint} size="lg" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
          <Button onClick={handleGoHome} size="lg" variant="outline" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
          <p className="text-green-700 text-sm">
            You will receive a confirmation email shortly. Your order will be processed and shipped within 2-3 business days.
          </p>
        </div>
      </PageContainer>
    </PageSection>
  );
};

export default PaymentSuccessPage;
