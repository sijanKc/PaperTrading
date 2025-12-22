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
  Offcanvas,
  Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { portfolioService } from '../../services/portfolioService'; // 🆕 IMPORT API SERVICE
import styles from '../css/Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // 🆕 FETCH USER DATA USING API SERVICE
  const fetchUserData = async () => {
    try {
      const userFromStorage = localStorage.getItem('user');
      
      if (userFromStorage) {
        const user = JSON.parse(userFromStorage);
        setUserData(user);
      }

      // 🆕 USING PORTFOLIO SERVICE INSTEAD OF DIRECT FETCH
      const response = await portfolioService.getOverview();
      setPortfolioData(response.data.data);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback data
      setPortfolioData({
        virtualBalance: 100000,
        dailyPL: 0,
        totalInvestment: 0,
        currentPortfolioValue: 0,
        totalPL: 0,
        availableCash: 100000
      });
      
      if (!userData) {
        setUserData({
          name: 'User',
          email: 'user@example.com',
          username: 'user'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 🆕 SIMPLIFIED NOTIFICATIONS (No backend endpoint yet)
  const fetchNotifications = () => {
    // Since /api/notifications doesn't exist in your backend yet
    const defaultNotifications = [
      { id: 1, message: 'Welcome to Sanchaya!', time: 'Just now', read: false },
      { id: 2, message: `Your virtual balance: रु ${portfolioData?.virtualBalance?.toLocaleString('en-NP') || '1,00,000'}`, time: 'Just now', read: false },
    ];
    setNotifications(defaultNotifications);
  };

  // REAL-TIME sidebar state detection with dynamic width calculation
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('.sidebar');
      
      if (sidebar) {
        const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
        setSidebarCollapsed(isCollapsed);
        
        // Calculate dynamic widths based on sidebar state
        if (isCollapsed) {
          document.documentElement.style.setProperty('--sidebar-width', '70px');
          document.documentElement.style.setProperty('--header-width', 'calc(100vw - 70px)');
          document.documentElement.style.setProperty('--header-left', '70px');
        } else {
          document.documentElement.style.setProperty('--sidebar-width', '280px');
          document.documentElement.style.setProperty('--header-width', 'calc(100vw - 280px)');
          document.documentElement.style.setProperty('--header-left', '280px');
        }
      }
    };

    checkSidebarState();
    const interval = setInterval(checkSidebarState, 100);
    return () => clearInterval(interval);
  }, []);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      
      if (mobile) {
        document.documentElement.style.setProperty('--header-width', '100vw');
        document.documentElement.style.setProperty('--header-left', '0px');
      } else {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
          const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
          if (isCollapsed) {
            document.documentElement.style.setProperty('--header-width', 'calc(100vw - 70px)');
            document.documentElement.style.setProperty('--header-left', '70px');
          } else {
            document.documentElement.style.setProperty('--header-width', 'calc(100vw - 280px)');
            document.documentElement.style.setProperty('--header-left', '280px');
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🆕 IMPROVED DATA FETCHING
  useEffect(() => {
    fetchUserData();
    fetchNotifications();

    // Set up real-time updates
    const portfolioInterval = setInterval(fetchUserData, 30000); // Update every 30 seconds

    return () => {
      clearInterval(portfolioInterval);
    };
  }, []);

  // 🆕 UPDATE NOTIFICATIONS WHEN PORTFOLIO DATA CHANGES
  useEffect(() => {
    if (portfolioData) {
      const updatedNotifications = [
        { id: 1, message: 'Welcome to Sanchaya!', time: 'Just now', read: false },
        { id: 2, message: `Your virtual balance: रु ${portfolioData.virtualBalance?.toLocaleString('en-NP')}`, time: 'Just now', read: false },
        { id: 3, message: `Portfolio value: रु ${portfolioData.currentValue?.toLocaleString('en-NP')}`, time: '2 mins ago', read: false },
      ];
      setNotifications(updatedNotifications);
    }
  }, [portfolioData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Apply theme to entire document
    document.body.setAttribute('data-bs-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update CSS variables for theme
    if (newTheme === 'light') {
      document.documentElement.style.setProperty('--header-bg', 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)');
      document.documentElement.style.setProperty('--header-border', '#d1d5db');
      document.documentElement.style.setProperty('--text-color', 'white');
    } else {
      document.documentElement.style.setProperty('--header-bg', 'linear-gradient(135deg, #1e293b 0%, #334155 100%)');
      document.documentElement.style.setProperty('--header-border', '#475569');
      document.documentElement.style.setProperty('--text-color', 'white');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  // Initialize theme and user data
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-bs-theme', savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Initialize user data from localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      setUserData(JSON.parse(userFromStorage));
    }

    // Apply initial theme colors
    if (savedTheme === 'light') {
      document.documentElement.style.setProperty('--header-bg', 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)');
      document.documentElement.style.setProperty('--header-border', '#d1d5db');
    } else {
      document.documentElement.style.setProperty('--header-bg', 'linear-gradient(135deg, #1e293b 0%, #334155 100%)');
      document.documentElement.style.setProperty('--header-border', '#475569');
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 🆕 SIMPLIFIED NOTIFICATION MARKING
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? {...n, read: true} : n)
    );
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Display name based on available data
  const displayName = userData?.name || userData?.username || 'User';
  const displayEmail = userData?.email || 'user@example.com';

  if (loading) {
    return (
      <Navbar className={`${styles.header} ${styles.loading}`} fixed="top">
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center w-100 py-2">
            <Spinner animation="border" variant="primary" size="sm" className="me-2" />
            <span className="text-muted">Loading...</span>
          </div>
        </Container>
      </Navbar>
    );
  }

  return (
    <>
      <Navbar 
        className={`${styles.header} ${theme === 'light' ? styles.lightTheme : ''}`}
        expand="lg" 
        fixed="top"
        style={{
          width: 'var(--header-width)',
          left: 'var(--header-left)',
          transition: 'all 0.3s ease'
        }}
      >
        <Container fluid className={styles.headerContainer}>
          {/* Left Section - Brand & Search */}
          <div className={`d-flex align-items-center ${styles.headerLeft}`}>
            <Navbar.Brand href="/dashboard" className={styles.headerBrand}>
              <span className={styles.brandIcon}>💰</span>
              <span className={styles.brandText}>Sanchaya</span>
            </Navbar.Brand>

            {/* Search Bar - Visible on desktop */}
            <Form className="d-none d-lg-block ms-3 ms-xl-4" onSubmit={handleSearch}>
              <InputGroup className={styles.headerSearch}>
                <InputGroup.Text className={styles.searchIcon}>🔍</InputGroup.Text>
                <Form.Control
                  type="search"
                  placeholder="Search NEPSE stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  size={isMobile ? "sm" : "md"}
                />
              </InputGroup>
            </Form>
          </div>

          {/* Right Section - Actions */}
          <div className={`d-flex align-items-center ${styles.headerRight}`}>
            {/* Quick Stats - Visible on desktop */}
            <div className={`d-none d-md-flex align-items-center ${styles.quickStats}`}>
              <div className={styles.statItem}>
                <small className={styles.statLabel}>Virtual Balance</small>
                <div className={styles.statValue}>
                  रु {portfolioData?.virtualBalance?.toLocaleString('en-NP') || '1,00,000'}
                </div>
              </div>
              <div className={styles.statItem}>
                <small className={styles.statLabel}>Today's P/L</small>
                <div className={`${styles.statValue} ${portfolioData?.dailyPL >= 0 ? styles.positive : styles.negative}`}>
                  {portfolioData?.dailyPL >= 0 ? '+' : ''}रु {Math.abs(portfolioData?.dailyPL || 0).toLocaleString('en-NP')}
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <Button
              variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
              className={`${styles.headerBtn} ${styles.themeBtn}`}
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              size={isMobile ? "sm" : "md"}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </Button>

            {/* Notifications */}
            <Dropdown align="end" className={styles.notificationDropdown}>
              <Dropdown.Toggle 
                variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} 
                className={`${styles.headerBtn} ${styles.notificationBtn}`}
                size={isMobile ? "sm" : "md"}
              >
                <span className={styles.notificationIcon}>🔔</span>
                {unreadNotifications > 0 && (
                  <Badge bg="danger" className={styles.notificationBadge}>
                    {unreadNotifications}
                  </Badge>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu className={`${styles.notificationMenu} ${theme === 'light' ? styles.lightTheme : ''}`}>
                <div className={styles.notificationHeader}>
                  <h6>Notifications</h6>
                  {unreadNotifications > 0 && (
                    <Badge bg="primary">{unreadNotifications} new</Badge>
                  )}
                </div>
                <div className={styles.notificationList}>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <Dropdown.Item 
                        key={notification.id} 
                        className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className={styles.notificationContent}>
                          <p className={styles.notificationMessage}>{notification.message}</p>
                          <small className={styles.notificationTime}>{notification.time}</small>
                        </div>
                      </Dropdown.Item>
                    ))
                  ) : (
                    <div className={styles.noNotifications}>
                      No new notifications
                    </div>
                  )}
                </div>
                <Dropdown.Divider />
                <Dropdown.Item 
                  className="text-center text-primary"
                  onClick={() => navigate('/dashboard/notifications')}
                >
                  View All Notifications
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* User Profile Dropdown */}
            <Dropdown align="end" className={styles.userDropdown}>
              <Dropdown.Toggle 
                variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} 
                className={styles.userDropdownBtn}
                size={isMobile ? "sm" : "md"}
              >
                <div className={styles.userAvatarSm}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className={`${styles.userNameText} d-none d-md-inline`}>
                  {displayName}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className={`${styles.userDropdownMenu} ${theme === 'light' ? styles.lightTheme : ''}`}>
                <Dropdown.Header>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.userDetails}>
                      <div className={styles.userNameFull}>{displayName}</div>
                      <div className={styles.userEmail}>{displayEmail}</div>
                    </div>
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item as="button" onClick={() => navigate('/dashboard/profile')}>
                  👤 My Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as="button" className="text-danger" onClick={handleLogout}>
                  🚪 Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Mobile Menu Toggle */}
            <Button
              variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
              className={`d-lg-none ${styles.headerBtn} ${styles.mobileMenuBtn}`}
              onClick={() => setShowNotifications(true)}
              size="sm"
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
        <Offcanvas.Header closeButton className={theme === 'light' ? styles.lightTheme : ''}>
          <Offcanvas.Title>Sanchaya</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Mobile Search */}
          <Form className="mb-3" onSubmit={handleSearch}>
            <InputGroup>
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search NEPSE stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Form>

          <div className={styles.mobileStats}>
            <h6>Portfolio Overview</h6>
            <div className={styles.balance}>
              रु {portfolioData?.virtualBalance?.toLocaleString('en-NP') || '1,00,000'}
            </div>
            <div className={`${styles.pl} ${portfolioData?.dailyPL >= 0 ? styles.positive : styles.negative}`}>
              Today: {portfolioData?.dailyPL >= 0 ? '+' : ''}रु {Math.abs(portfolioData?.dailyPL || 0).toLocaleString('en-NP')}
            </div>
          </div>
          
          <Nav className={`flex-column ${styles.mobileNav}`}>
            <Nav.Link onClick={() => { navigate('/dashboard/profile'); setShowNotifications(false); }}>
              👤 Profile
            </Nav.Link>
            <Nav.Link onClick={() => { navigate('/dashboard/notifications'); setShowNotifications(false); }}>
              🔔 Notifications {unreadNotifications > 0 && `(${unreadNotifications})`}
            </Nav.Link>
            <Nav.Link className="text-danger" onClick={handleLogout}>
              🚪 Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Add spacer for fixed navbar */}
      <div className={styles.navbarSpacer} />
    </>
  );
};

export default Header;