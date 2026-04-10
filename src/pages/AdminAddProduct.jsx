import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome, FiPackage, FiUpload, FiX, FiCheck, FiArrowLeft, FiPlusCircle, FiFileText, FiLayers, FiImage, FiTrendingUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminAddProduct.css'; 

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    specifications: {}
  });

  const categories = ['Saree', 'Kurtas & Suits', 'Lehenga Choli', 'Gowns', 'Anarkali'];

  const categoryFields = {
    'Saree': [
      { 
        name: 'fabric', 
        label: 'Saree Fabric', 
        type: 'select', 
        options: ['Silk', 'Soft Silk', 'Cotton', 'Georgette', 'Chiffon', 'Net', 'Organza', 'Crepe', 'Satin', 'Velvet', 'Linen', 'Chanderi', 'Banarasi'] 
      },
      { name: 'sareeColor', label: 'Saree Color', type: 'text', placeholder: 'e.g. Royal Blue' },
      { 
        name: 'blouseFabric', 
        label: 'Blouse Fabric', 
        type: 'select', 
        options: ['Silk', 'Soft Silk', 'Cotton', 'Georgette', 'Chiffon', 'Net', 'Organza', 'Crepe', 'Satin', 'Velvet', 'Linen', 'Chanderi', 'Banarasi'] 
      },
      { name: 'blouseColor', label: 'Blouse Color', type: 'text', placeholder: 'e.g. Gold' },
      { name: 'blousePiece', label: 'Blouse Piece', type: 'select', options: ['Yes', 'No'] },
      { name: 'sareeLength', label: 'Saree Length', type: 'numberWithUnit', options: ['Meters'], unitName: 'sareeLengthUnit' },
      { name: 'blouseLength', label: 'Blouse Length', type: 'numberWithUnit', options: ['Meters'], unitName: 'blouseLengthUnit' },
      { name: 'sareeWeight', label: 'Saree Weight', type: 'numberWithUnit', options: ['Gms', 'Kg'], unitName: 'sareeWeightUnit' },
      { 
        name: 'occasion', 
        label: 'Occasion', 
        type: 'select', 
        options: ['Wedding', 'Party Wear', 'Festival', 'Casual', 'Bridal', 'Reception', 'Traditional'] 
      },
      { name: 'work', label: 'Work Type', type: 'text', placeholder: 'e.g. Embroidery' }
    ],
    'Kurtas & Suits': [
      { name: 'fabric', label: 'Fabric', type: 'text' },
      { name: 'style', label: 'Style', type: 'text' },
      { name: 'neck', label: 'Neck Type', type: 'text' },
      { name: 'sleeves', label: 'Sleeves', type: 'text' }
    ],
    'Lehenga Choli': [
      { name: 'fabric', label: 'Fabric', type: 'text' },
      { name: 'work', label: 'Work', type: 'text' },
      { name: 'flare', label: 'Flare', type: 'text' },
      { name: 'dupatta', label: 'Dupatta', type: 'text' }
    ],
    'Gowns': [
      { name: 'fabric', label: 'Fabric', type: 'text' },
      { name: 'length', label: 'Length', type: 'text' },
      { name: 'neck', label: 'Neck', type: 'text' }
    ],
    'Anarkali': [
      { name: 'fabric', label: 'Fabric', type: 'text' },
      { name: 'flare', label: 'Flare', type: 'text' },
      { name: 'work', label: 'Work', type: 'text' }
    ]
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setImages([...images, ...files]);
    const bundle = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...bundle]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSpecChange = (name, value) => {
    setFormData({
      ...formData,
      specifications: { ...formData.specifications, [name]: value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('category', category);
    data.append('specifications', JSON.stringify(formData.specifications));
    images.forEach(image => data.append('images', image));

    try {
      await axios.post(`${API_BASE_URL}/api/admin/products`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product Added to Global Catalog Successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to connect to business catalog');
    } finally {
      setLoading(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <AdminLayout title="Add Enterprise Product">
      <main className="command-center-layout" style={{ margin: '0', padding: '0', gridTemplateColumns: '1fr 400px' }}>
        {/* 📋 MAIN FORM AREA */}
        <form onSubmit={handleSubmit} id="masterProductForm">
          {/* Section 1: Core Product Identity */}
          <motion.div 
            className="business-section"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="section-header">
              <div className="section-icon"><FiFileText /></div>
              <h3>Product Identity</h3>
            </div>
            
            <div className="premium-form-grid">
              <div className="business-input-group full-width">
                <label>Official Product Name</label>
                <input 
                  type="text" 
                  className="luxury-input" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Masterpiece Silk Saree - Ruby Edition" 
                  required 
                />
              </div>
              
              <div className="business-input-group">
                <label>Inventory Category</label>
                <select 
                  className="luxury-input" 
                  value={category} 
                  onChange={(e) => { setCategory(e.target.value); setFormData({...formData, specifications: {}}); }} 
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="business-input-group">
                <label>Business Price (₹)</label>
                <input 
                  type="number" 
                  className="luxury-input" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                  required 
                />
              </div>

              <div className="business-input-group full-width">
                <label>Global Stock Level</label>
                <input 
                  type="number" 
                  className="luxury-input" 
                  value={formData.stock} 
                  onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                  required 
                />
              </div>
            </div>
          </motion.div>

          {/* Section 2: Detailed Specifications */}
          <AnimatePresence mode="wait">
            {category && (
              <motion.div 
                key={category}
                className="business-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="section-header">
                  <div className="section-icon"><FiLayers /></div>
                  <h3>{category} Specifications</h3>
                </div>
                
                <div className="premium-form-grid spec-panel-gold">
                  {categoryFields[category].map(field => (
                    <div className="business-input-group" key={field.name}>
                      <label>{field.label}</label>
                      {field.type === 'select' ? (
                        <select 
                          className="luxury-input" 
                          value={formData.specifications[field.name] || ''} 
                          onChange={(e) => handleSpecChange(field.name, e.target.value)}
                        >
                          <option value="">Select</option>
                          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : field.type === 'numberWithUnit' ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input 
                            type="number" 
                            className="luxury-input" 
                            placeholder={field.placeholder || ''} 
                            value={formData.specifications[field.name] || ''} 
                            onChange={(e) => handleSpecChange(field.name, e.target.value)} 
                          />
                          <select 
                            className="luxury-input" 
                            style={{ width: '120px' }} 
                            value={formData.specifications[field.unitName] || field.options[0]} 
                            onChange={(e) => handleSpecChange(field.unitName, e.target.value)}
                          >
                            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      ) : (
                        <input 
                          type={field.type} 
                          className="luxury-input" 
                          placeholder={field.placeholder || ''} 
                          value={formData.specifications[field.name] || ''} 
                          onChange={(e) => handleSpecChange(field.name, e.target.value)} 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 3: Media Management */}
          <motion.div 
            className="business-section"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="section-header">
              <div className="section-icon"><FiImage /></div>
              <h3>Media Assets</h3>
            </div>
            
            <div className="luxury-upload-area" onClick={() => document.getElementById('imageInput').click()}>
              <div className="upload-icon-gold"><FiUpload /></div>
              <p style={{ fontWeight: 700, margin: '10px 0' }}>Drop Product Photography Here</p>
              <span style={{ fontSize: '0.8rem', color: '#95a5a6' }}>Supports Studio Grade JPG, PNG, WEBP (Max 5 Files)</span>
              <input 
                type="file" 
                id="imageInput" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
              />
            </div>

            <div className="image-status-grid">
              {previews.map((preview, index) => (
                <div key={index} className="status-thumb">
                  <img src={preview} alt="Preview" />
                  <button type="button" className="thumb-remove" onClick={() => removeImage(index)}><FiX /></button>
                </div>
              ))}
            </div>
          </motion.div>
        </form>

        {/* 🗄️ STICKY ACTION SIDEBAR */}
        <div className="action-sidebar-sticky">
          <motion.div 
            className="business-section preview-card-premium"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="preview-image-placeholder">
              {previews.length > 0 ? (
                <img src={previews[0]} alt="Live Preview" />
              ) : (
                <FiImage style={{ fontSize: '3rem', opacity: 0.2 }} />
              )}
            </div>
            <div className="preview-content">
              <span className="preview-tag">{category || 'Category'}</span>
              <h4 className="preview-title">{formData.name || 'Untitled Enterprise Product'}</h4>
              <div className="preview-price">
                <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>Market Valuation</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>₹{formData.price || '0'}</div>
              </div>
            </div>
          </motion.div>

          <div className="sidebar-stats-card business-section" style={{ padding: '20px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#27ae60' }}>
              <FiTrendingUp />
              <span style={{ fontWeight: 600 }}>Ready for Global Catalog</span>
            </div>
          </div>

          <button 
            type="submit" 
            form="masterProductForm" 
            className="btn-save-luxury" 
            disabled={loading}
          >
            {loading ? 'Processing Global Sync...' : <><FiCheck /> Authorize & Save Product</>}
          </button>
          
          <button 
            type="button" 
            className="admin-btn-outline" 
            style={{ width: '100%', marginTop: '15px', padding: '15px' }} 
            onClick={() => navigate('/admin/products')}
          >
            Discard Draft
          </button>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminAddProduct;
