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

interface CheckoutFormData {
  // Contact Information
  email: string;
  
  // Delivery Address
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Shipping Method
  shippingMethod: string;
  
  // Payment
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  securityCode: string;
  nameOnCard: string;
  
  // Billing
  billingAddressSame: boolean;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, subtotal, clearAllItems } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    shippingMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    nameOnCard: '',
    billingAddressSame: true,
  });

  const updateFormData = (field: keyof CheckoutFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateShipping = () => {
    if (subtotal >= siteConfig.store.freeShippingThreshold) return 0;
    return formData.shippingMethod === 'express' ? 19.99 : siteConfig.store.shippingRate;
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
    
    // Simulate order processing
    setTimeout(() => {
      clearAllItems();
      setIsProcessing(false);
      navigate('/', { 
        replace: true,
        state: { orderSuccess: true }
      });
    }, 3000);
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
                <FormField label="Email address" required>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </FormField>
              </FormSection>

              {/* Delivery Address */}
              <FormSection title="Delivery Address">
                <div className="space-y-4">
                  <Grid cols={2} gap="md">
                    <FormField label="First name" required>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        placeholder="First name"
                        required
                      />
                    </FormField>
                    <FormField label="Last name" required>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        placeholder="Last name"
                        required
                      />
                    </FormField>
                  </Grid>

                  <FormField label="Address" required>
                    <Input
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      placeholder="Street address"
                      required
                    />
                  </FormField>

                  <FormField label="Apartment, suite, etc. (optional)">
                    <Input
                      value={formData.apartment}
                      onChange={(e) => updateFormData('apartment', e.target.value)}
                      placeholder="Apartment, suite, etc."
                    />
                  </FormField>

                  <Grid cols={1} responsive={{ sm: 3 }} gap="md">
                    <FormField label="City" required>
                      <Input
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        placeholder="City"
                        required
                      />
                    </FormField>
                    <FormField label="State" required>
                      <Select 
                        value={formData.state} 
                        onValueChange={(value) => updateFormData('state', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField label="Postal code" required>
                      <Input
                        value={formData.postalCode}
                        onChange={(e) => updateFormData('postalCode', e.target.value)}
                        placeholder="Postal code"
                        required
                      />
                    </FormField>
                  </Grid>
                </div>
              </FormSection>

              {/* Shipping Method */}
              <FormSection title="Shipping Method">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={(e) => updateFormData('shippingMethod', e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex-1 flex justify-between">
                      <span>Standard Shipping (5-7 business days)</span>
                      <span>{formatCurrency(siteConfig.store.shippingRate)}</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={(e) => updateFormData('shippingMethod', e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex-1 flex justify-between">
                      <span>Express Shipping (2-3 business days)</span>
                      <span>{formatCurrency(19.99)}</span>
                    </div>
                  </label>
                </div>
              </FormSection>

              {/* Payment */}
              <FormSection title="Payment">
                <div className="space-y-4">
                  <FormField label="Card number" required>
                    <Input
                      value={formData.cardNumber}
                      onChange={(e) => updateFormData('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </FormField>

                  <Grid cols={3} gap="md">
                    <FormField label="Expiry date" required>
                      <Input
                        value={formData.expiryDate}
                        onChange={(e) => updateFormData('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        required
                      />
                    </FormField>
                    <FormField label="Security code" required>
                      <Input
                        value={formData.securityCode}
                        onChange={(e) => updateFormData('securityCode', e.target.value)}
                        placeholder="123"
                        required
                      />
                    </FormField>
                    <div></div>
                  </Grid>

                  <FormField label="Name on card" required>
                    <Input
                      value={formData.nameOnCard}
                      onChange={(e) => updateFormData('nameOnCard', e.target.value)}
                      placeholder="Full name as shown on card"
                      required
                    />
                  </FormField>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="billingAddress"
                      checked={formData.billingAddressSame}
                      onCheckedChange={(checked) => updateFormData('billingAddressSame', checked)}
                    />
                    <label htmlFor="billingAddress" className="text-sm">
                      Billing address is the same as delivery address
                    </label>
                  </div>
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
                        src={item.image}
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
                    disabled={isProcessing}
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