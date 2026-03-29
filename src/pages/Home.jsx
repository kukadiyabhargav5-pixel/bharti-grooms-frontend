import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiShoppingBag, FiStar, FiShield, FiTruck, FiAward } from 'react-icons/fi';
import { GiDress, GiDiamondRing } from 'react-icons/gi';
import Footer from '../components/Footer';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import '../styles/Home.css';

const features = [
  {
    icon: '👗',
    title: 'Premium Ethnic Wear',
    desc: 'Explore our curated collection of handcrafted sarees, lehengas, and suits made with finest fabrics.',
  },
  {
    icon: '💎',
    title: 'Exclusive Designs',
    desc: 'Every piece is thoughtfully designed to bring out the elegance and personality of the modern woman.',
  },
  {
    icon: '🚚',
    title: 'Pan India Delivery',
    desc: 'Fast and reliable delivery across India with secure packaging and real-time tracking.',
  },
  {
    icon: '🔒',
    title: 'Secure Shopping',
    desc: 'Shop with confidence using our 100% secure payment gateway and easy return policy.',
  },
  {
    icon: '⭐',
    title: 'Top Quality',
    desc: 'We source from the best artisans and manufacturers to bring you quality that lasts.',
  },
  {
    icon: '🎁',
    title: 'Gift Wrapping',
    desc: 'Make every occasion special with our beautiful gift wrapping and personalised message options.',
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const featureRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data.slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch slider products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <div className="page">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg-circle hero-bg-circle-1" />
        <div className="hero-bg-circle hero-bg-circle-2" />
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="hero-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="badge-dot" />
              New Collection 2026 — Now Live
            </motion.div>
            <h1 className="hero-title">
              Where <span className="highlight">Elegance</span> Meets
              <br /> Tradition
            </h1>
            <p className="hero-desc">
              Bharti Glooms brings you premium ethnic wear crafted with love and passion.
              Discover sarees, lehengas, suits and more — designed for the modern woman.
            </p>
            <div className="hero-buttons">
              <Link to="/product" className="btn-primary">
                <FiShoppingBag /> Shop Now <FiArrowRight />
              </Link>
              <Link to="/about" className="btn-outline">
                Our Story
              </Link>
            </div>
            <div className="hero-stats">
              {[
                { num: '5000+', label: 'Happy Customers' },
                { num: '200+', label: 'Products' },
                { num: '10+', label: 'Years Experience' }
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="stat-number">{stat.num}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="hero-visual">
            <div className="hero-img-wrapper">
              <div className="hero-slider-container">
                {loading ? (
                  <div className="hero-main-card skeleton">
                    <div className="skeleton-content">Loading...</div>
                  </div>
                ) : products.length > 0 ? (
                  products.map((product, index) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className={`hero-slider-slide ${index === currentSlide ? 'active' : ''}`}
                    >
                      <img
                        src={getImageUrl(product.images[0])}
                        alt={product.name}
                        className="hero-product-img"
                      />
                      <div className="hero-product-info">
                        <h3>{product.name}</h3>
                        <p>₹{product.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="hero-main-card">
                    <div className="hero-card-content">
                      <span className="hero-card-icon">👗</span>
                      <div className="hero-card-text">Bharti Glooms</div>
                      <div className="hero-card-sub">Premium Collection</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="floating-badge floating-badge-1">
                <span className="fb-icon">⭐</span>
                <div className="fb-text">
                  Top Rated
                  <div className="fb-sub">4.9 / 5.0 Rating</div>
                </div>
              </div>

              <div className="floating-badge floating-badge-2">
                <span className="fb-icon">🎁</span>
                <div className="fb-text">
                  Free Shipping
                  <div className="fb-sub">On orders ₹999+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              Why Choose <span className="text-gradient">Bharti Glooms</span>?
            </h2>
            <p className="section-subtitle">
              We are committed to delivering excellence in every thread, every design, and every delivery.
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="feature-card glass-panel"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(58, 0, 15, 0.1)" }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Discover Your Perfect Look?</h2>
          <p className="cta-subtitle">
            Join thousands of happy customers who trust Bharti Glooms for their special moments.
          </p>
          <div className="cta-buttons">
            <Link to="/product" className="btn-white">
              <FiShoppingBag /> Explore Collection
            </Link>
            <Link to="/register" className="btn-transparent">
              <FiArrowRight /> Join Us Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
