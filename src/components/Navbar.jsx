import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiPackage, FiInfo, FiLogIn, FiUserPlus, FiMenu, FiX, FiUser, FiLogOut, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { GiDiamondRing } from 'react-icons/gi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [menuOpen]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const links = [
    { path: '/', label: 'Home', icon: <FiHome /> },
    { path: '/product', label: 'Product', icon: <FiPackage /> },
    { path: '/about', label: 'About', icon: <FiInfo /> },
    { path: '/wishlist', label: 'Favorites', icon: <FiHeart /> },
    { path: '/cart', label: 'Cart', icon: <FiShoppingBag /> },
  ];

  return (
    <>
      <nav className={`navbar no-print ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
            <img src="/logo.png" alt="Bharti Glooms Logo" className="logo-img" />
            <span className="logo-name">BHARTI GLOOMS</span>
          </Link>

          <div className="navbar-right">
            <ul className="navbar-links">
              {links.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    end={link.path === '/'}
                  >
                    {link.label}
                    {link.path === '/cart' && cartCount > 0 && (
                      <span className="cart-badge">{cartCount}</span>
                    )}
                    {link.path === '/wishlist' && wishlistCount > 0 && (
                      <span className="cart-badge" style={{ backgroundColor: '#ff4d4d' }}>{wishlistCount}</span>
                    )}
                  </NavLink>
                </li>
              ))}

            </ul>

            <div className="navbar-actions">
              {user ? (
                <>
                  <Link to="/profile" className="nav-btn-login">
                    <FiUser /> Profile
                  </Link>
                  <button onClick={handleLogout} className="nav-btn-logout">
                    <FiLogOut /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-btn-login">
                    <FiLogIn /> Login
                  </Link>
                  <Link to="/register" className="nav-btn-register">
                    <FiUserPlus /> Register
                  </Link>
                </>
              )}
            </div>
          </div>

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                end={link.path === '/'}
                onClick={() => setMenuOpen(false)}
              >
                {link.icon} {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mobile-nav-actions">
          {user ? (
            <>
              <Link to="/profile" className="nav-btn-login" onClick={() => setMenuOpen(false)}>
                <FiUser /> Profile
              </Link>
              <button 
                onClick={() => { handleLogout(); setMenuOpen(false); }} 
                className="nav-btn-logout" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn-login" onClick={() => setMenuOpen(false)}>
                <FiLogIn /> Login
              </Link>
              <Link to="/register" className="nav-btn-register" onClick={() => setMenuOpen(false)}>
                <FiUserPlus /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
