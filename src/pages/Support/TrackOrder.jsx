import React, { useState } from 'react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');

  return (
    <div className="container" style={{ padding: '80px 1.5rem', maxWidth: '600px', textAlign: 'center' }}>
      <h1 className="page-title">Track Order</h1>
      <p style={{ marginBottom: '2rem' }}>Enter your order ID to see the current status of your shipment.</p>
      
      <div style={{ background: 'var(--clr-surface-2)', padding: '40px', borderRadius: '24px' }}>
        <input 
          type="text" 
          placeholder="Order ID (e.g. #TZ12345)" 
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '14px', 
            borderRadius: '12px', 
            border: '2px solid var(--clr-border)',
            marginBottom: '1rem',
            textAlign: 'center',
            fontSize: '1.1rem'
          }} 
        />
        <button className="btn btn-primary" style={{ width: '100%' }}>Track My Package</button>
      </div>
      
      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--clr-text-muted)' }}>
        Your order ID can be found in the confirmation email we sent after your purchase.
      </p>
    </div>
  );
}
