import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome, FiPackage, FiUpload, FiX, FiCheck, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import '../styles/Admin.css';

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

  const categories = ['Saree', 'Kurti', 'Lehenga', 'Tunic', 'Dupatta'];

  const categoryFields = {
    Saree: [
      { label: 'Saree Color', name: 'sareeColor', type: 'text', placeholder: 'e.g. Royal Blue' },
      { label: 'Blouse Color', name: 'blouseColor', type: 'text', placeholder: 'e.g. Golden' },
      { label: 'Saree Fabric', name: 'sareeFabric', type: 'select', options: ['Soft Silk', 'Cotton', 'Chiffon', 'Georgette', 'Net', 'Banarasi Silk', 'Kanjivaram Silk', 'Organza', 'Crepe', 'Satin', 'Linen', 'Bandhani', 'Chanderi', 'Tussar Silk', 'Dola Silk', 'Jacquard', 'Velvet', 'Lycra', 'Georgette Silk', 'Cotton Silk'] },
      { label: 'Blouse Piece', name: 'blousePiece', type: 'select', options: ['Yes', 'No'] },
      { label: 'Blouse Fabric', name: 'blouseFabric', type: 'select', options: ['Silk', 'Cotton', 'Satin', 'Georgette', 'Velvet', 'Net', 'Jacquard', 'Brocade', 'Art Silk', 'Phantom Silk', 'Banglori Silk', 'Heavy Silk', 'Zari Silk'] },
      { label: 'Saree Length (mtr)', name: 'sareeLength', type: 'text' },
      { label: 'Blouse Length (mtr)', name: 'blouseLength', type: 'text' },
      { label: 'Work Type', name: 'workType', type: 'text' },
      { label: 'Border Type', name: 'borderType', type: 'text' },
      { label: 'Pattern', name: 'pattern', type: 'text' },
      { label: 'Occasion', name: 'occasion', type: 'text' },
      { label: 'Weight', name: 'weight', unitName: 'weightUnit', type: 'numberWithUnit', options: ['GMS', 'KG'] }
    ],
    Kurti: [
      { label: 'Fabric', name: 'fabric', type: 'select', options: ['Cotton', 'Rayon', 'Silk', 'Georgette', 'Chiffon', 'Crepe', 'Maslin', 'Havy Rayon', 'Cambric Cotton'] },
      { label: 'Length', name: 'length', type: 'select', options: ['Short', 'Calf', 'Full'] },
      { label: 'Sleeve Type', name: 'sleeve', type: 'text' },
      { label: 'Neck Type', name: 'neck', type: 'text' },
      { label: 'Fit Type', name: 'fit', type: 'text' },
      { label: 'Pattern', name: 'pattern', type: 'text' },
      { label: 'Size', name: 'size', type: 'text', placeholder: 'S, M, L, XL' },
      { label: 'Occasion', name: 'occasion', type: 'text' }
    ],
    Lehenga: [
      { label: 'Lehenga Fabric', name: 'lehengaFabric', type: 'text' },
      { label: 'Choli Fabric', name: 'choliFabric', type: 'text' },
      { label: 'Dupatta Fabric', name: 'dupattaFabric', type: 'text' },
      { label: 'Work Type', name: 'workType', type: 'text' },
      { label: 'Flare (mtr)', name: 'flare', type: 'text' },
      { label: 'Lehenga Length', name: 'length', type: 'text' },
      { label: 'Stitch Type', name: 'stitch', type: 'select', options: ['Stitched', 'Semi-stitched'] },
      { label: 'Occasion', name: 'occasion', type: 'text' },
      { label: 'Weight', name: 'weight', unitName: 'weightUnit', type: 'numberWithUnit', options: ['GMS', 'KG'] }
    ],
    Tunic: [
      { label: 'Fabric', name: 'fabric', type: 'text' },
      { label: 'Length', name: 'length', type: 'text' },
      { label: 'Sleeve Type', name: 'sleeve', type: 'text' },
      { label: 'Neck Style', name: 'neck', type: 'text' },
      { label: 'Fit Type', name: 'fit', type: 'text' },
      { label: 'Pattern', name: 'pattern', type: 'text' },
      { label: 'Closure', name: 'closure', type: 'text' },
      { label: 'Occasion', name: 'occasion', type: 'text' }
    ],
    Dupatta: [
      { label: 'Fabric', name: 'fabric', type: 'text' },
      { label: 'Dimensions', name: 'dimensions', type: 'text', placeholder: 'Length x Width' },
      { label: 'Work Type', name: 'workType', type: 'text' },
      { label: 'Border Style', name: 'border', type: 'text' },
      { label: 'Pattern', name: 'pattern', type: 'text' },
      { label: 'Weight', name: 'weight', unitName: 'weightUnit', type: 'numberWithUnit', options: ['GMS', 'KG'] },
      { label: 'Occasion', name: 'occasion', type: 'text' }
    ]
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setImages([...images, ...files]);
    const filePreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...filePreviews]);
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
    if (!category) {
      alert('Please select a category');
      return;
    }
    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category', category);
    data.append('stock', formData.stock);

    const finalSpecs = { ...formData.specifications };
    categoryFields[category].forEach(f => {
      if (f.type === 'numberWithUnit' && finalSpecs[f.name] && !finalSpecs[f.unitName]) {
        finalSpecs[f.unitName] = f.options[0];
      }
    });

    data.append('specifications', JSON.stringify(finalSpecs));
    images.forEach(img => data.append('images', img));

    try {
      await axios.post('http://localhost:5000/api/admin/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product added successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <Link to="/admin/dashboard" className="admin-logo" style={{ textDecoration: 'none' }}>
            <div className="admin-logo-icon">BG</div>
            <span className="admin-logo-text">Admin Panel</span>
          </Link>
          <nav className="admin-top-nav desktop-nav">
            <Link to="/admin/dashboard" className="admin-nav-item"><FiHome /> Dashboard</Link>
            <Link to="/admin/products" className="admin-nav-item active"><FiPackage /> Products</Link>
          </nav>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-content-header">
          <button className="admin-btn-back" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="admin-page-title">Add New Product</h2>
        </div>

        <div className="admin-content">
          <form className="admin-add-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              {/* Left Column: General Info */}
              <div className="admin-form-section">
                <div className="admin-card">
                  <div className="admin-card-header"><h3>General Information</h3></div>
                  <div className="admin-card-body">
                    <div className="admin-form-group">
                      <label>Product Title</label>
                      <input type="text" className="admin-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Designer Silk Saree" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Category</label>
                      <select className="admin-input" value={category} onChange={(e) => { setCategory(e.target.value); setFormData({...formData, specifications: {}}); }} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div className="admin-form-group">
                        <label>Price (₹)</label>
                        <input type="number" className="admin-input" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                      </div>
                      <div className="admin-form-group">
                        <label>Initial Stock</label>
                        <input type="number" className="admin-input" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Category Fields */}
                {category && (
                  <div className="admin-card" style={{ marginTop: '20px' }}>
                    <div className="admin-card-header"><h3>{category} Specifications</h3></div>
                    <div className="admin-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      {categoryFields[category].map(field => (
                        <div className="admin-form-group" key={field.name}>
                          <label>{field.label}</label>
                          {field.type === 'select' ? (
                            <select className="admin-input" value={formData.specifications[field.name] || ''} onChange={(e) => handleSpecChange(field.name, e.target.value)}>
                              <option value="">Select</option>
                              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : field.type === 'numberWithUnit' ? (
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <input type="number" className="admin-input" placeholder={field.placeholder || ''} value={formData.specifications[field.name] || ''} onChange={(e) => handleSpecChange(field.name, e.target.value)} />
                              <select className="admin-input" style={{ width: '100px' }} value={formData.specifications[field.unitName] || field.options[0]} onChange={(e) => handleSpecChange(field.unitName, e.target.value)}>
                                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            </div>
                          ) : (
                            <input type={field.type} className="admin-input" placeholder={field.placeholder || ''} value={formData.specifications[field.name] || ''} onChange={(e) => handleSpecChange(field.name, e.target.value)} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Images */}
              <div className="admin-form-section">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Product Images ({images.length}/5)</h3>
                  </div>
                  <div className="admin-card-body">
                    <div className="image-upload-zone" onClick={() => document.getElementById('imageInput').click()}>
                      <FiUpload style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--maroon)' }} />
                      <p>Click to upload images</p>
                      <span>Supports: JPG, PNG, WEBP (Max 5)</span>
                      <input type="file" id="imageInput" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </div>

                    <div className="image-preview-grid">
                      {previews.map((preview, index) => (
                        <div key={index} className="preview-item">
                          <img src={preview} alt="Preview" />
                          <button type="button" className="remove-img-btn" onClick={() => removeImage(index)}><FiX /></button>
                          {index === 0 && <span className="main-image-badge">Main Image</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="admin-actions-bar" style={{ marginTop: '20px' }}>
                  <button type="submit" className="admin-btn-save" disabled={loading}>
                    {loading ? 'Adding Product...' : <><FiCheck /> Save Product</>}
                  </button>
                  <button type="button" className="admin-btn-cancel" onClick={() => navigate('/admin/products')}>Cancel</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminAddProduct;
