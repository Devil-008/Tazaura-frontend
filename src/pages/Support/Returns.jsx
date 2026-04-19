import React from 'react';

export default function Returns() {
  return (
    <div className="container" style={{ padding: '80px 1.5rem', maxWidth: '800px', lineHeight: '1.8' }}>
      <h1 className="page-title">Returns & Refunds Policy</h1>
      
      <section style={{ marginBottom: '2rem' }}>
        <h3>1. Returns Policy</h3>
        <p>At Tazaura, we take pride in the quality of our dry fruits. If you receive a product that is damaged or not meeting our quality standards, you can return it within 7 days of delivery.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3>2. Eligibility for Returns</h3>
        <ul>
          <li>The product must be in its original packaging.</li>
          <li>The zipper seal must not be tampered with (except for quality issues discovered after opening).</li>
          <li>Proof of purchase (Order ID) is required.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3>3. Refund Process</h3>
        <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds will be processed to your original payment method within 5-7 business days.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3>4. Contact Us</h3>
        <p>If you have any questions about our returns policy, please contact us at <a href="mailto:care@tazaura.in">care@tazaura.in</a>.</p>
      </section>
    </div>
  );
}
