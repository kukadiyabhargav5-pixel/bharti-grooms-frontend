import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiBox, FiDollarSign, FiLogOut, FiBell, FiSettings, FiArchive, FiAlertCircle, FiClock } from 'react-icons/fi';

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Pending Order', path: '/admin/orders/pending', icon: <FiClock /> },
    { name: 'User', path: '/admin/users', icon: <FiUsers /> },
    { name: 'Product', path: '/admin/products', icon: <FiBox /> },
    { name: 'Stock', path: '/admin/stock/all', icon: <FiArchive /> },
    { name: 'Complain', path: '/admin/complaints', icon: <FiAlertCircle /> },
  ];

  return (
    <nav className="luxury-top-nav">
      <div className="nav-container">
        {/* Left Side: Brand & Links */}
        <div className="nav-left">
          <Link to="/admin/dashboard" className="nav-brand">
            <div className="brand-icon-luxury">B</div>
            <span className="brand-text">Bharti <span style={{ color: "var(--admin-gold)" }}>Glooms</span></span>
          </Link>

          <div className="desktop-menu">
            {navLinks.map((link) => {
              const isActive = location.pathname.includes(link.path.split('/')[2]);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`nav-link-premium ${isActive ? 'active' : ''}`}
                >
                  {link.icon}
                  {link.name}
                  {isActive && <div className="nav-underline"></div>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="nav-right">
          <button className="action-icon-btn" title="Notifications">
            <FiBell />
          </button>
          <button className="action-icon-btn" title="Settings">
            <FiSettings />
          </button>

          <div className="admin-profile-dropdown" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=D4AF37" 
              alt="Admin Profile" 
              className="profile-img-premium" 
            />
            <span className="admin-name">Admin Center</span>

            {showProfileMenu && (
              <div className="profile-menu-luxury">
                <div className="menu-header">
                  <strong>System Admin</strong>
                  <span>Manage Platform</span>
                </div>
                <hr style={{ borderColor: 'rgba(0,0,0,0.05)', margin: '15px 0' }} />
                <button onClick={handleLogout} className="menu-item-logout">
                  <FiLogOut />
                  Secure Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
