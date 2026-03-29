import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiSmartphone } from 'react-icons/fi';
import { useRef } from 'react';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../apiConfig';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    console.log('Login page mounted');
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      
      if (res.data.requires2FA) {
        setShow2FA(true);
        setSuccess(res.data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    if (e) e.preventDefault();
    const fullCode = twoFactorCode.join('');
    verifyOTP(fullCode);
  };

  const verifyOTP = async (code) => {
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/admin/verify-2fa`, {
        email: formData.email,
        code: code
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid 2FA code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...twoFactorCode];
    newOtp[index] = value.substring(value.length - 1);
    setTwoFactorCode(newOtp);

    // Auto focus next
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }

    // Auto submit on last digit
    if (value && index === 5) {
      const fullCode = newOtp.join('');
      if (fullCode.length === 6) {
        verifyOTP(fullCode);
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !twoFactorCode[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasteData.length === 6 && pasteData.every(char => !isNaN(char))) {
      setTwoFactorCode(pasteData);
      otpRefs[5].current.focus();
      verifyOTP(pasteData.join(''));
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        // Since we are using custom button, we get an access token
        // We might need to fetch user info from google or send the code to backend
        // For simplicity, let's assume our backend handles the token
        const res = await axios.post(`${API_BASE_URL}/api/auth/google-login`, {
          access_token: tokenResponse.access_token
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Google login error:', err);
        setError(err.response?.data?.message || 'Google Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Login Popup Error:', error);
      setError('Google Sign-In was blocked or failed. Please check your browser settings and try again.');
    }
  });

  return (
    <>
      <div className="auth-page">
        <div className="auth-bg-1" />
        <div className="auth-bg-2" />

        <motion.div 
          className="auth-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="auth-form-panel">
            <div className="auth-form-header">
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Welcome Back
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Don't have an account? <Link to="/register" className="text-gradient" style={{ fontWeight: 700 }}>Create one now</Link>
              </motion.p>
            </div>

            {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert-msg alert-error">⚠️ {error}</motion.div>}
            {success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert-msg alert-success">✅ {success}</motion.div>}

            <AnimatePresence mode="wait">
              {!show2FA ? (
                <motion.form 
                  key="login-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="form-label">Email Address</label>
                    <div className="form-input-wrapper">
                      <FiMail className="form-input-icon" />
                      <input
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="form-label">Password</label>
                    <div className="form-input-wrapper">
                      <FiLock className="form-input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="form-input"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                      <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--maroon)', textDecoration: 'none', fontWeight: '700' }}>
                        Forgot Password?
                      </Link>
                    </div>
                  </motion.div>

                  <motion.button 
                    type="submit" 
                    className="form-submit-btn" 
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form 
                  key="2fa-form"
                  onSubmit={handle2FASubmit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="otp-container">
                    <motion.div 
                      className="otp-header-icon"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <FiShield />
                    </motion.div>
                    
                    <div className="otp-header-text" style={{ textAlign: 'center', marginBottom: '10px' }}>
                      <h4 style={{ color: 'var(--maroon)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '5px' }}>Identity Verification</h4>
                      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Enter the 6-digit code from your app</p>
                    </div>

                    <div className="otp-input-row" onPaste={handleOtpPaste}>
                      {twoFactorCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={otpRefs[index]}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={`otp-digit ${digit ? 'has-value' : ''} ${error ? 'error' : ''}`}
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>

                    <div className="otp-help-text">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem' }}>
                        <FiSmartphone />
                        <span>Check Google Authenticator</span>
                      </div>
                    </div>
                  </div>

                  <motion.button 
                    type="submit" 
                    className="form-submit-btn" 
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </motion.button>

                  <button 
                    type="button" 
                    onClick={() => setShow2FA(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--maroon)', width: '100%', marginTop: '15px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Back to Password
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

              <motion.div 
                className="auth-divider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span>OR</span>
              </motion.div>

              <motion.div 
                className="google-login-container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <button 
                  type="button" 
                  className="custom-google-btn" 
                  onClick={() => loginWithGoogle()}
                  disabled={loading}
                >
                  <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" />
                  Continue with Google
                </button>
              </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
