import React from 'react';

export default function FAQ() {
  const faqs = [
    { q: "How do I ensure the dry fruits stay fresh?", a: "All our products come in premium zipper pouches. Simply reseal the pouch after use and store it in a cool, dry place away from direct sunlight." },
    { q: "How long does delivery take?", a: "We typically ship orders within 24 hours. Depending on your location, delivery takes between 2 to 5 business days." },
    { q: "Do you offer international shipping?", a: "Currently, we only ship within India. We are working on expanding our reach soon!" },
    { q: "Are your products organic?", a: "Our products are 100% natural and sourced from certified farms that follow sustainable practices without harmful preservatives." },
  ];

  return (
    <div className="container" style={{ padding: '80px 1.5rem', maxWidth: '800px' }}>
      <h1 className="page-title">Frequently Asked Questions</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ padding: '24px', background: 'var(--clr-surface-2)', borderRadius: '16px' }}>
            <h4 style={{ color: 'var(--clr-primary)', marginBottom: '10px', fontSize: '1.1rem' }}>{faq.q}</h4>
            <p style={{ opacity: 0.8 }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
