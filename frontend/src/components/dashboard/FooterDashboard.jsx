import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Badge,
  Button,
  ProgressBar,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import styles from '../css/FooterDashboard.module.css';

const FooterDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [systemStatus, setSystemStatus] = useState('operational');
  const [serverLoad, setServerLoad] = useState(0);
  const [activeTraders, setActiveTraders] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [theme, setTheme] = useState('dark');

  // Sidebar state detection
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
        setSidebarCollapsed(isCollapsed);
      }
    };

    checkSidebarState();
    const interval = setInterval(checkSidebarState, 50);
    return () => clearInterval(interval);
  }, []);

  // Theme detection
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setServerLoad(Math.floor(Math.random() * 30) + 10);
      setActiveTraders(Math.floor(Math.random() * 500) + 1500);
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(updateInterval);
  }, []);

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case 'operational': return 'success';
      case 'degraded': return 'warning';
      case 'outage': return 'danger';
      default: return 'secondary';
    }
  };

  const getSystemStatusIcon = () => {
    switch (systemStatus) {
      case 'operational': return '🟢';
      case 'degraded': return '🟡';
      case 'outage': return '🔴';
      default: return '⚪';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const QuickStats = () => (
    <div className={styles.quickStats}>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Server Load</span>
        <div className={styles.statContent}>
          <ProgressBar 
            now={serverLoad} 
            variant={serverLoad > 80 ? "danger" : serverLoad > 60 ? "warning" : "success"}
            className={styles.loadBar}
          />
          <span className={styles.statValue}>{serverLoad}%</span>
        </div>
      </div>
      
      <div className={styles.statItem}>
        <span className={styles.statLabel}>Active Traders</span>
        <div className={styles.statContent}>
          <span className={styles.statIcon}>👥</span>
          <span className={styles.statValue}>{activeTraders.toLocaleString()}</span>
        </div>
      </div>
      
      <div className={styles.statItem}>
        <span className={styles.statLabel}>System Status</span>
        <div className={styles.statContent}>
          <span className={styles.statusIcon}>{getSystemStatusIcon()}</span>
          <Badge bg={getSystemStatusColor()} className={styles.statusBadge}>
            {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
          </Badge>
        </div>
      </div>
    </div>
  );

  const MarketHours = () => (
    <div className={styles.marketHours}>
      <h6>🏛️ NEPSE Trading Hours</h6>
      <div className={styles.hoursGrid}>
        <div className={styles.hoursItem}>
          <span className={styles.days}>Sun - Thu</span>
          <span className={styles.time}>11:00 AM - 3:00 PM</span>
        </div>
        <div className={styles.hoursItem}>
          <span className={styles.days}>Friday</span>
          <span className={styles.time}>11:00 AM - 2:00 PM</span>
        </div>
        <div className={`${styles.hoursItem} ${styles.holidayItem}`}>
          <span className={styles.days}>Saturday</span>
          <span className={styles.time}>Market Closed</span>
        </div>
      </div>
      <div className={styles.marketStatus}>
        <Badge bg="outline-success" className={styles.marketStatusBadge}>
          ● Market Open
        </Badge>
        <small className={styles.nextHoliday}>Next holiday: Dashain (Oct 15-19)</small>
      </div>
    </div>
  );

  const QuickLinks = () => (
    <div className={styles.quickLinks}>
      <h6>🔗 Quick Links</h6>
      <div className={styles.linksGrid}>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Official NEPSE website</Tooltip>}
        >
          <a href="https://www.nepalstock.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
            🌐 NEPSE Official
          </a>
        </OverlayTrigger>
        
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Nepal Rastra Bank</Tooltip>}
        >
          <a href="https://www.nrb.org.np" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
            🏦 NRB
          </a>
        </OverlayTrigger>
        
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Securities Board of Nepal</Tooltip>}
        >
          <a href="https://www.sebon.gov.np" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
            ⚖️ SEBON
          </a>
        </OverlayTrigger>
        
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>CDS and Clearing Limited</Tooltip>}
        >
          <a href="https://www.cdsc.com.np" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
            📊 CDSC
          </a>
        </OverlayTrigger>
        
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>View our privacy policy</Tooltip>}
        >
          <a href="#privacy" className={styles.footerLink}>
            🔒 Privacy
          </a>
        </OverlayTrigger>
        
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Read terms and conditions</Tooltip>}
        >
          <a href="#terms" className={styles.footerLink}>
            📄 Terms
          </a>
        </OverlayTrigger>
        
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Get help and support</Tooltip>}
        >
          <a href="#support" className={styles.footerLink}>
            ❓ Support
          </a>
        </OverlayTrigger>
        
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Learn about paper trading</Tooltip>}
        >
          <a href="#about" className={styles.footerLink}>
            ℹ️ About
          </a>
        </OverlayTrigger>
      </div>
    </div>
  );

  const SystemInfo = () => (
    <div className={styles.systemInfo}>
      <h6>⚙️ System Information</h6>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Platform Version</span>
          <span className={styles.infoValue}>v2.1.4</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Data Latency</span>
          <span className={styles.infoValue}>
            <Badge bg="success">~2s</Badge>
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Last Update</span>
          <span className={styles.infoValue}>{formatTimeAgo(lastUpdate)}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Session ID</span>
          <span className={styles.infoValue}>
            <Badge bg="outline-secondary">SAN-{Date.now().toString().slice(-6)}</Badge>
          </span>
        </div>
      </div>
    </div>
  );

  const EducationalResources = () => (
    <div className={styles.educationalResources}>
      <h6>📚 Learning Center</h6>
      <div className={styles.resourcesGrid}>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Learn stock market basics</Tooltip>}
        >
          <a href="#basics" className={styles.resourceLink}>
            📖 Trading Basics
          </a>
        </OverlayTrigger>
        
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>NEPSE trading guide</Tooltip>}
        >
          <a href="#guide" className={styles.resourceLink}>
            🎯 NEPSE Guide
          </a>
        </OverlayTrigger>
        
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Technical analysis tutorials</Tooltip>}
        >
          <a href="#analysis" className={styles.resourceLink}>
            📊 Technical Analysis
          </a>
        </OverlayTrigger>
        
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Risk management strategies</Tooltip>}
        >
          <a href="#risk" className={styles.resourceLink}>
            🛡️ Risk Management
          </a>
        </OverlayTrigger>
      </div>
    </div>
  );

  return (
    <div className={`${styles.footerDashboardWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <Card className={styles.footerDashboardCard}>
        <Card.Body className={styles.footerBody}>
          <Row className="g-4">
            {/* Quick Stats Column */}
            <Col xl={3} lg={6} md={6} sm={12}>
              <div className={styles.footerSection}>
                <div className={styles.sectionHeader}>
                  <h6 className={styles.sectionTitle}>📈 Live Stats</h6>
                  <Badge bg="outline-primary" className={styles.updateBadge}>
                    Live
                  </Badge>
                </div>
                <QuickStats />
              </div>
            </Col>

            {/* Market Hours Column */}
            <Col xl={3} lg={6} md={6} sm={12}>
              <div className={styles.footerSection}>
                <MarketHours />
              </div>
            </Col>

            {/* Quick Links Column */}
            <Col xl={2} lg={6} md={6} sm={12}>
              <div className={styles.footerSection}>
                <QuickLinks />
              </div>
            </Col>

            {/* System Info Column */}
            <Col xl={2} lg={6} md={6} sm={12}>
              <div className={styles.footerSection}>
                <SystemInfo />
              </div>
            </Col>

            {/* Educational Resources Column */}
            <Col xl={2} lg={6} md={6} sm={12}>
              <div className={styles.footerSection}>
                <EducationalResources />
              </div>
            </Col>
          </Row>

          {/* Bottom Bar */}
          <div className={styles.footerBottom}>
            <div className={styles.bottomContent}>
              <div className={styles.copyright}>
                <span className={styles.copyrightText}>
                  © 2024 <strong>Sanchaya</strong> - NEPSE Paper Trading Platform
                </span>
                <span className={styles.version}>v2.1.4</span>
              </div>
              
              <div className={styles.bottomLinks}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>This is a paper trading simulation</Tooltip>}
                >
                  <Badge bg="warning" text="dark" className={styles.demoBadge}>
                    🧪 Paper Trading Demo
                  </Badge>
                </OverlayTrigger>
                
                <span className={styles.disclaimer}>
                  Virtual money • Educational purposes only
                </span>
                
                <div className={styles.socialLinks}>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Follow us for updates</Tooltip>}
                  >
                    <Button variant="outline-secondary" size="sm" className={styles.socialBtn}>
                      📘
                    </Button>
                  </OverlayTrigger>
                  
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Join our community</Tooltip>}
                  >
                    <Button variant="outline-secondary" size="sm" className={styles.socialBtn}>
                      💬
                    </Button>
                  </OverlayTrigger>
                  
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Contact support</Tooltip>}
                  >
                    <Button variant="outline-secondary" size="sm" className={styles.socialBtn}>
                      📧
                    </Button>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FooterDashboard;