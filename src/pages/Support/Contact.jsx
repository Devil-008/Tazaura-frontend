import React from 'react';

export default function Contact() {
  return (
    <div className="container" style={{ padding: '80px 1.5rem', maxWidth: '800px' }}>
      <h1 className="page-title">Contact Us</h1>
      <p style={{ marginBottom: '2rem' }}>We'd love to hear from you. Please fill out the form below or reach us through our contact details.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Get in Touch</h3>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Email:</strong><br />
            <a href="mailto:care@tazaura.in">care@tazaura.in</a>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Phone:</strong><br />
            <a href="tel:+918327347783">+91 8327347783</a>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Address:</strong><br />
            Pukuria, Jhargram, West Bengal, 721514, India
          </div>
        </div>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" placeholder="Your Name" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="email" placeholder="Your Email" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <textarea placeholder="Your Message" rows="4" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}></textarea>
          <button className="btn btn-primary">Send Message</button>
        </form>
      </div>
    </div>
  );
}
