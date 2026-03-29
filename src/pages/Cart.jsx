import { useEffect } from 'react';
import { FiShoppingBag, FiArrowRight, FiTrash2, FiMinus, FiPlus, FiChevronLeft } from 'react-icons/fi';
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="empty-cart-premium"
            >
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#fff', color: 'var(--maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', margin: '0 auto 30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <FiShoppingBag />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '16px', fontFamily: 'Playfair Display, serif' }}>Your Bag is Empty</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-gray)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                It looks like you haven't discovered your next favorite saree yet. Explore our latest arrivals today!
              </p>
              <Link to="/product" className="btn-checkout-premium" style={{ display: 'inline-flex', width: 'auto', padding: '18px 50px', textDecoration: 'none' }}>
                Start Shopping <FiArrowRight style={{ marginLeft: '10px' }} />
              </Link>
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
            <button className="back-btn" onClick={() => navigate('/product')} style={{ marginBottom: '20px' }}>
              <FiChevronLeft /> Back to Shop
            </button>
            <h1>Shopping Bag</h1>
          </div>

          <div className="cart-container">
            {/* Left: Items List */}
            <div className="cart-items-list">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div 
                    key={item._id} 
                    className="cart-item-premium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <div className="cart-item-image">
                      <img 
                        src={getImageUrl(item.images && item.images.length > 0 ? item.images[0] : '')} 
                        alt={item.name} 
                      />
                    </div>
                    
                    <div className="cart-item-info">
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-meta">Category: {item.category}</div>
                      <div className="cart-item-price-unit">₹{item.price.toLocaleString()}</div>
                    </div>

                    <div className="cart-item-ops">
                      <div className="premium-qty">
                        <button 
                          className="premium-qty-btn" 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button 
                          className="premium-qty-btn" 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          <FiPlus />
                        </button>
                      </div>
                      
                      <button className="premium-remove" onClick={() => removeFromCart(item._id)}>
                        <FiTrash2 /> Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right: Summary Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="cart-summary-premium"
            >
              <h2 className="summary-title-premium">Order Summary</h2>
              
              <div className="summary-details">
                <div className="detail-line">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="detail-line">
                  <span>Standard Delivery</span>
                  <span style={{ color: '#059669', fontWeight: 'bold' }}>FREE</span>
                </div>
                <div className="detail-line">
                  <span>Estimated Tax</span>
                  <span>₹0</span>
                </div>
                <div className="detail-line grand-total">
                  <span>Total Amount</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button className="btn-checkout-premium" onClick={() => navigate('/checkout')}>
                Secure Checkout
              </button>


              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '15px' }}>
                  We accept all major credit cards and UPI.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', color: '#cbd5e1', fontSize: '1.5rem' }}>
                  {/* Secure payment icons would go here */}
                </div>
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
