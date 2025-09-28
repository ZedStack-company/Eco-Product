import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from "@/components/ui/use-toast";
import { EmailService } from "@/services/EmailService";

const Footer = () => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const success = await EmailService.subscribe(email);
    setLoading(false);

    if (success) {
      toast({
        title: "Subscribed!",
        description: "You have successfully joined our mailing list 🎉",
      });
      setEmail(""); // clear input
    } else {
      toast({
        title: "Subscription Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };
  return (
    <footer className="bg-eco-forest text-background">
      <div className="container-eco py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 place-items-center ">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <h3 className="text-3xl font-light tracking-widest mb-4">ECO</h3>
            <div className="space-y-4 text-sm text-background/80">
              <p className="font-medium">About the store</p>
              <p>Eco Goods by Goods for Shopify.</p>
              <p>Big thanks to The Forest Body for the product and Blogger featured in this store. Since we purchase this product, head over to their store to check it out.</p>
            </div>
          </div>

          {/* Info Links */}
          <div className="md:col-span-1">
            <h4 className="font-medium mb-4">Info</h4>
            <div className="space-y-2 text-sm text-background/80">
              <Link to="/search" className="block hover:text-background transition-colors">Search</Link>
              <Link to="/journal" className="block hover:text-background transition-colors">Journal</Link>
              <Link to="/about" className="block hover:text-background transition-colors">About</Link>
              <Link to="/theme-features" className="block hover:text-background transition-colors">Theme Features</Link>
              {/* <Link to="/returns" className="block hover:text-background transition-colors">Returns & Refunds</Link> */}
            </div>
          </div>

          {/* Additional Info */}
          {/* <div className="md:col-span-1">
            <div className="space-y-2 text-sm text-background/80">
              <Link to="/shipping" className="block hover:text-background transition-colors">Shipping Info</Link>
              <Link to="/contact" className="block hover:text-background transition-colors">Contact Us</Link>
              <Link to="/privacy" className="block hover:text-background transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="block hover:text-background transition-colors">Terms of Service</Link>
            </div>
          </div> */}

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h4 className="font-medium mb-4">Mailing list</h4>
            <p className="text-sm text-background/80 mb-4">
              Be the first to receive updates on new arrivals, special promos and sales.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-background/30 text-background placeholder:text-background/60 rounded-none flex-1"
                disabled={loading}
              />
              <Button
                className="eco-button-inverse ml-2 rounded-none"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? "..." : "→"}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-background/60">POWERED BY ZedStack</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {/* Payment Icons would go here */}
              <div className="flex space-x-2 text-background/60">
                <span className="text-xs">VISA</span>
                <span className="text-xs">MC</span>
                <span className="text-xs">AMEX</span>
                <span className="text-xs">PP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;