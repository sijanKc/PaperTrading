import React, { useState, useEffect } from 'react';
import styles from '../../admincss/UserModal.module.css';

const UserModal = ({ 
  isOpen, 
  onClose, 
  userData, 
  mode = 'edit', // 'edit' or 'create'
  onSave 
}) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    approved: false, // New: Approval checkbox
    virtualMoney: 10000,
    tradingLimit: 50000,
    suspensionDuration: 7,
    suspensionReason: '',
    banReason: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with user data when editing
  useEffect(() => {
    if (userData && mode === 'edit') {
      setFormData({
        id: userData.id || '',
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'user',
        status: userData.status || 'active',
        approved: userData.approved || false, // New
        virtualMoney: userData.virtualMoney || 10000,
        tradingLimit: userData.tradingLimit || 50000,
        suspensionDuration: userData.suspensionDuration || 7,
        suspensionReason: userData.suspensionReason || '',
        banReason: userData.banReason || '',
        notes: userData.notes || ''
      });
    } else if (mode === 'create') {
      // Reset form for new user
      setFormData({
        id: '',
        name: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active',
        approved: false, // New users default unapproved
        virtualMoney: 10000,
        tradingLimit: 50000,
        suspensionDuration: 7,
        suspensionReason: '',
        banReason: '',
        notes: ''
      });
    }
  }, [userData, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuspend = () => {
    if (window.confirm(`Suspend this user for ${formData.suspensionDuration} days?`)) {
      setFormData(prev => ({
        ...prev,
        status: 'suspended'
      }));
    }
  };

  const handleBan = () => {
    if (window.confirm('Ban this user permanently?')) {
      setFormData(prev => ({
        ...prev,
        status: 'banned'
      }));
    }
  };

  const handleDelete = () => {
    if (window.confirm('Delete this user account? This action cannot be undone.')) {
      setFormData(prev => ({
        ...prev,
        status: 'deleted'
      }));
    }
  };

  const handleResetPassword = () => {
    if (window.confirm('Send password reset email to user?')) {
      alert('Password reset email sent!');
    }
  };

  // New: Handle approval toggle
  const handleApproveToggle = () => {
    if (!formData.approved && window.confirm('Approve this user? They will gain access to the dashboard.')) {
      setFormData(prev => ({ ...prev, approved: true }));
    } else if (formData.approved && window.confirm('Unapprove this user? They will lose dashboard access.')) {
      setFormData(prev => ({ ...prev, approved: false }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === 'edit' ? '✏️ Edit User' : '👤 Create New User'}
            {mode === 'edit' && formData.id && (
              <span className={styles.userId}>ID: {formData.id}</span>
            )}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Quick Actions Bar - Updated to include approve toggle */}
        <div className={styles.quickActions}>
          <button 
            type="button"
            className={`${styles.actionBtn} ${formData.approved ? styles.warning : styles.success}`}
            onClick={handleApproveToggle}
          >
            {formData.approved ? '❌ Unapprove' : '✅ Approve'}
          </button>
          
          <button 
            type="button"
            className={`${styles.actionBtn} ${styles.suspendBtn}`}
            onClick={handleSuspend}
            disabled={formData.status === 'suspended'}
          >
            ⏸️ Suspend
          </button>
          
          <button 
            type="button"
            className={`${styles.actionBtn} ${styles.banBtn}`}
            onClick={handleBan}
            disabled={formData.status === 'banned'}
          >
            ⛔ Ban
          </button>
          
          <button 
            type="button"
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={handleDelete}
            disabled={formData.status === 'deleted'}
          >
            🗑️ Delete
          </button>
          
          <button 
            type="button"
            className={`${styles.actionBtn} ${styles.resetBtn}`}
            onClick={handleResetPassword}
          >
            🔑 Reset Password
          </button>
        </div>

        {/* Modal Content */}
        <div className={styles.modalContent}>
          <form onSubmit={handleSubmit} className={styles.userForm}>
            
            {/* Basic Information Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>👤</span>
                Basic Information
              </h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Full Name *
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.formInput}
                      required
                      placeholder="Enter full name"
                    />
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Email Address *
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.formInput}
                      required
                      placeholder="user@example.com"
                    />
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Phone Number
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.formInput}
                      placeholder="+977 98XXXXXXXX"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Account Settings Section - Updated to include approval checkbox */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>⚙️</span>
                Account Settings
              </h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    User Role
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={styles.formSelect}
                    >
                      <option value="user">👤 User</option>
                      <option value="premium">⭐ Premium User</option>
                      <option value="moderator">🛡️ Moderator</option>
                      <option value="admin">👑 Admin</option>
                    </select>
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Account Status
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={styles.formSelect}
                    >
                      <option value="active">✅ Active</option>
                      <option value="inactive">🔄 Inactive</option>
                      <option value="suspended">⏸️ Suspended</option>
                      <option value="banned">⛔ Banned</option>
                      <option value="deleted">🗑️ Deleted</option>
                    </select>
                  </label>
                </div>

                {/* New: Approval checkbox - Independent of status */}
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="approved"
                      checked={formData.approved}
                      onChange={handleChange}
                      className={styles.formCheckbox}
                    />
                    ✅ Admin Approved (Allows dashboard access)
                  </label>
                  <span className={styles.helperText}>
                    If unchecked, user status will be 'pending' and cannot access dashboard.
                  </span>
                </div>

                {/* Show suspension settings if suspended */}
                {formData.status === 'suspended' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Suspension Duration (Days)
                        <input
                          type="number"
                          name="suspensionDuration"
                          value={formData.suspensionDuration}
                          onChange={handleChange}
                          className={styles.formInput}
                          min="1"
                          max="365"
                        />
                      </label>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Suspension Reason
                        <textarea
                          name="suspensionReason"
                          value={formData.suspensionReason}
                          onChange={handleChange}
                          className={styles.formTextarea}
                          placeholder="Enter reason for suspension"
                          rows="3"
                        />
                      </label>
                    </div>
                  </>
                )}

                {/* Show ban reason if banned */}
                {formData.status === 'banned' && (
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Ban Reason
                      <textarea
                        name="banReason"
                        value={formData.banReason}
                        onChange={handleChange}
                        className={styles.formTextarea}
                        placeholder="Enter reason for ban"
                        rows="3"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Trading Settings Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>💰</span>
                Trading Settings
              </h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Initial Virtual Money (₹)
                    <input
                      type="number"
                      name="virtualMoney"
                      value={formData.virtualMoney}
                      onChange={handleChange}
                      className={styles.formInput}
                      min="0"
                      step="1000"
                    />
                    <span className={styles.helperText}>
                      Starting balance for paper trading
                    </span>
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Daily Trading Limit (₹)
                    <input
                      type="number"
                      name="tradingLimit"
                      value={formData.tradingLimit}
                      onChange={handleChange}
                      className={styles.formInput}
                      min="0"
                      step="5000"
                    />
                    <span className={styles.helperText}>
                      Maximum trade amount per day
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📝</span>
                Admin Notes
              </h3>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Additional Notes
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className={styles.formTextarea}
                    placeholder="Add any notes about this user..."
                    rows="4"
                  />
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className={styles.saveButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Saving...
                  </>
                ) : mode === 'edit' ? 'Save Changes' : 'Create User'}
              </button>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.footerInfo}>
            <span className={styles.infoItem}>
              <span className={styles.infoIcon}>📅</span>
              Last Updated: {new Date().toLocaleDateString()}
            </span>
            {mode === 'edit' && !formData.approved && (
              <span className={styles.warningBadge}>
                ⚠️ User is PENDING APPROVAL - No dashboard access
              </span>
            )}
            {mode === 'edit' && formData.status !== 'active' && formData.approved && (
              <span className={styles.warningBadge}>
                ⚠️ User is {formData.status.toUpperCase()}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserModal;