import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import './Orders.css';

const STATUS_COLORS = {
  pending:    'warning',
  paid:       'success',
  processing: 'info',
  shipped:    'info',
  delivered:  'success',
  cancelled:  'error',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/orders').then((r) => setOrders(r.data.data)); }, []);

  if (orders.length === 0) return (
    <div className="empty-state" style={{ padding: '4rem', textAlign: 'center' }}>
      <h2>No orders yet</h2>
      <p>Start shopping to see your orders here!</p>
      <Link to="/products" className="taz-btn taz-btn--primary taz-btn--md" style={{ marginTop: '1rem', display: 'inline-flex' }}>
        Shop Now
      </Link>
    </div>
  );

  return (
    <div className="orders-page container animate-fadeIn">
      <h1 className="page-title">My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} className="order-card">
            <div className="order-card__left">
              <span className="order-id">Order #{order.id}</span>
              <span className="order-date">{new Date(order.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</span>
              <span className="order-items">{order.item_count} item{order.item_count !== 1 ? 's' : ''}</span>
            </div>
            <div className="order-card__right">
              <span className={`badge badge-${STATUS_COLORS[order.status] || 'accent'}`}>{order.status}</span>
              <span className="order-total">₹{parseFloat(order.total_price).toFixed(2)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
