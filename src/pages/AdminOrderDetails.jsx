import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiUser, FiPackage, FiMapPin, FiPhone, FiMail, FiCreditCard, FiClock, FiBox, FiTruck, FiCheck, FiPrinter, FiChevronLeft, FiInfo, FiTag, FiShoppingBag } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminAddProduct.css'; 

const AdminOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/orders/${id}`);
            setOrder(res.data);
        } catch (error) {
            console.error('Failed to fetch order details:', error);
            navigate('/admin/dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') { navigate('/login'); }
        fetchOrderDetails();
    }, [id, navigate]);

    const handleStatusUpdate = async (nextStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/api/admin/orders/${id}/status`, { status: nextStatus });
            fetchOrderDetails();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Order Intelligence">
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="admin-loading-spinner" style={{ margin: '0 auto' }}></div>
                </div>
            </AdminLayout>
        );
    }

    if (!order) return null;

    const getStatusStep = () => {
        if (order.status === 'Pending') return 1;
        if (order.status === 'Ready to Ship') return 2;
        if (order.status === 'Out for Delivery') return 3;
        if (order.status === 'Delivered') return 4;
        return 0;
    };

    return (
        <AdminLayout title="Logistics Depth Analysis">
            <div className="admin-content-header no-print" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => navigate(-1)} className="admin-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 20px' }}>
                    <FiChevronLeft /> Logistics Dashboard
                </button>
                <button onClick={() => window.print()} className="btn-save-luxury" style={{ width: 'auto', marginTop: 0, padding: '10px 25px', background: '#1e293b' }}>
                    <FiPrinter /> Generate Physical Invoice
                </button>
            </div>

            <div className="admin-content">
                {/* 🏛️ OPERATIONAL STATUS HUB */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="business-section no-print"
                    style={{ marginBottom: '30px', padding: '30px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '900px', margin: '0 auto' }}>
                        {[
                            { label: 'Pending', icon: <FiClock />, step: 1 },
                            { label: 'Packed', icon: <FiBox />, step: 2 },
                            { label: 'Shipped', icon: <FiTruck />, step: 3 },
                            { label: 'Delivered', icon: <FiCheck />, step: 4 }
                        ].map((s, i, arr) => (
                            <div key={s.label} style={{ display: 'flex', alignItems: 'center', flex: i === arr.length - 1 ? 'none' : 1 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'relative' }}>
                                    <div className="brand-icon-luxury" style={{ 
                                        width: '50px', height: '50px', 
                                        background: getStatusStep() >= s.step ? 'var(--maroon)' : '#f1f5f9',
                                        color: getStatusStep() >= s.step ? 'white' : '#94a3b8',
                                        boxShadow: getStatusStep() === s.step ? '0 0 15px rgba(96, 0, 24, 0.3)' : 'none'
                                    }}>
                                        {s.icon}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: getStatusStep() >= s.step ? 'var(--maroon)' : '#94a3b8', textTransform: 'uppercase' }}>{s.label}</span>
                                </div>
                                {i !== arr.length - 1 && (
                                    <div style={{ flex: 1, height: '3px', background: getStatusStep() > s.step ? 'var(--maroon)' : '#f1f5f9', margin: '0 15px', marginTop: '-20px', borderRadius: '3px' }}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }} className="details-layout-container">
                    <div className="main-log-column">
                        {/* 👤 CUSTOMER INTEL */}
                        <motion.section 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="business-section"
                            style={{ marginBottom: '30px' }}
                        >
                            <h3 className="section-title-luxury"><FiUser /> Customer Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                                <div className="business-input-group">
                                    <label>Identity</label>
                                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e293b' }}>{order.customer?.name || 'Authorized Guest'}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--maroon)', fontWeight: 600 }}>{order.customer?.email || 'No Registry Email'}</div>
                                </div>
                                <div className="business-input-group">
                                    <label>Shipping Target</label>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#475569', lineHeight: '1.6' }}><FiMapPin /> {order.customer?.address || 'Pickup Required'}</div>
                                </div>
                            </div>
                        </motion.section>

                        {/* 📦 ASSET MANIFEST */}
                        <motion.section 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="business-section"
                        >
                            <h3 className="section-title-luxury"><FiPackage /> Asset Manifest</h3>
                            <div className="luxury-table-container" style={{ marginTop: '20px' }}>
                                <table className="luxury-table">
                                    <thead>
                                        <tr>
                                            <th>Product Asset</th>
                                            <th>Quantification</th>
                                            <th style={{ textAlign: 'right' }}>Valuation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.products?.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <img 
                                                            src={getImageUrl(item.photo || item.image || (item.images && item.images[0]))} 
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px' }}
                                                            className="no-print"
                                                        />
                                                        <div>
                                                            <div style={{ fontWeight: 800, fontSize: '1rem' }}>{item.name}</div>
                                                            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>ID: #{item._id?.slice(-6).toUpperCase()}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 700 }}>₹{item.price.toLocaleString()} x {item.quantity}</td>
                                                <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--maroon)' }}>₹{(item.price * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr style={{ background: '#f8fafc' }}>
                                            <td colSpan="2" style={{ textAlign: 'right', padding: '20px', fontWeight: 800, fontSize: '1.1rem' }}>GRAND TOTAL VALUATION</td>
                                            <td style={{ textAlign: 'right', padding: '20px', fontWeight: 900, fontSize: '1.5rem', color: 'var(--maroon)', borderLeft: '2px solid #edf2f7' }}>₹{order.totalAmount.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </motion.section>
                    </div>

                    <div className="side-action-column">
                        {/* ⚡ COMMAND ACTIONS */}
                        <motion.section 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="business-section no-print"
                            style={{ marginBottom: '30px' }}
                        >
                            <h3 className="section-title-luxury"><FiInfo /> Command Center</h3>
                            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div className="status-pill-luxury status-read" style={{ textAlign: 'center', padding: '12px', fontSize: '1rem' }}>
                                    Current Status: <strong>{order.status}</strong>
                                </div>
                                {order.status === 'Pending' && (
                                    <button onClick={() => handleStatusUpdate('Ready to Ship')} className="btn-save-luxury" style={{ marginTop: 0, padding: '15px', background: '#2563eb' }}>
                                        Mark as Ready to Ship
                                    </button>
                                )}
                                {order.status === 'Ready to Ship' && (
                                    <button onClick={() => handleStatusUpdate('Out for Delivery')} className="btn-save-luxury" style={{ marginTop: 0, padding: '15px', background: '#9333ea' }}>
                                        Dispatch to Courier
                                    </button>
                                )}
                                {order.status === 'Out for Delivery' && (
                                    <button onClick={() => handleStatusUpdate('Delivered')} className="btn-save-luxury" style={{ marginTop: 0, padding: '15px', background: '#059669' }}>
                                        Confirm Delivery
                                    </button>
                                )}
                            </div>
                        </motion.section>

                        {/* 🧾 FINANCIAL INTELLIGENCE */}
                        <motion.section 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="business-section"
                        >
                            <h3 className="section-title-luxury"><FiCreditCard /> Financial Intel</h3>
                            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="business-input-group">
                                    <label>Transaction Protocol</label>
                                    <div style={{ fontWeight: 800, textTransform: 'uppercase', color: 'var(--maroon)' }}>{order.payment?.method || 'CASH ON DELIVERY'}</div>
                                </div>
                                <div className="business-input-group">
                                    <label>Payment Registry ID</label>
                                    <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', background: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>{order.payment?.orderId || 'N/A: OFFLINE_AUTH'}</div>
                                </div>
                                <div className="business-input-group">
                                    <label>Asset Recovery Hash</label>
                                    <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', background: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>{order.payment?.transactionId || 'RESERVED_FOR_VERIFICATION'}</div>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </div>

            <style>{`
                .section-title-luxury {
                    font-family: 'Playfair Display';
                    font-size: 1.3rem;
                    color: #1e293b;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 0;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #edf2f7;
                }
                .section-title-luxury svg { color: var(--maroon); }
                
                @media print {
                    .no-print { display: none !important; }
                    .admin-layout { background: white !important; padding: 0 !important; }
                    .business-section { border: none !important; box-shadow: none !important; padding: 0 !important; margin-bottom: 30px !important; }
                    .details-layout-container { display: block !important; }
                    .luxury-table { border: 1px solid #eee !important; width: 100% !important; }
                    .luxury-table th { background: #f8fafc !important; color: black !important; }
                }
            `}</style>
        </AdminLayout>
    );
};

export default AdminOrderDetails;
