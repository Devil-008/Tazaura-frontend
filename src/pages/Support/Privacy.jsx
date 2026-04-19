import React from 'react';

export default function Privacy() {
  return (
    <div className="container" style={{ padding: '80px 1.5rem', maxWidth: '800px', lineHeight: '1.8' }}>
      <h1 className="page-title">Privacy Policy</h1>
      
      <p>Last updated: April 2024</p>
      
      <section style={{ marginTop: '2rem' }}>
        <h3>1. Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team. This includes your name, email, shipping address, and phone number.</p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3>2. How We Use Your Information</h3>
        <p>We use your information to process orders, communicate with you about your account, and send you promotional offers if you have opted in. We do not sell your personal data to third parties.</p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3>3. Data Security</h3>
        <p>We implement a variety of security measures to maintain the safety of your personal information. Your payment data is processed through secure gateways like Razorpay and is never stored on our servers.</p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3>4. Contact</h3>
        <p>If you have any questions regarding your privacy, please reach out to us at <a href="mailto:privacy@tazaura.in">privacy@tazaura.in</a>.</p>
      </section>
    </div>
  );
}
