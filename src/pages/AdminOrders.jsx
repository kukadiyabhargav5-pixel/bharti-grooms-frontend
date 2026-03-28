import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiHome, FiPackage, FiArrowLeft, FiSearch, FiEye, FiClock, FiBox, FiTruck, FiCheck, FiShoppingBag, FiTrash2, FiDownload } from 'react-icons/fi';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import '../styles/Admin.css';

const AdminOrders = () => {
    const { status } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
        window.scrollTo(0, 0);
        fetchOrders();
    }, [navigate, status]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Map URL status to exact backend status string (case-sensitive)
            let backendStatus = '';
            if (status === 'pending') backendStatus = 'Pending';
            else if (status === 'ready-to-ship') backendStatus = 'Ready to Ship';
            else if (status === 'out-for-delivery') backendStatus = 'Out for Delivery';
            else if (status === 'delivered') backendStatus = 'Delivered';

            console.log(`Fetching orders for status: ${status} -> ${backendStatus}`);
            const res = await axios.get(`http://localhost:5000/api/admin/orders?status=${backendStatus}`);
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, nextStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, { status: nextStatus });
            fetchOrders(); // Refresh list
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Failed to update order status');
        }
    };

    const handleDownloadInvoice = (order) => {
        const invoiceContent = `
            <div style="font-family: 'Poppins', sans-serif; padding: 40px; color: #1e293b; position: relative; background: white;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #1e293b; padding-bottom: 20px;">
                    <img src="/logo.png" style="width: 80px; margin-bottom: 10px;" />
                    <h1 style="margin: 0; font-size: 32px; letter-spacing: 4px; font-weight: 900; text-transform: uppercase;">BHARTI GLOOMS</h1>
                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #475569; letter-spacing: 2px;">PREMIUM ETHNIC WEAR</p>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 40px; gap: 40px;">
                    <div style="flex: 1;">
                        <h3 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px; color: #1e293b;">CUSTOMER INFO</h3>
                        <p style="margin: 4px 0;"><strong>Name:</strong> <strong>${order.customer?.name || 'N/A'}</strong></p>
                        <p style="margin: 4px 0;"><strong>Email:</strong> <strong>${order.customer?.email || 'N/A'}</strong></p>
                        <p style="margin: 4px 0;"><strong>Mobile:</strong> <strong>${order.customer?.mobile || order.customer?.mobileNumber || 'N/A'}</strong></p>
                    </div>
                    <div style="flex: 1; text-align: right;">
                        <h3 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px; color: #1e293b;">DELIVER TO</h3>
                        <p style="margin: 4px 0; font-weight: 900; font-size: 15px;"><strong>${order.customer?.address || 'N/A'}</strong></p>
                    </div>
                </div>

                <div style="margin-bottom: 40px;">
                    <h3 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px; color: #1e293b;">ORDER SUMMARY</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8fafc; text-align: left;">
                                <th style="padding: 12px; border-bottom: 2px solid #e2e8f0;">PRODUCT</th>
                                <th style="padding: 12px; border-bottom: 2px solid #e2e8f0;">PRICE</th>
                                <th style="padding: 12px; border-bottom: 2px solid #e2e8f0;">QTY</th>
                                <th style="padding: 12px; border-bottom: 2px solid #e2e8f0; text-align: right;">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.products.map(p => `
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${p.name}</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">₹${p.price.toLocaleString()}</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">${p.quantity}</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700;">₹${(p.price * p.quantity).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 250px; background: #f8fafc; padding: 20px; border-radius: 12px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 600;">
                            <span>Subtotal</span>
                            <span>₹${order.totalAmount.toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 600;">
                            <span>Shipping</span>
                            <span style="color: #059669;">FREE</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid #e2e8f0; font-weight: 900; font-size: 18px; color: #1e293b;">
                            <span>Grand Total</span>
                            <span>₹${order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; font-weight: 600; border-top: 1px solid #eee; padding-top: 20px;">
                    THANK YOU FOR SHOPPING WITH BHARTI GLOOMS!<br/>
                    www.bhartiglooms.com
                </div>
            </div>
        `;

        const element = document.createElement('div');
        element.innerHTML = invoiceContent;
        document.body.appendChild(element);

        const opt = {
            margin: [10, 10],
            filename: `Bharti_Glooms_Invoice_${order._id.slice(-6).toUpperCase()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save().then(() => {
            document.body.removeChild(element);
        });

        // Automation: If Pending, move to Ready to Ship
        if (order.status === 'Pending') {
            handleStatusUpdate(order._id, 'Ready to Ship');
        }
    };

    const getPageTitle = () => {
        switch (status) {
            case 'pending': return 'Pending Orders';
            case 'ready-to-ship': return 'Ready to Ship';
            case 'out-for-delivery': return 'Out for Delivery';
            case 'delivered': return 'Delivered Orders';
            default: return 'Order Management';
        }
    };

    const handleDeleteOrder = async (id) => {
        if (window.confirm('Are you sure you want to cancel and delete this order?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/orders/${id}`);
                fetchOrders();
            } catch (error) {
                alert('Failed to delete order');
            }
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'pending': return <FiClock style={{ color: '#f39c12' }} />;
            case 'ready-to-ship': return <FiBox style={{ color: '#3498db' }} />;
            case 'out-for-delivery': return <FiTruck style={{ color: '#9b59b6' }} />;
            case 'delivered': return <FiCheck style={{ color: '#2ecc71' }} />;
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
        (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        o._id.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <Link to="/admin/products" className="admin-nav-item"><FiPackage /> Products</Link>
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
                            placeholder="Search by Customer or ID..."
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
                            Loading Orders...
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '16px', border: '1px solid #edf2f7' }}>
                            <FiShoppingBag style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '20px' }} />
                            <h3 style={{ color: '#64748b' }}>No orders found</h3>
                            <p style={{ color: '#94a3b8' }}>All caught up! No orders in this category.</p>
                        </div>
                    ) : (
                        <div className="admin-data-grid">
                            {filteredOrders.map(o => (
                                <div key={o._id} className="admin-detail-card order-card">
                                    <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <div className="order-id" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: #{o._id.slice(-6).toUpperCase()}</div>
                                        <div className={`status-badge-inline ${status}`} style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase'
                                        }}>{o.status}</div>
                                    </div>
                                    
                                    <div className="admin-card-divider" style={{ borderBottom: '1px solid #edf2f7', marginBottom: '15px' }}></div>
                                    
                                    {o.products && o.products.length > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                            <img 
                                                src={o.products[0].photo} 
                                                alt={o.products[0].name} 
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #edf2f7' }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{o.products[0].name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                                                    Qty: {o.products[0].quantity} {o.products.length > 1 ? `(+${o.products.length - 1} more items)` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="admin-card-label" style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Customer Details</div>
                                    <div className="admin-card-value" style={{ marginBottom: '12px', display: 'block' }}>
                                        <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.1rem', marginBottom: '4px' }}>{o.customer?.name || o.user?.name || 'Guest User'}</div>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#475569', marginBottom: '2px' }}>{o.customer?.email || o.user?.email || 'No Email'}</div>
                                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#1e293b', lineHeight: '1.4' }}>{o.customer?.address || 'No Address'}</div>
                                    </div>
                                    
                                    <div className="admin-card-label" style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Date</div>
                                    <div className="admin-card-value" style={{ fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                    
                                    <div className="admin-card-label" style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Total Amount</div>
                                    <div className="admin-card-value" style={{ fontWeight: '800', color: 'var(--maroon)', marginBottom: '15px', fontSize: '1.1rem' }}>₹ {o.totalAmount.toLocaleString()}</div>
                                    
                                    <div className="admin-card-divider" style={{ borderBottom: '1px solid #edf2f7', marginBottom: '15px' }}></div>

                                    <div className="admin-card-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                                        <button 
                                            className="admin-card-btn btn-download-invoice"
                                            onClick={() => handleDownloadInvoice(o)}
                                            style={{
                                                padding: '12px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                background: o.status === 'Pending' ? '#2563eb' : '#64748b',
                                                color: 'white',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <FiDownload /> {o.status === 'Pending' ? 'Download & Ready to Ship' : 'Download Invoice'}
                                        </button>

                                        {getNextStatus() && (
                                            <button 
                                                className={`status-next-btn ${status}`}
                                                onClick={() => handleStatusUpdate(o._id, getNextStatus())}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    background: 'var(--maroon)',
                                                    color: 'white',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                Mark as {getNextStatus()}
                                            </button>
                                        )}
                                        <button 
                                            className="admin-card-btn btn-view" 
                                            onClick={() => navigate(`/admin/orders/view/${o._id}`)}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '12px',
                                                border: '1px solid #edf2f7',
                                                background: 'white',
                                                color: '#64748b',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <FiEye /> View Details
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteOrder(o._id)}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '12px',
                                                border: '1px solid #fee2e2',
                                                background: '#fff5f5',
                                                color: '#ef4444',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <FiTrash2 style={{ marginRight: '5px' }} /> Cancel Order
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <style>{`
                .status-badge-inline.pending { background: #fff8eb; color: #d97706; }
                .status-badge-inline.ready-to-ship { background: #e0f2fe; color: #0369a1; }
                .status-badge-inline.out-for-delivery { background: #f5f3ff; color: #6d28d9; }
                .status-badge-inline.delivered { background: #ecfdf5; color: #059669; }
                
                .status-next-btn.pending { background: #f39c12; }
                .status-next-btn.ready-to-ship { background: #3498db; }
                .status-next-btn.out-for-delivery { background: #9b59b6; }
                
                .status-next-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    filter: brightness(1.1);
                }
            `}</style>
        </div>
    );
};

export default AdminOrders;
