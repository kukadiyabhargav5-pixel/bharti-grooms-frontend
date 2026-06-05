import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { FiUser, FiMail, FiPhone, FiMapPin, FiArrowLeft, FiArrowRight, FiLock, FiCheckCircle, FiShield } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import '../styles/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || '',
        address: user.address || ''
      });
    } else {
      navigate('/login');
    }

    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [navigate, cartItems.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Create order on backend
      const response = await fetch(`${API_BASE_URL}/api/payment/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        })
      });

      const orderData = await response.json();

      if (!orderData.id) {
        alert('Failed to initiate payment. Please try again.');
        return;
      }

      // 2. Configure Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Key from environment variables
        amount: orderData.amount,
        currency: orderData.currency,
        name: "BHARTI GLOOMS",
        description: "Premium Ethnic Wear Purchase",
        order_id: orderData.id,
        handler: async function (response) {
          // Success! Verify on backend and save order
          const storedUser = JSON.parse(localStorage.getItem('user'));
          
          const orderDetails = {
            userId: storedUser?.id || storedUser?._id,
            name: formData.name,
            email: formData.email,
            mobileNumber: formData.mobileNumber,
            address: formData.address,
            products: cartItems,
            totalAmount: cartTotal
          };

          const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: orderDetails
            })
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok) {
            navigate('/invoice', {
              state: {
                paymentId: response.razorpay_payment_id,
                orderData: orderData,
                formData: formData,
                cartItems: cartItems,
                totalAmount: cartTotal
              }
            });
          } else {
            alert('Payment verification failed: ' + verifyData.message);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobileNumber
        },
        notes: {
          address: formData.address
        },
        theme: {
          color: "#800020" // Maroon theme
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
      });
      rzp1.open();

    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <div className="checkout-page">
        <div className="container">
          
          {/* Animated Progress Indicator */}
          <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="checkout-progress"
          >
             <div className="progress-step completed"><span><FiCheckCircle /></span> Cart</div>
             <div className="progress-line active"></div>
             <div className="progress-step active">
               <motion.span 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }} 
                 transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
               >
                 2
               </motion.span> 
               Shipping
             </div>
             <div className="progress-line"></div>
             <div className="progress-step"><span>3</span> Payment</div>
          </motion.div>

          <button className="back-link" onClick={() => navigate('/cart')}>
            <FiArrowLeft /> Back to Shopping Cart
          </button>

          <div className="checkout-grid">
            {/* Left: Shipping Form */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="checkout-form-section"
            >
              <motion.h1 variants={itemVariants} className="checkout-title">Shipping Details</motion.h1>
              <motion.p variants={itemVariants} className="checkout-subtitle">Where should we send your exquisite selection?</motion.p>

              <form onSubmit={handleSubmit} className="premium-form">
                
                {/* Floating Label Input Group */}
                <motion.div variants={itemVariants} className="luxury-form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="luxury-input"
                    placeholder=" "
                    required
                  />
                  <label className="luxury-label"><FiUser className="mr-2" /> Full Name</label>
                  <div className="luxury-input-border"></div>
                </motion.div>

                <motion.div variants={itemVariants} className="luxury-form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="luxury-input"
                    placeholder=" "
                    required
                  />
                  <label className="luxury-label"><FiMail className="mr-2" /> Email Address</label>
                  <div className="luxury-input-border"></div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="luxury-form-group">
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="luxury-input"
                    placeholder=" "
                    required
                  />
                  <label className="luxury-label"><FiPhone className="mr-2" /> Mobile Number</label>
                  <div className="luxury-input-border"></div>
                </motion.div>

                <motion.div variants={itemVariants} className="luxury-form-group">
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="luxury-input textarea"
                    placeholder=" "
                    required
                    rows="4"
                  ></textarea>
                  <label className="luxury-label"><FiMapPin className="mr-2" /> Delivery Address</label>
                  <div className="luxury-input-border"></div>
                </motion.div>

                <motion.div variants={itemVariants} className="payment-notice-premium">
                  <div className="notice-icon"><FiShield /></div>
                  <p>Your personal information is encrypted and securely processed.</p>
                </motion.div>

                <motion.button 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 45px rgba(128,0,32,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="btn-place-order-premium"
                  disabled={isSubmitting}
                >
                  <span className="btn-text">{isSubmitting ? 'Processing...' : 'Proceed to Payment'}</span> 
                  {!isSubmitting && <FiArrowRight className="btn-icon" />}
                  {/* Decorative Shine Element */}
                  <div className="btn-shine"></div>
                </motion.button>
              </form>
            </motion.div>

            {/* Right: Order Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
              className="checkout-summary-section"
            >
              <div className="summary-glass-card">
                <div className="glass-card-header">
                  <h3>Order Summary</h3>
                  <span className="item-count-pill">{cartItems.length} Items</span>
                </div>

                <div className="summary-items-scroll">
                  {cartItems.map((item, idx) => (
                    <motion.div 
                      key={item._id} 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", delay: 0.4 + (idx * 0.1) }}
                      className="summary-item-premium"
                    >
                      <div className="summary-item-img-box">
                        <img src={getImageUrl(item.images && item.images.length > 0 ? item.images[0] : '')} alt={item.name} />
                        <span className="qty-badge">{item.quantity}</span>
                      </div>
                      <div className="summary-item-info">
                        <p className="item-name-premium">{item.name}</p>
                        <p className="item-price-premium">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-details-premium">
                  <div className="summary-line text-gray">
                    <span>Subtotal</span>
                    <span className="fw-700 text-dark">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-line">
                    <span>Shipping</span>
                    <span className="free-shipping-label">Complimentary</span>
                  </div>
                  <div className="summary-line grand-total-premium">
                    <span>Total</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="secure-badge-row">
                   <div className="secure-badge"><FiLock /> Secure</div>
                   <div className="secure-badge"><FiCheckCircle /> Verified</div>
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

export default Checkout;
