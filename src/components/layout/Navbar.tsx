import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleCart } from '../../store/slices/cartSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigation = [
    { name: 'SHOP', href: '/shop' },
    { name: 'TOP SELLERS', href: '/top-sellers' },
    { name: 'ABOUT', href: '/about' },
    { name: 'JOURNAL', href: '/journal' },
    { name: 'THEME FEATURES', href: '/theme-features' },
  ];

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  return (
    <nav className="navbar-eco sticky top-0 z-50">
      <div className="container-eco">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-light tracking-widest">
            ECO
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium tracking-wide hover:text-muted-foreground transition-colors ${
                  location.pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:text-muted-foreground transition-colors">
              <Search size={20} />
            </button>
            <button 
              onClick={handleCartClick}
              className="p-2 hover:text-muted-foreground transition-colors relative"
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium tracking-wide hover:text-muted-foreground transition-colors ${
                    location.pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;