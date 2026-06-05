import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiClock, FiPackage, FiTruck, FiCheckCircle, FiUsers, FiDollarSign, FiPlusCircle, FiBox, FiAlertTriangle, FiXOctagon, FiMessageSquare, FiEye, FiArrowRight } from 'react-icons/fi';
import { API_BASE_URL } from '../apiConfig';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching stats from:', `${API_BASE_URL}/api/admin/stats`);
        const [statsRes, complaintsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin/stats`, { params: { filterType: '7days' } }),
          axios.get(`${API_BASE_URL}/api/complaints`)
        ]);
        setStats(statsRes.data);
        setRecentComplaints(complaintsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    };

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      fetchStats();
    }
  }, [navigate]);

  if (error) return <AdminLayout title="Error"><div>System Error: {error}</div></AdminLayout>;
  if (!stats) return <AdminLayout title="Loading"><div>Initializing Imperial Systems...</div></AdminLayout>;

  return (
    <AdminLayout title="Imperial Command Center">
      <div className="dashboard-root-luxe">
        <h2 style={{ color: '#1a202c', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '10px' }}>Order Pipeline Overview</h2>
        
        <div className="admin-status-grid">
          {[
            { label: 'Pending Orders', count: stats.orderStats?.pendingCount || 0, desc: 'Awaiting Processing', route: 'pending', icon: <FiClock />, bg: '#fffbeb', color: '#b45309' },
            { label: 'Ready to Ship', count: stats.orderStats?.readyToShipCount || 0, desc: 'Packed & Ready', route: 'ready-to-ship', icon: <FiPackage />, bg: '#f0fdf4', color: '#15803d' },
            { label: 'Out for Delivery', count: stats.orderStats?.outForDeliveryCount || 0, desc: 'En Route', route: 'out-for-delivery', icon: <FiTruck />, bg: '#eff6ff', color: '#1d4ed8' },
            { label: 'Delivered', count: stats.orderStats?.deliveredCount || 0, desc: 'Completed', route: 'delivered', icon: <FiCheckCircle />, bg: '#faf5ff', color: '#7e22ce' }
          ].map((item, index) => (
            <motion.div
              key={item.route}
              className="admin-dashboard-card"
              onClick={() => navigate(`/admin/orders/${item.route}`)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="card-icon" style={{ background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              <div className="card-content">
                <span className="card-title">{item.label}</span>
                <span className="card-count" style={{ color: item.color }}>{item.count}</span>
                <span className="card-desc">{item.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <h2 style={{ color: '#1a202c', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '10px', marginTop: '30px' }}>System Overview</h2>
        <div className="admin-status-grid">
          {[
            { label: 'Total Users', count: stats.totalUsers || 0, desc: 'Registered Customers', route: 'users', icon: <FiUsers />, bg: '#fffbeb', color: '#b45309' },
            { label: 'Total Products', count: stats.totalProducts || 0, desc: 'In Inventory', route: 'products', icon: <FiPackage />, bg: '#f0fdf4', color: '#15803d' },
            { label: 'Revenue', count: `₹${stats.totalIncome || 0}`, desc: 'Total Earnings', route: '', icon: <FiDollarSign />, bg: '#eff6ff', color: '#1d4ed8' },
            { label: 'Add Product', count: '+', desc: 'Create New Item', route: 'add-product', icon: <FiPlusCircle />, bg: '#faf5ff', color: '#7e22ce' }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="admin-dashboard-card"
              onClick={() => item.route && navigate(`/admin/${item.route}`)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              style={{ cursor: item.route ? 'pointer' : 'default' }}
            >
              <div className="card-icon" style={{ background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              <div className="card-content">
                <span className="card-title">{item.label}</span>
                <span className="card-count" style={{ color: item.color, fontSize: item.label === 'Revenue' ? '1.5rem' : '' }}>{item.count}</span>
                <span className="card-desc">{item.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- INVENTORY ANALYTICS / STOCK MANAGEMENT --- */}
        <div className="imperial-block" style={{ marginTop: '30px' }}>
          <div className="block-header">
            <h2 className="block-title">
              <FiBox /> Inventory Analytics
            </h2>
            <button className="admin-btn-outline" onClick={() => navigate('/admin/products')} style={{ display: 'flex', alignItems: 'center', gap: '5px'}}>
              Manage Stock <FiArrowRight />
            </button>
          </div>
          <div className="stock-grid-imperial">
            <div className="stock-card-luxe" onClick={() => navigate('/admin/stock/in-stock')}>
              <div className="stock-meta">
                <div className="status-dot in"></div>
                <div>
                  <label>In Stock</label>
                  <div className="count">{stats.stockStats?.inStockCount || 0}</div>
                </div>
              </div>
              <FiCheckCircle size={30} color="#27ae60" opacity={0.2} />
            </div>
            
            <div className="stock-card-luxe" onClick={() => navigate('/admin/stock/low-stock')}>
              <div className="stock-meta">
                <div className="status-dot low"></div>
                <div>
                  <label>Low Stock</label>
                  <div className="count" style={{ color: '#f39c12' }}>{stats.stockStats?.lowStockCount || 0}</div>
                </div>
              </div>
              <FiAlertTriangle size={30} color="#f39c12" opacity={0.2} />
            </div>

            <div className="stock-card-luxe" onClick={() => navigate('/admin/stock/out-of-stock')}>
              <div className="stock-meta">
                <div className="status-dot out"></div>
                <div>
                  <label>Out of Stock</label>
                  <div className="count" style={{ color: '#e74c3c' }}>{stats.stockStats?.outOfStockCount || 0}</div>
                </div>
              </div>
              <FiXOctagon size={30} color="#e74c3c" opacity={0.2} />
            </div>
          </div>
        </div>

        {/* --- RECENT INQUIRIES / COMPLAINT BOX --- */}
        <div className="imperial-block" style={{ marginTop: '30px' }}>
          <div className="block-header">
            <h2 className="block-title">
              <FiMessageSquare /> Recent Inquiries
            </h2>
            <button className="admin-btn-outline" onClick={() => navigate('/admin/complaints')} style={{ display: 'flex', alignItems: 'center', gap: '5px'}}>
              View All <FiArrowRight />
            </button>
          </div>
          
          <div className="admin-table-container">
            <table className="imperial-table-modern">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.length > 0 ? (
                  recentComplaints.map((comp) => (
                    <tr key={comp._id}>
                      <td className="user-info-cell">
                        <strong>{comp.name}</strong>
                        <span>{comp.email}</span>
                      </td>
                      <td className="subject-cell">{comp.subject}</td>
                      <td>
                        <span className={`status-tag ${comp.status === 'Unread' ? 'unread' : 'read'}`}>
                          {comp.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns-luxe">
                          <button 
                            className="luxe-icon-btn" 
                            title="View Inquiry"
                            onClick={() => navigate(`/admin/complaints`)}
                          >
                            <FiEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      No recent inquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
