import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome, FiUsers, FiPackage, FiLogOut, FiMenu, FiX, FiSearch, FiEdit2, FiTrash2, FiEye, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminAddProduct.css'; // Reusing luxury buttons and card styles
import '../styles/AdminDataGrid.css'; // Proper Admin grid layout styling

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view', 'edit'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    address: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') { navigate('/login'); }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`);
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user, mode) => {
    setSelectedUser(user);
    setModalMode(mode);
    setFormData({
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber || '',
      address: user.address || ''
    });
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalMode(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/admin/users/${selectedUser._id}`, formData);
      closeModal();
      fetchUsers();
    } catch (error) {
      alert('Failed to update customer record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Erase this customer account permanently? This action is irreversible.')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert('Deletions failed');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Customer Relations">
      <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="business-search-zone" style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
          <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search Registered Customers..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="luxury-input" 
            style={{ paddingLeft: '45px' }}
          />
        </div>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="business-section" style={{ textAlign: 'center', padding: '100px' }}>
            <div className="admin-loading-spinner" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ fontWeight: 600, color: '#94a3b8' }}>Synchronizing CRM Data...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <motion.div 
            className="business-section" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '100px' }}
          >
            <FiUsers style={{ fontSize: '4rem', color: 'var(--admin-gold)', marginBottom: '20px', opacity: 0.3 }} />
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem' }}>No Customer Records</h3>
            <p style={{ color: '#94a3b8' }}>No matches found in the administrative registry.</p>
          </motion.div>
        ) : (
          <div className="admin-data-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
            <AnimatePresence>
              {filteredUsers.map((u, index) => (
                <motion.div 
                  key={u._id} 
                  className="business-section"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ marginBottom: '0', padding: '25px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <div className="brand-icon-luxury" style={{ background: 'var(--admin-gold-soft)', color: 'var(--maroon)', width: '50px', height: '50px', fontSize: '1.5rem' }}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Playfair Display' }}>{u.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Customer ID: {u._id.slice(-8).toUpperCase()}</div>
                    </div>
                  </div>
                  
                  <div className="business-input-group" style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.7rem' }}><FiMail style={{ marginRight: '5px' }} /> Email Registry</label>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{u.email}</div>
                  </div>

                  <div className="business-input-group" style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.7rem' }}><FiPhone style={{ marginRight: '5px' }} /> Secure Mobile</label>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{u.mobileNumber || 'Not Provided'}</div>
                  </div>

                  <div className="admin-card-divider"></div>
                  <div className="admin-card-actions" style={{ border: 'none', paddingTop: '0' }}>
                    <button className="btn-view" style={{ flex: 1, borderRadius: '10px' }} onClick={() => openModal(u, 'view')}><FiEye /> Insight</button>
                    <button className="btn-edit" style={{ flex: 1, borderRadius: '10px' }} onClick={() => openModal(u, 'edit')}><FiEdit2 /> Profile</button>
                    <button className="btn-delete" style={{ padding: '10px', borderRadius: '10px' }} onClick={() => handleDelete(u._id)}><FiTrash2 /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 🏛️ CUSTOMER MODAL */}
      <AnimatePresence>
        {modalMode && (
          <motion.div 
            className="admin-modal-overlay" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="admin-modal-container"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ borderRadius: '24px', border: '1px solid var(--admin-gold-border)', maxWidth: '550px' }}
            >
              <div className="admin-modal-header" style={{ background: 'white', border: 'none', padding: '30px' }}>
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem' }}>{modalMode === 'view' ? 'Customer Profile Intelligence' : 'Modify Record'}</h3>
                <button className="admin-close-btn" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="admin-modal-body" style={{ padding: '0 30px 30px' }}>
                  <div className="business-input-group" style={{ marginBottom: '20px' }}>
                    <label>Full Legal Name</label>
                    <input type="text" className="luxury-input" disabled={modalMode === 'view'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="business-input-group" style={{ marginBottom: '20px' }}>
                    <label>Electronic Address</label>
                    <input type="email" className="luxury-input" disabled={modalMode === 'view'} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="business-input-group" style={{ marginBottom: '20px' }}>
                    <label>Mobile Contact</label>
                    <input type="text" className="luxury-input" disabled={modalMode === 'view'} value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} />
                  </div>
                  <div className="business-input-group">
                    <label>Physical Registry (Address)</label>
                    <textarea 
                      className="luxury-input" 
                      style={{ height: '100px', resize: 'none' }} 
                      disabled={modalMode === 'view'} 
                      value={formData.address} 
                      onChange={(e) => setFormData({...formData, address: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="admin-modal-footer" style={{ background: '#f8fafc', padding: '20px 30px', border: 'none' }}>
                  <button type="button" className="admin-btn-outline" style={{ borderRadius: '12px' }} onClick={closeModal}>Close Registry</button>
                  {modalMode === 'edit' && <button type="submit" className="btn-save-luxury" style={{ width: 'auto', padding: '10px 25px', marginTop: '0', borderRadius: '12px' }}>Commit Changes</button>}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminUsers;
