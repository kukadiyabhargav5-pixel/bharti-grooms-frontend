import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiMapPin } from 'react-icons/fi';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import Footer from '../components/Footer';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    address: '',
    password: '',
  });

  useEffect(() => {
    console.log('Register page mounted');
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
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.post('http://localhost:5000/api/auth/google-login', {
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
      console.error('Google Register Popup Error:', error);
      setError('Google Sign-In failed or was blocked. Ensure your browser allows popups.');
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
                Create Account
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Already have an account? <Link to="/login" className="text-gradient" style={{ fontWeight: 700 }}>Sign In</Link>
              </motion.p>
            </div>

            {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert-msg alert-error">⚠️ {error}</motion.div>}
            {success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert-msg alert-success">✅ {success}</motion.div>}

            <form onSubmit={handleSubmit}>
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="form-label">Full Name</label>
                <div className="form-input-wrapper">
                  <FiUser className="form-input-icon" />
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
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
                transition={{ delay: 0.7 }}
              >
                <label className="form-label">Mobile Number</label>
                <div className="form-input-wrapper">
                  <FiPhone className="form-input-icon" />
                  <input
                    type="tel"
                    name="mobileNumber"
                    className="form-input"
                    placeholder="Enter mobile number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="form-label">Password</label>
                <div className="form-input-wrapper">
                  <FiLock className="form-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label className="form-label">Full Address</label>
                <div className="form-input-wrapper">
                  <FiMapPin className="form-input-icon" style={{ top: '24px', transform: 'none' }} />
                  <textarea
                    name="address"
                    className="form-input"
                    placeholder="Enter your delivery address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="2"
                    style={{ resize: 'none', paddingTop: '16px' }}
                  />
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
                transition={{ delay: 1.0 }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </motion.button>

              <motion.div 
                className="auth-divider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <span>OR</span>
              </motion.div>

              <motion.div 
                className="google-login-container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
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
              
              <motion.p 
                style={{ fontSize: '0.8rem', color: 'var(--text-gray)', textAlign: 'center', marginTop: '20px', lineHeight: 1.5 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                By registering, you agree to Bharti Glooms' <br />
                <a href="#" style={{ color: 'var(--maroon)', fontWeight: '700' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--maroon)', fontWeight: '700' }}>Privacy Policy</a>.
              </motion.p>
            </form>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
