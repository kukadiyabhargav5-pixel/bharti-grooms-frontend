import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiPackage, FiArrowLeft, FiSearch, FiEye, FiClock, FiBox, FiTruck, FiCheck, FiShoppingBag, FiTrash2, FiDownload, FiChevronLeft, FiMapPin, FiUser, FiInfo } from 'react-icons/fi';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminAddProduct.css'; 

const AdminOrders = () => {
    const { status } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState(null);
    const [trackingOrderId, setTrackingOrderId] = useState(null);
    const [trackingNumber, setTrackingNumber] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        const statusMap = {
            'pending': 'Pending',
            'ready-to-ship': 'Ready to Ship',
            'out-for-delivery': 'Out for Delivery',
            'delivered': 'Delivered'
        };
        const backendStatus = statusMap[status] || status;

        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/orders`, {
                params: { status: backendStatus }
            });
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [status]);

    const handleStatusUpdate = async (orderId, nextStatus) => {
        setProcessingId(orderId);
        try {
            await axios.put(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, { status: nextStatus });
            fetchOrders();
        } catch (error) {
            console.error('Failed to update order status:', error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleSendTracking = async (orderId) => {
        if (!trackingNumber.trim()) return alert('Please enter a tracking number');
        setProcessingId(orderId);
        try {
            await axios.post(`${API_BASE_URL}/api/admin/orders/${orderId}/tracking`, { trackingId: trackingNumber });
            alert('Tracking ID sent successfully directly to customer email!');
            setTrackingOrderId(null);
            setTrackingNumber('');
            fetchOrders();
        } catch (error) {
            console.error('Failed to send tracking details:', error);
            alert('Failed to update tracking');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDownloadInvoice = (order) => {
        const invoiceContent = `
            <div style="font-family: 'Poppins', sans-serif; padding: 40px; color: #1e293b; position: relative; background: white;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #1e293b; padding-bottom: 20px;">
                    <h1 style="margin: 0; font-size: 32px; letter-spacing: 4px; font-weight: 900; text-transform: uppercase;">BHARTI GLOOMS</h1>
                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #475569; letter-spacing: 2px;">PREMIUM ETHNIC WEAR</p>
                </div>
                <!-- Invoice Body Content -->
                <div style="display: flex; justify-content: space-between; margin-bottom: 40px; gap: 40px;">
                    <div>
                        <h3 style="font-size: 14px; color: #94a3b8; margin-bottom: 10px;">CUSTOMER</h3>
                        <p style="margin: 0; font-weight: 800;">${order.customer?.name || 'N/A'}</p>
                        <p style="margin: 0;">${order.customer?.email || 'N/A'}</p>
                    </div>
                    <div style="text-align: right;">
                        <h3 style="font-size: 14px; color: #94a3b8; margin-bottom: 10px;">SHIPPING TARGET</h3>
                        <p style="margin: 0; font-weight: 700; max-width: 300px;">${order.customer?.address || 'N/A'}</p>
                    </div>
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background: #f8fafc; text-align: left;">
                            <th style="padding: 15px; border-bottom: 2px solid #e2e8f0;">ASSET</th>
                            <th style="padding: 15px; border-bottom: 2px solid #e2e8f0;">PRICE</th>
                            <th style="padding: 15px; border-bottom: 2px solid #e2e8f0;">QTY</th>
                            <th style="padding: 15px; border-bottom: 2px solid #e2e8f0; text-align: right;">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.products.map(p => `
                            <tr>
                                <td style="padding: 15px; border-bottom: 1px solid #f1f5f9; font-weight: 700;">${p.name}</td>
                                <td style="padding: 15px; border-bottom: 1px solid #f1f5f9;">₹${p.price.toLocaleString()}</td>
                                <td style="padding: 15px; border-bottom: 1px solid #f1f5f9;">${p.quantity}</td>
                                <td style="padding: 15px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 800;">₹${(p.price * p.quantity).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 250px; background: #f8fafc; padding: 25px; border-radius: 20px; border: 1px solid #edf2f7;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: 800; font-size: 18px; color: #600018;">
                            <span>GRAND TOTAL</span>
                            <span>₹${order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const element = document.createElement('div');
        element.innerHTML = invoiceContent;
        document.body.appendChild(element);
        const opt = {
            margin: [10, 10],
            filename: `Bharti_Glooms_Order_${order._id.slice(-6).toUpperCase()}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save().then(() => {
            document.body.removeChild(element);
        });

        if (order.status === 'Pending') {
            handleStatusUpdate(order._id, 'Ready to Ship');
        }
    };

    const getPageTitle = () => {
        switch (status) {
            case 'pending': return 'Pending Log';
            case 'ready-to-ship': return 'Ready for Dispatch';
            case 'out-for-delivery': return 'Active Transit';
            case 'delivered': return 'Successfully Executed';
            default: return 'Order Stream';
        }
    };

    const handleDeleteOrder = async (id) => {
        if (window.confirm('Terminate this order record permanently?')) {
            setProcessingId(id);
            try {
                await axios.delete(`${API_BASE_URL}/api/admin/orders/${id}`);
                fetchOrders();
            } catch (error) {
                alert('Deletion failed');
            } finally {
                setProcessingId(null);
            }
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'pending': return <FiClock />;
            case 'ready-to-ship': return <FiBox />;
            case 'out-for-delivery': return <FiTruck />;
            case 'delivered': return <FiCheck />;
            default: return <FiShoppingBag />;
        }
    };

    const getNextStatus = () => {
        if (status === 'pending') return 'Ready to Ship';
        if (status === 'ready-to-ship') return 'Out for Delivery';
        if (status === 'out-for-delivery') return 'Delivered';
        return null;
    };

    const filteredOrders = orders.filter(o =>
        (o.customer?.name || o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        o._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Operational Logistics">
            <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => navigate('/admin/dashboard')} className="admin-btn-outline" style={{ padding: '10px' }}><FiChevronLeft /></button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className="brand-icon-luxury" style={{ width: '45px', height: '45px', background: 'var(--maroon)', color: 'white' }}>{getStatusIcon()}</div>
                        <h2 style={{ fontFamily: 'Playfair Display', margin: 0, fontSize: '1.6rem' }}>{getPageTitle()}</h2>
                    </div>
                </div>

                <div className="business-search-zone" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search Logistics ID or Customer..."
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
                        <p style={{ fontWeight: 600, color: '#94a3b8' }}>Synchronizing Global Orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <motion.div 
                        className="business-section" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '100px' }}
                    >
                        <FiShoppingBag style={{ fontSize: '4rem', color: 'var(--admin-gold)', marginBottom: '20px', opacity: 0.3 }} />
                        <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem' }}>Logistics Node Empty</h3>
                        <p style={{ color: '#94a3b8' }}>No active orders found in this operational segment.</p>
                    </motion.div>
                ) : (
                    <div className="admin-data-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '25px' }}>
                        <AnimatePresence>
                            {filteredOrders.map((o, idx) => (
                                <motion.div 
                                    key={o._id} 
                                    className="business-section"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    style={{ marginBottom: '0', display: 'flex', flexDirection: 'column' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>LOGS ID: #{o._id.slice(-8).toUpperCase()}</div>
                                            {o.trackingId && (
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.5px', marginTop: '6px', display: 'flex', alignItems: 'center', background: '#eff6ff', padding: '4px 8px', borderRadius: '6px', width: 'fit-content' }}>
                                                    <FiTruck style={{ marginRight: '6px' }} /> AWB: {o.trackingId}
                                                </div>
                                            )}
                                        </div>
                                        <span className={`status-pill-luxury ${status === 'pending' ? 'status-unread' : 'status-read'}`} style={{ margin: 0, borderRadius: '8px' }}>
                                            {o.status}
                                        </span>
                                    </div>

                                    <div className="admin-card-divider"></div>

                                    {o.products && o.products.length > 0 && (
                                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '15px', border: '1px solid #edf2f7', alignItems: 'center' }}>
                                            <div style={{ position: 'relative', width: '80px', height: '100px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.08)', backgroundColor: '#fff', flexShrink: 0 }}>
                                                <img 
                                                    src={getImageUrl(o.products[0].photo || o.products[0].image || (o.products[0].images && o.products[0].images[0]))} 
                                                    alt="Asset" 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                                                    onError={(e) => { e.target.src = 'https://placehold.co/100x120?text=Asset'; }}
                                                />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem', lineHeight: '1.2', marginBottom: '6px' }}>{o.products[0].name}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--maroon)', fontWeight: 700 }}>
                                                    Qty: {o.products[0].quantity} {o.products.length > 1 ? `(+${o.products.length - 1} items)` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="business-input-group" style={{ marginBottom: '20px' }}>
                                        <label style={{ fontSize: '0.75rem' }}><FiUser /> Destination Customer</label>
                                        <div style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Playfair Display' }}>{o.customer?.name || o.user?.name || 'Authorized Guest'}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}><FiMapPin style={{ marginRight: '5px' }} /> {o.customer?.address || 'No Registry Address'}</div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                        <div>
                                            <div className="admin-card-label">Timestamp</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ textAlignment: 'right' }}>
                                            <div className="admin-card-label" style={{ textAlign: 'right' }}>Net Valuation</div>
                                            <div style={{ fontWeight: 900, color: 'var(--maroon)', fontSize: '1.4rem' }}>₹ {o.totalAmount.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="admin-card-divider" style={{ margin: '15px 0' }}></div>

                                    {trackingOrderId === o._id ? (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }} 
                                            animate={{ height: 'auto', opacity: 1 }} 
                                            className="tracking-input-zone" 
                                            style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                        >
                                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Enter AWB / Tracking ID</label>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. BLUDART12345" 
                                                    value={trackingNumber} 
                                                    onChange={(e) => setTrackingNumber(e.target.value)} 
                                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} 
                                                />
                                                <button 
                                                    onClick={() => handleSendTracking(o._id)} 
                                                    disabled={processingId === o._id}
                                                    style={{ padding: '10px 15px', background: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: '0.2s', opacity: processingId === o._id ? 0.7 : 1 }}
                                                >
                                                    {processingId === o._id ? 'Sending...' : 'Save & Send'}
                                                </button>
                                            </div>
                                            <button onClick={() => setTrackingOrderId(null)} style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', padding: 0, fontWeight: 600 }}>Cancel Action</button>
                                        </motion.div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                                            {/* Primary Action Row */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                {getNextStatus() && (
                                                    <button 
                                                        className="btn-save-luxury"
                                                        onClick={() => handleStatusUpdate(o._id, getNextStatus())}
                                                        disabled={processingId === o._id}
                                                        style={{ margin: 0, padding: '10px', fontSize: '0.85rem', background: 'var(--admin-gold)', color: '#600018', borderRadius: '10px' }}
                                                    >
                                                        <FiCheck /> {processingId === o._id ? 'Processing...' : `Mark ${getNextStatus()}`}
                                                    </button>
                                                )}
                                                {(o.status === 'Ready to Ship' || o.status === 'Out for Delivery' || o.status === 'Pending') && (
                                                    <button 
                                                        className="btn-save-luxury"
                                                        onClick={() => setTrackingOrderId(o._id)}
                                                        disabled={processingId === o._id}
                                                        style={{ margin: 0, padding: '10px', fontSize: '0.85rem', background: '#3b82f6', color: 'white', borderRadius: '10px' }}
                                                    >
                                                        <FiTruck /> {o.trackingId ? 'Change Tracking ID' : 'Add Tracking ID'}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Secondary Action Row */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                                <button 
                                                    className="admin-btn-outline" 
                                                    onClick={() => handleDownloadInvoice(o)}
                                                    style={{ padding: '8px', borderRadius: '8px', fontSize: '0.8rem', background: '#fff', borderColor: '#e2e8f0' }}
                                                >
                                                    <FiDownload /> Invoice
                                                </button>
                                                <button 
                                                    className="admin-btn-outline" 
                                                    onClick={() => navigate(`/admin/orders/view/${o._id}`)}
                                                    style={{ padding: '8px', borderRadius: '8px', fontSize: '0.8rem', background: '#fff', borderColor: '#e2e8f0' }}
                                                >
                                                    <FiEye /> View Info
                                                </button>
                                                <button 
                                                    className="admin-btn-outline" 
                                                    onClick={() => handleDeleteOrder(o._id)}
                                                    style={{ padding: '8px', borderRadius: '8px', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', background: '#fff' }}
                                                >
                                                    <FiTrash2 /> Abort
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            
            <style>{`
                .status-next-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            `}</style>
        </AdminLayout>
    );
};

export default AdminOrders;
