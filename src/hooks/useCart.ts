import { useAppDispatch, useAppSelector } from './index';
import { 
  addToCart as addToCartAction, 
  removeFromCart, 
  updateQuantity, 
  toggleCart, 
  clearCart 
} from '@/store/slices/cartSlice';
import { Product } from '@/types/product';
import { CartItem } from '@/types/cart';
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    dispatch(addToCartAction(product));
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  }, [dispatch]);

  const removeItem = useCallback((productId: string) => {
    dispatch(removeFromCart(productId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  }, [dispatch]);

  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      dispatch(updateQuantity({ id: productId, quantity }));
    }
  }, [dispatch, removeItem]);

  const openCart = useCallback(() => {
    if (!cart.isOpen) {
      dispatch(toggleCart());
    }
  }, [dispatch, cart.isOpen]);

  const closeCart = useCallback(() => {
    if (cart.isOpen) {
      dispatch(toggleCart());
    }
  }, [dispatch, cart.isOpen]);

  const toggleCartDrawer = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  const clearAllItems = useCallback(() => {
    dispatch(clearCart());
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  }, [dispatch]);

  const getItemQuantity = useCallback((productId: string) => {
    const item = cart.items.find(item => item.id === productId);
    return item?.quantity || 0;
  }, [cart.items]);

  const isItemInCart = useCallback((productId: string) => {
    return cart.items.some(item => item.id === productId);
  }, [cart.items]);

  const getTotalItems = useCallback(() => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart.items]);

  const getCartSubtotal = useCallback(() => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart.items]);

  return {
    items: cart.items,
    isOpen: cart.isOpen,
    total: cart.total,
    itemCount: getTotalItems(),
    subtotal: getCartSubtotal(),
    addToCart,
    removeItem,
    updateItemQuantity,
    openCart,
    closeCart,
    toggleCartDrawer,
    clearAllItems,
    getItemQuantity,
    isItemInCart,
  };
};