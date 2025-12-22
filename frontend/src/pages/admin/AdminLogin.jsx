import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, AlertCircle } from 'lucide-react';
import styles from './adminlogin.module.css';
import axios from 'axios';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      const { token, user } = response.data;

      if (user.role === 'admin') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('adminAuthenticated', 'true'); // Keep this for now for compatibility
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. You do not have admin privileges.');
        setLoading(false);
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className="text-center mb-4">
          <div style={{ 
            display: 'inline-flex', 
            padding: '12px', 
            borderRadius: '16px', 
            background: 'rgba(99, 102, 241, 0.1)',
            color: '#818cf8',
            marginBottom: '16px'
          }}>
            <Shield size={32} />
          </div>
        </div>
        
        <h2 className={styles.title}>Admin Portal</h2>
        <p className={styles.subtitle}>Secure access for administrators only</p>

        {error && (
          <div className={styles.alert}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <div className={styles.inputWrapper}>
              <input 
                type="text" 
                className={styles.input}
                placeholder="Enter admin username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User size={18} className={styles.icon} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <input 
                type="password" 
                className={styles.input}
                placeholder="Enter secure password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} className={styles.icon} />
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
