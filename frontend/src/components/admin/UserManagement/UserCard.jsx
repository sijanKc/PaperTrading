import React, { useState } from 'react';
import styles from '../../admincss/UserCard.module.css';

const UserCard = ({ 
  user, 
  onEdit, 
  onSuspend, 
  onBan, 
  onDelete,
  onViewTrades,
  onSendMessage,
  onApprove, // New prop for approve/reject
  onReject 
}) => {
  const [showActions, setShowActions] = useState(false);
  
  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return 'Rs. 0';
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount).replace('NPR', 'Rs.');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge - Updated to include 'pending'
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'yellow', icon: '⏳' }, // New for unapproved
      active: { label: 'Active', color: 'green', icon: '✅' },
      inactive: { label: 'Inactive', color: 'gray', icon: '⚪' },
      suspended: { label: 'Suspended', color: 'orange', icon: '⏸️' },
      banned: { label: 'Banned', color: 'red', icon: '⛔' },
      deleted: { label: 'Deleted', color: 'black', icon: '🗑️' },
      premium: { label: 'Premium', color: 'purple', icon: '⭐' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`${styles.statusBadge} ${styles[config.color]}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleConfig = {
      user: { label: 'User', color: 'blue', icon: '👤' },
      premium: { label: 'Premium', color: 'purple', icon: '⭐' },
      moderator: { label: 'Moderator', color: 'teal', icon: '🛡️' },
      admin: { label: 'Admin', color: 'red', icon: '👑' }
    };
    
    const config = roleConfig[role] || roleConfig.user;
    return (
      <span className={`${styles.roleBadge} ${styles[config.color]}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  // Calculate days since join
  const getDaysSinceJoin = (joinDate) => {
    const join = new Date(joinDate);
    const today = new Date();
    const diffTime = Math.abs(today - join);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle approve/reject click
  const handleApproveClick = () => {
    if (window.confirm('Approve this user? They will gain access to the dashboard.')) {
      onApprove(user.id);
    }
  };

  const handleRejectClick = () => {
    if (window.confirm('Reject this user? They will remain pending and cannot access the dashboard.')) {
      onReject(user.id);
    }
  };

  return (
    <div className={styles.userCard}>
      
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.userAvatar}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className={styles.avatarImage} />
          ) : (
            <span className={styles.avatarFallback}>
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        <div className={styles.userInfo}>
          <div className={styles.nameRow}>
            <h3 className={styles.userName}>{user.name}</h3>
            {getStatusBadge(user.status)}
            {getRoleBadge(user.role)}
          </div>
          
          <p className={styles.userEmail}>
            <span className={styles.infoIcon}>📧</span>
            {user.email}
          </p>
          
          {user.phone && (
            <p className={styles.userPhone}>
              <span className={styles.infoIcon}>📱</span>
              {user.phone}
            </p>
          )}
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.actionMenuToggle}
            onClick={() => setShowActions(!showActions)}
          >
            ⋮
          </button>
          
          {showActions && (
            <div className={styles.actionMenu}>
              <button 
                className={styles.actionMenuItem}
                onClick={() => {
                  onEdit(user);
                  setShowActions(false);
                }}
              >
                <span className={styles.menuIcon}>✏️</span>
                Edit Profile
              </button>
              
              <button 
                className={styles.actionMenuItem}
                onClick={() => {
                  onViewTrades(user.id);
                  setShowActions(false);
                }}
              >
                <span className={styles.menuIcon}>📊</span>
                View Trades
              </button>
              
              <button 
                className={styles.actionMenuItem}
                onClick={() => {
                  onSendMessage(user.id);
                  setShowActions(false);
                }}
              >
                <span className={styles.menuIcon}>💬</span>
                Send Message
              </button>
              
              {/* New Approve/Reject actions for pending users */}
              {user.status === 'pending' && (
                <>
                  <div className={styles.menuDivider}></div>
                  <button 
                    className={`${styles.actionMenuItem} ${styles.success}`}
                    onClick={() => {
                      handleApproveClick();
                      setShowActions(false);
                    }}
                  >
                    <span className={styles.menuIcon}>✅</span>
                    Approve User
                  </button>
                  
                  <button 
                    className={`${styles.actionMenuItem} ${styles.warning}`}
                    onClick={() => {
                      handleRejectClick();
                      setShowActions(false);
                    }}
                  >
                    <span className={styles.menuIcon}>❌</span>
                    Reject User
                  </button>
                </>
              )}
              
              <div className={styles.menuDivider}></div>
              
              <button 
                className={`${styles.actionMenuItem} ${styles.danger}`}
                onClick={() => {
                  onSuspend(user.id);
                  setShowActions(false);
                }}
                disabled={user.status === 'suspended'}
              >
                <span className={styles.menuIcon}>⏸️</span>
                Suspend User
              </button>
              
              <button 
                className={`${styles.actionMenuItem} ${styles.danger}`}
                onClick={() => {
                  onBan(user.id);
                  setShowActions(false);
                }}
                disabled={user.status === 'banned'}
              >
                <span className={styles.menuIcon}>⛔</span>
                Ban User
              </button>
              
              <button 
                className={`${styles.actionMenuItem} ${styles.danger}`}
                onClick={() => {
                  onDelete(user.id);
                  setShowActions(false);
                }}
                disabled={user.status === 'deleted'}
              >
                <span className={styles.menuIcon}>🗑️</span>
                Delete User
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className={styles.cardBody}>
        
        {/* Trading Statistics */}
        <div className={styles.statsSection}>
          <h4 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📊</span>
            Trading Statistics
          </h4>
          
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>
                <span className={styles.statIcon}>💰</span>
                Portfolio Value
              </div>
              <div className={styles.statValue}>
                {formatCurrency(user.portfolioValue)}
              </div>
              <div className={`${styles.statChange} ${user.portfolioChange >= 0 ? styles.positive : styles.negative}`}>
                {user.portfolioChange >= 0 ? '↗' : '↘'} {Math.abs(user.portfolioChange)}%
              </div>
            </div>
            
            <div className={styles.statItem}>
              <div className={styles.statLabel}>
                <span className={styles.statIcon}>📈</span>
                Total Trades
              </div>
              <div className={styles.statValue}>
                {user.totalTrades}
              </div>
              <div className={styles.statSubtext}>
                Last: {formatDate(user.lastTradeDate)}
              </div>
            </div>
            
            <div className={styles.statItem}>
              <div className={styles.statLabel}>
                <span className={styles.statIcon}>🎯</span>
                Success Rate
              </div>
              <div className={styles.statValue}>
                {user.successRate}%
              </div>
              <div className={styles.statSubtext}>
                Profitable trades
              </div>
            </div>
            
            <div className={styles.statItem}>
              <div className={styles.statLabel}>
                <span className={styles.statIcon}>🏆</span>
                Rank
              </div>
              <div className={styles.statValue}>
                #{user.rank}
              </div>
              <div className={styles.statSubtext}>
                Top {user.totalUsers > 0 ? Math.ceil((user.rank / user.totalUsers) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className={styles.infoSection}>
          <h4 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>👤</span>
            Account Information
          </h4>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>User ID:</span>
              <span className={styles.infoValue}>
                <code>{user.id}</code>
              </span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Joined:</span>
              <span className={styles.infoValue}>
                {formatDate(user.joinDate)} ({getDaysSinceJoin(user.joinDate)} days ago)
              </span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Last Login:</span>
              <span className={styles.infoValue}>
                {formatDate(user.lastLogin)} ({user.lastLoginIp})
              </span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email Verified:</span>
              <span className={styles.infoValue}>
                {user.emailVerified ? (
                  <span className={styles.verified}>✅ Yes</span>
                ) : (
                  <span className={styles.notVerified}>❌ No</span>
                )}
              </span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Trading Level:</span>
              <span className={styles.infoValue}>
                {user.tradingLevel} ({user.experiencePoints} XP)
              </span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Virtual Money:</span>
              <span className={styles.infoValue}>
                {formatCurrency(user.virtualMoney)} / {formatCurrency(user.tradingLimit)}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.activitySection}>
          <h4 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📝</span>
            Recent Activity
          </h4>
          
          <div className={styles.activityList}>
            {user.recentActivities && user.recentActivities.length > 0 ? (
              user.recentActivities.slice(0, 3).map((activity, index) => (
                <div key={index} className={styles.activityItem}>
                  <span className={styles.activityIcon}>
                    {activity.type === 'trade' && '💰'}
                    {activity.type === 'login' && '🔑'}
                    {activity.type === 'withdrawal' && '💸'}
                    {activity.type === 'deposit' && '💳'}
                  </span>
                  <span className={styles.activityText}>{activity.description}</span>
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>
              ))
            ) : (
              <p className={styles.noActivity}>No recent activity</p>
            )}
          </div>
        </div>

      </div>

      {/* Card Footer */}
      <div className={styles.cardFooter}>
        <div className={styles.footerActions}>
          <button 
            className={styles.footerBtn}
            onClick={() => onViewTrades(user.id)}
          >
            <span className={styles.btnIcon}>📊</span>
            View Trades
          </button>
          
          <button 
            className={styles.footerBtn}
            onClick={() => onSendMessage(user.id)}
          >
            <span className={styles.btnIcon}>💬</span>
            Message
          </button>
          
          <button 
            className={`${styles.footerBtn} ${styles.primary}`}
            onClick={() => onEdit(user)}
          >
            <span className={styles.btnIcon}>✏️</span>
            Edit Profile
          </button>
        </div>
        
        <div className={styles.footerStats}>
          <span className={styles.footerStat}>
            <span className={styles.statIconSmall}>👁️</span>
            {user.profileViews} views
          </span>
          
          <span className={styles.footerStat}>
            <span className={styles.statIconSmall}>💬</span>
            {user.messages} messages
          </span>
          
          <span className={styles.footerStat}>
            <span className={styles.statIconSmall}>⭐</span>
            {user.rating}/5.0
          </span>
        </div>
      </div>

    </div>
  );
};

// Default props for the component
UserCard.defaultProps = {
  user: {
    id: 'USR001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+977 9841234567',
    avatar: null,
    status: 'active',
    role: 'user',
    portfolioValue: 12456,
    portfolioChange: 15.2,
    totalTrades: 45,
    lastTradeDate: new Date().toISOString(),
    successRate: 78,
    rank: 15,
    totalUsers: 1000,
    joinDate: '2024-01-15',
    lastLogin: new Date().toISOString(),
    lastLoginIp: '192.168.1.100',
    emailVerified: true,
    tradingLevel: 'Intermediate',
    experiencePoints: 2450,
    virtualMoney: 10000,
    tradingLimit: 50000,
    recentActivities: [
      { type: 'trade', description: 'Bought 100 shares of NABIL', time: '2 hours ago' },
      { type: 'login', description: 'Logged in from new device', time: '1 day ago' },
      { type: 'trade', description: 'Sold 50 shares of NTC', time: '2 days ago' }
    ],
    profileViews: 245,
    messages: 12,
    rating: 4.5
  }
};

export default UserCard;