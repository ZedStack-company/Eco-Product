import { useState } from 'react';
import { useAppSelector } from '../hooks';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

const CheckoutPage = () => {
  const { items, total } = useAppSelector(state => state.cart);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    nameOnCard: '',
    useShippingAddress: true,
    saveInfo: false,
    emailOffers: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout logic here
    console.log('Processing checkout...', formData);
  };

  const shippingCost = 0; // Free shipping
  const finalTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-eco py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-muted-foreground">beyond-theme-3</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Checkout Form */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Section */}
              <div>
                <h2 className="text-lg font-medium mb-4">Contact</h2>
                <div className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email or mobile phone number"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full"
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-1">Enter an email or phone number</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="emailOffers"
                      checked={formData.emailOffers}
                      onCheckedChange={(checked) => handleInputChange('emailOffers', !!checked)}
                    />
                    <Label htmlFor="emailOffers" className="text-sm">Email me with news and offers</Label>
                  </div>
                </div>
              </div>

              {/* Delivery Section */}
              <div>
                <h2 className="text-lg font-medium mb-4">Delivery</h2>
                <div className="space-y-4">
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="First name (optional)"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="border-destructive"
                        required
                      />
                      <p className="text-sm text-destructive mt-1">Enter a last name</p>
                    </div>
                  </div>

                  <div>
                    <Input
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="border-destructive"
                      required
                    />
                    <p className="text-sm text-destructive mt-1">Enter an address</p>
                  </div>

                  <Input
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Input
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="border-destructive"
                        required
                      />
                      <p className="text-sm text-destructive mt-1">Enter a city</p>
                    </div>
                    <div>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger className="border-destructive">
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-destructive mt-1">Select a state / province</p>
                    </div>
                    <div>
                      <Input
                        placeholder="ZIP code"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="border-destructive"
                        required
                      />
                      <p className="text-sm text-destructive mt-1">Enter a ZIP / postal code</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="saveInfo"
                      checked={formData.saveInfo}
                      onCheckedChange={(checked) => handleInputChange('saveInfo', !!checked)}
                    />
                    <Label htmlFor="saveInfo" className="text-sm">Save this information for next time</Label>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div>
                <h2 className="text-lg font-medium mb-4">Shipping method</h2>
                <div className="bg-muted/30 p-4 rounded border text-center text-sm text-muted-foreground">
                  Enter your shipping address to view available shipping methods.
                </div>
              </div>

              {/* Payment Section */}
              <div>
                <h2 className="text-lg font-medium mb-4">Payment</h2>
                <p className="text-sm text-muted-foreground mb-4">All transactions are secure and encrypted.</p>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-t border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Credit card</span>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">B</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 border border-t-0 rounded-b">
                    <div>
                      <Input
                        placeholder="Card number"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        className="border-destructive"
                        required
                      />
                      <p className="text-sm text-destructive mt-1">Enter a card number</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          placeholder="Expiration date (MM / YY)"
                          value={formData.expirationDate}
                          onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                          className="border-destructive"
                          required
                        />
                        <p className="text-sm text-destructive mt-1">Enter a valid expiration date</p>
                      </div>
                      <div>
                        <Input
                          placeholder="Security code"
                          value={formData.securityCode}
                          onChange={(e) => handleInputChange('securityCode', e.target.value)}
                          className="border-destructive"
                          required
                        />
                        <p className="text-sm text-destructive mt-1">Enter the CVV or security code on your card</p>
                      </div>
                    </div>

                    <div>
                      <Input
                        placeholder="Name on card"
                        value={formData.nameOnCard}
                        onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                        className="border-destructive"
                        required
                      />
                      <p className="text-sm text-destructive mt-1">Enter your name exactly as it's written on your card</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="useShippingAddress"
                        checked={formData.useShippingAddress}
                        onCheckedChange={(checked) => handleInputChange('useShippingAddress', !!checked)}
                      />
                      <Label htmlFor="useShippingAddress" className="text-sm">Use shipping address as billing address</Label>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium">
                Pay now
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground">
              All rights reserved beyond-theme-3
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:pl-8">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <span className="absolute -top-2 -right-2 bg-muted-foreground text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                      </div>
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Gift card" className="flex-1" />
                    <Button variant="outline" className="px-6">Apply</Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-muted-foreground">Enter shipping address</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">USD</div>
                    <div>${finalTotal.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;