import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiShoppingCart, FiUser, FiMenu, FiX, FiType, FiChevronLeft } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import TazauraLogo from '../../assets/SVG 2.svg';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount, fetchCart }  = useCart();
  const { darkMode, toggleDark, fontSize, changeFontSize } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [fontMenu, setFontMenu]     = useState(false);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo and Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {location.pathname !== '/' && (
            <button className="icon-btn" onClick={() => navigate(-1)} title="Go Back" style={{ marginLeft: '-0.5rem' }}>
              <FiChevronLeft size={22} />
            </button>
          )}
          <Link to="/" className="navbar__logo">
            <img src={TazauraLogo} alt="Tazaura Logo" className="tazaura-svg-logo" style={{ width: '100px', height: 'auto' }} />
            {/* <span>Tazaura</span> */}
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="navbar__links">
          <Link to="/"         className="navbar__link">Home</Link>
          <Link to="/products" className="navbar__link">Shop</Link>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Font size */}
          <div className="font-menu-wrap">
            <button className="icon-btn" onClick={() => setFontMenu(v => !v)} title="Font size">
              <FiType />
            </button>
            {fontMenu && (
              <div className="font-menu">
                {['sm','md','lg'].map(s => (
                  <button key={s} className={`font-option${fontSize===s?' active':''}`}
                    onClick={() => { changeFontSize(s); setFontMenu(false); }}>
                    {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark mode */}
          <button className="icon-btn" onClick={toggleDark} title="Toggle theme">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {/* Cart */}
          {user && (
            <Link to="/cart" className="icon-btn cart-btn">
              <FiShoppingCart />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
          )}

          {/* User */}
          {user ? (
            <div className="user-menu-wrap">
              <button className="icon-btn user-btn">
                <FiUser /> <span className="user-name">{user.name?.split(' ')[0]}</span>
              </button>
              <div className="user-dropdown">
                <Link to="/profile"     className="dropdown-item">Profile</Link>
                <Link to="/orders"      className="dropdown-item">Orders</Link>
                {isAdmin && <Link to="/admin" className="dropdown-item">Admin</Link>}
                <button onClick={handleLogout} className="dropdown-item dropdown-item--danger">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}

          {/* Hamburger */}
          <button className="icon-btn hamburger" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/"         onClick={() => setMenuOpen(false)} className="mobile-link">Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="mobile-link">Shop</Link>
          {user && <Link to="/cart"    onClick={() => setMenuOpen(false)} className="mobile-link">Cart ({itemCount})</Link>}
          {user && <Link to="/profile" onClick={() => setMenuOpen(false)} className="mobile-link">Profile</Link>}
          {user && <Link to="/orders"  onClick={() => setMenuOpen(false)} className="mobile-link">Orders</Link>}
          {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="mobile-link">Admin</Link>}
          {user
            ? <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mobile-link mobile-link--danger">Logout</button>
            : <Link to="/login" onClick={() => setMenuOpen(false)} className="mobile-link">Login</Link>
          }
        </div>
      )}
    </header>
  );
}
