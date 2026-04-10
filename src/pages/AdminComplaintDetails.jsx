import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiMail, FiUser, FiCalendar, FiInfo, 
  FiSend, FiCheck, FiTrash2, FiHome, FiPackage, 
  FiUsers, FiShield, FiLogOut, FiChevronLeft
} from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminAddProduct.css'; 

const AdminComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchComplaint = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/complaints/${id}`);
      setComplaint(res.data);
      if (res.data.status === 'Unread') {
        await axios.put(`${API_BASE_URL}/api/complaints/${id}/status`, { status: 'Read' });
      }
    } catch (error) {
      console.error('Failed to fetch complaint details:', error);
      navigate('/admin/complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Erase this inquiry from Global Records?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/complaints/${id}`);
        navigate('/admin/complaints');
      } catch (error) {
        alert('Deletion failed');
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      await axios.post(`${API_BASE_URL}/api/complaints/${id}/reply`, {
        replyMessage: replyText
      });
      alert('Communication Transmitted Successfully.');
      navigate('/admin/complaints');
    } catch (error) {
      alert('Transmission failed.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') { navigate('/login'); }
    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Intelligence Depth">
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <div className="admin-loading-spinner" style={{ margin: '0 auto' }}></div>
        </div>
      </AdminLayout>
    );
  }

  if (!complaint) return null;

  return (
    <AdminLayout title="Inquiry Intelligence">
      <div className="admin-content-header" style={{ marginBottom: '25px' }}>
        <button onClick={() => navigate(-1)} className="admin-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 20px' }}>
          <FiChevronLeft /> Return to Communications
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="business-section"
        style={{ maxWidth: '1000px', margin: '0 auto', padding: 0, overflow: 'hidden' }}
      >
        <div style={{ background: 'var(--admin-maroon-gradient)', color: 'white', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div className="brand-icon-luxury" style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '2rem' }}>
              <FiMail />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display', margin: 0, fontSize: '1.8rem' }}>Intelligence Report</h2>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>Secure Record Hash: #{complaint._id.toUpperCase()}</p>
            </div>
          </div>
          <div className={`status-pill-luxury ${complaint.status === 'Unread' ? 'status-unread' : 'status-read'}`} style={{ padding: '10px 25px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}>
            {complaint.status}
          </div>
        </div>

        <div style={{ padding: '50px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginBottom: '50px' }}>
            <div className="business-input-group">
              <label style={{ color: '#94a3b8', letterSpacing: '1px' }}><FiUser /> Originator Profile</label>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>{complaint.name}</div>
              <div style={{ fontSize: '1rem', color: 'var(--maroon)', fontWeight: 600 }}>{complaint.email}</div>
            </div>
            <div className="business-input-group">
              <label style={{ color: '#94a3b8', letterSpacing: '1px' }}><FiCalendar /> Logged Timestamp</label>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>{new Date(complaint.createdAt).toLocaleDateString()}</div>
              <div style={{ fontSize: '1rem', color: '#64748b' }}>{new Date(complaint.createdAt).toLocaleTimeString()}</div>
            </div>
          </div>

          <div style={{ marginBottom: '50px' }}>
            <label style={{ color: '#94a3b8', letterSpacing: '1px', marginBottom: '15px', display: 'block', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Intelligence Subject & Content</label>
            <div style={{ background: '#f8fafc', borderRadius: '25px', padding: '40px', border: '1px solid #edf2f7' }}>
              <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', color: 'var(--maroon)', marginBottom: '20px' }}>{complaint.subject}</h3>
              <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{complaint.message}</p>
            </div>
          </div>

          <div style={{ borderTop: '2px dashed #f1f5f9', paddingTop: '50px' }}>
            <label style={{ color: 'var(--maroon)', fontWeight: 800, display: 'block', marginBottom: '20px', letterSpacing: '1.5px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Authorize Communication Response</label>
            <textarea 
              className="luxury-input"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Draft official corporate response..."
              style={{ height: '200px', padding: '25px', fontSize: '1.1rem', background: 'white' }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
              <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiTrash2 /> Terminate Record
              </button>
              <button 
                onClick={handleSendReply} 
                disabled={isSending || !replyText.trim()}
                className="btn-save-luxury"
                style={{ width: 'auto', padding: '15px 40px', marginTop: 0, borderRadius: '15px' }}
              >
                {isSending ? 'Transmitting...' : 'Send Official Response'} <FiSend style={{ marginLeft: '10px' }} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminComplaintDetails;
