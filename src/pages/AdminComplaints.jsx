import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUsers, FiPackage, FiLogOut, FiMenu, FiX, FiMail, 
  FiCheck, FiTrash2, FiEye, FiSearch, FiFilter, FiShield, 
  FiSend, FiChevronRight, FiCalendar, FiUser, FiInfo
} from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import '../styles/Admin.css';

const AdminComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/complaints`);
      setComplaints(res.data);

    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
    setReplyText('');
    
    // If unread, mark as read
    if (inquiry.status === 'Unread') {
      updateStatus(inquiry._id, 'Read');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/complaints/${id}/status`, { status });      // Update local state for immediate feedback
      setComplaints(prev => prev.map(c => c._id === id ? { ...c, status } : c));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this inquiry? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/complaints/${id}`);        setComplaints(prev => prev.filter(c => c._id !== id));
        if (selectedInquiry?._id === id) handleCloseModal();
      } catch (error) {
        alert('Failed to delete inquiry');
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    
    setIsSending(true);
    try {
      await axios.post(`${API_BASE_URL}/api/complaints/${selectedInquiry._id}/reply`, {        replyMessage: replyText
      });
      alert('Reply sent successfully! The inquiry has been removed from your inbox.');
      handleCloseModal();
      fetchComplaints(); // Refresh the list
    } catch (error) {
      console.error('Reply Error:', error);
      alert('Failed to send reply. Please check your connection or try refreshing the page.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
    window.scrollTo(0, 0);
    fetchComplaints();
  }, [navigate]);

  const filteredComplaints = complaints.filter(comp => {
    const matchesSearch = 
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      comp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || comp.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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
            <Link to="/admin/dashboard" className="admin-nav-item"><FiHome /> Dashboard</Link>
            <Link to="/admin/products" className="admin-nav-item"><FiPackage /> Products</Link>
            <Link to="/admin/users" className="admin-nav-item"><FiUsers /> Customers</Link>
            <Link to="/admin/complaints" className="admin-nav-item active"><FiMail /> Inquiries</Link>
            <Link to="/admin/2fa-setup" className="admin-nav-item"><FiShield /> Safety</Link>
          </nav>
        </div>
        <div className="admin-topbar-right">
          <div className="admin-profile-badge">
            <span className="admin-profile-name">Bharti Admin</span>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="admin-topbar-logout"><FiLogOut /></button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-content-header" style={{ marginBottom: '30px' }}>
          <div>
            <h2 className="admin-page-title" style={{ marginBottom: '5px' }}>Customer Support Center</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage and respond to all customer inquiries and complaints from one place.</p>
          </div>
          <button className="admin-btn-primary" onClick={fetchComplaints}>Refresh Inbox</button>
        </div>

        <div className="admin-content">
          {/* Stats & Filters */}
          <div className="admin-header-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div className="admin-quick-stat" style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
              <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>Total Inquiries</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>{complaints.length}</div>
            </div>
            <div className="admin-quick-stat" style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
              <div style={{ color: '#c53030', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>Pending Unread</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c53030' }}>{complaints.filter(c => c.status === 'Unread').length}</div>
            </div>
            {/* Filter Section */}
            <div className="filter-card" style={{ gridColumn: 'span 2', background: 'white', padding: '15px 20px', borderRadius: '16px', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" placeholder="Search by name, email or subject..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                />
              </div>
              <select 
                value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', background: 'white' }}
              >
                <option value="All">All Inquiries</option>
                <option value="Unread">Unread Only</option>
                <option value="Read">Read Only</option>
                <option value="Replied">Replied Only</option>
              </select>
            </div>
          </div>

          {/* Premium Inbox Table */}
          <div className="admin-card" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: 'none' }}>
            <div className="admin-table-container">
              <table className="admin-table premium-table">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '20px' }}>CUSTOMER</th>
                    <th>INQUIRY DETAILS</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '100px' }}><div className="loader-box">Processing Inbox...</div></td></tr>
                  ) : filteredComplaints.length > 0 ? (
                    filteredComplaints.map(comp => (
                      <motion.tr 
                        key={comp._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ borderBottom: '1px solid #f1f5f9' }}
                        className={comp.status === 'Unread' ? 'unread-row' : ''}
                      >
                        <td style={{ padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                              width: '40px', height: '40px', borderRadius: '50%', 
                              background: '#f1f5f9', color: '#600018', display: 'flex', 
                              alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' 
                            }}>
                              {comp.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#1e293b' }}>{comp.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{comp.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#600018', fontSize: '0.95rem', marginBottom: '4px' }}>{comp.subject}</div>
                          <div style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {comp.message}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FiCalendar size={12} /> {new Date(comp.createdAt).toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${comp.status.toLowerCase()}`}>
                            {comp.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button onClick={() => handleOpenModal(comp)} className="premium-action-btn view" title="View & Reply">
                              <FiEye />
                            </button>
                            <button onClick={() => handleDelete(comp._id)} className="premium-action-btn delete" title="Delete Inquiry">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>No inquiries found in this category.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Premium View/Reply Modal */}
      <AnimatePresence>
        {isModalOpen && selectedInquiry && (
          <div className="admin-modal-overlay">
            <motion.div 
              className="admin-modal-content premium-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="modal-header-premium">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div className="modal-icon-box"><FiMail /></div>
                  <div>
                    <h3 style={{ margin: 0 }}>Customer Support Console</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>Ref: #{selectedInquiry._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <button onClick={handleCloseModal} className="modal-close-btn-premium"><FiX /></button>
              </div>

              <div className="modal-body-premium">
                {/* Inquiry Details */}
                <div className="inquiry-info-section">
                  <div className="info-row">
                    <div className="info-item">
                      <label><FiUser /> From</label>
                      <p><strong>{selectedInquiry.name}</strong> ({selectedInquiry.email})</p>
                    </div>
                    <div className="info-item">
                      <label><FiCalendar /> Received</label>
                      <p>{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="info-item full">
                    <label><FiInfo /> Subject</label>
                    <p style={{ fontSize: '1.1rem', color: '#600018', fontWeight: 700 }}>{selectedInquiry.subject}</p>
                  </div>
                  <div className="message-content-box">
                    <label>CUSTOMER MESSAGE</label>
                    <div className="message-bubble">{selectedInquiry.message}</div>
                  </div>
                </div>

                {/* Reply Section */}
                <div className="reply-section-premium">
                  <label>COMPOSE REPLY (Sent from bhartiglooms@gmail.com)</label>
                  <textarea 
                    placeholder="Type your detailed response to the customer here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                  ></textarea>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                    <button 
                      onClick={handleSendReply} 
                      className="btn-send-reply"
                      disabled={isSending || !replyText.trim()}
                    >
                      {isSending ? 'Transmitting Response...' : 'Send Official Reply'} <FiSend style={{ marginLeft: '10px' }} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .premium-table th { font-size: 0.75rem; letter-spacing: 1.5px; color: #64748b; font-weight: 700; }
        .unread-row { background: #fdfaf9 !important; border-left: 4px solid #600018 !important; }
        .status-pill { padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
        .status-pill.unread { background: #fff5f5; color: #c53030; }
        .status-pill.read { background: #f0fff4; color: #2e7d32; }
        .status-pill.replied { background: #ebf8ff; color: #3182ce; }
        
        .premium-action-btn { 
          width: 36px; height: 36px; border-radius: 10px; border: none; 
          display: flex; alignItems: center; justifyContent: center; 
          cursor: pointer; transition: all 0.2s; font-size: 1rem;
        }
        .premium-action-btn.view { background: #f1f5f9; color: #334155; }
        .premium-action-btn.view:hover { background: #e2e8f0; color: #1e293b; transform: translateY(-2px); }
        .premium-action-btn.delete { background: #fff5f5; color: #c53030; }
        .premium-action-btn.delete:hover { background: #fed7d7; transform: translateY(-2px); }

        .admin-modal-overlay { 
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
          background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); 
          display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
        }
        .premium-modal { 
          background: white; border-radius: 24px; width: 100%; max-width: 700px; 
          max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .modal-header-premium { 
          padding: 25px 30px; background: #600018; color: white; 
          display: flex; justify-content: space-between; align-items: center;
        }
        .modal-icon-box { 
          width: 45px; height: 45px; background: rgba(255,255,255,0.1); 
          border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
        }
        .modal-close-btn-premium { background: none; border: none; color: white; cursor: pointer; font-size: 1.5rem; opacity: 0.7; transition: 0.2s; }
        .modal-close-btn-premium:hover { opacity: 1; transform: rotate(90deg); }
        
        .modal-body-premium { padding: 30px; }
        .inquiry-info-section { margin-bottom: 30px; }
        .info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
        .info-item label { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: #94a3b8; font-weight: 700; list-style: none; text-transform: uppercase; margin-bottom: 5px; }
        .info-item p { margin: 0; font-size: 0.95rem; color: #1e293b; }
        
        .message-content-box label { font-size: 0.7rem; color: #94a3b8; font-weight: 700; display: block; margin-bottom: 10px; }
        .message-bubble { background: #f8fafc; padding: 20px; border-radius: 16px; font-size: 0.95rem; color: #475569; line-height: 1.6; border: 1px solid #f1f5f9; }
        
        .reply-section-premium { border-top: 1px solid #f1f5f9; padding-top: 25px; }
        .reply-section-premium label { font-size: 0.7rem; color: #600018; font-weight: 700; display: block; margin-bottom: 10px; letter-spacing: 0.5px; }
        .reply-section-premium textarea { 
          width: 100%; border: 1px solid #e2e8f0; border-radius: 16px; padding: 15px; 
          font-family: inherit; font-size: 0.95rem; outline: none; transition: 0.2s; resize: none;
        }
        .reply-section-premium textarea:focus { border-color: #600018; box-shadow: 0 0 0 4px rgba(96, 0, 24, 0.05); }

        .btn-send-reply { 
          background: #600018; color: white; padding: 12px 30px; 
          border: none; border-radius: 12px; font-weight: 700; cursor: pointer; 
          display: flex; align-items: center; transition: 0.3s;
        }
        .btn-send-reply:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(96, 0, 24, 0.2); }
        .btn-send-reply:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default AdminComplaints;
