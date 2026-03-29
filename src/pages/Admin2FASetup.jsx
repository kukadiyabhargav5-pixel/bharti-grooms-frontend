import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiCopy, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const Admin2FASetup = () => {
  const navigate = useNavigate();
  const [setupData, setSetupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }

    const fetchSetup = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/2fa-setup`);
        setSetupData(res.data);

      } catch (err) {
        console.error('Failed to fetch 2FA setup:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSetup();
  }, [navigate]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="admin-loading">Loading Setup...</div>;

  return (
    <div className="admin-layout" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div 
        className="admin-card" 
        style={{ maxWidth: '500px', width: '100%', padding: '40px', textAlign: 'center' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ background: 'rgba(128, 0, 32, 0.1)', color: 'var(--maroon)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.5rem' }}>
          <FiShield />
        </div>
        
        <h2 style={{ marginBottom: '10px' }}>Admin 2FA Setup</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '30px' }}>
          Secure your admin account using Google Authenticator. Scan the QR code below using the app on your phone.
        </p>

        {setupData && (
          <>
            <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
              <img src={setupData.qrcode} alt="2FA QR Code" style={{ width: '200px', height: '200px' }} />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '30px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>Manual Secret Key</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={setupData.secret} 
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.9rem', fontFamily: 'monospace' }}
                />
                <button 
                  onClick={() => copyToClipboard(setupData.secret)}
                  style={{ padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--maroon)', color: 'white', cursor: 'pointer' }}
                >
                  {copied ? <FiCheckCircle /> : <FiCopy />}
                </button>
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '15px', borderRadius: '12px', textAlign: 'left', marginBottom: '30px' }}>
              <p style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: '600', marginBottom: '5px' }}>⚠️ Important Step:</p>
              <p style={{ fontSize: '0.8rem', color: '#b45309' }}>
                Copy this manual secret and paste it into your server's <code>.env</code> file as <code>ADMIN_2FA_SECRET</code> to activate it.
              </p>
            </div>
          </>
        )}

        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="admin-btn-outline"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
};

export default Admin2FASetup;
