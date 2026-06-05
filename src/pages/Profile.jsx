import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiPhone, FiLogOut, FiMapPin,
  FiShoppingBag, FiEdit2, FiLock, FiCheck, FiX,
  FiPackage, FiClock, FiTruck, FiCheckCircle, FiExternalLink
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import '../styles/Profile.css';

const statusIcon = (status) => {
  if (status === 'Pending') return <FiClock />;
  if (status === 'Ready to Ship') return <FiPackage />;
  if (status === 'Out for Delivery') return <FiTruck />;
  if (status === 'Delivered') return <FiCheckCircle />;
  return <FiClock />;
};

const statusClass = (status) => {
  if (status === 'Pending') return 'status-pending';
  if (status === 'Ready to Ship') return 'status-ready';
  if (status === 'Out for Delivery') return 'status-out';
  if (status === 'Delivered') return 'status-delivered';
  return 'status-pending';
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordChecking, setPasswordChecking] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', mobileNumber: '', address: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setEditForm({ name: u.name || '', mobileNumber: u.mobileNumber || '', address: u.address || '' });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'orders' && user) fetchOrders();
  }, [activeTab, user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const userId = user.id || user._id;
      const email = user.email;
      const res = await axios.get(`${API_BASE_URL}/api/auth/my-orders?userId=${userId}&email=${email}`);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditClick = () => {
    setPasswordModal(true);
    setPasswordInput('');
    setPasswordError('');
  };

  const handlePasswordVerify = async () => {
    if (!passwordInput.trim()) { setPasswordError('Please enter your password'); return; }
    setPasswordChecking(true);
    setPasswordError('');
    try {
      const userId = user.id || user._id;
      await axios.post(`${API_BASE_URL}/api/auth/verify-password`, { userId, password: passwordInput });
      setPasswordModal(false);
      setEditMode(true);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Incorrect password');
    } finally {
      setPasswordChecking(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const userId = user.id || user._id;
      const res = await axios.put(`${API_BASE_URL}/api/auth/update-profile`, {
        userId, name: editForm.name, mobileNumber: editForm.mobileNumber, address: editForm.address
      });
      const updatedUser = { ...user, ...res.data.user };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setEditMode(false);
    } catch (err) {
      alert('Failed to save profile');
    } finally {
      setSaveLoading(false);
    }
  };

  if (!user) return (
    <div className="profile-loading-screen">
      <div className="loader-premium"></div>
    </div>
  );

  const infoCard = (icon, label, value) => (
    <div className="profile-info-field">
      <div className="profile-info-icon">{icon}</div>
      <div className="profile-info-content">
        <div className="profile-info-label">{label}</div>
        <div className="profile-info-value">{value || '—'}</div>
      </div>
    </div>
  );

  return (
    <>
      <div className="profile-page-premium">
        <div className="profile-hero-bg"></div>

        <div className="container profile-main-container">
          
          <motion.div 
            className="profile-header-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="profile-avatar-premium">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-name-premium">{user.name}</h2>
            <p className="profile-email-premium">{user.email}</p>
          </motion.div>

          <motion.div 
            className="profile-tabs-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button 
              className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            ><FiUser /> My Profile</button>
            <button 
              className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            ><FiShoppingBag /> My Orders</button>
          </motion.div>

          <div className="profile-content-area">
            <AnimatePresence mode="wait">
              
              {/* --- PROFILE TAB --- */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="profile-info-card-premium"
                >
                  {!editMode ? (
                    <>
                      <div className="profile-fields-grid">
                        {infoCard(<FiUser />, 'Full Name', user.name)}
                        {infoCard(<FiMail />, 'Email Address', user.email)}
                        {infoCard(<FiPhone />, 'Mobile Number', user.mobileNumber)}
                        {infoCard(<FiMapPin />, 'Delivery Address', user.address)}
                      </div>
                      <div className="profile-actions-row">
                        <button className="btn-edit-profile" onClick={handleEditClick}>
                          <FiEdit2 /> Edit Profile
                        </button>
                        <button className="btn-sign-out" onClick={handleLogout}>
                          <FiLogOut /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="profile-edit-form">
                      <h3 className="edit-form-title"><FiEdit2 /> Edit Profile</h3>
                      <div className="edit-fields-grid">
                        <div className="edit-field">
                          <label>Full Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            placeholder="Your full name"
                            className="luxury-input"
                          />
                        </div>
                        <div className="edit-field">
                          <label>Mobile Number</label>
                          <input
                            type="tel"
                            value={editForm.mobileNumber}
                            onChange={e => setEditForm({ ...editForm, mobileNumber: e.target.value })}
                            placeholder="10-digit number"
                            className="luxury-input"
                          />
                        </div>
                        <div className="edit-field full-width">
                          <label>Delivery Address</label>
                          <textarea
                            rows={3}
                            value={editForm.address}
                            onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                            placeholder="Full address with landmark, city, state, pincode"
                            className="luxury-input textarea"
                          />
                        </div>
                      </div>
                      <div className="profile-actions-row">
                        <button className="btn-save-profile" onClick={handleSaveProfile} disabled={saveLoading}>
                          <FiCheck /> {saveLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button className="btn-cancel-edit" onClick={() => setEditMode(false)}>
                          <FiX /> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- ORDERS TAB --- */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="orders-list-premium"
                >
                  {ordersLoading ? (
                    <div className="orders-loading">Loading your premium orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="empty-orders-premium">
                      <div className="empty-icon">🛍️</div>
                      <h3>No orders yet</h3>
                      <p>Your wardrobe relies on premium excellence. Start your journey today.</p>
                      <button onClick={() => navigate('/product')} className="btn-browse-collection">
                        Browse Collection
                      </button>
                    </div>
                  ) : (
                    <div className="orders-grid">
                      {orders.map(order => (
                        <div key={order._id} className="order-card-horizontal">
                          {/* 1. Image Column */}
                          <div className="order-horiz-image">
                            {order.products && order.products[0]?.photo ? (
                              <img src={order.products[0].photo} alt="Product" onError={e => e.target.style.display = 'none'} />
                            ) : (
                              <div className="no-img-placeholder">No Image</div>
                            )}
                          </div>

                          {/* 2. Details Column */}
                          <div className="order-horiz-details">
                            <div className="horiz-header-row">
                              <span className="horiz-order-id">#{order._id?.slice(-8).toUpperCase()}</span>
                              <span className={`status-badge-mini ${statusClass(order.status)}`}>
                                {statusIcon(order.status)} {order.status}
                              </span>
                            </div>
                            
                            <h4 className="horiz-item-name">
                              {order.products && order.products.length > 0 
                                ? order.products.map(p => p.name).join(', ') 
                                : 'Order Items'}
                            </h4>
                            
                            <div className="horiz-meta-row">
                              <div className="meta-item">
                                <span className="meta-label">Date:</span> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                              <div className="meta-item">
                                <span className="meta-label">Payment:</span> {order.payment?.method || 'N/A'}
                              </div>
                              {order.trackingId && (
                                <div className="meta-item" style={{ color: '#3b82f6', fontWeight: 600 }}>
                                  <span className="meta-label" style={{ color: '#3b82f6', marginRight: '4px' }}>AWB:</span> {order.trackingId}
                                </div>
                              )}
                              <div className="meta-item total-highlight">
                                <span className="meta-label">Total:</span> ₹{order.totalAmount?.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {/* 3. Actions Column */}
                          <div className="order-horiz-actions">
                            <button 
                              className="btn-track-order"
                              onClick={() => window.open('https://shreemahavircourier.com/', '_blank')}
                              title="Easily track your order via Shree Mahavir Courier"
                            >
                              <FiExternalLink /> Track Order
                            </button>

                            <button 
                              className="btn-view-invoice"
                              onClick={() => navigate('/invoice', { 
                                state: {
                                  paymentId: order.payment?.transactionId || order.payment?.orderId || 'SUCCESS',
                                  orderData: { id: order._id },
                                  formData: order.customer || user,
                                  cartItems: order.products,
                                  totalAmount: order.totalAmount
                                }
                              })}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {passwordModal && (
          <motion.div 
            className="password-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="password-modal-card"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="modal-icon"><FiLock /></div>
              <h3>Verify Your Identity</h3>
              <p>Enter your password to edit your profile</p>

              <input
                type="password"
                placeholder="Enter your password"
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setPasswordError(''); }}
                onKeyDown={e => e.key === 'Enter' && handlePasswordVerify()}
                autoFocus
                className={`luxury-input ${passwordError ? 'error-border' : ''}`}
              />
              {passwordError && <p className="error-text">{passwordError}</p>}

              <div className="modal-actions">
                <button className="btn-verify" onClick={handlePasswordVerify} disabled={passwordChecking}>
                  {passwordChecking ? 'Verifying...' : 'Confirm'}
                </button>
                <button className="btn-cancel" onClick={() => setPasswordModal(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default Profile;
