import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome, FiUsers, FiPackage, FiLogOut, FiMenu, FiX, FiSearch, FiEdit2, FiTrash2, FiEye, FiPlus, FiBox, FiImage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminAddProduct.css'; // Reusing luxury buttons and card styles
import '../styles/AdminDataGrid.css'; // Proper Admin grid layout styling

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view', 'edit'
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    specifications: [],
    existingImages: [],
    newImages: null
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') { navigate('/login'); }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product, mode) => {
    setSelectedProduct(product);
    setModalMode(mode);
    
    // Convert specifications object to array of {key, value} objects for UI
    const specsArray = [];
    if (product.specifications && typeof product.specifications === 'object') {
       Object.entries(product.specifications).forEach(([k, v]) => {
          specsArray.push({ key: k, value: v });
       });
    }

    setFormData({
      name: product.name,
      price: product.price,
      category: product.category || '',
      stock: product.stock !== undefined ? product.stock : 0,
      specifications: specsArray,
      existingImages: product.images || [],
      newImages: null
    });
  };

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index][field] = value;
    setFormData({ ...formData, specifications: updatedSpecs });
  };

  const addSpec = () => {
    setFormData({ ...formData, specifications: [...formData.specifications, { key: '', value: '' }] });
  };

  const removeSpec = (index) => {
    const updatedSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData({ ...formData, specifications: updatedSpecs });
  };

  const removeExistingImage = (imgUrl) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img !== imgUrl)
    }));
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalMode(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);

      const specsObj = {};
      formData.specifications.forEach(spec => {
        if (spec.key && spec.key.trim() !== '') {
           specsObj[spec.key.trim()] = spec.value;
        }
      });
      data.append('specifications', JSON.stringify(specsObj));
      
      formData.existingImages.forEach(img => {
        data.append('existingImages', img);
      });
      
      if (formData.newImages) {
        Array.from(formData.newImages).forEach(file => {
          data.append('newImages', file);
        });
      }

      await axios.put(`${API_BASE_URL}/api/admin/products/${selectedProduct._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      closeModal();
      fetchProducts();
    } catch (error) {
      console.error('Update product trace:', error);
      alert('Sync Failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product from Global Catalog?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert('Deletion failed');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout title="Inventory Catalog">
      <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="business-search-zone" style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
          <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search Global Inventory..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="luxury-input" 
            style={{ paddingLeft: '45px' }}
          />
        </div>
        <button className="btn-save-luxury" style={{ width: 'auto', padding: '12px 25px', marginTop: '0' }} onClick={() => navigate('/admin/add-product')}>
          <FiPlus /> New Listing
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="business-section" style={{ textAlign: 'center', padding: '100px' }}>
            <div className="admin-loading-spinner" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ fontWeight: 600, color: '#94a3b8' }}>Synchronizing Catalog Data...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div 
            className="business-section" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '100px' }}
          >
            <FiBox style={{ fontSize: '4rem', color: 'var(--admin-gold)', marginBottom: '20px', opacity: 0.3 }} />
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem' }}>Inventory Exhausted</h3>
            <p style={{ color: '#94a3b8' }}>No records match your search criteria.</p>
          </motion.div>
        ) : (
          <div className="admin-data-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            <AnimatePresence>
              {filteredProducts.map((p, index) => (
                <motion.div 
                  key={p._id} 
                  className="business-section"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ marginBottom: '0', display: 'flex', flexDirection: 'column' }}
                >
                  <div className="admin-card-img-wrapper" style={{ height: '220px', borderRadius: '15px' }}>
                    {p.images && p.images.length > 0 ? (
                      <img src={getImageUrl(p.images[0])} alt={p.name} className="admin-card-img" />
                    ) : (
                      <FiImage style={{ fontSize: '2rem', opacity: 0.1 }} />
                    )}
                  </div>
                  <div style={{ margin: '20px 0 10px', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Playfair Display' }}>{p.name}</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <div className="admin-card-label">Valuation</div>
                      <div className="admin-card-value" style={{ margin: '0', fontSize: '1.2rem', color: 'var(--maroon)' }}>₹ {p.price.toLocaleString()}</div>
                    </div>
                    <span className="preview-tag" style={{ margin: '0' }}>{p.category || 'Standard'}</span>
                  </div>

                  <div className="admin-card-divider"></div>
                  <div className="admin-card-actions" style={{ border: 'none', paddingTop: '0' }}>
                    <button className="btn-view" style={{ flex: 1, borderRadius: '10px' }} onClick={() => openModal(p, 'view')}><FiEye /> View</button>
                    <button className="btn-edit" style={{ flex: 1, borderRadius: '10px' }} onClick={() => openModal(p, 'edit')}><FiEdit2 /> Edit</button>
                    <button className="btn-delete" style={{ padding: '10px', borderRadius: '10px' }} onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 🏛️ BUSINESS MODAL */}
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
              style={{ borderRadius: '24px', border: '1px solid var(--admin-gold-border)' }}
            >
              <div className="admin-modal-header" style={{ background: 'white', border: 'none', padding: '30px' }}>
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem' }}>{modalMode === 'view' ? 'Asset Intelligence' : 'Refine Catalog Entry'}</h3>
                <button className="admin-close-btn" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="admin-modal-body" style={{ padding: '0 30px 30px', maxHeight: '60vh', overflowY: 'auto' }}>
                  {modalMode === 'view' ? (
                     selectedProduct?.images?.length > 0 && (
                      <div className="admin-modal-img-wrapper" style={{ borderRadius: '15px' }}>
                        <img src={getImageUrl(selectedProduct.images[0])} alt={selectedProduct.name} className="admin-modal-img" />
                      </div>
                     )
                  ) : (
                    <div className="business-input-group" style={{ marginBottom: '20px' }}>
                      <label>Image Manager</label>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {formData.existingImages.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
                            <img src={getImageUrl(img)} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button type="button" onClick={() => removeExistingImage(img)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.7rem' }}>X</button>
                          </div>
                        ))}
                      </div>
                      <input type="file" multiple className="luxury-input" onChange={(e) => setFormData({...formData, newImages: e.target.files})} accept="image/*" />
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div className="business-input-group">
                      <label>Enterprise Name</label>
                      <input type="text" className="luxury-input" disabled={modalMode === 'view'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="business-input-group">
                      <label>Classification (Category)</label>
                      <select 
                        className="luxury-input" 
                        disabled={modalMode === 'view'} 
                        value={formData.category} 
                        onChange={(e) => setFormData({...formData, category: e.target.value})} 
                        required
                      >
                        <option value="">Select Classification</option>
                        <option value="Saree">Saree</option>
                        <option value="Kurtas & Suits">Kurtas & Suits</option>
                        <option value="Lehenga Choli">Lehenga Choli</option>
                        <option value="Gowns">Gowns</option>
                        <option value="Anarkali">Anarkali</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div className="business-input-group">
                      <label>Market Price (₹)</label>
                      <input type="number" className="luxury-input" disabled={modalMode === 'view'} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                    <div className="business-input-group">
                      <label>Inventory Stock</label>
                      <input type="number" className="luxury-input" disabled={modalMode === 'view'} value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
                    </div>
                  </div>
                  <div className="business-input-group" style={{ marginBottom: '20px' }}>
                      <label>Product Specifications</label>
                      {modalMode === 'view' ? (
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '15px' }}>
                          {formData.specifications.map((spec, idx) => (
                             <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', padding: '5px 0' }}>
                               <strong style={{ color: '#475569' }}>{spec.key}:</strong> 
                               <span style={{ color: '#0f172a' }}>{spec.value}</span>
                             </div>
                          ))}
                          {formData.specifications.length === 0 && <span style={{ color: '#94a3b8' }}>No specifications available</span>}
                        </div>
                      ) : (
                        <div>
                          {formData.specifications.map((spec, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                              <input type="text" placeholder="Key (e.g. Color)" className="luxury-input" style={{ width: '40%', padding: '10px 15px', fontSize: '0.9rem' }} value={spec.key} onChange={(e) => handleSpecChange(idx, 'key', e.target.value)} />
                              <input type="text" placeholder="Value (e.g. Red)" className="luxury-input" style={{ flex: 1, padding: '10px 15px', fontSize: '0.9rem' }} value={spec.value} onChange={(e) => handleSpecChange(idx, 'value', e.target.value)} />
                              <button type="button" onClick={() => removeSpec(idx)} className="btn-delete" style={{ padding: '0 15px', borderRadius: '10px', height: '42px' }}>X</button>
                            </div>
                          ))}
                          <button type="button" onClick={addSpec} className="admin-btn-outline" style={{ marginTop: '5px', padding: '8px 15px', borderRadius: '10px', fontSize: '0.85rem' }}>+ Add Specification</button>
                        </div>
                      )}
                  </div>
                </div>
                <div className="admin-modal-footer" style={{ background: '#f8fafc', padding: '20px 30px', border: 'none' }}>
                  <button type="button" className="admin-btn-outline" style={{ borderRadius: '12px' }} onClick={closeModal}>Close Console</button>
                  {modalMode === 'edit' && <button type="submit" className="btn-save-luxury" style={{ width: 'auto', padding: '10px 25px', marginTop: '0', borderRadius: '12px' }}>Authorize Changes</button>}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminProducts;
