import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import toast from 'react-hot-toast';
import './Checkout.css';

const STEPS = ['Address', 'Review', 'Payment'];

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses,    setAddresses]    = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [step,         setStep]         = useState(1); // 1=address, 2=review, 3=payment
  const [orderId,      setOrderId]      = useState(null);
  const [rzData,       setRzData]       = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [showNewAddr,  setShowNewAddr]  = useState(false);
  const [savingAddr,   setSavingAddr]   = useState(false);
  const [newAddr, setNewAddr] = useState({ full_name:'', phone:'', line1:'', line2:'', city:'', state:'', pincode:'' });

  useEffect(() => {
    if (!user) return;
    api.get('/profile').then((r) => {
      const addrs = r.data.data.addresses || [];
      setAddresses(addrs);
      const def = addrs.find((a) => a.is_default);
      if (def) setSelectedAddr(def.id);
      if (addrs.length === 0) setShowNewAddr(true);
    }).catch(() => {});
  }, [user]);

  if (!user) {
    return (
      <div className="checkout-empty">
        <p>Please <button onClick={() => navigate('/login')} className="inline-link">log in</button> to checkout.</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <div className="checkout-empty"><h2>Your cart is empty</h2></div>;
  }

  /* ── Save new address ── */
  const saveNewAddress = async (e) => {
    e.preventDefault();
    setSavingAddr(true);
    try {
      const res = await api.post('/profile/addresses', newAddr);
      const savedId = res.data.data?.address_id;
      const newAddrObj = { ...newAddr, id: savedId, is_default: addresses.length === 0 };
      setAddresses((prev) => [...prev, newAddrObj]);
      setSelectedAddr(savedId);
      setShowNewAddr(false);
      setNewAddr({ full_name:'', phone:'', line1:'', line2:'', city:'', state:'', pincode:'' });
      toast.success('Address saved!');
    } catch {
      toast.error('Failed to save address. Please try again.');
    } finally { setSavingAddr(false); }
  };

  /* ── Place order → create Razorpay order ── */
  const placeOrder = async () => {
    if (!selectedAddr) { toast.error('Please select a delivery address'); return; }
    setLoading(true);
    try {
      const res = await api.post('/orders', { address_id: selectedAddr });
      const oid = res.data.data.order_id;
      setOrderId(oid);
      const rz = await api.post('/payments/create', { order_id: oid });
      setRzData(rz.data.data);
      setStep(3);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  /* ── Open Razorpay popup ── */
  const openRazorpay = () => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK not loaded. Please refresh the page.');
      return;
    }
    const options = {
      key:         rzData.key_id,
      amount:      rzData.amount,
      currency:    rzData.currency,
      name:        'Tazaura',
      description: `Order #${orderId}`,
      image:        '/favicon.svg',
      order_id:    rzData.razorpay_order_id,
      prefill: {
        name:  user?.name  || '',
        email: user?.email || '',
      },
      theme: { color: '#F18421' },
      handler: async (response) => {
        try {
          const verRes = await api.post('/payments/verify', response);
          if (verRes.data.success) {
            await clearCart();
            toast.success('🎉 Payment successful! Your order is confirmed.');
            navigate(`/orders/${orderId}`);
          }
        } catch {
          toast.error('Payment verification failed. Contact support.');
        }
      },
      modal: {
        ondismiss: () => toast('Payment cancelled. You can retry anytime.', { icon: 'ℹ️' }),
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (resp) => {
      toast.error(`Payment failed: ${resp.error.description}`);
    });
    rzp.open();
  };

  const selectedAddrObj = addresses.find((a) => a.id === selectedAddr);
  const subtotal = cartTotal;
  const delivery = 0;

  return (
    <div className="checkout-page container animate-fadeIn">
      {/* Step indicator */}
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`checkout-step${step === i + 1 ? ' active' : step > i + 1 ? ' done' : ''}`}>
            <div className="step-circle">{step > i + 1 ? '✓' : i + 1}</div>
            <span className="step-label">{s}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        {/* ── Left Panel ── */}
        <div className="checkout-main">

          {/* Step 1: Address */}
          {step === 1 && (
            <div className="checkout-section">
              <h2>📍 Delivery Address</h2>

              {addresses.map((addr) => (
                <label key={addr.id} className={`addr-card${selectedAddr === addr.id ? ' selected' : ''}`}>
                  <input type="radio" name="addr" value={addr.id} checked={selectedAddr === addr.id} onChange={() => setSelectedAddr(addr.id)} />
                  <div>
                    <strong>{addr.full_name}</strong> · {addr.phone}
                    <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} – {addr.pincode}</p>
                  </div>
                </label>
              ))}

              {/* Add new address inline */}
              {!showNewAddr && (
                <button className="add-address-btn" onClick={() => setShowNewAddr(true)}>+ Add New Address</button>
              )}

              {showNewAddr && (
                <form className="new-addr-form" onSubmit={saveNewAddress}>
                  <h3>New Address</h3>
                  <div className="addr-grid">
                    <Input label="Full Name"   value={newAddr.full_name} onChange={(e) => setNewAddr({...newAddr, full_name:e.target.value})} required />
                    <Input label="Phone"       value={newAddr.phone}     onChange={(e) => setNewAddr({...newAddr, phone:e.target.value})}     required />
                    <Input label="Address Line 1" value={newAddr.line1} onChange={(e) => setNewAddr({...newAddr, line1:e.target.value})} required style={{ gridColumn:'1/-1' }} />
                    <Input label="Address Line 2 (optional)" value={newAddr.line2} onChange={(e) => setNewAddr({...newAddr, line2:e.target.value})} style={{ gridColumn:'1/-1' }} />
                    <Input label="City"    value={newAddr.city}    onChange={(e) => setNewAddr({...newAddr, city:e.target.value})}    required />
                    <Input label="State"   value={newAddr.state}   onChange={(e) => setNewAddr({...newAddr, state:e.target.value})}   required />
                    <Input label="Pincode" value={newAddr.pincode} onChange={(e) => setNewAddr({...newAddr, pincode:e.target.value})} required />
                  </div>
                  <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem' }}>
                    <Button type="submit" variant="primary" loading={savingAddr}>Save Address</Button>
                    {addresses.length > 0 && (
                      <Button type="button" variant="ghost" onClick={() => setShowNewAddr(false)}>Cancel</Button>
                    )}
                  </div>
                </form>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setStep(2)}
                disabled={!selectedAddr}
                style={{ marginTop:'0.5rem' }}
              >
                Continue to Review →
              </Button>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="checkout-section">
              <h2>📋 Review Your Order</h2>
              <div className="review-address">
                <strong>Delivering to:</strong>
                <p>
                  {selectedAddrObj?.full_name} · {selectedAddrObj?.phone}<br />
                  {selectedAddrObj?.line1}{selectedAddrObj?.line2 ? `, ${selectedAddrObj.line2}` : ''}, {selectedAddrObj?.city}, {selectedAddrObj?.state} – {selectedAddrObj?.pincode}
                </p>
                <button className="change-link" onClick={() => setStep(1)}>Change</button>
              </div>

              <div className="review-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="review-item">
                    <div className="ri-info">
                      <span className="ri-name">{item.name}</span>
                      <span className="ri-unit">{item.unit}</span>
                    </div>
                    <span className="ri-qty">× {item.quantity}</span>
                    <span className="ri-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="review-totals">
                <div className="rt-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="rt-row"><span>Delivery</span><span className="free">FREE</span></div>
                <div className="rt-row rt-total"><span>Total Payable</span><span>₹{subtotal.toFixed(2)}</span></div>
              </div>

              <Button variant="primary" size="lg" fullWidth loading={loading} onClick={placeOrder}>
                Place Order & Pay ₹{subtotal.toFixed(2)}
              </Button>
              <button className="back-btn" onClick={() => setStep(1)}>← Back to Address</button>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && rzData && (
            <div className="checkout-section payment-step">
              <div className="payment-success-icon">🎉</div>
              <h2>Order Placed!</h2>
              <p>Order <strong>#{orderId}</strong> is confirmed. Complete your payment below.</p>
              <div className="payment-amount">₹{subtotal.toFixed(2)}</div>
              <Button variant="primary" size="lg" fullWidth onClick={openRazorpay} style={{ maxWidth:'360px' }}>
                Pay ₹{subtotal.toFixed(2)} via Razorpay
              </Button>
              
              <div style={{ marginTop: '1rem', width: '100%', maxWidth: '360px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--clr-border)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--clr-border)' }} />
              </div>

              <Button 
                variant="secondary" 
                size="lg" 
                fullWidth 
                loading={loading}
                disabled={loading}
                style={{ maxWidth:'360px', marginTop: '1rem', background: '#f5f5f5', color: '#333', border: '1px solid #ddd' }}
                onClick={async () => {
                  setLoading(true);
                  try {
                    await api.post('/payments/cod', { order_id: orderId });
                    await clearCart();
                    toast.success('🎉 Order confirmed with Cash on Delivery!');
                    navigate(`/orders/${orderId}`);
                  } catch (err) {
                    toast.error(err?.response?.data?.message || 'Failed to confirm COD order');
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Cash on Delivery (COD)
              </Button>

              <p className="payment-note" style={{ marginTop: '1.5rem' }}>🔒 All online payments are secured and encrypted via Razorpay</p>
              <div className="payment-methods">
                <span>UPI</span><span>Credit Card</span><span>Debit Card</span><span>Net Banking</span><span>COD</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Order Summary Sidebar ── */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item">
                <span className="ci-name">{item.name} <span className="ci-qty">×{item.quantity}</span></span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="checkout-item"><span>Delivery</span><span className="free">FREE</span></div>
          <div className="checkout-total">
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="trust-badges">
            <span>🔒 Secure</span>
            <span>🚀 Fast Delivery</span>
            <span>✅ Quality assured</span>
          </div>
        </div>
      </div>
    </div>
  );
}
