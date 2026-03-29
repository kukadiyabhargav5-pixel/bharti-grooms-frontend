import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome, FiUsers, FiPackage, FiLogOut, FiMenu, FiX, FiTrendingUp, FiDollarSign, FiPlusCircle, FiClock, FiBox, FiTruck, FiCheck, FiEye, FiFileText, FiTrash2, FiCalendar, FiFilter, FiShield, FiMail } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    filteredUsers: 0,
    filteredProducts: 0,
    filteredRevenue: 0,
    filteredOrdersCount: 0,
    recentOrders: [],
    orderStats: {
      pendingCount: 0,
      readyToShipCount: 0,
      outForDeliveryCount: 0,
      deliveredCount: 0
    }
  });
  const [filterType, setFilterType] = useState('7days');
  const [customRange, setCustomRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
        params: { filterType, ...customRange }
      });
      const complaintsRes = await axios.get(`${API_BASE_URL}/api/complaints`);
      setStats({
        ...res.data,
        complaints: complaintsRes.data,
        totalComplaints: complaintsRes.data.length
      });
    } catch (error) {
      console.error('Failed to fetch stats/complaints:', error);
    }
  };


  const deleteOrder = async (id) => {
    if (window.confirm('Delete this order permanently?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/orders/${id}`);        fetchStats();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    if (newStock < 0) return;
    try {
      await axios.put(`${API_BASE_URL}/api/admin/products/${productId}/stock`, { stock: newStock });
      fetchStats(); // Refresh dashboard data
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  useEffect(() => {
    // Auth Check
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
    window.scrollTo(0, 0);
    fetchStats();
  }, [navigate, filterType, customRange.start, customRange.end]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Top Navbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <div className="admin-logo">
            <div className="admin-logo-icon">BG</div>
            <span className="admin-logo-text">Admin Panel</span>
          </div>
          
          <button className="admin-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
            <FiMenu />
          </button>
          
          <nav className="admin-top-nav desktop-nav">
            <Link to="/admin/dashboard" className="admin-nav-item active">
              <FiHome /> Dashboard
            </Link>
            <Link to="/admin/products" className="admin-nav-item">
              <FiPackage /> Products
            </Link>
            <Link to="/admin/users" className="admin-nav-item">
              <FiUsers /> Customers
            </Link>
            <Link to="/admin/complaints" className="admin-nav-item">
              <FiMail /> Inquiries
            </Link>
            <Link to="/admin/2fa-setup" className="admin-nav-item">
              <FiShield /> Safety
            </Link>
          </nav>
        </div>

        <div className="admin-topbar-right">
          <div className="admin-profile-badge">
            <img 
              src="/logo.png" 
              alt="Admin" 
              className="admin-avatar" 
              onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Bharti+Admin&background=random"; }} 
            />
            <span className="admin-profile-name">Bharti Admin</span>
          </div>
          <button onClick={handleLogout} className="admin-topbar-logout" title="Logout">
            <FiLogOut />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="admin-mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="admin-mobile-nav" onClick={(e) => e.stopPropagation()}>
            <div className="admin-mobile-nav-header">
              <h3>Menu</h3>
              <button className="admin-close-btn" onClick={() => setMobileMenuOpen(false)}>
                <FiX />
              </button>
            </div>
            <nav className="admin-nav-col">
              <Link to="/admin/dashboard" className="admin-nav-item active" onClick={() => setMobileMenuOpen(false)}><FiHome /> Dashboard</Link>
              <Link to="/admin/products" className="admin-nav-item" onClick={() => setMobileMenuOpen(false)}><FiPackage /> Products</Link>
              <Link to="/admin/users" className="admin-nav-item" onClick={() => setMobileMenuOpen(false)}><FiUsers /> Customers</Link>
              <Link to="/admin/complaints" className="admin-nav-item" onClick={() => setMobileMenuOpen(false)}><FiMail /> Inquiries</Link>
              <Link to="/admin/2fa-setup" className="admin-nav-item" onClick={() => setMobileMenuOpen(false)}><FiShield /> Safety</Link>
              <button onClick={handleLogout} className="admin-mobile-logout"><FiLogOut /> Logout</button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <h2 className="admin-page-title">Dashboard Overview</h2>
          
          <div className="admin-filter-container" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'white', padding: '8px 15px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <FiFilter style={{ color: '#64748b' }} />
            <div className="filter-pills" style={{ display: 'flex', background: '#f8fafc', padding: '4px', borderRadius: '8px', gap: '4px' }}>
              {['daily', '7days', '30days', 'custom'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: filterType === type ? 'var(--maroon)' : 'transparent',
                    color: filterType === type ? 'white' : '#64748b'
                  }}
                >
                  {type === 'daily' ? 'Daily' : type === '7days' ? 'Last 7 Days' : type === '30days' ? 'Last 30 Days' : 'Custom Range'}
                </button>
              ))}
            </div>

            {filterType === 'custom' && (
              <div className="custom-date-inputs" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '10px', borderLeft: '1px solid #e2e8f0', paddingLeft: '15px' }}>
                <input 
                  type="date" 
                  value={customRange.start} 
                  onChange={(e) => setCustomRange({...customRange, start: e.target.value})}
                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                />
                <span style={{ color: '#94a3b8' }}>to</span>
                <input 
                  type="date" 
                  value={customRange.end} 
                  onChange={(e) => setCustomRange({...customRange, end: e.target.value})}
                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-dashboard-section">
            <h2 className="admin-section-title">Order Management Workflow</h2>
            <div className="admin-stats-grid order-stats-grid">
              {/* 1. Pending Orders */}
              <Link to="/admin/orders/pending" className="admin-stat-card order-stat pending" style={{ textDecoration: 'none' }}>
                <div className="admin-stat-icon"><FiClock /></div>
                <div className="admin-stat-info">
                  <h3>Pending Orders</h3>
                  <p>{stats.orderStats?.pendingCount || 0}</p>
                  <span className="admin-stat-trend">Needs Attention</span>
                </div>
              </Link>

              {/* 2. Ready to Ship */}
              <Link to="/admin/orders/ready-to-ship" className="admin-stat-card order-stat processing" style={{ textDecoration: 'none' }}>
                <div className="admin-stat-icon"><FiBox /></div>
                <div className="admin-stat-info">
                  <h3>Ready to Ship</h3>
                  <p>{stats.orderStats?.readyToShipCount || 0}</p>
                  <span className="admin-stat-trend">In Processing</span>
                </div>
              </Link>

              {/* 3. Out for Delivery */}
              <Link to="/admin/orders/out-for-delivery" className="admin-stat-card order-stat shipped" style={{ textDecoration: 'none' }}>
                <div className="admin-stat-icon"><FiTruck /></div>
                <div className="admin-stat-info">
                  <h3>Out for Delivery</h3>
                  <p>{stats.orderStats?.outForDeliveryCount || 0}</p>
                  <span className="admin-stat-trend">On the Way</span>
                </div>
              </Link>

              {/* 4. Delivered */}
              <Link to="/admin/orders/delivered" className="admin-stat-card order-stat delivered" style={{ textDecoration: 'none' }}>
                <div className="admin-stat-icon"><FiCheck /></div>
                <div className="admin-stat-info">
                  <h3>Delivered</h3>
                  <p>{stats.orderStats?.deliveredCount || 0}</p>
                  <span className="admin-stat-trend">Successfully Completed</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Business Overview Section */}
          <div className="admin-dashboard-section" style={{ marginTop: '40px' }}>
            <h2 className="admin-section-title">Business Overview</h2>
            <div className="admin-stats-grid">
              {/* 1. Total User */}
              <Link to="/admin/users" className="admin-stat-card" style={{ textDecoration: 'none' }}>
                <div className="admin-stat-icon" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6' }}>
                  <FiUsers />
                </div>
                <div className="admin-stat-info">
                  <h3>Total Users</h3>
                  <p>{stats.totalUsers}</p>
                  <span className="admin-stat-trend neutral">New {filterType}: {stats.filteredUsers}</span>
                </div>
              </Link>

              {/* 2. Total Product */}
              <Link to="/admin/products" className="admin-stat-card" style={{ textDecoration: 'none' }}>
                <div className="admin-stat-icon" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db' }}>
                  <FiPackage />
                </div>
                <div className="admin-stat-info">
                  <h3>Total Products</h3>
                  <p>{stats.totalProducts}</p>
                  <span className="admin-stat-trend positive">New {filterType}: {stats.filteredProducts}</span>
                </div>
              </Link>

              {/* 2.5 Add New Product - NEW QUICK ACTION */}
              <Link to="/admin/add-product" className="admin-stat-card add-product-action" style={{ textDecoration: 'none', border: '1px dashed var(--maroon)', background: '#fff9f9' }}>
                <div className="admin-stat-icon" style={{ background: 'var(--maroon)', color: 'white' }}>
                  <FiPlusCircle />
                </div>
                <div className="admin-stat-info">
                  <h3 style={{ color: 'var(--maroon)' }}>Add New</h3>
                  <p style={{ fontSize: '1.2rem' }}>Product</p>
                  <span className="admin-stat-trend" style={{ color: 'var(--maroon)' }}>Quick Shortcut</span>
                </div>
              </Link>

              {/* 3. Revenue */}
              <div className="admin-stat-card revenue-card" style={{ borderLeft: '4px solid #f39c12' }}>
                <div className="admin-stat-icon" style={{ background: 'rgba(243, 156, 18, 0.1)', color: '#f39c12' }}>
                  <FiTrendingUp />
                </div>
                <div className="admin-stat-info">
                  <h3>Revenue</h3>
                  <p>₹ {stats.filteredRevenue ? stats.filteredRevenue.toLocaleString() : '0'}</p>
                  <span className="admin-stat-trend positive">From {stats.filteredOrdersCount || 0} Orders</span>
                </div>
              </div>

              {/* 4. Customer Inquiries */}
              <Link to="/admin/complaints" className="admin-stat-card inquiry-card" style={{ borderLeft: '4px solid #34495e', textDecoration: 'none' }}>
                <div className="admin-stat-icon" style={{ background: 'rgba(52, 73, 94, 0.1)', color: '#34495e' }}>
                  <FiMail />
                </div>
                <div className="admin-stat-info">
                  <h3>Customer Inquiries</h3>
                  <p>{stats.totalComplaints || 0}</p>
                  <span className="admin-stat-trend neutral">Manage Feedback</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Stock Management Section */}
          <div className="admin-dashboard-section" style={{ marginTop: '40px' }}>
            <h1 className="admin-section-title">Stock Management</h1>
            
            <div className="admin-stats-grid stock-status-grid">
              <div 
                className="admin-stat-card stock-stat-card in-stock"
                onClick={() => navigate('/admin/stock/in-stock')}
                style={{ position: 'relative' }}
              >
                <div className="admin-stat-icon"><FiPackage /></div>
                <div className="admin-stat-info">
                  <h3>In Stock</h3>
                  <p>{stats.stockStats?.inStockCount || 0}</p>
                  <span className="admin-stat-trend positive">Healthy Stock</span>
                </div>
              </div>

              <div 
                className="admin-stat-card stock-stat-card low-stock"
                onClick={() => navigate('/admin/stock/low-stock')}
                style={{ position: 'relative' }}
              >
                <div className="admin-stat-icon"><FiTrendingUp /></div>
                <div className="admin-stat-info">
                  <h3>Low Stock</h3>
                  <p>{stats.stockStats?.lowStockCount || 0}</p>
                  <span className="admin-stat-trend warning">Restock Soon</span>
                </div>
              </div>

              <div 
                className="admin-stat-card stock-stat-card out-of-stock"
                onClick={() => navigate('/admin/stock/out-of-stock')}
                style={{ position: 'relative' }}
              >
                <div className="admin-stat-icon"><FiBox /></div>
                <div className="admin-stat-info">
                  <h3>Out of Stock</h3>
                  <p>{stats.stockStats?.outOfStockCount || 0}</p>
                  <span className="admin-stat-trend danger">Immediate Action</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Recent Orders</h3>
              <button className="admin-btn-outline" onClick={() => navigate('/admin/orders/all')}>View All</button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders && stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map(order => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-6).toUpperCase()}</td>
                        <td>{order.customer?.name || order.user?.name || 'Guest User'}</td>
                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{order.customer?.email || order.user?.email || 'N/A'}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td>₹ {order.totalAmount.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge-inline ${order.status?.toLowerCase().replace(/ /g, '-')}`}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => navigate(`/admin/orders/view/${order._id}`)}
                              className="action-icon-btn" 
                              title="View Details"
                              style={{ color: '#3498db', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                            >
                              <FiEye />
                            </button>
                            <button 
                              onClick={() => navigate(`/admin/invoice/${order._id}`)}
                              className="action-icon-btn" 
                              title="View Invoice"
                              style={{ color: '#9b59b6', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                            >
                              <FiFileText />
                            </button>
                            <button 
                              onClick={() => deleteOrder(order._id)}
                              className="action-icon-btn" 
                              title="Delete Order"
                              style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No recent orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Customer Support Section */}
          <div className="admin-dashboard-section" style={{ marginTop: '40px' }}>
            <h2 className="admin-section-title">Customer Complaints & Inquiries</h2>
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>Recent Messages</h3>
                <span className="badge" style={{ background: '#34495e', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                  {stats.totalComplaints || 0} Total
                </span>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th style={{ textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.complaints && stats.complaints.length > 0 ? (
                      stats.complaints.slice(0, 5).map(comp => (
                        <tr key={comp._id}>
                          <td style={{ fontSize: '0.85rem' }}>{new Date(comp.createdAt).toLocaleDateString('en-IN')}</td>
                          <td>
                            <strong>{comp.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{comp.email}</div>
                          </td>
                          <td style={{ fontWeight: '600', color: '#600018' }}>{comp.subject}</td>
                          <td title={comp.message}>
                            <div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem' }}>
                              {comp.message}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span style={{ 
                              background: comp.status === 'Unread' ? '#fff5f5' : '#f0fff4', 
                              color: comp.status === 'Unread' ? '#c53030' : '#2e7d32',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}>
                              {comp.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No inquiries found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
