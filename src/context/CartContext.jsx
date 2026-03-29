import { createContext, useCallback, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get('/cart');
      setCartItems(res.data.data.items || []);
      setCartTotal(res.data.data.total || 0);
    } catch {
      // silently fail if not logged in
    }
  }, []);

  const addToCart = useCallback(async (product_id, quantity = 1) => {
    await api.post('/cart', { product_id, quantity });
    toast.success('Added to cart!');
    fetchCart();
  }, [fetchCart]);

  const updateItem = useCallback(async (item_id, quantity) => {
    await api.put(`/cart/${item_id}`, { quantity });
    fetchCart();
  }, [fetchCart]);

  const removeItem = useCallback(async (item_id) => {
    await api.delete(`/cart/${item_id}`);
    toast.success('Item removed');
    fetchCart();
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    await api.delete('/cart/clear');
    setCartItems([]);
    setCartTotal(0);
  }, []);

  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, itemCount, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
