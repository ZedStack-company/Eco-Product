import { X, Plus, Minus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toggleCart, removeFromCart, updateQuantity } from '../../store/slices/cartSlice';

const ShoppingCart = () => {
  const dispatch = useAppDispatch();
  const { items, isOpen, total } = useAppSelector(state => state.cart);

  const handleClose = () => {
    dispatch(toggleCart());
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemove(id);
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-lg font-medium">Shopping Cart ({items.length})</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:text-muted-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Your cart is empty</p>
                <button
                  onClick={handleClose}
                  className="eco-button mt-4"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.price}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <button className="eco-button w-full mb-2">
                CHECKOUT
              </button>
              <button
                onClick={handleClose}
                className="eco-button-inverse w-full"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;