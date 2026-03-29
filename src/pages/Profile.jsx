import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiPhone, FiLogOut, FiMapPin,
  FiShoppingBag, FiEdit2, FiLock, FiCheck, FiX,
  FiPackage, FiClock, FiTruck, FiCheckCircle
} from 'react-icons/fi';
import Footer from '../components/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const statusIcon = (status) => {
  if (status === 'Pending') return <FiClock style={{ color: '#f39c12' }} />;
  if (status === 'Ready to Ship') return <FiPackage style={{ color: '#3498db' }} />;
  if (status === 'Out for Delivery') return <FiTruck style={{ color: '#9b59b6' }} />;
  if (status === 'Delivered') return <FiCheckCircle style={{ color: '#27ae60' }} />;
  return <FiClock />;
};

const statusColor = (status) => {
  if (status === 'Pending') return '#fff3cd';
  if (status === 'Ready to Ship') return '#cce5ff';
  if (status === 'Out for Delivery') return '#e8d5f5';
  if (status === 'Delivered') return '#d4edda';
  return '#f8f9fa';
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'orders'

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Edit flow state
  const [editMode, setEditMode] = useState(false);          // showing edit form
  const [passwordModal, setPasswordModal] = useState(false); // showing password modal
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

  // Step 1: user clicks "Edit Profile" → show password modal
  const handleEditClick = () => {
    setPasswordModal(true);
    setPasswordInput('');
    setPasswordError('');
  };

  // Step 2: verify password
  const handlePasswordVerify = async () => {
    if (!passwordInput.trim()) { setPasswordError('Please enter your password'); return; }
    setPasswordChecking(true);
    setPasswordError('');
    try {
      const userId = user.id || user._id;
      await axios.post(`${API_BASE_URL}/api/auth/verify-password`, { userId, password: passwordInput });
      // Password correct — open edit form
      setPasswordModal(false);
      setEditMode(true);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Incorrect password');
    } finally {
      setPasswordChecking(false);
    }
  };

  // Step 3: save updated profile
  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const userId = user.id || user._id;
      const res = await axios.put(`${API_BASE_URL}/api/auth/update-profile`, {
        userId,
        name: editForm.name,
        mobileNumber: editForm.mobileNumber,
        address: editForm.address
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading...
    </div>
  );

  const infoCard = (icon, label, value) => (
    <div style={{
      padding: '18px 20px', borderRadius: '12px', border: '1px solid rgba(128,0,0,0.1)',
      background: 'var(--off-white)', display: 'flex', alignItems: 'center', gap: '16px'
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '10px',
        background: 'rgba(128,0,0,0.06)', color: 'var(--maroon)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)', fontWeight: '600', marginBottom: '3px' }}>{label}</div>
        <div style={{ fontSize: '1rem', color: 'var(--text-dark)', fontWeight: '600' }}>{value || '—'}</div>
      </div>
    </div>
  );

  return (
    <>
      <div className="auth-page" style={{ padding: '100px 20px 60px' }}>
        <div className="auth-bg-1" />
        <div className="auth-bg-2" />

        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* Avatar & Name */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--maroon), var(--maroon-light))',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', fontWeight: '800', margin: '0 auto 12px',
              boxShadow: '0 10px 25px rgba(128, 0, 0, 0.2)'
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.6rem', color: 'var(--text-dark)' }}>{user.name}</h2>
            <p style={{ margin: 0, color: 'var(--text-gray)', fontSize: '0.9rem' }}>{user.email}</p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '8px', background: '#f8f5f2',
            padding: '6px', borderRadius: '14px', marginBottom: '24px'
          }}>
            {[
              { key: 'profile', label: 'My Profile', icon: <FiUser /> },
              { key: 'orders', label: 'My Orders', icon: <FiShoppingBag /> }
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                flex: 1, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontWeight: '700', fontSize: '0.95rem', transition: 'all 0.2s',
                background: activeTab === tab.key ? 'var(--maroon)' : 'transparent',
                color: activeTab === tab.key ? 'white' : 'var(--text-gray)',
                boxShadow: activeTab === tab.key ? '0 4px 12px rgba(128,0,0,0.2)' : 'none'
              }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ── My Profile Tab ── */}
          {activeTab === 'profile' && (
            <div style={{
              background: 'white', borderRadius: '20px', padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              {!editMode ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                    {infoCard(<FiUser />, 'Full Name', user.name)}
                    {infoCard(<FiMail />, 'Email Address', user.email)}
                    {infoCard(<FiPhone />, 'Mobile Number', user.mobileNumber)}
                    {infoCard(<FiMapPin />, 'Delivery Address', user.address)}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleEditClick} style={{
                      flex: 1, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                      background: 'linear-gradient(135deg, var(--maroon), var(--maroon-light))',
                      color: 'white', fontWeight: '700', fontSize: '1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: '0 4px 15px rgba(128,0,0,0.25)'
                    }}>
                      <FiEdit2 /> Edit Profile
                    </button>
                    <button onClick={handleLogout} style={{
                      padding: '14px 20px', borderRadius: '12px', cursor: 'pointer',
                      background: 'transparent', color: '#e74c3c',
                      border: '2px solid #e74c3c', fontWeight: '700', fontSize: '1rem',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      <FiLogOut /> Sign Out
                    </button>
                  </div>
                </>
              ) : (
                /* Edit Form */
                <>
                  <h3 style={{ margin: '0 0 20px', color: 'var(--maroon)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiEdit2 /> Edit Profile
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {[
                      { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
                      { label: 'Mobile Number', key: 'mobileNumber', type: 'tel', placeholder: '10-digit number' },
                    ].map(field => (
                      <div key={field.key}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-gray)', marginBottom: '6px', display: 'block' }}>{field.label}</label>
                        <input
                          type={field.type}
                          value={editForm[field.key]}
                          onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          style={{
                            width: '100%', padding: '12px 16px', borderRadius: '10px',
                            border: '1.5px solid rgba(128,0,0,0.2)', fontSize: '1rem',
                            outline: 'none', boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-gray)', marginBottom: '6px', display: 'block' }}>Delivery Address</label>
                      <textarea
                        rows={3}
                        value={editForm.address}
                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                        placeholder="Full address with landmark, city, state, pincode"
                        style={{
                          width: '100%', padding: '12px 16px', borderRadius: '10px',
                          border: '1.5px solid rgba(128,0,0,0.2)', fontSize: '1rem',
                          resize: 'vertical', outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleSaveProfile} disabled={saveLoading} style={{
                      flex: 1, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                      color: 'white', fontWeight: '700', fontSize: '1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}>
                      <FiCheck /> {saveLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => setEditMode(false)} style={{
                      padding: '14px 20px', borderRadius: '12px', cursor: 'pointer',
                      background: 'transparent', color: '#888',
                      border: '2px solid #ddd', fontWeight: '700',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      <FiX /> Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── My Orders Tab ── */}
          {activeTab === 'orders' && (
            <div>
              {ordersLoading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-gray)', fontSize: '1rem' }}>
                  Loading your orders...
                </div>
              ) : orders.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px', background: 'white',
                  borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛍️</div>
                  <h3 style={{ color: 'var(--text-dark)', margin: '0 0 8px' }}>No orders yet</h3>
                  <p style={{ color: 'var(--text-gray)', margin: '0 0 20px' }}>Start shopping to see your orders here</p>
                  <button onClick={() => navigate('/product')} style={{
                    padding: '12px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    background: 'var(--maroon)', color: 'white', fontWeight: '700'
                  }}>
                    Browse Collection
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orders.map(order => (
                    <div key={order._id} style={{
                      background: 'white', borderRadius: '16px', padding: '20px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                      borderLeft: '4px solid var(--maroon)'
                    }}>
                      {/* Order Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ fontWeight: '800', color: 'var(--maroon)', fontSize: '1rem' }}>
                            #{order._id?.slice(-8).toUpperCase()}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginTop: '2px' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {statusIcon(order.status)}
                          <span style={{
                            padding: '5px 14px', borderRadius: '20px', fontSize: '0.82rem',
                            fontWeight: '700', background: statusColor(order.status)
                          }}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                        {order.products?.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {item.photo && (
                              <img src={item.photo} alt={item.name}
                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #f0e8e8' }}
                                onError={e => e.target.style.display = 'none'}
                              />
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '700', color: 'var(--text-dark)', fontSize: '0.9rem' }}>{item.name}</div>
                              <div style={{ color: 'var(--text-gray)', fontSize: '0.8rem' }}>
                                ₹{item.price?.toLocaleString()} × {item.quantity}
                              </div>
                            </div>
                            <div style={{ fontWeight: '800', color: 'var(--maroon)', fontSize: '0.9rem' }}>
                              ₹{(item.price * item.quantity)?.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderTop: '1px solid #f0e8e8', paddingTop: '12px', flexWrap: 'wrap', gap: '8px'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-gray)' }}>
                            Payment: <strong>{order.payment?.method || 'N/A'}</strong>
                          </div>
                          <div style={{ fontWeight: '800', color: 'var(--text-dark)', fontSize: '1rem' }}>
                            Total: <span style={{ color: 'var(--maroon)' }}>₹{order.totalAmount?.toLocaleString()}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => navigate('/invoice', { 
                            state: {
                              paymentId: order.payment?.transactionId || order.payment?.orderId || 'SUCCESS',
                              orderData: { id: order._id },
                              formData: order.customer || user,
                              cartItems: order.products,
                              totalAmount: order.totalAmount
                            }
                          })}
                          style={{
                            padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--maroon)',
                            background: 'white', color: 'var(--maroon)', fontWeight: '700', cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => { e.target.style.background = 'var(--maroon)'; e.target.style.color = 'white'; }}
                          onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = 'var(--maroon)'; }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Password Verification Modal */}
      {passwordModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: '20px', padding: '35px',
            maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'rgba(128,0,0,0.08)', color: 'var(--maroon)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', margin: '0 auto 12px'
              }}>
                <FiLock />
              </div>
              <h3 style={{ margin: '0 0 6px', color: 'var(--text-dark)' }}>Verify Your Identity</h3>
              <p style={{ margin: 0, color: 'var(--text-gray)', fontSize: '0.9rem' }}>Enter your password to edit your profile</p>
            </div>

            <input
              type="password"
              placeholder="Enter your password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setPasswordError(''); }}
              onKeyDown={e => e.key === 'Enter' && handlePasswordVerify()}
              autoFocus
              style={{
                width: '100%', padding: '13px 16px', borderRadius: '10px',
                border: `1.5px solid ${passwordError ? '#e74c3c' : 'rgba(128,0,0,0.2)'}`,
                fontSize: '1rem', outline: 'none', marginBottom: '8px', boxSizing: 'border-box'
              }}
            />
            {passwordError && (
              <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: '0 0 12px' }}>{passwordError}</p>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button onClick={handlePasswordVerify} disabled={passwordChecking} style={{
                flex: 1, padding: '13px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, var(--maroon), var(--maroon-light))',
                color: 'white', fontWeight: '700', fontSize: '0.95rem'
              }}>
                {passwordChecking ? 'Verifying...' : 'Confirm'}
              </button>
              <button onClick={() => setPasswordModal(false)} style={{
                padding: '13px 18px', borderRadius: '10px', cursor: 'pointer',
                background: 'transparent', border: '2px solid #ddd', color: '#888', fontWeight: '700'
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Profile;
