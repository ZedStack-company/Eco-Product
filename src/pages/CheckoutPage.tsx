import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PageContainer from '@/components/layout/PageContainer';
import PageSection from '@/components/layout/PageSection';
import FormField from '@/components/forms/FormField';
import FormSection from '@/components/forms/FormSection';
import Grid from '@/components/ui/Grid';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/formatUtils';
import { siteConfig } from '@/config/siteConfig';
import { createStripeCheckoutSession } from '@/services/checkoutService';

interface CheckoutFormData {
  // Contact Information
  name: string;
  email: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, subtotal, clearAllItems } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
  });

  const updateFormData = (field: keyof CheckoutFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateShipping = () => {
    if (subtotal >= siteConfig.store.freeShippingThreshold) return 0;
    return siteConfig.store.shippingRate;
  };

  const calculateTax = () => {
    return subtotal * siteConfig.store.taxRate;
  };

  const calculateTotal = () => {
    return subtotal + calculateShipping() + calculateTax();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const session = await createStripeCheckoutSession({
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        customer_email: formData.email || undefined,
        currency: 'usd',
        success_url: window.location.origin + '/payment-success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: window.location.origin + '/payment-failed?session_id={CHECKOUT_SESSION_ID}',
        metadata: {
          customer_name: formData.name,
          customer_email: formData.email,
        }
      });

      if (session.url) {
        window.location.href = session.url;
      } else {
        // Fallback: redirect via client (should not happen on latest Stripe)
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      return;
    }
  };

  if (items.length === 0) {
    return (
      <PageSection padding="xl">
        <PageContainer maxWidth="md" className="text-center">
          <h1 className="heading-lg mb-6">Your cart is empty</h1>
          <p className="text-body mb-8">
            Add some products to your cart to continue with checkout.
          </p>
          <Button onClick={() => navigate('/shop')} size="lg">
            Continue Shopping
          </Button>
        </PageContainer>
      </PageSection>
    );
  }

  return (
    <PageSection padding="lg">
      <PageContainer maxWidth="2xl">
        <div className="mb-8">
          <h1 className="heading-lg">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Grid cols={1} responsive={{ lg: 2 }} gap="xl" className="items-start">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              {/* Contact Information */}
              <FormSection title="Contact Information">
                <div className="space-y-4">
                  <FormField label="Full Name" required>
                    <Input
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </FormField>

                  <FormField label="Email address" required>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </FormField>
                </div>
              </FormSection>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-4">
              <FormSection title="Order Summary" variant="subtle">
                <div className="space-y-4">
                  {/* Items */}
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                       <img
                         src={item.image_url || '/placeholder.svg'}
                         alt={item.name}
                         className="w-16 h-16 object-cover rounded"
                       />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>
                        {calculateShipping() === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatCurrency(calculateShipping())
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>{formatCurrency(calculateTax())}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg border-t pt-2">
                      <span>Total</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full eco-button" 
                    size="lg"
                    disabled={isProcessing || !formData.name || !formData.email}
                  >
                    {isProcessing ? 'Processing Order...' : 'Complete Order'}
                  </Button>
                </div>
              </FormSection>
            </div>
          </Grid>
        </form>
      </PageContainer>
    </PageSection>
  );
};

export default CheckoutPage;