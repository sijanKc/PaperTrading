import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OTPInput from '../components/OTPInput';
import './VerifyOTP.css';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userData, type = 'registration' } = location.state || {};

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleOTPComplete = async (otpValue) => {
    setOtp(otpValue);
    setError('');
    setLoading(true);

    try {
      let response;

      if (type === 'password-reset') {
        // For password reset, just verify OTP and navigate to reset password page
        navigate('/reset-password', {
          state: { email, otp: otpValue }
        });
        return;
      } else {
        // For registration, verify OTP and create account
        response = await fetch('http://localhost:5000/api/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            otp: otpValue,
            email,
            ...userData
          })
        });
      }

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Verification successful! Redirecting...');
        
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
        setOtp('');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Network error. Please check your connection and try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || resendLoading) return;

    setResendLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          type: type === 'password-reset' ? 'password-reset' : 'registration'
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('New OTP sent to your email!');
        setResendTimer(60);
        setCanResend(false);

        // Restart countdown
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        if (data.retryAfter) {
          setError(`Please wait ${data.retryAfter} seconds before requesting another OTP`);
        } else {
          setError(data.message || 'Failed to resend OTP');
        }
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    if (type === 'password-reset') {
      navigate('/forgot-password');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-card">
        <div className="verify-otp-header">
          <div className="verify-otp-icon">
            <span>📧</span>
          </div>
          <h1>Verify Your Email</h1>
          <p>
            We've sent a 6-digit OTP to<br />
            <strong>{email}</strong>
          </p>
        </div>

        <div className="verify-otp-body">
          {successMessage && (
            <div className="success-message">
              <span>✓</span> {successMessage}
            </div>
          )}

          <OTPInput
            length={6}
            onComplete={handleOTPComplete}
            error={error}
            disabled={loading}
          />

          {loading && (
            <div className="loading-message">
              <div className="spinner"></div>
              <p>Verifying OTP...</p>
            </div>
          )}

          <div className="resend-section">
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="resend-button"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            ) : (
              <p className="resend-timer">
                Resend OTP in <strong>{resendTimer}s</strong>
              </p>
            )}
          </div>

          <div className="otp-info">
            <p>⏱️ OTP expires in 10 minutes</p>
            <p>🔒 Don't share this code with anyone</p>
          </div>

          <button onClick={handleBack} className="back-button">
            ← Back to {type === 'password-reset' ? 'Forgot Password' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
