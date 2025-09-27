import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff, Lock, ShoppingBag } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping: () => void;
  onLoginSuccess: () => void;
}

const AdminLoginModal = ({
  isOpen,
  onClose,
  onContinueShopping,
  onLoginSuccess
}: AdminLoginModalProps) => {
  const { login, isAuthenticated } = useAdmin();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reset everything each time modal opens
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      setShowLoginForm(false);
      setCredentials({ username: '', password: '' });
      setIsLoading(false);
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(credentials);
      if (success) {
        toast.success('Admin login successful!');
        onLoginSuccess();
        onClose();
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {!showLoginForm ? (
            <>
              <DialogTitle className="text-center text-2xl font-bold">
                Welcome
              </DialogTitle>
              <DialogDescription className="text-center">
                Choose how you'd like to proceed
              </DialogDescription>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setShowLoginForm(false)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle>Admin Login</DialogTitle>
            </div>
          )}
        </DialogHeader>

        {!showLoginForm ? (
          <div className="space-y-4 py-6">
            <Button
              onClick={() => setShowLoginForm(true)}
              className="w-full h-12 text-lg"
            >
              <Lock className="mr-2 h-5 w-5" />
              Sign in as Admin
            </Button>

            <Button
              onClick={onContinueShopping}
              className="w-full h-12 text-lg"
              variant="outline"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </Button>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sign In</CardTitle>
              <CardDescription>
                Access the admin dashboard to manage products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials(prev => ({ ...prev, username: e.target.value }))
                    }
                    placeholder="Enter username"
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials(prev => ({ ...prev, password: e.target.value }))
                      }
                      placeholder="Enter password"
                      required
                      className="pr-10"
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(prev => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginModal;
