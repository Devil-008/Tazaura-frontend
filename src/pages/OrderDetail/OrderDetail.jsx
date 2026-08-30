import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const STATUS_COLORS = { pending:'warning', paid:'success', processing:'info', shipped:'info', delivered:'success', cancelled:'error' };

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { api.get(`/orders/${id}`).then((r) => setOrder(r.data.data)); }, [id]);
  if (!order) return <div className="page-center"><div className="skeleton" style={{ width: 600, height: 300 }} /></div>;

  return (
    <div className="container animate-fadeIn" style={{ padding: '2rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/orders" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>← Back to Orders</Link>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>Order #{order.id}</h1>
        <span className={`badge badge-${STATUS_COLORS[order.status] || 'accent'}`}>{order.status}</span>
      </div>
      <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem' }}>
        {order.items?.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem 1.5rem', borderBottom: '1px solid var(--clr-border)', alignItems: 'center' }}>
            <img src={item.image || '/placeholder.jpg'} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)' }}>{item.unit} × {item.quantity}</div>
            </div>
            <span style={{ fontWeight: 700 }}>₹{(item.unit_price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 'var(--fs-xl)' }}>
          <span>Total</span><span>₹{parseFloat(order.total_price).toFixed(2)}</span>
        </div>
      </div>
      {order.payment && (
        <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem 1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Payment Info</h3>
          {/* order.payment.method === 'COD' ? (
            <>
              <p style={{ color: 'var(--clr-text)', fontWeight: 600, fontSize: 'var(--fs-base)' }}>Cash on Delivery (COD)</p>
              <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-sm)', marginTop: '0.25rem' }}>Payment will be collected upon delivery. (Status: {order.payment.status})</p>
            </>
          ) : */ (
            <>
              <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-sm)' }}>Method: {order.payment.method} | Status: {order.payment.status}</p>
              {order.payment.razorpay_payment_id && (
                <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-sm)' }}>Payment ID: {order.payment.razorpay_payment_id}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
