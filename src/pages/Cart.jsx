import { useEffect } from 'react';
import { FiShoppingBag, FiArrowRight, FiTrash2, FiMinus, FiPlus, FiChevronLeft, FiShield } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { getImageUrl } from '../apiConfig';
import '../styles/Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (cartItems.length === 0) {
    return (
      <>
        <div className="cart-page">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="empty-cart-premium glass-panel"
            >
              <motion.div 
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                className="empty-icon-circle"
              >
                <FiShoppingBag />
              </motion.div>
              <h2 className="empty-title font-serif">Your Cart is Empty</h2>
              <p className="empty-subtitle">
                It looks like you haven't discovered your next favorite piece yet. Explore our latest premium arrivals today!
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/product" className="btn-solid-gold">
                  Discover Collections <FiArrowRight className="ml-2" style={{ marginLeft: '10px' }} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <button className="back-link-gold" onClick={() => navigate('/product')}>
              <FiChevronLeft /> Continue Shopping
            </button>
            <h1 className="font-serif page-title">Shopping Cart <span>({cartItems.length} items)</span></h1>
          </div>

          <div className="cart-container">
            {/* Left: Items List */}
            <div className="cart-items-list">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div 
                    key={item._id} 
                    className="cart-item-premium glass-panel"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    layout="position"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="cart-item-image">
                      <img 
                        src={getImageUrl(item.images && item.images.length > 0 ? item.images[0] : '')} 
                        alt={item.name} 
                      />
                    </div>
                    
                    <div className="cart-item-info">
                      <div className="cart-item-cat">{item.category}</div>
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-price-unit">₹{item.price.toLocaleString()}</div>
                    </div>

                    <div className="cart-item-ops">
                      <div className="premium-qty-controls">
                        <motion.button 
                          whileTap={{ scale: 0.8 }}
                          className="qty-btn" 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus />
                        </motion.button>
                        <span className="qty-val">{item.quantity}</span>
                        <motion.button 
                          whileTap={{ scale: 0.8 }}
                          className="qty-btn" 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          <FiPlus />
                        </motion.button>
                      </div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05, color: '#ef4444' }}
                        whileTap={{ scale: 0.9 }}
                         className="btn-remove-item" 
                        onClick={() => removeFromCart(item._id)}
                      >
                        <FiTrash2 /> Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right: Summary Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="cart-summary-premium glass-panel"
            >
              <h2 className="summary-title font-serif">Order Summary</h2>
              
              <div className="summary-details">
                <div className="detail-line">
                  <span className="text-gray">Subtotal</span>
                  <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="detail-line">
                  <span className="text-gray">Shipping</span>
                  <span className="text-green uppercase fw-800">Complimentary</span>
                </div>
                <div className="detail-line">
                  <span className="text-gray">Estimated Tax</span>
                  <span className="font-bold">₹0</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="detail-line grand-total">
                  <span>Total</span>
                  <span className="text-maroon">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-solid-maroon w-100" 
                onClick={() => navigate('/checkout')}
              >
                Secure Checkout <FiArrowRight style={{ marginLeft: '10px' }} />
              </motion.button>

              <div className="secure-checkout-badge">
                <FiShield className="shield-icon" /> 
                <span>100% Secure Checkout</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
