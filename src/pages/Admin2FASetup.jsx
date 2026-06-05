import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiCopy, FiCheckCircle, FiArrowLeft, FiLock, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import AdminLayout from '../components/AdminLayout';
import '../styles/AdminAddProduct.css'; 

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

  if (loading) {
    return (
      <AdminLayout title="Security Protocols">
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <div className="admin-loading-spinner" style={{ margin: '0 auto' }}></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Cryptographic Security Hub">
      <div className="admin-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '20px' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="business-section"
          style={{ maxWidth: '600px', width: '100%', padding: '50px', textAlign: 'center', borderRadius: '30px' }}
        >
          <div className="brand-icon-luxury" style={{ 
            width: '80px', height: '80px', background: 'var(--admin-maroon-gradient)', color: 'white', 
            fontSize: '2rem', margin: '0 auto 30px', boxShadow: '0 10px 25px rgba(96, 0, 24, 0.2)' 
          }}>
            <FiLock />
          </div>
          
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: '15px' }}>Admin Protocol 2FA</h2>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6', marginBottom: '40px' }}>
            Initialize multi-layer biometric and cryptographic authentication. Scan the specialized QR identifier below using an authorized Authenticator application.
          </p>

          {setupData && (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '40px' }}
              >
                <div style={{ 
                  background: 'white', padding: '25px', borderRadius: '25px', 
                  display: 'inline-block', boxShadow: '0 15px 40px rgba(0,0,0,0.08)', 
                  border: '1px solid #edf2f7', marginBottom: '35px' 
                }}>
                  <img src={setupData.qrcode} alt="Security Hash" style={{ width: '220px', height: '220px', display: 'block' }} />
                  <div style={{ marginTop: '15px', fontSize: '0.7rem', color: 'var(--maroon)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Authorized Node QR</div>
                </div>

                <div style={{ textAlign: 'left', marginBottom: '35px' }}>
                  <label className="admin-card-label" style={{ marginBottom: '10px', display: 'block' }}>Manual Override Secret Key</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      readOnly 
                      value={setupData.secret} 
                      className="luxury-input"
                      style={{ flex: 1, fontFamily: 'monospace', fontSize: '1.1rem', background: '#f8fafc', fontWeight: 600 }}
                    />
                    <button 
                      onClick={() => copyToClipboard(setupData.secret)}
                      className="btn-save-luxury"
                      style={{ marginTop: 0, width: '60px', padding: 0 }}
                    >
                      {copied ? <FiCheck /> : <FiCopy />}
                    </button>
                  </div>
                </div>

                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.03)', border: '1px dashed rgba(96, 0, 24, 0.2)', 
                  padding: '25px', borderRadius: '20px', textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <FiAlertTriangle style={{ color: 'var(--maroon)', fontSize: '1.5rem', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--maroon)', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Critical Configuration:</p>
                      <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.6' }}>
                        To finalize the handshake, integrate this manual secret into the core environment layer (<code>.env</code>) as <code>ADMIN_2FA_SECRET</code>. 
                        <strong> Failure to do so will result in protocol mismatch.</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="admin-btn-outline"
              style={{ flex: 1, padding: '15px', borderRadius: '15px' }}
            >
              <FiArrowLeft /> Intelligence Hub
            </button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Admin2FASetup;
