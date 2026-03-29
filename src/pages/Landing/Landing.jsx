import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Landing.css';

const CATEGORIES = [
  { name: 'Nuts', icon: '🥜', color: '#D4DE95' },
  { name: 'Dates', icon: '🌴', color: '#BAC095' },
  { name: 'Dry Fruits', icon: '🍇', color: '#636B2F' },
  { name: 'Oats', icon: '🌾', color: '#3D4127' },
  { name: 'Mixes', icon: '✨', color: '#BAC095' },
];

const TESTIMONIALS = [
  { id: 1, name: 'Ayesha Rahman', role: 'Fitness Enthusiast', text: 'The quality of the dry fruits is simply unmatched. The almonds are crunchy, and the dates are so fresh! Fast delivery too.', rating: 5 },
  { id: 2, name: 'Rahul Sharma', role: 'Regular Customer', text: 'Tazaura has become my go-to for daily oats and mixed nuts. Excellent packaging and premium feel all around. Highly recommended.', rating: 5 },
  { id: 3, name: 'Priya Desai', role: 'Home Baker', text: 'I use their walnuts and raisins for my baking business. My clients always ask what my secret is. It\'s Tazaura\'s fresh produce!', rating: 4 },
];

export default function Landing() {
  const [featured, setFeatured] = useState([]);
  const [testIdx, setTestIdx] = useState(0);

  useEffect(() => {
    api.get('/products', { params: { per_page: 8 } }).then((res) =>
      setFeatured(res.data.data.products.filter((p) => p.is_featured))
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestIdx((i) => (i + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero__content animate-fadeIn">
          <span className="hero__badge">🌿 Nature's Best</span>
          <h1 className="hero__title">
            Premium Dry Fruits<br />&amp; <span className="hero__accent">Oats</span>
          </h1>
          <p className="hero__desc">
            Hand-picked, naturally dried, packed with goodness. Delivered fresh to your doorstep.
          </p>
          <div className="hero__cta">
            <Link to="/products" className="taz-btn taz-btn--primary taz-btn--lg">Shop Now</Link>
            <Link to="/products?category=Oats" className="taz-btn taz-btn--ghost taz-btn--lg">Explore Oats</Link>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__circle" />
          <div className="hero__emoji">🥜</div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-heading">Shop by Category</h2>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} className="category-card"
                style={{ '--cat-color': cat.color }}>
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-heading">Featured Products</h2>
              <Link to="/products" className="view-all">View All →</Link>
            </div>
            <div className="featured-grid">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header center">
            <h2 className="section-heading text-center" style={{ margin: '0 auto' }}>What Our Customers Say</h2>
          </div>
          <div className="carousel-container">
            <div className="carousel-track-wrapper">
              <div className="carousel-track" style={{ transform: `translateX(-${testIdx * 100}%)` }}>
                {TESTIMONIALS.map((t) => (
                  <div key={t.id} className="carousel-slide">
                    <div className="testimonial-card">
                      <div className="test-rating">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                      <p className="test-text">"{t.text}"</p>
                      <div className="test-author">
                        <div className="test-avatar">{t.name.charAt(0)}</div>
                        <div className="test-meta">
                          <h4>{t.name}</h4>
                          <span>{t.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <button className="carousel-btn prev" onClick={() => setTestIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}>❮</button>
            <button className="carousel-btn next" onClick={() => setTestIdx(i => (i + 1) % TESTIMONIALS.length)}>❯</button>

            <div className="carousel-dots">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} className={`dot ${i === testIdx ? 'active' : ''}`} onClick={() => setTestIdx(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-heading text-center">Why Choose Tazaura?</h2>
          <div className="features-grid">
            {[
              { icon: '🌿', title: 'All Natural', desc: 'No preservatives, no additives. Just pure goodness.' },
              { icon: '🚀', title: 'Fast Delivery', desc: 'Orders shipped within 24 hours of placement.' },
              { icon: '💎', title: 'Premium Quality', desc: 'Hand-selected, grade-A produce from the finest farms.' },
              { icon: '🔒', title: 'Secure Payments', desc: 'UPI, cards, and net banking — all secured via Razorpay.' },
            ].map((f) => (
              <div key={f.title} className="feature-card animate-fadeIn">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>


        </div>
      </section>
      <div style={{ marginTop: '5rem' }}>
        <h2 className="section-heading text-center">Also Available On</h2>
        <div className="partners-marquee">
          <div className="partners-track">
            {/* We double the logos to create a seamless infinite loop */}
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="partners-group">
                <span className="partner-logo p-amazon">amazon</span>
                <span className="partner-logo p-flipkart">Flipkart</span>
                <span className="partner-logo p-meesho">meesho</span>
                <span className="partner-logo p-blinkit">blinkit</span>
                <span className="partner-logo p-zepto">Zepto</span>
                <span className="partner-logo p-swiggy">Swiggy Instamart</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
