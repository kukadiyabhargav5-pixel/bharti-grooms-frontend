import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome, FiUsers, FiPackage, FiLogOut, FiMenu, FiX, FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import '../styles/Admin.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
    window.scrollTo(0, 0);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
      await axios.put(`${API_BASE_URL}/api/admin/users/${selectedUser._id}`, formData);      closeModal();
      fetchUsers();
    } catch (error) {
      alert('Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`);        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <Link to="/admin/dashboard" className="admin-logo" style={{ textDecoration: 'none' }}>
            <div className="admin-logo-icon">BG</div>
            <span className="admin-logo-text">Admin Panel</span>
          </Link>
          <button className="admin-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
            <FiMenu />
          </button>
          <nav className="admin-top-nav desktop-nav">
            <Link to="/admin/dashboard" className="admin-nav-item"><FiHome /> Dashboard</Link>
            <Link to="/admin/products" className="admin-nav-item"><FiPackage /> Products</Link>
            <Link to="/admin/users" className="admin-nav-item active"><FiUsers /> Customers</Link>
          </nav>
        </div>
        <div className="admin-topbar-right">
          <button onClick={handleLogout} className="admin-topbar-logout" title="Logout"><FiLogOut /></button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="admin-mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="admin-mobile-nav" onClick={(e) => e.stopPropagation()}>
            <nav className="admin-nav-col">
              <Link to="/admin/dashboard" className="admin-nav-item" onClick={() => setMobileMenuOpen(false)}><FiHome /> Dashboard</Link>
              <Link to="/admin/users" className="admin-nav-item active" onClick={() => setMobileMenuOpen(false)}><FiUsers /> Customers</Link>
              <button onClick={handleLogout} className="admin-mobile-logout"><FiLogOut /> Logout</button>
            </nav>
          </div>
        </div>
      )}

      <main className="admin-main">
        <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="admin-page-title">User Management</h2>
          <div className="admin-search-wrapper">
             <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 1 }} />
             <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="admin-search-input" />
          </div>
        </div>

        <div className="admin-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>
              <div className="admin-loading-spinner" style={{ marginBottom: '10px' }}></div>
              Loading Customers...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '16px', border: '1px solid #edf2f7' }}>
              <FiUsers style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '20px' }} />
              <h3 style={{ color: '#64748b' }}>No customers found</h3>
              <p style={{ color: '#94a3b8' }}>Try adjusting your search or check if users exist.</p>
            </div>
          ) : (
            <div className="admin-data-grid">
              {filteredUsers.map(u => (
                <div key={u._id} className="admin-detail-card">
                  <div style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '1.1rem' }}>{u.name}</div>
                  <div className="admin-card-label">Email</div>
                  <div className="admin-card-value">{u.email}</div>
                  <div className="admin-card-label">Mobile</div>
                  <div className="admin-card-value">{u.mobileNumber || 'N/A'}</div>
                  <div className="admin-card-divider"></div>
                  <div className="admin-card-actions">
                    <button className="admin-card-btn btn-view" onClick={() => openModal(u, 'view')}><FiEye /> View</button>
                    <button className="admin-card-btn btn-edit" onClick={() => openModal(u, 'edit')}><FiEdit2 /> Edit</button>
                    <button className="admin-card-btn btn-delete" onClick={() => handleDelete(u._id)}><FiTrash2 /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modalMode && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{modalMode === 'view' ? 'User Details' : 'Edit User'}</h3>
              <button className="admin-close-btn" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Full Name</label>
                  <input type="text" className="admin-input" disabled={modalMode === 'view'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>Email Address</label>
                  <input type="email" className="admin-input" disabled={modalMode === 'view'} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>Mobile Number</label>
                  <input type="text" className="admin-input" disabled={modalMode === 'view'} value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>Address</label>
                  <textarea className="admin-input" style={{ height: '80px', resize: 'none' }} disabled={modalMode === 'view'} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-outline" onClick={closeModal}>Close</button>
                {modalMode === 'edit' && <button type="submit" className="admin-btn-primary" style={{ background: 'var(--maroon)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>Save Changes</button>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
