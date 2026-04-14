import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getImageUrl } from '../../utils/image';
import './Landing.css';

const CATEGORIES = [
  { name: 'Nuts',       icon: '🥜', color: '#D4DE95', gradient: 'linear-gradient(135deg,#D4DE95,#BAC095)' },
  { name: 'Dates',      icon: '🌴', color: '#C8A87A', gradient: 'linear-gradient(135deg,#C8A87A,#A0734E)' },
  { name: 'Dry Fruits', icon: '🍇', color: '#9B7FD4', gradient: 'linear-gradient(135deg,#9B7FD4,#6B4FA0)' },
  // { name: 'Oats',       icon: '🌾', color: '#77B89C', gradient: 'linear-gradient(135deg,#77B89C,#3D8065)' },
  // { name: 'Mixes',      icon: '✨', color: '#E8A87C', gradient: 'linear-gradient(135deg,#E8A87C,#C06B3A)' },
];

const TESTIMONIALS = [
  { id: 1, name: 'Ayesha Rahman',  role: 'Fitness Enthusiast', text: 'The quality of the dry fruits is simply unmatched. The almonds are crunchy, and the dates are so fresh! Fast delivery too.', rating: 5 },
  { id: 2, name: 'Rahul Sharma',   role: 'Regular Customer',   text: 'Tazaura has become my go-to for daily oats and mixed nuts. Excellent packaging and premium feel all around. Highly recommended.', rating: 5 },
  { id: 3, name: 'Priya Desai',    role: 'Home Baker',         text: "I use their walnuts and raisins for my baking business. My clients always ask what my secret is. It's Tazaura's fresh produce!", rating: 4 },
];

const FEATURES = [
  { icon: '🌿', title: 'All Natural',      desc: 'No preservatives, no additives. Just pure goodness straight from nature.' },
  { icon: '🚀', title: 'Fast Delivery',    desc: 'Orders shipped within 24 hours, delivered fresh to your doorstep.' },
  { icon: '💎', title: 'Premium Quality',  desc: 'Hand-selected, grade-A produce from the finest farms worldwide.' },
  { icon: '🔒', title: 'Secure Payments',  desc: 'UPI, cards, and net banking — all secured via Razorpay.' },
];

export default function Landing() {
  const [featured,  setFeatured]  = useState([]);
  const [banners,   setBanners]   = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [testIdx,   setTestIdx]   = useState(0);
  const bannerTimer = useRef(null);

  // Fetch featured products
  useEffect(() => {
    api.get('/products', { params: { per_page: 8 } })
      .then((res) => setFeatured(res.data.data.products.filter((p) => p.is_featured)))
      .catch(() => {});
  }, []);

  // Fetch banners
  useEffect(() => {
    api.get('/banners')
      .then((res) => setBanners(res.data.data || []))
      .catch(() => {});
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length < 2) return;
    bannerTimer.current = setInterval(() => {
      setBannerIdx((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(bannerTimer.current);
  }, [banners]);

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setTestIdx((i) => (i + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  const goToBanner = (idx) => {
    clearInterval(bannerTimer.current);
    setBannerIdx(idx);
  };

  return (
    <div className="landing">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg-blob hero__bg-blob--1" />
        <div className="hero__bg-blob hero__bg-blob--2" />
        <div className="hero__bg-blob hero__bg-blob--3" />

        <div className="hero__content">
          <span className="hero__badge animate-pop">🌿 Nature's Best</span>
          <h1 className="hero__title">
            <span className="hero__title-line animate-slideUp" style={{ '--delay': '0.1s' }}>Premium Dry Fruits</span>
            <span className="hero__title-line hero__accent animate-slideUp" style={{ '--delay': '0.2s' }}>& Nuts</span>
          </h1>
          <p className="hero__desc animate-slideUp" style={{ '--delay': '0.3s' }}>
            Hand-picked, naturally dried, packed with goodness. Delivered fresh to your doorstep across India.
          </p>
          <div className="hero__cta animate-slideUp" style={{ '--delay': '0.4s' }}>
            <Link to="/products" className="taz-btn taz-btn--hero-primary">
              Shop Now <span className="btn-arrow">→</span>
            </Link>
            <Link to="/products?category=Oats" className="taz-btn taz-btn--hero-ghost">
              Explore More
            </Link>
          </div>

          <div className="hero__stats animate-slideUp" style={{ '--delay': '0.5s' }}>
            <div className="hero__stat"><strong>20+</strong><span>Products</span></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><strong>100+</strong><span>Happy Customers</span></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><strong>24hr</strong><span>Fast Delivery</span></div>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__circle-ring" />
          <div className="hero__circle-ring hero__circle-ring--2" />
          <div className="hero__emoji-wrap">
            <span className="hero__emoji">🥜</span>
          </div>
          <div className="hero__floating-chip chip--1">🌰 Cashews</div>
          <div className="hero__floating-chip chip--2">🍇 Raisins</div>
          <div className="hero__floating-chip chip--3">🌴 Dates</div>
        </div>
      </section>

      {/* ── Banner Carousel (only if banners exist) ── */}
      {banners.length > 0 && (
        <section className="banner-section">
          <div className="banner-carousel">
            <div className="banner-track" style={{ transform: `translateX(-${bannerIdx * 100}%)` }}>
              {banners.map((b) => (
                <div key={b.id} className="banner-slide">
                  <img src={getImageUrl(b.image_url)} alt={b.title || 'Banner'} className="banner-img" />
                  {(b.title || b.subtitle) && (
                    <div className="banner-overlay">
                      {b.title    && <h2 className="banner-title">{b.title}</h2>}
                      {b.subtitle && <p  className="banner-subtitle">{b.subtitle}</p>}
                      {b.link     && <Link to={b.link} className="taz-btn taz-btn--hero-primary">Shop Now →</Link>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {banners.length > 1 && (
              <>
                <button className="banner-btn prev" onClick={() => goToBanner((bannerIdx - 1 + banners.length) % banners.length)}>❮</button>
                <button className="banner-btn next" onClick={() => goToBanner((bannerIdx + 1) % banners.length)}>❯</button>
                <div className="banner-dots">
                  {banners.map((_, i) => (
                    <button key={i} className={`banner-dot${i === bannerIdx ? ' active' : ''}`} onClick={() => goToBanner(i)} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ── Shop by Category ── */}
      <section className="section section--categories">
        <div className="container">
          <div className="section-label">Browse by type</div>
          <h2 className="section-heading">Shop by <span className="text-accent">Category</span></h2>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="category-card"
                style={{ '--cat-gradient': cat.gradient, '--cat-color': cat.color, '--delay': `${i * 0.08}s` }}
              >
                <div className="category-card__icon-wrap">
                  <span className="category-icon">{cat.icon}</span>
                </div>
                <span className="category-name">{cat.name}</span>
                <span className="category-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      {featured.length > 0 && (
        <section className="section section--featured">
          <div className="container">
            <div className="section-header">
              <div>
                <div className="section-label">Handpicked for you</div>
                <h2 className="section-heading">Featured <span className="text-accent">Products</span></h2>
              </div>
              <Link to="/products" className="view-all-btn">View All <span>→</span></Link>
            </div>
            <div className="featured-grid">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Why Choose Tazaura ── */}
      <section className="features-section">
        <div className="features-section__bg" />
        <div className="container">
          <div className="section-label light">Our Promise</div>
          <h2 className="section-heading text-center" style={{ color: 'var(--clr-accent)' }}>
            Why Choose <span style={{ color: '#fff' }}>Tazaura?</span>
          </h2>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="feature-card" style={{ '--delay': `${i * 0.1}s` }}>
                <div className="feature-icon-wrap">
                  <span className="feature-icon">{f.icon}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials (just above footer) ── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-label center">Real Stories</div>
          <h2 className="section-heading text-center">
            What Our <span className="text-accent">Customers Say</span>
          </h2>
          
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="testimonial-card animate-slideUp">
                <div className="card-avatar">{t.name.charAt(0)}</div>
                <div className="card-content">
                  <div className="card-rating">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                  <p className="card-text">
                    "{t.text}"
                  </p>
                  <span className="card-author">— {t.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonials-footer text-center" style={{ marginTop: '3rem' }}>
             <Link to="" className="view-all-btn">Read All Reviews</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
