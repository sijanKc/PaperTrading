import React, { useState } from 'react';
import { Nav, Navbar, Button, Collapse, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import styles from '../css/Sidebar.module.css';

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard', badge: null },
    { path: '/portfolio', icon: '💼', label: 'Portfolio', badge: null },
    { path: '/trade', icon: '💰', label: 'Trade', badge: 'NEW' },
    { path: '/transactions', icon: '📝', label: 'Transactions', badge: null },
    { path: '/analytics', icon: '📈', label: 'Analytics', badge: 'PRO' },
    { path: '/leaderboard', icon: '🏆', label: 'Leaderboard', badge: null },
    { path: '/journal', icon: '📔', label: 'Trading Journal', badge: null },
    { path: '/strategytester', icon: '🧪', label: 'Strategy Tester', badge: 'BETA' },
    { path: '/settings', icon: '⚙️', label: 'Settings', badge: null },
    { path: '/help', icon: '❓', label: 'Help & Support', badge: null },
    { path: '/feedback', icon: '💬', label: 'Feedback', badge: null },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`${styles.sidebar} ${open ? styles.sidebarOpen : styles.sidebarCollapsed}`}>
      {/* Sidebar Header */}
      <div className={styles.sidebarHeader}>
        <div className="d-flex align-items-center justify-content-between">
          {open && (
            <div className={styles.sidebarBrand}>
              <h4 className="mb-0">📈 SANCHAYA</h4>
              <small className={styles.brandSubtitle}>Practice Mode</small>
            </div>
          )}
          <Button
            variant="link"
            className={styles.sidebarToggle}
            onClick={() => setOpen(!open)}
          >
            {open ? '◀' : '▶'}
          </Button>
        </div>
      </div>

      {/* Practice Mode Banner */}
      {open && (
        <div className={styles.practiceBanner}>
          <div className="d-flex align-items-center">
            <span className={styles.practiceIcon}>🎮</span>
            <div className="ms-2">
              <small className={styles.practiceTitle}>PAPER TRADING</small>
              <br />
              <small className={styles.practiceSubtitle}>Virtual Nrs.1,00,000</small>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu - SCROLLABLE */}
      <div className={styles.sidebarContent}>
        <Nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              className={`${styles.sidebarNavLink} ${isActive(item.path) ? styles.active : ''}`}
            >
              <div className={styles.navLinkContent}>
                <span className={styles.navIcon}>{item.icon}</span>
                {open && (
                  <>
                    <span className={styles.navLabel}>{item.label}</span>
                    {item.badge && (
                      <Badge bg="primary" className={styles.navBadge}>
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </div>
              {isActive(item.path) && <div className={styles.activeIndicator}></div>}
            </Nav.Link>
          ))}
        </Nav>
      </div>

      {/* Quick Actions */}
      {open && (
        <div className={styles.sidebarActions}>
          <div className={styles.sidebarSectionTitle}>Quick Actions</div>
          <Button 
            variant="outline-warning" 
            size="sm" 
            className={`w-100 mb-2 ${styles.resetBtn}`}
          >
            🔄 Reset Portfolio
          </Button>
          <Button 
            variant="outline-info" 
            size="sm" 
            className="w-100"
          >
            📊 View Stats
          </Button>
        </div>
      )}

      {/* User Profile Section */}
      <div className={styles.sidebarFooter}>
        <Nav.Link as={Link} to="/profile" className={`p-0 text-decoration-none ${styles.profileLink}`}>
            <div className={`${styles.userProfile} ${isActive('/profile') ? styles.activeProfile : ''}`}>
            <div className={styles.userAvatar}>👤</div>
            {open && (
                <div className={styles.userInfo}>
                <div className={styles.userName}>Trader User</div>
                <div className={styles.userStatus}>
                    <span className={`${styles.statusDot} ${styles.online}`}></span>
                    Paper Trading
                </div>
                </div>
            )}
            </div>
        </Nav.Link>
      </div>
    </div>
  );
};

export default Sidebar;