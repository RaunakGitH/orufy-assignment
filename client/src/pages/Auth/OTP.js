import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyOtp } from '../../services/authService';
import { useAuth } from '../../context/authContext';
import { login } from '../../services/authService';
import toast from 'react-hot-toast';
import './Auth.css';

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginSuccess } = useAuth();

  const emailOrPhone = location.state?.emailOrPhone || '';
  const devOtp = location.state?.otp || ''; 

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);

  
  useEffect(() => {
    if (!emailOrPhone) navigate('/login');
  }, [emailOrPhone, navigate]);

  
  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; 
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);
    setError('');
    
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length < 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(emailOrPhone, otpStr);
      loginSuccess(res.data.token, res.data.user);
      toast.success('Welcome to Productr!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await login(emailOrPhone);
      toast.success('OTP resent!');
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="auth-page">
      {/* Left illustration panel */}
      <div className="auth-left">
        <div className="auth-illustration">
          <div className="auth-illustration-card">
            <div className="runner-icon">🏃</div>
            <p>Upl<span>o</span>ad your<br />product to market</p>
          </div>
        </div>
      </div>

      
      <div className="auth-right">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="logo-icon">🛍️</div>
            <span>Productr</span>
          </div>

          <h2>Login to your Productr Account</h2>
          <p>
            Enter your OTP
            {devOtp && (
              <span className="dev-otp-hint"> (dev: <b>{devOtp}</b>)</span>
            )}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Enter OTP</label>
              <div className="otp-boxes" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`otp-box ${error ? 'error' : ''}`}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              {error && <p className="form-error">{error}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
              disabled={loading}
            >
              {loading ? <><span className="spinner" /> Verifying...</> : 'Enter your OTP'}
            </button>
          </form>

          <p className="auth-footer" style={{ marginTop: '16px' }}>
            Didn't receive OTP?{' '}
            {resendTimer > 0 ? (
              <span className="auth-link disabled">Resend in {resendTimer}s</span>
            ) : (
              <button className="auth-link-btn" onClick={handleResend}>Resend it</button>
            )}
          </p>

          <p className="auth-footer">
            <Link to="/login" className="auth-link">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTP;