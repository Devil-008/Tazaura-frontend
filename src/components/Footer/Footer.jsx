import { Link } from 'react-router-dom';
import icon2 from '../../assets/icon3.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="footer__logo">
            <img src={icon2} alt="Tazaura Logo" className="tazaura-svg-logo" style={{ width: '150px', height: 'auto', display: 'inline-block', verticalAlign: 'middle' }} />
          </span>
          <p>Freshness you deserve — premium quality dry fruits sourced directly from the finest farms across the world.</p>

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
          <h4>Support</h4>
          <Link to="/contact">Contact Us</Link>
          <Link to="/track-order">Track Order</Link>
          <Link to="/returns">Returns Policy</Link>
          <Link to="/faq">FAQs</Link>
          <Link to="/privacy">Privacy Policy</Link>
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
