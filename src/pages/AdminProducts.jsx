import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome, FiUsers, FiPackage, FiLogOut, FiMenu, FiX, FiSearch, FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import '../styles/Admin.css';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
    window.scrollTo(0, 0);
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openModal = (product, mode) => {
    setSelectedProduct(product);
    setModalMode(mode);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category || ''
    });
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalMode(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/products/${selectedProduct._id}`, formData);
      closeModal();
      fetchProducts();
    } catch (error) {
      alert('Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <Link to="/admin/products" className="admin-nav-item active"><FiPackage /> Products</Link>
            <Link to="/admin/users" className="admin-nav-item"><FiUsers /> Customers</Link>
          </nav>
        </div>
        <div className="admin-topbar-right">
          <Link to="/admin/add-product" className="admin-btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--maroon)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            <FiPlus /> Add New
          </Link>
          <button onClick={handleLogout} className="admin-topbar-logout" title="Logout"><FiLogOut /></button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="admin-mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
           <div className="admin-mobile-nav" onClick={(e) => e.stopPropagation()}>
            <nav className="admin-nav-col">
              <Link to="/admin/dashboard" className="admin-nav-item" onClick={() => setMobileMenuOpen(false)}><FiHome /> Dashboard</Link>
              <Link to="/admin/products" className="admin-nav-item active" onClick={() => setMobileMenuOpen(false)}><FiPackage /> Products</Link>
              <button onClick={handleLogout} className="admin-mobile-logout"><FiLogOut /> Logout</button>
            </nav>
          </div>
        </div>
      )}

      <main className="admin-main">
        <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="admin-page-title">Product Inventory</h2>
          <div className="admin-search-wrapper">
             <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 1 }} />
             <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="admin-search-input" />
          </div>
        </div>

        <div className="admin-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>
              <div className="admin-loading-spinner" style={{ marginBottom: '10px' }}></div>
              Loading Products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '16px', border: '1px solid #edf2f7' }}>
              <FiPackage style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '20px' }} />
              <h3 style={{ color: '#64748b' }}>No products found</h3>
              <p style={{ color: '#94a3b8' }}>Your inventory is currently empty.</p>
            </div>
          ) : (
            <div className="admin-data-grid">
              {filteredProducts.map(p => (
                <div key={p._id} className="admin-detail-card">
                   <div className="admin-card-img-wrapper">
                      {p.images && p.images.length > 0 ? (
                        <img src={`http://localhost:5000${p.images[0]}`} alt={p.name} className="admin-card-img" />
                      ) : (
                        <div className="admin-card-no-img">No Image</div>
                      )}
                   </div>
                   <div style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '1.1rem' }}>{p.name}</div>
                  <div className="admin-card-label">Price</div>
                  <div className="admin-card-value">₹ {p.price.toLocaleString()}</div>
                  <div className="admin-card-label">Category</div>
                  <div className="admin-card-value">{p.category || 'N/A'}</div>
                  <div className="admin-card-divider"></div>
                  <div className="admin-card-actions">
                    <button className="admin-card-btn btn-view" onClick={() => openModal(p, 'view')}><FiEye /> View</button>
                    <button className="admin-card-btn btn-edit" onClick={() => openModal(p, 'edit')}><FiEdit2 /> Edit</button>
                    <button className="admin-card-btn btn-delete" onClick={() => handleDelete(p._id)}><FiTrash2 /> Delete</button>
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
              <h3>{modalMode === 'view' ? 'Product Details' : 'Edit Product'}</h3>
              <button className="admin-close-btn" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="admin-modal-body">
                {modalMode === 'view' && selectedProduct?.images?.length > 0 && (
                  <div className="admin-modal-img-wrapper">
                    <img src={`http://localhost:5000${selectedProduct.images[0]}`} alt={selectedProduct.name} className="admin-modal-img" />
                  </div>
                )}
                <div className="admin-form-group">
                  <label>Product Name</label>
                  <input type="text" className="admin-input" disabled={modalMode === 'view'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>Price (₹)</label>
                  <input type="number" className="admin-input" disabled={modalMode === 'view'} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>Category</label>
                  <input type="text" className="admin-input" disabled={modalMode === 'view'} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
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

export default AdminProducts;
