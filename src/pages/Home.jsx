import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiStar, FiAward, FiCheckCircle } from 'react-icons/fi';
import Footer from '../components/Footer';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import '../styles/Home.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: 'darkred', color: 'white', minHeight: '100vh' }}>
          <h2>React Crash Details:</h2>
          <p style={{fontFamily: 'monospace', fontSize: '16px'}}>{this.state.error.toString()}</p>
          <pre style={{background: 'rgba(0,0,0,0.5)', padding: 20}}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children; 
  }
}

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      // User requested 10 products
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
    }, 4000);
    return () => clearInterval(interval);
  }, [products]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="maroon-page">
      {/* ===== FULL WIDTH SLIDER HERO ===== */}
      <section className="maroon-hero">
        
        {loading ? (
          <div className="hero-loader">
             <div className="spinner"></div>
          </div>
        ) : products.length > 0 && products[currentSlide] ? (
          <div className="hero-track-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="hero-slide-full"
              >
                <div className="hero-container">
                  
                  {/* LEFT SIDE: TEXT DETAILS */}
                  <div className="hero-content">
                    <div className="hero-badge">
                      <span className="badge-dot" /> {products[currentSlide]?.category || 'Exclusive'} Collection
                    </div>
                    
                    <h1 className="hero-title font-serif">
                      {products[currentSlide]?.name || 'Premium Saree'}
                    </h1>
                    
                    <p className="hero-desc">
                      {products[currentSlide]?.description 
                        ? (products[currentSlide].description.length > 150 ? products[currentSlide].description.substring(0, 150) + "..." : products[currentSlide].description)
                        : 'Experience the epitome of Indian craftsmanship. Bharti Glooms presents premium ethnic wear meticulously designed to celebrate your most cherished moments.'}
                    </p>
                    
                    <div className="hero-price-panel">
                      <span className="label">Special Price</span>
                      <h2 className="hero-price font-serif">₹{products[currentSlide]?.price?.toLocaleString() || '---'}</h2>
                    </div>

                    <div className="hero-actions">
                      <Link to={`/product/${products[currentSlide]?._id}`} className="btn-solid-gold">
                        View Details <FiArrowRight />
                      </Link>
                    </div>

                    <div className="hero-trust">
                      <span><FiCheckCircle /> 100% Authentic Fabric</span>
                      <span><FiCheckCircle /> Free Secure Shipping</span>
                    </div>
                  </div>

                  {/* RIGHT SIDE: ANIMATED HERO ELEMENT */}
                  <div className="hero-visual">
                    <div className="animated-hero-wrapper">
                      {/* Animated rotating border / glow */}
                      <div className="animated-glow-ring"></div>
                      
                      <div className="animated-hero-element">
                        <Link to={`/product/${products[currentSlide]?._id}`} className="frame-link">
                          <img 
                            src={products[currentSlide]?.images?.length > 0 ? getImageUrl(products[currentSlide].images[0]) : ''} 
                            alt={products[currentSlide]?.name || ''} 
                            className="frame-image"
                          />
                        </Link>
                      </div>

                      {/* FLOATING BADGES */}
                      <div className="floating-glass-badge top-badge">
                        <div className="fb-icon"><FiStar /></div>
                        <div className="fb-text">
                          Masterpiece
                          <div className="fb-sub">Exquisite Details</div>
                        </div>
                      </div>
                      
                      <div className="floating-glass-badge bottom-badge">
                        <div className="fb-icon"><FiAward /></div>
                        <div className="fb-text">
                          Premium Quality
                          <div className="fb-sub">Handcrafted</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>

            {/* SLIDER DOTS NAVIGATION */}
            <div className="hero-slider-dots" style={{ position: 'absolute', bottom: '30px', zIndex: 100 }}>
              {products.map((_, idx) => (
                <button 
                  key={idx} 
                  className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* ===== SAREE DETAILS (LIGHT THEME) ===== */}
      <section className="saree-features-light">
        <div className="container">
          <motion.div className="section-header-dark" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <h2>The Anatomy of <span>Elegance</span></h2>
            <p>Every Bharti Glooms piece is thoughtfully curated to bring out true heritage and personality.</p>
          </motion.div>

          <div className="features-light-grid">
            {[
              { icon: '🌺', title: 'Pure Silk Heritage', desc: 'Woven from the finest authentic silk fibers ensuring a majestic drape and a rich, long-lasting natural sheen.' },
              { icon: '✨', title: 'Zari Mastery', desc: 'Hand-embroidered with precision, featuring authentic gold threads that reflect centuries of royal Indian artistry.' },
              { icon: '🎨', title: 'Pallu Artistry', desc: 'Every pallu is an absolute masterpiece of tradition, showcasing complex motifs that serve as the breathtaking centerpiece.' },
              { icon: '🪶', title: 'Feather-Light Comfort', desc: 'Expertly engineered fabrics that are surprisingly lightweight and breathable, allowing for effortless all-day movement.' },
              { icon: '🧵', title: 'Handloom Perfection', desc: 'Meticulously crafted by master artisans on traditional Indian handlooms, ensuring zero compromises in quality.' },
              { icon: '👑', title: 'Heirloom Durability', desc: 'Crafted not just for a single season, but to be passed down through generations as a cherished family heirloom.' }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="feature-light-card"
                initial="hidden" whileInView="show" viewport={{ once: true }} 
                variants={fadeUp} 
                transition={{ delay: index * 0.1 }}
              >
                <div className="feature-icon-box">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SIGNATURE SAREE BANNER (THEMED REDESIGN) ===== */}
      <section className="signature-saree-banner">
        <div className="banner-overlay"></div>
        <div className="container">
          <motion.div className="banner-content-premium" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
            <div className="banner-glass-card">
              <div className="gold-line"></div>
              <h2 className="font-serif">The Quintessential <span>Saree Experience</span></h2>
              <p className="banner-text">
                Every Bharti Glooms saree is more than a garment—it is six yards of pure poetry. We source the rarest authentic silk and commission generations-old master weavers to create designs that echo the grandeur of Indian royalty, ensuring you look nothing short of breathtaking on your most important days.
              </p>
              <div className="banner-author-box">
                <p className="banner-author font-serif">Crafted for the Modern Royalty</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const HomeWithBoundary = () => (
  <ErrorBoundary>
    <Home />
  </ErrorBoundary>
);

export default HomeWithBoundary;
