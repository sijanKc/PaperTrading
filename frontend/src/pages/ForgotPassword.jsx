import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to OTP verification page
        navigate('/verify-otp', {
          state: {
            email,
            type: 'password-reset'
          }
        });
      } else {
        if (data.retryAfter) {
          setError(`Please wait ${data.retryAfter} seconds before requesting another OTP`);
        } else {
          setError(data.message || 'Failed to send OTP. Please try again.');
        }
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="forgot-password-icon">
            <span>🔐</span>
          </div>
          <h1>Forgot Password?</h1>
          <p>No worries! Enter your email and we'll send you an OTP to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              disabled={loading}
              className={error ? 'input-error' : ''}
            />
            {error && <p className="error-message">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Sending OTP...
              </>
            ) : (
              'Send OTP'
            )}
          </button>

          <div className="form-footer">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="back-to-login"
            >
              ← Back to Login
            </button>
          </div>
        </form>

        <div className="info-box">
          <p>💡 <strong>Tip:</strong> Check your spam folder if you don't receive the email within a few minutes.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
