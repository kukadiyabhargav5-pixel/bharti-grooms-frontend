import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiChevronLeft, FiChevronRight, FiHeart } from 'react-icons/fi';
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
  const [activeImage, setActiveImage] = useState(0);
  const [direction, setDirection] = useState(0);

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

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setDirection(1);
      setActiveImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setDirection(-1);
      setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/product')} className="btn-primary">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <div className="details-grid">
          {/* Left: Image Slider */}
          <div className="details-images">
            <div className="main-image-wrapper">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={activeImage}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="motion-image-container"
                >
                  <motion.img 
                    src={getImageUrl(product.images[activeImage])} 
                    alt={product.name} 
                    className="main-image"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </AnimatePresence>
              
              {product.images && product.images.length > 1 && (
                <>
                  <button className="slider-nav prev" onClick={prevImage}>
                    <FiChevronLeft />
                  </button>
                  <button className="slider-nav next" onClick={nextImage}>
                    <FiChevronRight />
                  </button>
                  <div className="slider-dots">
                    {product.images.map((_, i) => (
                      <div 
                        key={i} 
                        className={`dot ${i === activeImage ? 'active' : ''}`}
                        onClick={() => {
                          setDirection(i > activeImage ? 1 : -1);
                          setActiveImage(i);
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>


          {/* Right: Product Info */}
          <div className="details-info">
            <div className="details-cat">{product.category}</div>
            <h1 className="details-title">{product.name}</h1>
            <div className="details-price">₹{product.price.toLocaleString()}</div>
            
            <div className="details-desc-section">
              <h3>Description</h3>
              <p>{product.description || 'Experience the elegance and comfort of this premium saree. Perfect for any special occasion.'}</p>
            </div>

            <div className="details-features">
              {product.specifications && Object.entries(product.specifications).map(([key, value]) => {
                if (!value || key === 'weightUnit') return null;
                
                let finalValue = value;
                if (key === 'weight' && product.specifications['weightUnit']) {
                  finalValue = `${value} ${product.specifications['weightUnit']}`;
                }

                return (
                  <div className="feature" key={key}>
                    <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {finalValue}
                  </div>
                );
              })}
              <div className="feature">
                <strong>Category:</strong> {product.category}
              </div>
              <div className="feature">
                <strong>Brand:</strong> Bharti Glooms
              </div>

              {/* Stock Scarcity Alert */}
              {product.stock > 0 && product.stock < 5 && (
                <div className="stock-alert scarcity">
                  ⚠️ Hurry! Only {product.stock} items left in stock.
                </div>
              )}
              {product.stock === 0 && (
                <div className="stock-alert out-of-stock">
                  🚫 Currently Out of Stock.
                </div>
              )}
            </div>


            <div className="details-actions">
              <button 
                className="btn-add-to-cart" 
                onClick={() => {
                  addToCart(product);
                  navigate('/cart');
                }}
                disabled={product.stock <= 0}
              >
                <FiShoppingCart /> {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button 
                className={`btn-wishlist ${isInWishlist(product._id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                <FiHeart fill={isInWishlist(product._id) ? "currentColor" : "none"} /> 
                {isInWishlist(product._id) ? ' Remove from Favorites' : ' Add to Favorites'}
              </button>
              <button className="btn-secondary-outline" onClick={() => navigate('/product')}>
                <FiArrowLeft /> Back to Collection
              </button>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
