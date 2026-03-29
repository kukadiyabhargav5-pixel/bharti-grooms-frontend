import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { FiUser, FiMail, FiPhone, FiMapPin, FiArrowLeft, FiLock, FiCheckCircle } from 'react-icons/fi';
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
            // Redirect to Invoice on success
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
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <div className="checkout-page">
        <div className="container">
          {/* Progress Indicator */}
          <div className="checkout-progress">
             <div className="progress-step completed"><span>1</span> Bag</div>
             <div className="progress-line active"></div>
             <div className="progress-step active"><span>2</span> Shipping</div>
             <div className="progress-line"></div>
             <div className="progress-step"><span>3</span> Payment</div>
          </div>

          <button className="back-link" onClick={() => navigate('/cart')}>
            <FiArrowLeft /> Back to Shopping Bag
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
                <motion.div variants={itemVariants} className="form-group-premium">
                  <label><FiUser /> Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="form-row-premium">
                  <div className="form-group-premium">
                    <label><FiMail /> Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <div className="form-group-premium">
                    <label><FiPhone /> Mobile Number</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter 10 digit number"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="form-group-premium">
                  <label><FiMapPin /> Delivery Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full house address, landmark, city, state, pincode"
                    required
                    rows="4"
                  ></textarea>
                </motion.div>



                <motion.div variants={itemVariants} className="payment-notice-premium">
                  <FiLock /> Your information is encrypted and processed securely.
                </motion.div>

                <motion.button 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="btn-place-order-premium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Proceed to Payment'} <FiCheckCircle style={{ marginLeft: '10px' }} />
                </motion.button>
              </form>
            </motion.div>

            {/* Right: Order Summary */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
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
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (idx * 0.1) }}
                      className="summary-item-premium"
                    >
                      <div className="summary-item-img-box">
                        <img src={getImageUrl(item.images[0])} alt={item.name} />
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
                  <div className="summary-line">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
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
