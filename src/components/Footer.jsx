import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaPinterest, FaWhatsapp } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail, FiArrowRight, FiLogOut } from 'react-icons/fi';
import '../styles/Footer.css';

const Footer = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

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

  return (
    <footer className="footer no-print">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <img src="/logo.png" alt="Bharti Glooms" className="footer-logo-img" style={{ height: '40px', marginRight: '10px' }} />
              <span className="footer-logo-name" style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px', color: '#600018' }}>BHARTI GLOOMS</span>
            </Link>
            <p className="footer-desc" style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#666', marginBottom: '25px' }}>
              Bharti Glooms is a premium destination for exquisite ethnic wear. We bring together traditional craftsmanship and modern elegance to create timeless ensembles for the contemporary woman.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com/bhartiglooms" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://instagram.com/bharti_glooms" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://pinterest.com/bhartiglooms" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Pinterest"><FaPinterest /></a>
              <a href="https://wa.me/918799495038" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp"><FaWhatsapp /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 style={{ color: '#600018', fontSize: '1.1rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</h4>
            <div className="footer-links">
              <Link to="/"><FiArrowRight size={12} /> Home</Link>
              <Link to="/product"><FiArrowRight size={12} /> Collections</Link>
              <Link to="/about"><FiArrowRight size={12} /> Our Story</Link>
              <Link to="/contact"><FiArrowRight size={12} /> Contact Us</Link>
              {user ? (
                <Link to="/profile"><FiArrowRight size={12} /> My Account</Link>
              ) : (
                <Link to="/login"><FiArrowRight size={12} /> Login / Register</Link>
              )}
            </div>
          </div>

          {/* Policy Links */}
          <div className="footer-col">
            <h4 style={{ color: '#600018', fontSize: '1.1rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Support & Policies</h4>
            <div className="footer-links">
              <Link to="/privacy-policy"><FiArrowRight size={12} /> Privacy Policy</Link>
              <Link to="/terms-conditions"><FiArrowRight size={12} /> Terms & Conditions</Link>
              <Link to="/refund-policy"><FiArrowRight size={12} /> Refund & Cancellation</Link>
              <Link to="/contact"><FiArrowRight size={12} /> Help Center</Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="footer-col">
            <h4 style={{ color: '#600018', fontSize: '1.1rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Get In Touch</h4>
            <div className="footer-contact-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="footer-contact-item" style={{ display: 'flex', gap: '12px' }}>
                <FiMapPin style={{ color: '#600018', marginTop: '4px' }} />
                <span style={{ fontSize: '0.9rem', color: '#666' }}>Surat, Gujarat, India – 395001</span>
              </div>
              <div className="footer-contact-item" style={{ display: 'flex', gap: '12px' }}>
                <FiPhone style={{ color: '#600018', marginTop: '4px' }} />
                <span style={{ fontSize: '0.9rem', color: '#666' }}>+91 87994 95038</span>
              </div>
              <div className="footer-contact-item" style={{ display: 'flex', gap: '12px' }}>
                <FiMail style={{ color: '#600018', marginTop: '4px' }} />
                <span style={{ fontSize: '0.9rem', color: '#666' }}>bhartiglooms@gmail.com</span>
              </div>
            </div>
            {/* Payment Icons Placeholder */}
            <div className="payment-support" style={{ marginTop: '20px', opacity: 0.7 }}>
              <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay Secure" style={{ height: '20px' }} />
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ marginTop: '50px', paddingTop: '25px', borderTop: '1px solid #eee', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#888' }}>
            © {year} <strong>Bharti Glooms</strong>. All Rights Reserved. Designed for Heritage.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
