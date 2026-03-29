import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [step, setStep] = useState(1); // 1=address, 2=payment
  const [orderId, setOrderId] = useState(null);
  const [rzData, setRzData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newAddr, setNewAddr] = useState({ full_name:'', phone:'', line1:'', city:'', state:'', pincode:'' });

  useEffect(() => {
    api.get('/profile').then((r) => {
      setAddresses(r.data.data.addresses || []);
      const def = r.data.data.addresses?.find((a) => a.is_default);
      if (def) setSelectedAddr(def.id);
    });
  }, []);

  const placeOrder = async () => {
    setLoading(true);
    try {
      const res = await api.post('/orders', { address_id: selectedAddr });
      const oid = res.data.data.order_id;
      setOrderId(oid);

      // Create Razorpay order
      const rz = await api.post('/payments/create', { order_id: oid });
      setRzData(rz.data.data);
      setStep(2);
    } finally { setLoading(false); }
  };

  const openRazorpay = () => {
    const options = {
      key: rzData.key_id,
      amount: rzData.amount,
      currency: rzData.currency,
      name: 'Tazaura',
      description: `Order #${orderId}`,
      order_id: rzData.razorpay_order_id,
      handler: async (response) => {
        const verRes = await api.post('/payments/verify', response);
        if (verRes.data.success) {
          clearCart();
          toast.success('Payment successful! 🎉');
          navigate(`/orders/${orderId}`);
        }
      },
      theme: { color: '#636B2F' },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (cartItems.length === 0) {
    return <div className="empty-cart"><h2>Your cart is empty</h2></div>;
  }

  return (
    <div className="checkout-page container animate-fadeIn">
      <h1 className="page-title">Checkout</h1>
      <div className="checkout-layout">
        {/* Left panel */}
        <div className="checkout-main">
          {step === 1 && (
            <div className="checkout-section">
              <h2>Delivery Address</h2>
              {addresses.map((addr) => (
                <label key={addr.id} className={`addr-card${selectedAddr === addr.id ? ' selected' : ''}`}>
                  <input type="radio" name="addr" value={addr.id} checked={selectedAddr === addr.id}
                    onChange={() => setSelectedAddr(addr.id)} />
                  <div>
                    <strong>{addr.full_name}</strong> · {addr.phone}
                    <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} – {addr.pincode}</p>
                  </div>
                </label>
              ))}
              <Button variant="primary" size="lg" loading={loading} onClick={placeOrder} disabled={!selectedAddr}>
                Place Order & Pay
              </Button>
            </div>
          )}

          {step === 2 && rzData && (
            <div className="checkout-section payment-step">
              <h2>Complete Payment</h2>
              <p>Order <strong>#{orderId}</strong> placed. Pay ₹{cartTotal.toFixed(2)} via UPI/Card.</p>
              <Button variant="primary" size="lg" fullWidth onClick={openRazorpay}>
                Pay ₹{cartTotal.toFixed(2)} →
              </Button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item">
              <span className="ci-name">{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout-total">
            <span>Total</span><span>₹{cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
