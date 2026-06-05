import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUsers, FiPackage, FiLogOut, FiMenu, FiX, FiMail, 
  FiCheck, FiTrash2, FiEye, FiSearch, FiFilter, FiShield, 
  FiSend, FiChevronRight, FiCalendar, FiUser, FiInfo, FiRefreshCw
} from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminAddProduct.css'; 

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
      await axios.put(`${API_BASE_URL}/api/complaints/${id}/status`, { status });
      setComplaints(prev => prev.map(c => c._id === id ? { ...c, status } : c));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry from Global Support records?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/complaints/${id}`);
        setComplaints(prev => prev.filter(c => c._id !== id));
        if (selectedInquiry?._id === id) handleCloseModal();
      } catch (error) {
        alert('Deletion failed');
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      await axios.post(`${API_BASE_URL}/api/complaints/${selectedInquiry._id}/reply`, {
        replyMessage: replyText
      });
      alert('Official Reply Transmitted Successfully.');
      handleCloseModal();
      fetchComplaints();
    } catch (error) {
      alert('Transmission failed. Check server status.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') { navigate('/login'); }
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
    <AdminLayout title="Support Intelligence">
      <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="business-search-zone" style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
          <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search Communications History..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="luxury-input" 
            style={{ paddingLeft: '45px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
             <select 
                value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="luxury-input"
                style={{ width: 'auto', padding: '10px 20px' }}
              >
                <option value="All">All Inquiries</option>
                <option value="Unread">Unread (Urgent)</option>
                <option value="Read">Reviewed</option>
                <option value="Replied">Resolved</option>
              </select>
            <button className="btn-save-luxury" style={{ width: 'auto', padding: '12px 25px', marginTop: '0' }} onClick={fetchComplaints}>
                <FiRefreshCw /> Refresh Inbox
            </button>
        </div>
      </div>

      <div className="admin-content">
        <section className="business-table-card">
          <div className="table-responsive">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Customer Profile</th>
                  <th>Intelligence Subject</th>
                  <th>Operational Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '100px' }}><div className="admin-loading-spinner" style={{ margin: '0 auto' }}></div></td></tr>
                ) : filteredComplaints.length > 0 ? (
                  filteredComplaints.map((comp, index) => (
                    <motion.tr 
                      key={comp._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{ background: comp.status === 'Unread' ? 'rgba(96, 0, 24, 0.02)' : 'transparent' }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="brand-icon-luxury" style={{ width: '35px', height: '35px', fontSize: '0.9rem', background: 'var(--admin-gold-soft)', color: 'var(--maroon)' }}>
                            {comp.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800 }}>{comp.name}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{comp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--maroon)' }}>{comp.subject}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7, maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{comp.message}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}><FiCalendar style={{ marginRight: '4px' }} /> {new Date(comp.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td>
                        <span className={`status-pill-luxury ${comp.status === 'Unread' ? 'status-unread' : 'status-read'}`}>
                          {comp.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleOpenModal(comp)} className="admin-btn-outline" style={{ padding: '8px 15px', border: '1px solid var(--admin-glass-border)' }}><FiEye /> Analyze</button>
                          <button onClick={() => handleDelete(comp._id)} className="admin-btn-outline" style={{ padding: '8px', color: '#e74c3c' }}><FiTrash2 /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>Communication registry is empty.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 🏛️ SUPPORT CONSOLE MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedInquiry && (
            <motion.div 
                className="admin-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
            >
                <motion.div 
                className="admin-modal-container"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '800px', borderRadius: '30px' }}
                >
                <div className="admin-modal-header" style={{ background: 'var(--admin-maroon-gradient)', color: 'white', border: 'none', padding: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className="brand-icon-luxury" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}><FiMail /></div>
                        <div>
                            <h3 style={{ fontFamily: 'Playfair Display', margin: 0, fontSize: '1.4rem' }}>Support Command Console</h3>
                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Secure Transmission Node Alpha</span>
                        </div>
                    </div>
                    <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem' }}><FiX /></button>
                </div>
                <div className="admin-modal-body" style={{ padding: '35px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                        <div className="business-input-group">
                            <label>Originator</label>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{selectedInquiry.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{selectedInquiry.email}</div>
                        </div>
                        <div className="business-input-group">
                            <label>Inquiry Timestamp</label>
                            <div style={{ fontWeight: 800 }}>{new Date(selectedInquiry.createdAt).toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <div className="business-input-group" style={{ marginBottom: '30px' }}>
                        <label>Intelligence Subject</label>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--maroon)', fontFamily: 'Playfair Display' }}>{selectedInquiry.subject}</div>
                    </div>

                    <div className="business-section" style={{ background: '#f8fafc', padding: '25px', borderRadius: '20px', border: '1px solid #edf2f7', marginBottom: '30px' }}>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Customer Statement</label>
                        <div style={{ fontSize: '1rem', lineHeight: '1.6', color: '#475569' }}>{selectedInquiry.message}</div>
                    </div>

                    <div className="business-input-group">
                        <label>Compose Official Response</label>
                        <textarea 
                            className="luxury-input" 
                            style={{ height: '150px', resize: 'none', background: 'white' }} 
                            placeholder="Draft high-end business correspondence..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />
                    </div>
                </div>
                <div className="admin-modal-footer" style={{ padding: '25px 35px', background: '#f8fafc', borderRadius: '0 0 30px 30px' }}>
                    <button className="admin-btn-outline" style={{ borderRadius: '12px' }} onClick={handleCloseModal}>Abort Transmission</button>
                    <button 
                        className="btn-save-luxury" 
                        style={{ width: 'auto', padding: '12px 35px', marginTop: 0, borderRadius: '12px' }}
                        disabled={isSending || !replyText.trim()}
                        onClick={handleSendReply}
                    >
                        {isSending ? 'Transmitting...' : 'Authorize & Send Reply'} <FiSend style={{ marginLeft: '10px' }} />
                    </button>
                </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .status-unread { background: #fff5f5; color: #c53030; border: 1px solid rgba(197, 48, 48, 0.2); }
        .status-read { background: #f0fff4; color: #2e7d32; border: 1px solid rgba(46, 125, 50, 0.2); }
      `}</style>
    </AdminLayout>
  );
};

export default AdminComplaints;
