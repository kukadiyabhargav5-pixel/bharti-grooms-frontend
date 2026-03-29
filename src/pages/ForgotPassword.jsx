import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
<<<<<<< HEAD
import { API_BASE_URL } from '../apiConfig';
=======
>>>>>>> e7c4edf6ed26cb8550d0ff7fb77bcd93d25367bc

const STEPS = { EMAIL: 1, OTP: 2, PASSWORD: 3, SUCCESS: 4 };

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email'); return; }
    setLoading(true);
    try {
<<<<<<< HEAD
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password/send-otp`, { email });
=======
      await axios.post('http://localhost:5000/api/auth/forgot-password/send-otp', { email });
>>>>>>> e7c4edf6ed26cb8550d0ff7fb77bcd93d25367bc
      setStep(STEPS.OTP);
      startResendTimer();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(t => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) { setError('Please enter the complete 6-digit OTP'); return; }
    setError('');
    setLoading(true);
    try {
<<<<<<< HEAD
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password/verify-otp`, { email, otp: otpString });
=======
      await axios.post('http://localhost:5000/api/auth/forgot-password/verify-otp', { email, otp: otpString });
>>>>>>> e7c4edf6ed26cb8550d0ff7fb77bcd93d25367bc
      setStep(STEPS.PASSWORD);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
<<<<<<< HEAD
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password/reset`, {
=======
      await axios.post('http://localhost:5000/api/auth/forgot-password/reset', {
>>>>>>> e7c4edf6ed26cb8550d0ff7fb77bcd93d25367bc
        email, otp: otp.join(''), newPassword
      });
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '13px 16px', borderRadius: '10px', boxSizing: 'border-box',
    border: `1.5px solid ${hasError ? '#e74c3c' : 'rgba(128,0,0,0.2)'}`,
    fontSize: '1rem', outline: 'none', fontFamily: 'inherit'
  });

  const btnStyle = {
    width: '100%', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
    background: 'linear-gradient(135deg, #800020, #a0002a)', color: 'white',
    fontWeight: '700', fontSize: '1rem', marginTop: '8px'
  };

  return (
    <div className="auth-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 20px' }}>
      <div className="auth-bg-1" />
      <div className="auth-bg-2" />

      <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>

          {/* ─ Step indicator ─ */}
          {step !== STEPS.SUCCESS && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '30px' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', transition: 'background 0.3s',
                  background: step >= s ? 'var(--maroon)' : '#eee' }} />
              ))}
            </div>
          )}

          {/* ── STEP 1: EMAIL ── */}
          {step === STEPS.EMAIL && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔐</div>
                <h2 style={{ margin: '0 0 6px', color: 'var(--text-dark)' }}>Forgot Password?</h2>
                <p style={{ margin: 0, color: 'var(--text-gray)', fontSize: '0.9rem' }}>
                  Enter your registered email and we'll send you an OTP
                </p>
              </div>
              <form onSubmit={handleSendOtp}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '7px' }}>
                  <FiMail style={{ marginRight: '5px' }} /> Email Address
                </label>
                <input type="email" placeholder="name@example.com" value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  style={inputStyle(!!error)} autoFocus />
                {error && <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: '6px 0 0' }}>{error}</p>}
                <button type="submit" style={btnStyle} disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP →'}
                </button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                <Link to="/login" style={{ color: 'var(--maroon)', fontWeight: '700', textDecoration: 'none' }}>
                  ← Back to Login
                </Link>
              </p>
            </>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === STEPS.OTP && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📧</div>
                <h2 style={{ margin: '0 0 6px', color: 'var(--text-dark)' }}>Enter OTP</h2>
                <p style={{ margin: 0, color: 'var(--text-gray)', fontSize: '0.9rem' }}>
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              {/* 6 OTP Boxes */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                {otp.map((digit, i) => (
                  <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1}
                    value={digit} onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    style={{
                      width: '48px', height: '56px', borderRadius: '10px', textAlign: 'center',
                      fontSize: '1.5rem', fontWeight: '800', border: '2px solid rgba(128,0,0,0.2)',
                      outline: 'none', transition: 'border-color 0.2s',
                      borderColor: digit ? 'var(--maroon)' : 'rgba(128,0,0,0.2)'
                    }}
                  />
                ))}
              </div>

              {error && <p style={{ color: '#e74c3c', fontSize: '0.85rem', textAlign: 'center', margin: '0 0 12px' }}>{error}</p>}

              <button onClick={handleVerifyOtp} style={btnStyle} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP →'}
              </button>

              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                Didn't get OTP?{' '}
                {resendTimer > 0
                  ? <span style={{ color: '#888' }}>Resend in {resendTimer}s</span>
                  : <button onClick={handleSendOtp} style={{ background: 'none', border: 'none', color: 'var(--maroon)', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Resend OTP
                    </button>
                }
              </p>
              <p style={{ textAlign: 'center', marginTop: '8px' }}>
                <button onClick={() => { setStep(STEPS.EMAIL); setError(''); setOtp(['','','','','','']); }}
                  style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.85rem' }}>
                  ← Change email
                </button>
              </p>
            </>
          )}

          {/* ── STEP 3: NEW PASSWORD ── */}
          {step === STEPS.PASSWORD && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔑</div>
                <h2 style={{ margin: '0 0 6px', color: 'var(--text-dark)' }}>Create New Password</h2>
                <p style={{ margin: 0, color: 'var(--text-gray)', fontSize: '0.9rem' }}>OTP verified! Set your new password below.</p>
              </div>
              <form onSubmit={handleReset}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '7px' }}>New Password</label>
                <div style={{ position: 'relative', marginBottom: '14px' }}>
                  <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                    value={newPassword} onChange={e => { setNewPassword(e.target.value); setError(''); }}
                    style={{ ...inputStyle(false), paddingRight: '42px' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '1.1rem' }}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '7px' }}>Confirm Password</label>
                <div style={{ position: 'relative', marginBottom: '4px' }}>
                  <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password"
                    value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    style={{ ...inputStyle(error.includes('match')), paddingRight: '42px' }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '1.1rem' }}>
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {error && <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: '6px 0 0' }}>{error}</p>}
                <button type="submit" style={btnStyle} disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password ✓'}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 4: SUCCESS ── */}
          {step === STEPS.SUCCESS && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%', background: '#d4edda',
                color: '#27ae60', fontSize: '2.5rem', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 20px'
              }}>
                <FiCheck />
              </div>
              <h2 style={{ color: 'var(--text-dark)', margin: '0 0 10px' }}>Password Reset!</h2>
              <p style={{ color: 'var(--text-gray)', margin: '0 0 28px', lineHeight: 1.6 }}>
                Your password has been successfully updated.<br />You can now login with your new password.
              </p>
              <button onClick={() => navigate('/login')} style={btnStyle}>
                Go to Login →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
