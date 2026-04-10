import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/AdminLayout.css';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children, title = "Admin Panel" }) => {

  return (
    <div className="luxury-admin-layout">
      <AdminNavbar />

      <main className="luxury-main-content-fluid" style={{ padding: '120px 40px 40px 40px' }}>
        <div className="content-page-header">
           <h2 className="luxury-page-title">{title}</h2>
        </div>
        <div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
