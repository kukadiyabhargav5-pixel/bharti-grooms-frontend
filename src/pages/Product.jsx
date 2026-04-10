import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiHeart, FiEye, FiShoppingCart, FiChevronRight } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Footer from '../components/Footer';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import '../styles/Product.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  // Lightbox State
  const [lightboxProduct, setLightboxProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

  const { toggleWishlist, isInWishlist } = useWishlist();
  const cardRefs = useRef([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const categories = ['All', 'Saree', 'Kurti', 'Lehenga', 'Tunic', 'Dupatta'];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = activeFilter === 'All' || p.category === activeFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) {
        ref.style.opacity = '0';
        ref.style.transform = 'translateY(30px)';
        ref.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [filtered.length, loading]);

  // Lightbox Handlers
  const openLightbox = (product) => {
    if (product?.images?.length > 0) {
      setLightboxProduct(product);
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setLightboxProduct(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (lightboxProduct && lightboxProduct.images.length > 1) {
      setSlideDirection(1);
      setCurrentImageIndex((prev) => (prev + 1) % lightboxProduct.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (lightboxProduct && lightboxProduct.images.length > 1) {
      setSlideDirection(-1);
      setCurrentImageIndex((prev) => (prev - 1 + lightboxProduct.images.length) % lightboxProduct.images.length);
    }
  };

  const selectImage = (e, idx) => {
    e.stopPropagation();
    if (lightboxProduct) {
      setSlideDirection(idx > currentImageIndex ? 1 : -1);
      setCurrentImageIndex(idx);
    }
  };

  return (
    <div className="page products-page">
      {/* Hero with Search & Filter Bar */}
      <div className="products-hero">
        <div className="container">
          <h1 className="section-title">
            Our <span>Collections</span>
          </h1>

          <div className="products-controls-bar">
            {/* Search */}
            <div className="search-container themed-search">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search premium products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="shop-search-input"
              />
            </div>

            {/* Category Filter */}
            <div className="filter-container themed-filter">
              <select 
                className="category-dropdown"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="container" style={{ maxWidth: '1400px' }}>
          {/* Product Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>
              <div className="loader"></div>
              <p style={{ marginTop: '20px', color: '#64748b' }}>Discovering premium products...</p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', background: '#f8fafc', borderRadius: '24px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 15 }}>📦</div>
                  <h3 style={{ color: '#334155', marginBottom: '8px' }}>No products found</h3>
                  <p style={{ color: '#64748b' }}>Try exploring other categories or adjusting your search.</p>
                </div>
              ) : (
                filtered.map((product, i) => (
                  <div
                    key={product._id}
                    className="product-card"
                    ref={(el) => (cardRefs.current[i] = el)}
                  >
                    <div className="product-img-wrapper" onClick={() => openLightbox(product)}>
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={getImageUrl(product.images[0])} 
                          alt={product.name} 
                          className="product-image cursor-pointer" 
                        />
                      ) : (
                        <div className="no-image-placeholder cursor-pointer">No Image</div>
                      )}
                      
                      {/* Overlay Buttons */}
                      <div className="product-card-overlay">
                        <button
                          className={`card-icon-btn wish-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                          title={isInWishlist(product._id) ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <FiHeart fill={isInWishlist(product._id) ? "#e74c3c" : "none"} />
                        </button>
                        <button className="card-icon-btn" onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}><FiEye /></button>
                      </div>
                    </div>

                    <div className="product-content">
                      <div className="product-cat-label">{product.category}</div>
                      <h3 className="product-title" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>{product.name}</h3>
                      <div className="product-price-row">
                        <span className="current-price">₹{product.price.toLocaleString()}</span>
                        {product.stock >= 5 ? (
                           <span className="stock-status in-stock">In Stock</span>
                        ) : product.stock > 0 ? (
                           <span className="stock-status low-stock">Only {product.stock} left!</span>
                        ) : (
                           <span className="stock-status out-of-stock">Out of Stock</span>
                        )}
                      </div>
                      
                      <div className="product-card-actions">
                        <button className="btn-card-details" onClick={() => navigate(`/product/${product._id}`)}>
                          <span>Details</span> <FiChevronRight />
                        </button>
                        <button 
                          className="btn-card-add" 
                          onClick={() => {
                            addToCart(product);
                            navigate('/cart');
                          }} 
                          disabled={product.stock <= 0}
                        >
                          <FiShoppingCart /> <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ====== LIGHTBOX MODAL ====== */}
      {lightboxProduct && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {lightboxProduct.images.length > 1 && (
              <button className="lightbox-nav btn-prev" onClick={prevImage}>&#10094;</button>
            )}
            
            <div className="lightbox-img-wrapper" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatePresence custom={slideDirection} mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  src={getImageUrl(lightboxProduct.images[currentImageIndex])} 
                  alt={lightboxProduct.name} 
                  className="lightbox-main-image"
                  custom={slideDirection}
                  initial={(d) => ({ opacity: 0, x: d === 1 ? 80 : -80 })}
                  animate={{ opacity: 1, x: 0 }}
                  exit={(d) => ({ opacity: 0, x: d === 1 ? -80 : 80 })}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </div>
            
            {lightboxProduct.images.length > 1 && (
              <button className="lightbox-nav btn-next" onClick={nextImage}>&#10095;</button>
            )}
            
            {lightboxProduct.images.length > 1 && (
              <div className="lightbox-indicators">
                {lightboxProduct.images.map((img, idx) => (
                  <span 
                    key={idx} 
                    className={`indicator-dot ${idx === currentImageIndex ? 'active' : ''}`}
                    onClick={(e) => selectImage(e, idx)}
                  ></span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Product;
