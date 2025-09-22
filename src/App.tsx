import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
          </Routes>
          <ShoppingCart />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
