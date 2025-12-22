import React from 'react';
import styles from '../../admincss/Sidebar.module.css';

const Sidebar = ({ 
  activeTab, 
  onTabChange, 
  sidebarOpen, 
  onToggleSidebar 
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', badge: null },
    { id: 'users', label: 'User Management', icon: '👥', badge: 12 },
    { id: 'trading', label: 'Trading Rules', icon: '⚙️', badge: null },
    { id: 'market', label: 'Market Data', icon: '📈', badge: 3 },
    { id: 'competitions', label: 'Competitions', icon: '🏆', badge: null },
    { id: 'monitoring', label: 'System Monitoring', icon: '🔍', badge: '!' },
    { id: 'reports', label: 'Reports', icon: '📋', badge: null },
    { id: 'settings', label: 'Settings', icon: '⚙️', badge: null },
  ];

  return (
    <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarCollapsed}`}>
      {/* Sidebar Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>📊</span>
          {sidebarOpen && (
            <span className={styles.logoText}>PaperTrade Admin</span>
          )}
        </div>
        <button 
          className={styles.sidebarToggle}
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className={styles.sidebarNav}>
        {navigationItems.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => onTabChange(item.id)}
            title={item.label}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {sidebarOpen && (
              <>
                <span className={styles.navLabel}>{item.label}</span>
                {item.badge && (
                  <span className={styles.navBadge}>{item.badge}</span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className={styles.sidebarFooter}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>A</div>
          {sidebarOpen && (
            <div className={styles.userDetails}>
              <span className={styles.userName}>Admin User</span>
              <span className={styles.userRole}>Super Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;