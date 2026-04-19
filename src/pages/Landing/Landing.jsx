import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getImageUrl } from '../../utils/image';
import BannerImg from '../../assets/banner.png';
import './Landing.css';

// Preload banner for top performance
const bannerPreload = new Image();
bannerPreload.src = BannerImg;

const CATEGORIES = [
  { name: 'Nuts', icon: '🥜', count: '12 Products', bg: '#e8f5e0' },
  { name: 'Dates', icon: '🌴', count: '5 Products', bg: '#fde8d8' },
  { name: 'Dry Fruits', icon: '🍇', count: '8 Products', bg: '#f3eafe' },
  { name: 'Cashews', icon: '🌰', count: '6 Products', bg: '#fff8e8' },
  { name: 'Mixed', icon: '🎁', count: '7 Products', bg: '#e8f0fe' },
];

const TESTIMONIALS = [
  { id: 1, name: 'Priya Sharma', loc: 'Mumbai', emoji: '👩', text: 'Tazaura almonds are absolutely fresh and crunchy. I have been ordering for 6 months and the quality never disappoints!', rating: 5 },
  { id: 2, name: 'Rahul Verma', loc: 'Delhi', emoji: '👨', text: 'Best cashews I have ever tasted. The zipper pack keeps them super fresh. Will definitely reorder.', rating: 5 },
  { id: 3, name: 'Anjali Patel', loc: 'Ahmedabad', emoji: '👩‍💼', text: 'The mixed dry fruits pack is incredible value. Perfect for my family snacking and morning routine.', rating: 5 },
  { id: 4, name: 'Mohammed Iqbal', loc: 'Hyderabad', emoji: '👨‍💻', text: 'Dates are soft, sweet and exactly what I needed. Fast delivery and excellent packaging.', rating: 4 },
  { id: 5, name: 'Sneha Reddy', loc: 'Bangalore', emoji: '🧑', text: 'Love the freshness! The raisins are plump and juicy — definitely not the shriveled ones in stores.', rating: 5 },
  { id: 6, name: 'Arjun Nair', loc: 'Chennai', emoji: '👦', text: 'Quality is unmatched. Ordered the walnuts and pistachios — both are top class.', rating: 5 },
];

const FEATURES = [
  { icon: '🌿', title: '100% Natural', desc: 'No artificial colors, flavors or additives. Just pure nature.' },
  { icon: '🚫', title: 'No Preservatives', desc: 'Free from harmful chemicals. Safe for your entire family.' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Express delivery in 24–72 hours. Fresh to your doorstep.' },
  { icon: '⭐', title: 'Premium Quality', desc: 'Sourced from certified farms with strict quality checks.' },
  { icon: '🔒', title: 'Zipper Freshness', desc: 'Special zipper pouches for extra freshness and resealability.' },

];

export default function Landing() {
  const [featured, setFeatured] = useState([]);
  const [banners, setBanners] = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [couponCopied, setCouponCopied] = useState(false);
  const [emailVal, setEmailVal] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const bannerTimer = useRef(null);
  const navigate = useNavigate();

  // Fetch featured products
  useEffect(() => {
    api.get('/products', { params: { per_page: 8 } })
      .then((res) => setFeatured(res.data.data.products.filter((p) => p.is_featured)))
      .catch(() => { });
  }, []);

  // Fetch banners
  useEffect(() => {
    api.get('/banners')
      .then((res) => setBanners(res.data.data || []))
      .catch(() => { });
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length < 2) return;
    bannerTimer.current = setInterval(() => {
      setBannerIdx((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(bannerTimer.current);
  }, [banners]);

  const goToBanner = (idx) => {
    clearInterval(bannerTimer.current);
    setBannerIdx(idx);
  };

  // Intersection Observer for fade-in
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in:not(.visible)').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });

  const copyCoupon = () => {
    navigator.clipboard?.writeText('DRY20').catch(() => { });
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2000);
  };

  const subscribeEmail = () => {
    if (!emailVal.trim() || !emailVal.includes('@')) {
      setEmailMsg('⚠️ Please enter a valid email.');
      return;
    }
    setEmailMsg('🎉 You\'re subscribed! Check your inbox for a welcome discount.');
    setEmailVal('');
  };

  return (
    <div className="landing">

      {/* ── Top Banner ── */}
      <section className="landing-banner-wrap" style={{ cursor: 'pointer' }} id="home" onClick={() => navigate('/products')}>
        <div className="landing-banner-img-box" >
          <img src={BannerImg} alt="Tazaura Banner" className="landing-banner-img" />
          <div className="landing-banner-overlay">
          </div>
        </div>
      </section>

      {/* ── Coupon ── */}
      {/* <div className="coupon-section">
        <div className="coupon-inner">
          <p className="coupon-text">🎉 Limited Time Offer — <strong>Get 20% OFF</strong> on your first order!</p>
          <div className="coupon-code">DRY20</div>
          <button className={`copy-btn${couponCopied ? ' copied' : ''}`} onClick={copyCoupon}>
            {couponCopied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>
      </div> */}

      {/* ── Marquee ── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          <div className="marquee-item">Premium Almonds</div>
          <div className="marquee-item">Golden Raisins</div>
          <div className="marquee-item">Cashew Royale</div>
          <div className="marquee-item">Medjool Dates</div>
          <div className="marquee-item">Freshness Guaranteed</div>
          <div className="marquee-item">Handpicked Quality</div>
          <div className="marquee-item">Premium Almonds</div>
          <div className="marquee-item">Golden Raisins</div>
          <div className="marquee-item">Cashew Royale</div>
          <div className="marquee-item">Medjool Dates</div>
          <div className="marquee-item">Freshness Guaranteed</div>
          <div className="marquee-item">Handpicked Quality</div>
        </div>
      </div>

      {/* ── Banner Carousel (only if banners exist) ── */}
      {banners.length > 0 && (
        <section className="banner-section">
          <div className="container">
            <div className="banner-carousel">
              <div className="banner-track" style={{ transform: `translateX(-${bannerIdx * 100}%)` }}>
                {banners.map((b) => (
                  <div key={b.id} className="banner-slide">
                    <img src={getImageUrl(b.image_url)} alt={b.title || 'Banner'} className="banner-img" />
                    {(b.title || b.subtitle) && (
                      <div className="banner-overlay">
                        {b.title && <h2 className="banner-title">{b.title}</h2>}
                        {b.subtitle && <p className="banner-subtitle">{b.subtitle}</p>}
                        {b.link && <Link to={b.link} className="btn-primary">Shop Now →</Link>}
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
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      {featured.length > 0 && (
        <section className="section section--featured" id="shop">
          <div className="container">
            <div className="section-header-center">
              <div className="section-tag">Our Products</div>
              <h2 className="section-heading">Premium <em>Dry Fruits</em> Collection</h2>
              <p className="section-sub">Handpicked, naturally dried and packed with wholesome goodness.</p>
              <div className="featured-search-bar">
                <input
                  type="text"
                  placeholder="Search almonds, cashews, raisins..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
                <button>Search</button>
              </div>
            </div>
            <div className="featured-grid">
              {featured
                .filter((p) => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()))
                .map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="featured-viewall">
              <Link to="/products" className="view-all-btn">View All Products <span>→</span></Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Shop by Category ── */}
      <section className="section section--categories" id="categories">
        <div className="container">
          <div className="section-header-center fade-in">
            <div className="section-tag">Browse By Category</div>
            <h2 className="section-heading">Shop by <em>Category</em></h2>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="cat-card fade-in"
                style={{ background: cat.bg, animationDelay: `${i * 0.08}s` }}
              >
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">{cat.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="why-section">
        <div className="container">
          <div className="section-header-center fade-in">
            <div className="section-tag section-tag--light">Why Tazaura</div>
            <h2 className="section-heading section-heading--white">Why <em>Choose Us</em>?</h2>
            <p className="section-sub section-sub--light">We take freshness seriously — from farm to your table.</p>
          </div>
          <div className="why-grid">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="why-card fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="why-icon">{f.icon}</span>
                <div className="why-title">{f.title}</div>
                <p className="why-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header-center fade-in">
            <div className="section-tag">Customer Love</div>
            <h2 className="section-heading">What Our <em>Customers</em> Say</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="testi-card fade-in">
                <div className="testi-quote">"</div>
                <p className="testi-text">{t.text}</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.emoji}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-loc">📍 {t.loc}</div>
                  </div>
                  <div className="testi-stars">{'★'.repeat(t.rating)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="newsletter-section">
        <div className="newsletter-inner fade-in">
          <h2>Get Freshness in Your Inbox 🌿</h2>
          <p>Subscribe for exclusive deals, new arrivals and healthy lifestyle tips.</p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={emailVal}
              onChange={(e) => setEmailVal(e.target.value)}
            />
            <button onClick={subscribeEmail}>Subscribe</button>
          </div>
          {emailMsg && <p className="email-msg">{emailMsg}</p>}
        </div>
      </section>

    </div>
  );
}
