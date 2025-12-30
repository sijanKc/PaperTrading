import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../admincss/Header.module.css';

const Header = ({ 
  sidebarOpen, 
  onToggleSidebar, 
  activeTab,
  onTabChange
}) => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, pending: 0, online: 0 }
  });
  const [notifications, setNotifications] = useState([]);

  // Fetch stats and user info
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setAdminData(user);

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
          
          // Generate notification for pending approvals
          const newNotifications = [];
          if (data.stats.users.pending > 0) {
            newNotifications.push({
              id: 'pending',
              type: 'warning',
              message: `${data.stats.users.pending} users waiting for approval`,
              time: 'Action required'
            });
          }
          
          // Add some default system info
          newNotifications.push({ id: 1, type: 'info', message: 'System is healthy', time: 'Just now' });
          setNotifications(newNotifications);
        }
      } catch (error) {
        console.error('Error fetching admin header stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const navigationTitles = {
    dashboard: 'Dashboard Overview',
    users: 'User Management',
    trading: 'Trading Rules Configuration',
    market: 'Market Data Management',
    competitions: 'Competition Management',
    monitoring: 'System Monitoring',
    reports: 'Reports & Analytics',
    settings: 'System Settings',
    profile: 'My Profile'
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerLeft}>
        <button 
          className={styles.mobileMenuToggle}
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          ☰
        </button>
        
        <div className={styles.pageInfo}>
          <h1 className={styles.pageTitle}>
            {navigationTitles[activeTab] || 'Admin Dashboard'}
          </h1>
          <div className={styles.breadcrumb}>
            <span>Admin</span>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbActive}>
              {navigationTitles[activeTab]?.split(' ')[0] || 'Dashboard'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.headerRight}>
        {/* Date & Time */}
        <div className={styles.dateTime}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <span className={styles.date}>{formatDate(currentTime)}</span>
        </div>

        {/* Quick Stats */}
        <div className={styles.quickStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Online</span>
            <span className={`${styles.statValue} ${styles.online}`}>{stats.users.online}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Users</span>
            <span className={styles.statValue}>{stats.users.total > 1000 ? `${(stats.users.total/1000).toFixed(1)}K` : stats.users.total}</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className={styles.headerActions}>
          {/* Search Button */}
          <button className={styles.headerBtn} title="Search">
            <span className={styles.btnIcon}>🔍</span>
          </button>

          {/* Notifications */}
          <div className={styles.notificationMenu}>
            <button 
              className={styles.headerBtn}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              title="Notifications"
            >
              <span className={styles.btnIcon}>🔔</span>
              {notifications.length > 0 && (
                <span className={styles.btnBadge}>{notifications.length}</span>
              )}
            </button>
            
            {notificationsOpen && (
              <div className={styles.notificationDropdown}>
                <div className={styles.dropdownHeader}>
                  <h3>Notifications</h3>
                  <span className={styles.notificationCount}>{notifications.length} new</span>
                </div>
                
                <div className={styles.notificationList}>
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`${styles.notificationItem} ${styles[notification.type]}`}
                    >
                      <div className={styles.notificationIcon}>
                        {notification.type === 'warning' && '⚠️'}
                        {notification.type === 'info' && 'ℹ️'}
                        {notification.type === 'success' && '✅'}
                      </div>
                      <div className={styles.notificationContent}>
                        <p className={styles.notificationMessage}>
                          {notification.message}
                        </p>
                        <span className={styles.notificationTime}>
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={styles.dropdownFooter}>
                  <button className={styles.viewAllBtn}>
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <button className={styles.headerBtn} title="Messages">
            <span className={styles.btnIcon}>💬</span>
            <span className={styles.btnBadge}>5</span>
          </button>

          {/* User Menu */}
          <div className={styles.userMenu}>
            <button 
              className={styles.userMenuBtn}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              title="User menu"
            >
              <div className={styles.headerAvatar}>
                <span>{adminData?.fullName?.charAt(0) || 'A'}</span>
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{adminData?.fullName || 'Admin User'}</span>
                <span className={styles.userRole}>{adminData?.role === 'admin' ? 'Super Admin' : 'Admin'}</span>
              </div>
              <span className={`${styles.dropdownArrow} ${userMenuOpen ? styles.rotated : ''}`}>
                ▼
              </span>
            </button>
            
            {userMenuOpen && (
              <div className={styles.userDropdown}>
                <div className={styles.userDropdownHeader}>
                  <div className={styles.dropdownAvatar}>{adminData?.fullName?.charAt(0) || 'A'}</div>
                  <div>
                    <div className={styles.dropdownUserName}>{adminData?.fullName || 'Admin User'}</div>
                    <div className={styles.dropdownUserEmail}>{adminData?.contact?.email || 'admin@papertrade.com'}</div>
                  </div>
                </div>
                
                <div className={styles.dropdownDivider}></div>
                
                <button 
                  className={styles.dropdownItem}
                  onClick={() => {
                    onTabChange('profile');
                    setUserMenuOpen(false);
                  }}
                >
                  <span className={styles.itemIcon}>👤</span>
                  <span>My Profile</span>
                </button>
                
                <div className={styles.dropdownDivider}></div>
                
                <button 
                  className={`${styles.dropdownItem} ${styles.logout}`}
                  onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      navigate('/login');
                  }}
                >
                  <span className={styles.itemIcon}>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for dropdowns */}
      {(userMenuOpen || notificationsOpen) && (
        <div 
          className={styles.dropdownOverlay}
          onClick={() => {
            setUserMenuOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;