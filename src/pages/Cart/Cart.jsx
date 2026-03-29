import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { getImageUrl } from '../../utils/image';
import './Cart.css';

export default function Cart() {
  const { cartItems, cartTotal, fetchCart, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) fetchCart(); }, [user]);

  if (!user) return (
    <div className="empty-cart">
      <FiShoppingBag size={60} />
      <h2>Please login to view your cart</h2>
      <Button variant="primary" onClick={() => navigate('/login')}>Login</Button>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="empty-cart">
      <FiShoppingBag size={60} />
      <h2>Your cart is empty</h2>
      <p>Add some delicious products!</p>
      <Button variant="primary" onClick={() => navigate('/products')}>Shop Now</Button>
    </div>
  );

  return (
    <div className="cart-page container animate-fadeIn">
      <h1 className="page-title">Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={getImageUrl(item.image)} alt={item.name}
                onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }} className="cart-item-img" />
              <div className="cart-item-info">
                <Link to={`/product/${item.product_id}`} className="cart-item-name">{item.name}</Link>
                <span className="cart-item-unit">{item.unit}</span>
                <span className="cart-item-price">₹{item.price} each</span>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
              </div>
              <span className="cart-item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
              <button className="cart-remove-btn" onClick={() => removeItem(item.id)}><FiTrash2 /></button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Items ({cartItems.length})</span><span>₹{cartTotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Delivery</span><span className="free">FREE</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{cartTotal.toFixed(2)}</span></div>
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
          <Link to="/products" className="continue-shopping">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
