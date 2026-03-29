import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome, FiPackage, FiUpload, FiX, FiCheck, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';        headers: { 'Content-Type': 'multipart/form-data' }
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
