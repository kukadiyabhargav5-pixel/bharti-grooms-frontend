import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiPackage, FiMapPin, FiPhone, FiMail, FiCreditCard, FiClock, FiBox, FiTruck, FiCheck, FiPrinter } from 'react-icons/fi';
import axios from 'axios';
<<<<<<< HEAD
import { API_BASE_URL } from '../apiConfig';
=======
>>>>>>> e7c4edf6ed26cb8550d0ff7fb77bcd93d25367bc
import '../styles/Admin.css';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
<<<<<<< HEAD
            const res = await axios.get(`${API_BASE_URL}/api/admin/orders/view/${id}`);
=======
            const res = await axios.get(`http://localhost:5000/api/admin/orders/view/${id}`);
>>>>>>> e7c4edf6ed26cb8550d0ff7fb77bcd93d25367bc
            setOrder(res.data);
        } catch (error) {
            console.error('Failed to fetch order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (nextStatus) => {
        try {
<<<<<<< HEAD
            await axios.put(`${API_BASE_URL}/api/admin/orders/${id}/status`, { status: nextStatus });
=======
            await axios.put(`http://localhost:5000/api/admin/orders/${id}/status`, { status: nextStatus });
>>>>>>> e7c4edf6ed26cb8550d0ff7fb77bcd93d25367bc
            fetchOrderDetails();
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="admin-loading">Loading order details...</div>;
    if (!order) return <div className="admin-error">Order not found.</div>;

    const getStatusStep = () => {
        if (order.status === 'Pending') return 1;
        if (order.status === 'Ready to Ship') return 2;
        if (order.status === 'Out for Delivery') return 3;
        if (order.status === 'Delivered') return 4;
        return 0;
    };

    return (
        <div className="admin-layout">
            <header className="admin-topbar no-print">
                <div className="admin-topbar-left">
                    <button onClick={() => navigate(-1)} className="admin-back-btn">
                        <FiArrowLeft />
                    </button>
                    <span className="admin-page-title">Order Details</span>
                </div>
                <div className="admin-topbar-actions">
                    <button onClick={() => window.print()} className="admin-btn btn-secondary">
                        <FiPrinter /> Print Invoice
                    </button>
                </div>
            </header>

            <main className="admin-main">
                {/* Print Header - Visible only when printing */}
                <div className="print-header-only">
                    <div className="business-print-brand">
                        <img src="/logo.png" alt="Bharti Glooms Logo" className="print-brand-logo" />
                        <h1>BHARTI GLOOMS</h1>
                        <p>PREMIUM ETHNIC WEAR</p>
                    </div>
                </div>
                {/* Status Stepper */}
                <div className="order-stepper-container no-print">
                    <div className="order-stepper">
                        <div className={`step ${getStatusStep() >= 1 ? 'active' : ''}`}>
                            <div className="step-icon"><FiClock /></div>
                            <span>Pending</span>
                        </div>
                        <div className={`step-line ${getStatusStep() >= 2 ? 'active' : ''}`}></div>
                        <div className={`step ${getStatusStep() >= 2 ? 'active' : ''}`}>
                            <div className="step-icon"><FiBox /></div>
                            <span>Packed</span>
                        </div>
                        <div className={`step-line ${getStatusStep() >= 3 ? 'active' : ''}`}></div>
                        <div className={`step ${getStatusStep() >= 3 ? 'active' : ''}`}>
                            <div className="step-icon"><FiTruck /></div>
                            <span>Shipped</span>
                        </div>
                        <div className={`step-line ${getStatusStep() >= 4 ? 'active' : ''}`}></div>
                        <div className={`step ${getStatusStep() >= 4 ? 'active' : ''}`}>
                            <div className="step-icon"><FiCheck /></div>
                            <span>Delivered</span>
                        </div>
                    </div>
                </div>

                <div className="order-details-grid">
                    {/* Left Column: Customer & Products */}
                    <div className="details-col-main">
                        <section className="details-section">
                            <h3><FiUser className="no-print" /> Customer Information</h3>
                            <div className="info-card customer-info-flex">
                                <div className="customer-info-left">
                                    <p><strong>Name:</strong> <strong>{order.customer?.name || 'N/A'}</strong></p>
                                    <p><strong>Email:</strong> <strong>{order.customer?.email || 'N/A'}</strong></p>
                                    <p><strong>Mobile:</strong> <strong>{order.customer?.mobile || order.customer?.mobileNumber || 'N/A'}</strong></p>
                                </div>
                                <div className="customer-info-right print-address-col">
                                    <p className="address-label"><strong>Address:</strong></p>
                                    <p className="address-value-bold"><strong>{order.customer?.address || 'N/A'}</strong></p>
                                </div>
                            </div>
                        </section>

                        <section className="details-section">
                            <h3><FiPackage /> Products ordered</h3>
                            <div className="order-items-list">
                                {order.products?.map((item, idx) => (
                                    <div key={idx} className="order-item-row">
                                        <div className="item-img-container no-print">
                                            {item.photo && <img src={item.photo} alt={item.name} />}
                                        </div>
                                        <div className="item-info">
                                            <h4>{item.name}</h4>
                                            <p>₹{item.price} x {item.quantity}</p>
                                        </div>
                                        <div className="item-total">
                                            ₹{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="order-summary-footer">
                                <div className="summary-row total">
                                    <span>Total Amount Paid:</span>
                                    <span>₹{order.totalAmount}</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Actions & Payment */}
                    <div className="details-col-side">
                        <section className="details-section no-print">
                            <h3>Actions</h3>
                            <div className="action-buttons-box">
                                {order.status === 'Pending' && (
                                    <button onClick={() => handleStatusUpdate('Ready to Ship')} className="admin-btn btn-primary full-width">
                                        Mark as Ready to Ship
                                    </button>
                                )}
                                {order.status === 'Ready to Ship' && (
                                    <button onClick={() => handleStatusUpdate('Out for Delivery')} className="admin-btn btn-primary full-width">
                                        Mark as Out for Delivery
                                    </button>
                                )}
                                {order.status === 'Out for Delivery' && (
                                    <button onClick={() => handleStatusUpdate('Delivered')} className="admin-btn btn-primary full-width">
                                        Mark as Delivered
                                    </button>
                                )}
                                <p className="status-note">Current Status: <strong>{order.status}</strong></p>
                            </div>
                        </section>

                        <section className="details-section">
                            <h3><FiCreditCard /> Payment Details</h3>
                            <div className="info-card">
                                <p><strong>Method:</strong> {order.payment?.method || 'COD'}</p>
                                <p><strong>Order ID:</strong> {order.payment?.orderId || 'N/A'}</p>
                                <p><strong>Transaction ID:</strong> {order.payment?.transactionId || 'N/A'}</p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-shadow {
                    0% { box-shadow: 0 0 0 0 rgba(128, 0, 0, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(128, 0, 0, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(128, 0, 0, 0); }
                }

                .admin-main {
                    animation: fadeIn 0.6s ease-out forwards;
                }

                .order-stepper-container {
                    background: white;
                    padding: 30px;
                    border-radius: 16px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 15px -3px rgba(0,0,0,0.05); /* Softer, larger shadow */
                    transition: all 0.3s ease;
                }
                .order-stepper-container:hover {
                    box-shadow: 0 12px 25px -5px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }

                .order-stepper {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    color: #94a3b8;
                    font-size: 0.9rem;
                    font-weight: 600;
                    position: relative;
                    z-index: 1;
                    transition: all 0.3s ease;
                }
                .step.active { 
                    color: var(--maroon); 
                    transform: scale(1.05);
                }
                
                .step-icon {
                    width: 45px;
                    height: 45px;
                    background: #f1f5f9;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                .step:hover .step-icon {
                    background: #e2e8f0;
                    transform: scale(1.1);
                }
                .step.active .step-icon {
                    background: var(--maroon);
                    color: white;
                    box-shadow: 0 0 0 5px rgba(128, 0, 0, 0.15);
                    animation: pulse-shadow 2s infinite;
                }
                .step.active:hover .step-icon {
                    background: #600000;
                    transform: scale(1.15);
                }
                
                .step-line {
                    flex-grow: 1;
                    height: 3px;
                    background: #f1f5f9;
                    margin: 0 -15px;
                    transform: translateY(-12px);
                    transition: background 0.5s ease-in-out;
                    border-radius: 2px;
                }
                .step-line.active { 
                    background: var(--maroon); 
                    box-shadow: 0 0 8px rgba(128, 0, 0, 0.3);
                }
                
                .order-details-grid {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 20px;
                }
                
                .details-section {
                    background: white;
                    padding: 24px;
                    border-radius: 16px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 15px -3px rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                    border: 1px solid transparent;
                }
                .details-section:hover {
                    box-shadow: 0 12px 25px -5px rgba(0,0,0,0.1);
                    transform: translateY(-3px);
                    border-color: rgba(128, 0, 0, 0.05);
                }
                
                .details-section h3 {
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #1e293b;
                    font-size: 1.2rem;
                    border-bottom: 2px solid #f1f5f9;
                    padding-bottom: 15px;
                    transition: color 0.3s ease;
                }
                .details-section:hover h3 {
                    color: var(--maroon);
                }
                .details-section h3 svg {
                    color: var(--maroon);
                    font-size: 1.3rem;
                    transition: transform 0.3s ease;
                }
                .details-section:hover h3 svg {
                    transform: scale(1.1) rotate(5deg);
                }
                
                .info-card p {
                    margin-bottom: 12px;
                    color: #475569;
                    line-height: 1.6;
                    font-size: 0.95rem;
                }
                .info-card p strong {
                    color: #1e293b;
                    margin-right: 5px;
                }
                
                .order-item-row {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 16px;
                    border-bottom: 1px solid #f1f5f9;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }
                .order-item-row:hover {
                    background-color: #f8fafc;
                    transform: translateX(5px);
                }
                .item-img-container {
                    width: 70px;
                    height: 70px;
                    background: #f1f5f9;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                .item-img-container img { 
                    width: 100%; 
                    height: 100%; 
                    object-fit: cover; 
                    transition: transform 0.5s ease;
                }
                .order-item-row:hover .item-img-container img {
                    transform: scale(1.1);
                }
                .item-info { flex-grow: 1; }
                .item-info h4 { 
                    margin: 0 0 6px 0; 
                    color: #1e293b;
                    font-size: 1.05rem;
                    transition: color 0.3s;
                }
                .order-item-row:hover .item-info h4 {
                    color: var(--maroon);
                }
                .item-info p { margin: 0; color: #64748b; font-size: 0.9rem; }
                .item-total { 
                    font-weight: 700; 
                    color: var(--maroon);
                    font-size: 1.1rem;
                }
                
                .order-summary-footer {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 2px dashed #e2e8f0;
                }
                .summary-row.total {
                    display: flex;
                    justify-content: space-between;
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #1e293b;
                    padding: 12px 15px;
                    background: #f8fafc;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                .details-section:hover .summary-row.total {
                    background: var(--maroon);
                    color: white;
                    transform: scale(1.02);
                    box-shadow: 0 4px 10px rgba(128,0,0,0.2);
                }
                
                .action-buttons-box {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .full-width { 
                    width: 100%; 
                    padding: 16px; 
                    font-size: 1rem;
                    border-radius: 10px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    z-index: 1;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .full-width::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.1);
                    z-index: -1;
                    transform: scaleY(0);
                    transform-origin: bottom;
                    transition: transform 0.3s ease;
                }
                .full-width:hover::before {
                    transform: scaleY(1);
                }
                .full-width:hover {
                    box-shadow: 0 6px 15px rgba(128, 0, 0, 0.3);
                    transform: translateY(-2px);
                }
                .full-width:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 5px rgba(128, 0, 0, 0.3);
                }
                
                .status-note {
                    text-align: center;
                    font-size: 0.95rem;
                    color: #64748b;
                    margin: 5px 0 0 0;
                    padding: 12px;
                    background: #f1f5f9;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                .status-note:hover {
                    background: #e2e8f0;
                    transform: scale(1.02);
                }
                .status-note strong {
                    color: var(--maroon);
                    font-weight: 700;
                }
                
                /* Local button hover overrides in case Admin.css doesn't have premium ones */
                .admin-back-btn, .admin-btn {
                    transition: all 0.3s ease !important;
                }
                .admin-back-btn:hover {
                    background: var(--maroon) !important;
                    color: white !important;
                    transform: translateX(-3px) !important;
                    box-shadow: 0 4px 10px rgba(128,0,0,0.2) !important;
                }
                .admin-btn:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                }

                .admin-topbar-actions .btn-secondary {
                    background: #1e293b !important;
                    color: white !important;
                    padding: 10px 24px !important;
                    border-radius: 12px !important;
                    font-weight: 600 !important;
                    font-size: 0.95rem !important;
                    border: none !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 10px !important;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                }

                .admin-topbar-actions .btn-secondary:hover {
                    background: #0f172a !important;
                    transform: translateY(-3px) !important;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
                }

                .admin-topbar-actions .btn-secondary svg {
                    font-size: 1.2rem !important;
                    color: #94a3b8 !important;
                }
                .admin-topbar-actions .btn-secondary:hover svg {
                    color: white !important;
                    transform: scale(1.1);
                }
                
                @media (max-width: 900px) {
                    .order-details-grid { grid-template-columns: 1fr; }
                    .order-stepper { overflow-x: auto; padding-bottom: 15px; }
                    .step { min-width: 80px; }
                    .step-line { min-width: 40px; }
                }

                /* PRINT STYLES */
                @media print {
                    .no-print, .admin-back-btn, .admin-topbar-actions, header.admin-topbar, .order-stepper-container, .details-col-side section:first-child {
                        display: none !important;
                    }
                    .admin-layout, .admin-main {
                        display: block !important;
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .order-details-grid {
                        display: block !important;
                    }
                    .details-section {
                        box-shadow: none !important;
                        border: none !important;
                        border-bottom: 2px dashed #eee !important;
                        border-radius: 0 !important;
                        margin-bottom: 20px !important;
                        padding: 10px 0 !important;
                    }
                    .details-section h3 {
                        border-bottom: 1px solid #eee !important;
                        font-size: 1.1rem !important;
                        margin-bottom: 15px !important;
                    }
                    
                    /* Header Branding for Print */
                    .print-header-only {
                        display: block !important;
                        text-align: center !important;
                        margin-bottom: 30px !important;
                        padding-bottom: 20px !important;
                        border-bottom: 3px double #1e293b !important;
                    }
                    .print-brand-logo {
                        width: 100px !important;
                        height: auto !important;
                        margin-bottom: 10px !important;
                    }
                    .business-print-brand h1 {
                        color: #1e293b !important;
                        margin: 0 !important;
                        font-size: 3.5rem !important;
                        letter-spacing: 5px !important;
                        font-weight: 900 !important;
                        text-transform: uppercase !important;
                    }
                    .business-print-brand p {
                        color: #475569 !important;
                        margin: 0 !important;
                        font-size: 1.1rem !important;
                        font-weight: 700 !important;
                        letter-spacing: 2px !important;
                    }

                    /* Split Customer Info */
                    .customer-info-flex {
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: flex-start !important;
                        gap: 40px !important;
                    }
                    .customer-info-left {
                        flex: 1 !important;
                    }
                    .customer-info-right {
                        flex: 1 !important;
                        text-align: right !important;
                    }
                    .address-value-bold {
                        font-size: 1.05rem !important;
                        color: #1e293b !important;
                        line-height: 1.5 !important;
                    }

                    /* No Images in Print */
                    .no-print, .item-img-container {
                        display: none !important;
                    }
                    
                    /* Product Table Layout for Print */
                    .order-item-row {
                        padding: 8px 0 !important;
                        border-bottom: 1px solid #f1f5f9 !important;
                        transform: none !important;
                    }
                    .item-total {
                        font-size: 1.1rem !important;
                        color: #000 !important; 
                    }
                }

                .print-header-only { display: none; }
            `}</style>
        </div>
    );
};

export default AdminOrderDetails;
