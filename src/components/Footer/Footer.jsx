import { Link } from 'react-router-dom';
import TazauraLogo from '../../assets/SVG 2.svg';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="footer__logo">
            <img src={TazauraLogo} alt="Tazaura Logo" className="tazaura-svg-logo" style={{ width: '100px', height: 'auto', display: 'inline-block', verticalAlign: 'middle' }} />
          </span>
          <p>Freshness you deserve — premium quality dry fruits sourced directly from the finest farms across the world.</p>
          {/* <div className="footer__social">
            <div className="social-btn">📘</div>
            <div className="social-btn">📸</div>
            <div className="social-btn">🐦</div>
            <div className="social-btn">▶️</div>
          </div> */}
        </div>
        <div className="footer__col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">Shop</Link>
          <Link to="/products?category=Nuts">Nuts</Link>
          <Link to="/products?category=Dates">Dates</Link>
        </div>
        <div className="footer__col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="footer__col">
          <h4>Contact Us</h4>
          <div className="contact-item"><span>📍</span><span>Pukuria, Jhargram, West Bengal, 721514, India</span></div>
          <div className="contact-item"><span>📞</span><a href="tel:+918327347783">+91 8327347783</a></div>
          <div className="contact-item"><span>✉️</span><a href="mailto:care@tazaura.in">care@tazaura.in</a></div>
          <div className="contact-item"><span>⏰</span><span>Mon–Sat: 9AM – 7PM</span></div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Tazaura. All rights reserved. Made with ❤️ in Jhargram.</p>
        <div className="footer__bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
