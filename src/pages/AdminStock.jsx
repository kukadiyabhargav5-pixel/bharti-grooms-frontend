import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiHome, FiPackage, FiArrowLeft, FiSearch, FiEye, FiEdit2, FiTrash2, FiBox, FiAlertCircle, FiXCircle } from 'react-icons/fi';
import axios from 'axios';
import '../styles/Admin.css';

const AdminStock = () => {
    const { status } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingStock, setEditingStock] = useState({});

    const handleStockUpdate = async (productId, newStock) => {
        if (newStock < 0) return;
        try {
            await axios.put(`http://localhost:5000/api/admin/products/${productId}/stock`, { stock: parseInt(newStock) });
            fetchProducts(); // Refresh list, product might move to another page
        } catch (error) {
            console.error('Failed to update stock:', error);
            alert('Failed to update stock');
        }
    };

    const handleInputChange = (productId, value) => {
        setEditingStock({ ...editingStock, [productId]: value });
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
        window.scrollTo(0, 0);
        fetchProducts();
    }, [navigate, status]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/admin/products');
            let filtered = res.data;

            if (status === 'in-stock') {
                filtered = filtered.filter(p => p.stock >= 5);
            } else if (status === 'low-stock') {
                filtered = filtered.filter(p => p.stock > 0 && p.stock < 5);
            } else if (status === 'out-of-stock') {
                filtered = filtered.filter(p => p.stock === 0);
            }

            setProducts(filtered);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPageTitle = () => {
        switch (status) {
            case 'in-stock': return 'In Stock Products';
            case 'low-stock': return 'Low Stock Alerts';
            case 'out-of-stock': return 'Out of Stock Items';
            default: return 'Stock Management';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'in-stock': return <FiBox style={{ color: '#10b981' }} />;
            case 'low-stock': return <FiAlertCircle style={{ color: '#f59e0b' }} />;
            case 'out-of-stock': return <FiXCircle style={{ color: '#ef4444' }} />;
            default: return <FiPackage />;
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
                    <nav className="admin-top-nav desktop-nav">
                        <Link to="/admin/dashboard" className="admin-nav-item"><FiHome /> Dashboard</Link>
                        <Link to="/admin/products" className="admin-nav-item active"><FiPackage /> Products</Link>
                    </nav>
                </div>
            </header>

            <main className="admin-main">
                <div className="admin-content-header" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button onClick={() => navigate('/admin/dashboard')} className="admin-back-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '1.2rem' }}>
                            <FiArrowLeft />
                        </button>
                        <h2 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {getStatusIcon()} {getPageTitle()}
                        </h2>
                    </div>

                    <div className="admin-search-wrapper" style={{ maxWidth: '400px' }}>
                        <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 1 }} />
                        <input
                            type="text"
                            placeholder="Search in this list..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-search-input"
                        />
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
                            <p style={{ color: '#94a3b8' }}>No items match the selected stock status.</p>
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
                                        <div className={`stock-badge ${p.stock >= 5 ? 'in' : p.stock > 0 ? 'low' : 'out'}`}>
                                            {p.stock} in stock
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '1.1rem' }}>{p.name}</div>
                                    <div className="admin-card-label">Price</div>
                                    <div className="admin-card-value">₹ {p.price.toLocaleString()}</div>
                                    <div className="admin-card-label">Category</div>
                                    <div className="admin-card-value">{p.category || 'N/A'}</div>
                                    <div className="admin-card-divider"></div>
                                    
                                    <div className="stock-manage-inline">
                                        <input 
                                            type="number" 
                                            className="stock-edit-input"
                                            value={editingStock[p._id] !== undefined ? editingStock[p._id] : p.stock}
                                            onChange={(e) => handleInputChange(p._id, e.target.value)}
                                            min="0"
                                        />
                                        <button 
                                            className="stock-update-btn"
                                            onClick={() => handleStockUpdate(p._id, editingStock[p._id] !== undefined ? editingStock[p._id] : p.stock)}
                                        >
                                            Update Stock
                                        </button>
                                    </div>

                                    <div className="admin-card-actions" style={{ marginTop: '10px' }}>
                                        <button className="admin-card-btn btn-view" onClick={() => navigate(`/product/${p._id}`)}><FiEye /> View Site</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminStock;
