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

  return (
    <footer className="footer no-print">
      <div className="footer-container">
        
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/logo.png" alt="Bharti Glooms" className="footer-logo-img" />
              <span className="footer-logo-name font-serif">BHARTI GLOOMS</span>
            </Link>
            <p className="footer-desc">
              Bharti Glooms is a premium destination for exquisite ethnic wear. We bring together traditional craftsmanship and modern elegance to create timeless ensembles for the contemporary woman.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com/bhartiglooms" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://instagram.com/bharti_glooms" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://pinterest.com/bhartiglooms" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Pinterest"><FaPinterest /></a>
              <a href="https://wa.me/918128090833" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp"><FaWhatsapp /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="font-serif">Quick Links</h4>
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
            <h4 className="font-serif">Support & Policies</h4>
            <div className="footer-links">
              <Link to="/privacy-policy"><FiArrowRight size={12} /> Privacy Policy</Link>
              <Link to="/terms-conditions"><FiArrowRight size={12} /> Terms & Conditions</Link>
              <Link to="/refund-policy"><FiArrowRight size={12} /> Refund & Cancellation</Link>
              <Link to="/contact"><FiArrowRight size={12} /> Help Center</Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="footer-col">
            <h4 className="font-serif">Get In Touch</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <FiMapPin className="contact-icon" />
                <span className="contact-text">Surat, Gujarat, India – 395001</span>
              </div>
              <div className="footer-contact-item">
                <FiPhone className="contact-icon" />
                <span className="contact-text">+91 8128090833</span>
              </div>
              <div className="footer-contact-item">
                <FiMail className="contact-icon" />
                <span className="contact-text">bhartiglooms@gmail.com</span>
              </div>
              <a href="https://wa.me/918128090833" target="_blank" rel="noopener noreferrer" className="footer-contact-item wa-contact" style={{ textDecoration: 'none' }}>
                <FaWhatsapp className="contact-icon wa-icon" />
                <span className="contact-text wa-text">+91 8128090833</span>
              </a>
            </div>
            {/* Payment Icons Placeholder */}
            <div className="payment-support">
              <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay Secure" />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} <strong>Bharti Glooms</strong>. All Rights Reserved. Designed for Heritage.</p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
