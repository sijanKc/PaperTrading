import React, { useState, useEffect } from 'react';
import { 
  Navbar, 
  Nav, 
  Container, 
  Dropdown, 
  Badge, 
  Button, 
  Form,
  InputGroup,
  Offcanvas
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sample data for Sanchaya
  const userData = {
    name: 'Nabin Investor',
    email: 'nabin@sanchaya.com',
    virtualBalance: 1250000.75,
    dailyPL: +2450.50
  };

  const notifications = [
    { id: 1, message: 'NLIC reached your target price', time: '5 min ago', read: false },
    { id: 2, message: 'Portfolio value increased by 2.5%', time: '1 hour ago', read: false },
    { id: 3, message: 'NEPSE gained 25 points today', time: '2 hours ago', read: true },
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // REAL-TIME sidebar state detection
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
        setSidebarCollapsed(isCollapsed);
      }
    };

    // Immediate check
    checkSidebarState();
    
    // Faster interval for real-time detection
    const interval = setInterval(checkSidebarState, 50);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-bs-theme', savedTheme);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching NEPSE stocks:', searchQuery);
  };

  return (
    <>
      <Navbar className={`${styles.header} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen} ${theme === 'light' ? styles.lightTheme : ''}`} expand="lg" fixed="top">
        <Container fluid className={styles.headerContainer}>
          {/* Left Section - Brand & Search */}
          <div className={`d-flex align-items-center ${styles.headerLeft}`}>
            <Navbar.Brand href="#home" className={styles.headerBrand}>
              <span className={styles.brandIcon}>💰</span>
              <span className={styles.brandText}>Sanchaya</span>
            </Navbar.Brand>

            {/* Search Bar - Visible on desktop */}
            <Form className="d-none d-lg-block ms-4" onSubmit={handleSearch}>
              <InputGroup className={styles.headerSearch}>
                <InputGroup.Text className={styles.searchIcon}>🔍</InputGroup.Text>
                <Form.Control
                  type="search"
                  placeholder="Search NEPSE stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </InputGroup>
            </Form>
          </div>

          {/* Right Section - Actions */}
          <div className={`d-flex align-items-center ${styles.headerRight}`}>
            {/* Quick Stats - Visible on desktop */}
            <div className={`d-none d-md-flex align-items-center ${styles.quickStats}`}>
              <div className={styles.statItem}>
                <small className="text-muted">Virtual Balance</small>
                <div className={styles.statValue}>रु {userData.virtualBalance.toLocaleString('en-NP')}</div>
              </div>
              <div className={styles.statItem}>
                <small className="text-muted">Today's P/L</small>
                <div className={`${styles.statValue} ${userData.dailyPL >= 0 ? 'text-success' : 'text-danger'}`}>
                  {userData.dailyPL >= 0 ? '+' : ''}रु {userData.dailyPL}
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="outline-light"
              className={styles.headerBtn}
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </Button>

            {/* Notifications */}
            <Dropdown align="end" className={styles.notificationDropdown}>
              <Dropdown.Toggle variant="outline-light" className={`${styles.headerBtn} ${styles.notificationBtn}`}>
                <span className={styles.notificationIcon}>🔔</span>
                {unreadNotifications > 0 && (
                  <Badge bg="danger" className={styles.notificationBadge}>
                    {unreadNotifications}
                  </Badge>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu className={styles.notificationMenu}>
                <div className={styles.notificationHeader}>
                  <h6>Notifications</h6>
                  <Badge bg="primary">{unreadNotifications} new</Badge>
                </div>
                <div className={styles.notificationList}>
                  {notifications.map(notification => (
                    <Dropdown.Item 
                      key={notification.id} 
                      className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                    >
                      <div className={styles.notificationContent}>
                        <p className={styles.notificationMessage}>{notification.message}</p>
                        <small className={styles.notificationTime}>{notification.time}</small>
                      </div>
                    </Dropdown.Item>
                  ))}
                </div>
                <Dropdown.Divider />
                <Dropdown.Item className="text-center text-primary">
                  View All Notifications
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* User Profile Dropdown */}
            <Dropdown align="end" className={styles.userDropdown}>
              <Dropdown.Toggle variant="outline-light" className={styles.userDropdownBtn}>
                <div className={styles.userAvatarSm}>👤</div>
                <span className={`${styles.userNameText} d-none d-md-inline`}>{userData.name}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className={styles.userDropdownMenu}>
                <Dropdown.Header>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>👤</div>
                    <div className={styles.userDetails}>
                      <div className={styles.userNameFull}>{userData.name}</div>
                      <div className={styles.userEmail}>{userData.email}</div>
                    </div>
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item as="button" onClick={() => navigate('/dashboard/profile')}>
                  👤 My Profile
                </Dropdown.Item>
                {/* <Dropdown.Item as="button" onClick={() => navigate('/dashboard/settings')}>
                  ⚙️ Settings
                </Dropdown.Item>
                <Dropdown.Item as="button" onClick={() => navigate('/dashboard/help')}>
                  ❓ Help & Support
                </Dropdown.Item> */}
                <Dropdown.Divider />
                <Dropdown.Item as="button" className="text-danger" onClick={handleLogout}>
                  🚪 Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline-light"
              className={`d-lg-none ${styles.headerBtn}`}
              onClick={() => setShowNotifications(true)}
            >
              ☰
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas 
        show={showNotifications} 
        onHide={() => setShowNotifications(false)}
        placement="end"
        className={`${styles.mobileOffcanvas} ${theme === 'light' ? styles.lightTheme : ''}`}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Sanchaya</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={styles.mobileStats}>
            <h6>Quick Stats</h6>
            <div className={styles.balance}>रु {userData.virtualBalance.toLocaleString('en-NP')}</div>
            <div className={`${styles.pl} ${userData.dailyPL >= 0 ? styles.positive : styles.negative}`}>
              Today: {userData.dailyPL >= 0 ? '+' : ''}रु {userData.dailyPL}
            </div>
          </div>
          
          <Nav className={`flex-column ${styles.mobileNav}`}>
            <Nav.Link onClick={() => navigate('/dashboard/profile')}>👤 Profile</Nav.Link>
            <Nav.Link onClick={() => navigate('/dashboard/settings')}>⚙️ Settings</Nav.Link>
            <Nav.Link onClick={() => navigate('/dashboard/help')}>❓ Help</Nav.Link>
            <Nav.Link className="text-danger" onClick={handleLogout}>🚪 Logout</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;