import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiChevronLeft, FiChevronRight, FiHeart, FiX, FiShield, FiTruck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Footer from '../components/Footer';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Slider states for inline previews
  const [activeImage, setActiveImage] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Full-Screen Lightbox states
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Inline Slider logic
  const nextImage = (e) => {
    if (e) e.stopPropagation();
    if (product?.images?.length > 0) {
      setDirection(1);
      setActiveImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    if (product?.images?.length > 0) {
      setDirection(-1);
      setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Lightbox Slide Logic
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    document.body.style.overflow = 'auto';
  };

  const nextLightboxImage = (e) => {
    e.stopPropagation();
    if (product?.images?.length > 0) {
      setSlideDirection(1);
      setLightboxIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevLightboxImage = (e) => {
    e.stopPropagation();
    if (product?.images?.length > 0) {
      setSlideDirection(-1);
      setLightboxIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 300 : -300, opacity: 0 })
  };

  const lightboxVariants = {
    enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 80 : -80, opacity: 0 })
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader-premium"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/product')} className="btn-primary">Back to Shop</button>
      </div>
    );
  }

  return (
    <>
      <div className="product-details-page">
        <div className="container">
          <button className="back-link-gold" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back to Collection
          </button>

          <div className="details-grid-premium">

            {/* COL 1: Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className="details-thumbs-col">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={`thumb-item ${i === activeImage ? 'active' : ''}`}
                    onClick={() => { setDirection(i > activeImage ? 1 : -1); setActiveImage(i); }}
                  >
                    <img src={getImageUrl(img)} alt={`View ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {/* COL 2: Main Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="details-gallery-section"
            >
              <div className="main-image-glass-card" onClick={() => openLightbox(activeImage)}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={activeImage}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.15 } }}
                    className="motion-image-container"
                  >
                    <img
                      src={getImageUrl(product.images[activeImage])}
                      alt={product.name}
                      className="main-image-premium"
                    />
                  </motion.div>
                </AnimatePresence>

                {product.images && product.images.length > 1 && (
                  <>
                    <button className="gallery-nav prev" onClick={prevImage}><FiChevronLeft /></button>
                    <button className="gallery-nav next" onClick={nextImage}><FiChevronRight /></button>
                  </>
                )}
                <div className="zoom-hint">Click to expand</div>
              </div>

              {/* Dot indicators */}
              {product.images && product.images.length > 1 && (
                <div className="image-dots">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      className={`image-dot ${i === activeImage ? 'active' : ''}`}
                      onClick={() => { setDirection(i > activeImage ? 1 : -1); setActiveImage(i); }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* COL 3: Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="details-info-section"
            >
              <div className="info-glass-card">
                <div className="details-cat-premium">{product.category}</div>
                <h1 className="details-title-premium">{product.name}</h1>

                <div className="price-row">
                  <div className="details-price-premium">₹{product.price.toLocaleString()}</div>
                  <span className="price-incl-tax">Incl. all taxes</span>
                </div>

                <div className="details-desc-premium">
                  <p>{product.description || 'Experience the elegance and comfort of this premium saree. Perfect for any special occasion.'}</p>
                </div>

                {/* Stock Alerts */}
                {product.stock > 0 && product.stock < 5 && (
                  <div className="stock-alert-premium scarcity">
                    ⚠️ Only {product.stock} left — Order soon!
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="stock-alert-premium out-of-stock">
                    🚫 Currently Out of Stock
                  </div>
                )}

                {/* Specs */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="specs-grid-premium">
                    {Object.entries(product.specifications).map(([key, value]) => {
                      if (!value || key.toLowerCase().endsWith('unit')) return null;
                      const unitKey = `${key}Unit`;
                      const finalValue = product.specifications[unitKey]
                        ? `${value} ${product.specifications[unitKey]}`
                        : value;
                      return (
                        <div className="spec-item" key={key}>
                          <span className="spec-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                          <span className="spec-value">{finalValue}</span>
                        </div>
                      );
                    })}
                    <div className="spec-item">
                      <span className="spec-label">Brand</span>
                      <span className="spec-value luxury-brand">Bharti Glooms</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="details-actions-premium">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-add-to-cart-premium"
                    onClick={() => { addToCart(product); navigate('/cart'); }}
                    disabled={product.stock <= 0}
                  >
                    <FiShoppingCart className="btn-icon" />
                    <span>{product.stock <= 0 ? 'Out of Stock' : `Add to Cart — ₹${product.price.toLocaleString()}`}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`btn-wishlist-premium ${isInWishlist(product._id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product)}
                  >
                    <FiHeart fill={isInWishlist(product._id) ? "currentColor" : "none"} className="btn-icon" />
                    <span>{isInWishlist(product._id) ? 'Saved to Favorites' : 'Add to Favorites'}</span>
                  </motion.button>
                </div>

                {/* Trust Badges */}
                <div className="trust-badges-premium">
                  <div className="trust-badge"><FiShield /> Secure Payment</div>
                  <div className="trust-badge"><FiTruck /> Free Delivery</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
      <Footer />

      {/* Full-Screen Image Lightbox */}
      <AnimatePresence mode="wait">
        {showLightbox && (
          <motion.div 
            className="lightbox-overlay-premium"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={closeLightbox}
          >
            <button className="lightbox-close" onClick={closeLightbox}>
              <FiX />
            </button>

            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.img 
                  key={lightboxIndex}
                  src={getImageUrl(product.images[lightboxIndex])}
                  alt={product.name}
                  custom={slideDirection}
                  variants={lightboxVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="lightbox-image-fluid"
                />
              </AnimatePresence>

              {product.images && product.images.length > 1 && (
                <>
                  <button className="lightbox-nav prev" onClick={prevLightboxImage}>
                    <FiChevronLeft />
                  </button>
                  <button className="lightbox-nav next" onClick={nextLightboxImage}>
                    <FiChevronRight />
                  </button>

                  <div className="lightbox-thumbnails">
                    {product.images.map((img, i) => (
                      <div 
                        key={i}
                        className={`lightbox-thumb ${i === lightboxIndex ? 'active' : ''}`}
                        onClick={() => {
                          setSlideDirection(i > lightboxIndex ? 1 : -1);
                          setLightboxIndex(i);
                        }}
                      >
                        <img src={getImageUrl(img)} alt={`Thumb ${i}`} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetails;
