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
          <p>Premium dry fruits & nuts, delivered fresh to your doorstep.</p>
        </div>
        <div className="footer__col">
          <h4>Shop</h4>
          <Link to="/products?category=Nuts">Nuts</Link>
          <Link to="/products?category=Dates">Dates</Link>
          {/* <Link to="/products?category=Oats">Oats</Link> */}
          <Link to="/products?category=Mixes">Mixes</Link>
        </div>
        <div className="footer__col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="footer__col">
          <h4>Contact</h4>
          <a href="mailto:support@tazaura.com">care@tazaura.in</a>
          <a href="tel:+919999999999">+91 6297978294 </a>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Tazaura. All rights reserved.</span>
      </div>
    </footer>
  );
}
