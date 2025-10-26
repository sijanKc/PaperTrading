import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Container } from 'react-bootstrap';
import styles from '../css/OverviewCards.module.css';

const OverviewCards = ({ stats }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Sidebar state detection - same as Header
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

  // Default stats if not provided
  const defaultStats = {
    virtualBalance: 1000000.00,
    totalInvestment: 750000.00,
    currentValue: 874500.00,
    profitLoss: 124500.00,
    profitLossPercent: 16.6,
    dailyPL: 2450.50,
    dailyPLPercent: 0.28,
    availableCash: 250000.00
  };

  const data = stats || defaultStats;

  const cards = [
    {
      title: 'Virtual Balance',
      value: `रु ${data.virtualBalance.toLocaleString('en-NP')}`,
      subtitle: 'Total Account Value',
      icon: '💰',
      color: 'primary',
      trend: 'stable'
    },
    {
      title: 'Total Investment',
      value: `रु ${data.totalInvestment.toLocaleString('en-NP')}`,
      subtitle: 'Amount Invested',
      icon: '📊',
      color: 'info',
      trend: 'neutral'
    },
    {
      title: 'Current Portfolio',
      value: `रु ${data.currentValue.toLocaleString('en-NP')}`,
      subtitle: 'Market Value',
      icon: '💼',
      color: 'success',
      trend: 'up'
    },
    {
      title: 'Total P/L',
      value: `रु ${Math.abs(data.profitLoss).toLocaleString('en-NP')}`,
      subtitle: `All Time ${data.profitLoss >= 0 ? 'Profit' : 'Loss'}`,
      percentage: `${data.profitLoss >= 0 ? '+' : ''}${data.profitLossPercent}%`,
      icon: data.profitLoss >= 0 ? '📈' : '📉',
      color: data.profitLoss >= 0 ? 'success' : 'danger',
      trend: data.profitLoss >= 0 ? 'up' : 'down'
    },
    {
      title: 'Today\'s P/L',
      value: `रु ${Math.abs(data.dailyPL).toLocaleString('en-NP')}`,
      subtitle: 'Daily Performance',
      percentage: `${data.dailyPL >= 0 ? '+' : ''}${data.dailyPLPercent}%`,
      icon: data.dailyPL >= 0 ? '🔼' : '🔽',
      color: data.dailyPL >= 0 ? 'success' : 'danger',
      trend: data.dailyPL >= 0 ? 'up' : 'down'
    },
    {
      title: 'Available Cash',
      value: `रु ${data.availableCash.toLocaleString('en-NP')}`,
      subtitle: 'Ready to Invest',
      icon: '💵',
      color: 'warning',
      trend: 'neutral'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getCardClass = (color, trend) => {
    const baseClass = styles.overviewCard;
    const colorClass = styles[`card${color.charAt(0).toUpperCase() + color.slice(1)}`];
    const trendClass = styles[`trend${trend.charAt(0).toUpperCase() + trend.slice(1)}`];
    return `${baseClass} ${colorClass} ${trendClass}`;
  };

  return (
    <div className={`${styles.overviewCardsWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <Container fluid>
        <div className={styles.overviewCardsContainer}>
          <Row className="g-3">
            {cards.map((card, index) => (
              <Col key={index} xl={4} lg={6} md={6} sm={12}>
                <Card className={getCardClass(card.color, card.trend)}>
                  <Card.Body>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}>
                        <span className={styles.icon}>{card.icon}</span>
                      </div>
                      <div className={styles.cardTitles}>
                        <Card.Title className={styles.cardTitle}>{card.title}</Card.Title>
                        <Card.Subtitle className={styles.cardSubtitle}>{card.subtitle}</Card.Subtitle>
                      </div>
                      {card.percentage && (
                        <Badge 
                          bg={card.color} 
                          className={styles.percentageBadge}
                        >
                          {card.percentage}
                        </Badge>
                      )}
                    </div>
                    
                    <div className={styles.cardContent}>
                      <div className={styles.cardValue}>{card.value}</div>
                      <div className={styles.cardTrend}>
                        <span className={styles.trendIcon}>{getTrendIcon(card.trend)}</span>
                        <span className={styles.trendText}>
                          {card.trend === 'up' ? 'Growing' : 
                           card.trend === 'down' ? 'Declining' : 'Stable'}
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <div className={styles.progressContainer}>
                        <div 
                          className={`${styles.progressBar} ${card.trend}`}
                          style={{
                            width: `${Math.min(Math.abs(card.trend === 'up' ? 75 : card.trend === 'down' ? 40 : 60), 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default OverviewCards;