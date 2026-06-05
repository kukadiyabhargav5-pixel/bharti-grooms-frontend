import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiPackage, FiArrowLeft, FiSearch, FiEye, FiEdit2, FiTrash2, FiBox, FiAlertCircle, FiXCircle, FiChevronLeft, FiRefreshCw, FiPlus, FiMinus, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminAddProduct.css'; 

const AdminStock = () => {
    const { status } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingStock, setEditingStock] = useState({});

    const handleStockUpdate = async (productId, newStock) => {
        if (newStock === undefined) return;
        try {
            await axios.put(`${API_BASE_URL}/api/admin/products/${productId}/stock`, { stock: newStock });
            fetchProducts(); 
        } catch (error) {
            console.error('Failed to update stock:', error);
        }
    };

    const handleInputChange = (productId, value) => {
        setEditingStock({ ...editingStock, [productId]: value });
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') { navigate('/login'); }
        fetchProducts();
    }, [navigate, status]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/products`);
            let filtered = res.data;
            if (status === 'in-stock') { filtered = filtered.filter(p => p.stock >= 5); } 
            else if (status === 'low-stock') { filtered = filtered.filter(p => p.stock > 0 && p.stock < 5); } 
            else if (status === 'out-of-stock') { filtered = filtered.filter(p => p.stock === 0); }
            setProducts(filtered);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPageTitle = () => {
        switch (status) {
            case 'in-stock': return 'Available Inventory';
            case 'low-stock': return 'Critical Stock Alerts';
            case 'out-of-stock': return 'Depleted Inventory';
            default: return 'Asset Management';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'in-stock': return <FiCheck />;
            case 'low-stock': return <FiAlertCircle />;
            case 'out-of-stock': return <FiXCircle />;
            default: return <FiBox />;
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout title="Inventory Intelligence">
            <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => navigate('/admin/dashboard')} className="admin-btn-outline" style={{ padding: '10px' }}><FiChevronLeft /></button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className="brand-icon-luxury" style={{ 
                            width: '45px', height: '45px', 
                            background: status === 'out-of-stock' ? '#ef4444' : status === 'low-stock' ? 'var(--admin-gold)' : 'var(--maroon)', 
                            color: 'white' 
                        }}>{getStatusIcon()}</div>
                        <h2 style={{ fontFamily: 'Playfair Display', margin: 0, fontSize: '1.6rem' }}>{getPageTitle()}</h2>
                    </div>
                </div>

                <div className="business-search-zone" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search Catalog Asset..."
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
                        <p style={{ fontWeight: 600, color: '#94a3b8' }}>Synchronizing Global Assets...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <motion.div 
                        className="business-section" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '100px' }}
                    >
                        <FiBox style={{ fontSize: '4rem', color: 'var(--admin-gold)', marginBottom: '20px', opacity: 0.3 }} />
                        <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem' }}>Registry Segment Empty</h3>
                        <p style={{ color: '#94a3b8' }}>No items match the current filtration state.</p>
                    </motion.div>
                ) : (
                    <div className="admin-data-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                        <AnimatePresence>
                            {filteredProducts.map((p, idx) => (
                                <motion.div 
                                    key={p._id} 
                                    className="business-section"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    style={{ marginBottom: '0', display: 'flex', flexDirection: 'column' }}
                                >
                                    <div style={{ position: 'relative', height: '280px', marginBottom: '20px', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                        <img 
                                            src={getImageUrl(p.images && p.images[0])} 
                                            alt={p.name} 
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }}
                                            onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Asset'; }}
                                        />
                                        <div style={{ 
                                            position: 'absolute', bottom: '15px', right: '15px', 
                                            padding: '8px 15px', borderRadius: '12px', backdropFilter: 'blur(10px)',
                                            background: p.stock >= 5 ? 'rgba(5, 150, 105, 0.9)' : p.stock > 0 ? 'rgba(217, 119, 6, 0.9)' : 'rgba(220, 38, 38, 0.9)',
                                            color: 'white', fontWeight: 800, fontSize: '0.85rem'
                                        }}>
                                            {p.stock} UNITS
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '15px' }}>
                                        <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', margin: '0 0 5px 0', color: '#1e293b' }}>{p.name}</h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>{p.category || 'General'}</span>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--maroon)' }}>₹ {p.price.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="admin-card-divider"></div>

                                    <div style={{ marginTop: 'auto' }}>
                                        <label className="admin-card-label" style={{ marginBottom: '10px', display: 'block', textAlign: 'center' }}>Adjust Stock Units</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '15px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                                <button 
                                                    onClick={() => handleInputChange(p._id, Math.max(0, (editingStock[p._id] !== undefined ? parseInt(editingStock[p._id]) : p.stock) - 1))}
                                                    style={{ width: '45px', height: '45px', borderRadius: '10px', border: 'none', background: 'white', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                                >
                                                    <FiMinus size={20} />
                                                </button>
                                                <input 
                                                    type="number" 
                                                    style={{ width: '80px', height: '45px', padding: '0 5px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '10px', background: 'white', fontWeight: '800', fontSize: '1.2rem', outline: 'none', color: '#0f172a' }}
                                                    value={editingStock[p._id] !== undefined ? editingStock[p._id] : p.stock}
                                                    onChange={(e) => handleInputChange(p._id, e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                                                    min="0"
                                                />
                                                <button 
                                                    onClick={() => handleInputChange(p._id, (editingStock[p._id] !== undefined ? parseInt(editingStock[p._id] || 0) : p.stock) + 1)}
                                                    style={{ width: '45px', height: '45px', borderRadius: '10px', border: 'none', background: 'white', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                                >
                                                    <FiPlus size={20} />
                                                </button>
                                            </div>
                                            <button 
                                                className="btn-save-luxury"
                                                style={{ width: '100%', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', borderRadius: '10px', margin: 0 }}
                                                onClick={() => handleStockUpdate(p._id, editingStock[p._id] !== undefined ? (parseInt(editingStock[p._id]) || 0) : p.stock)}
                                                title="Synchronize Stock"
                                            >
                                                <FiRefreshCw size={16} /> Sync Latest Value
                                            </button>
                                        </div>

                                        <button 
                                            className="admin-btn-outline" 
                                            onClick={() => navigate(`/product/${p._id}`)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '12px' }}
                                        >
                                            <FiEye /> Inspect Live
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminStock;
