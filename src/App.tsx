import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/layout/Layout';
import ShoppingCart from './components/ui/ShoppingCart';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import JournalPage from './pages/JournalPage';
import ThemeFeaturesPage from './pages/ThemeFeaturesPage';
import CheckoutPage from './pages/CheckoutPage';
import UnderTwentyPage from './pages/collections/UnderTwentyPage';
import SeasonalSalePage from './pages/collections/SeasonalSalePage';
import NewArrivalsPage from './pages/collections/NewArrivalsPage';
import FeaturedPage from './pages/collections/FeaturedPage';
import CollectionsPage from './pages/collections/CollectionsPage';
import AdminPage from './pages/AdminPage';
import AdminLoginModal from './components/admin/AdminLoginModal';
import NotFound from "./pages/NotFound";
import { useAdmin } from './hooks/useAdmin';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, isLoading, logout } = useAdmin();
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [userMode, setUserMode] = useState<'shopping' | 'admin' | null>(null);

useEffect(() => {
  console.log("isLoading:", isLoading, "isAuthenticated:", isAuthenticated, "hasPrompted:", hasPrompted);
  if (!isLoading && !hasPrompted) { // removed !isAuthenticated
    console.log("Opening login modal...");
    setShowLoginModal(true);
    setHasPrompted(true);
  }
}, [isLoading, hasPrompted]);


  const handleContinueShopping = () => {
    setUserMode('shopping');
    setShowLoginModal(false);
    navigate('/', { replace: true });
  };

  const handleAdminLoginSuccess = () => {
    setUserMode('admin');
    setShowLoginModal(false);
    navigate('/admin', { replace: true });
  };

  const handleLogout = () => {
    logout();
    setUserMode(null);
    setHasPrompted(false); // reset so we prompt again next time
    setShowLoginModal(true); // open modal right away
    navigate('/', { replace: true });
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="top-sellers" element={<ShopPage />} />
          <Route path="collections/under-20" element={<UnderTwentyPage />} />
          <Route path="collections/seasonal-sale" element={<SeasonalSalePage />} />
          <Route path="collections/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="collections/featured" element={<FeaturedPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="theme-features" element={<ThemeFeaturesPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ShoppingCart />

      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onContinueShopping={handleContinueShopping}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
            v7_fetcherPersist: true,
            v7_normalizeFormMethod: true,
            v7_partialHydration: true,
            v7_skipActionErrorRevalidation: true
          }}>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
