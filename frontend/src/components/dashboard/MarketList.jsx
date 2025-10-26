import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import styles from '../css/MarketList.module.css';

const MarketList = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [markets, setMarkets] = useState([]);
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

  // Sample NEPSE market data
  const nepseStocks = [
    {
      symbol: 'NLIC',
      name: 'Nepal Life Insurance Co. Ltd.',
      currentPrice: 765.00,
      change: 12.50,
      changePercent: 1.66,
      volume: 15420,
      sector: 'Insurance',
      previousClose: 752.50,
      dayHigh: 772.00,
      dayLow: 758.00
    },
    {
      symbol: 'NIBL',
      name: 'Nepal Investment Bank Ltd.',
      currentPrice: 452.75,
      change: -5.25,
      changePercent: -1.15,
      volume: 8925,
      sector: 'Commercial Banks',
      previousClose: 458.00,
      dayHigh: 460.00,
      dayLow: 448.00
    },
    {
      symbol: 'SCB',
      name: 'Standard Chartered Bank Nepal Ltd.',
      currentPrice: 625.00,
      change: 8.75,
      changePercent: 1.42,
      volume: 5678,
      sector: 'Commercial Banks',
      previousClose: 616.25,
      dayHigh: 630.00,
      dayLow: 620.00
    },
    {
      symbol: 'NTC',
      name: 'Nepal Telecom Company Ltd.',
      currentPrice: 835.25,
      change: 15.50,
      changePercent: 1.89,
      volume: 23456,
      sector: 'Telecommunication',
      previousClose: 819.75,
      dayHigh: 842.00,
      dayLow: 825.00
    },
    {
      symbol: 'HIDCL',
      name: 'Hydropower Investment & Development Co. Ltd.',
      currentPrice: 285.50,
      change: -3.25,
      changePercent: -1.13,
      volume: 12345,
      sector: 'Hydroelectricity',
      previousClose: 288.75,
      dayHigh: 290.00,
      dayLow: 282.00
    },
    {
      symbol: 'CIT',
      name: 'Citizens Bank International Ltd.',
      currentPrice: 345.00,
      change: 4.50,
      changePercent: 1.32,
      volume: 7890,
      sector: 'Commercial Banks',
      previousClose: 340.50,
      dayHigh: 348.00,
      dayLow: 342.00
    },
    {
      symbol: 'NIFRA',
      name: 'Nepal Infrastructure Bank Ltd.',
      currentPrice: 198.75,
      change: 2.25,
      changePercent: 1.15,
      volume: 15670,
      sector: 'Development Banks',
      previousClose: 196.50,
      dayHigh: 202.00,
      dayLow: 195.00
    },
    {
      symbol: 'SHL',
      name: 'Soaltee Hotel Ltd.',
      currentPrice: 312.00,
      change: -8.00,
      changePercent: -2.50,
      volume: 4567,
      sector: 'Hotels',
      previousClose: 320.00,
      dayHigh: 318.00,
      dayLow: 308.00
    }
  ];

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setMarkets(prevMarkets => 
        prevMarkets.map(stock => ({
          ...stock,
          currentPrice: stock.currentPrice + (Math.random() - 0.5) * 2,
          change: stock.change + (Math.random() - 0.5) * 0.5
        }))
      );
    }, 5000);

    // Initial data load
    setMarkets(nepseStocks);

    return () => clearInterval(interval);
  }, []);

  // Filter and sort stocks
  const filteredStocks = markets
    .filter(stock => {
      const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stock.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || stock.sector === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.currentPrice;
          bValue = b.currentPrice;
          break;
        case 'change':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case 'volume':
          aValue = a.volume;
          bValue = b.volume;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const sectors = ['all', ...new Set(nepseStocks.map(stock => stock.sector))];

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getSectorColor = (sector) => {
    const colors = {
      'Commercial Banks': 'primary',
      'Insurance': 'success',
      'Hydroelectricity': 'info',
      'Telecommunication': 'warning',
      'Development Banks': 'secondary',
      'Hotels': 'danger'
    };
    return colors[sector] || 'light';
  };

  return (
    <div className={`${styles.marketListWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      <Card className={styles.marketListCard}>
        <Card.Header className={styles.marketListHeader}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h4 className={styles.cardTitle}>📊 NEPSE Live Market</h4>
              <Badge bg="success" className={styles.liveBadge}>
                LIVE
              </Badge>
            </div>
            <div className={styles.controlsSection}>
              <InputGroup className={styles.searchGroup}>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search NEPSE stocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </InputGroup>

              <Dropdown className={styles.filterDropdown}>
                <Dropdown.Toggle variant="outline-secondary">
                  🏷️ {filterType === 'all' ? 'All Sectors' : filterType}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setFilterType('all')}>
                    All Sectors
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  {sectors.filter(s => s !== 'all').map(sector => (
                    <Dropdown.Item 
                      key={sector} 
                      onClick={() => setFilterType(sector)}
                    >
                      {sector}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Button 
                variant="outline-primary"
                onClick={() => {
                  // Refresh data
                  setMarkets([...nepseStocks]);
                }}
              >
                🔄 Refresh
              </Button>
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <div className={styles.tableContainer}>
            <Table hover className={styles.marketTable}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th onClick={() => handleSort('name')} className={styles.sortable}>
                    Stock {getSortIcon('name')}
                  </th>
                  <th onClick={() => handleSort('price')} className={styles.sortable}>
                    Price (रु) {getSortIcon('price')}
                  </th>
                  <th onClick={() => handleSort('change')} className={styles.sortable}>
                    Change {getSortIcon('change')}
                  </th>
                  <th onClick={() => handleSort('volume')} className={styles.sortable}>
                    Volume {getSortIcon('volume')}
                  </th>
                  <th>Sector</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock, index) => (
                  <tr key={stock.symbol} className={styles.stockRow}>
                    <td className={styles.stockInfo}>
                      <div className={styles.symbolName}>
                        <strong className={styles.stockSymbol}>{stock.symbol}</strong>
                        <small className={styles.stockName}>{stock.name}</small>
                      </div>
                    </td>
                    <td className={styles.priceCell}>
                      <div className={styles.currentPrice}>
                        रु {stock.currentPrice.toFixed(2)}
                      </div>
                      <div className={styles.priceRange}>
                        H: रु {stock.dayHigh.toFixed(2)} | L: रु {stock.dayLow.toFixed(2)}
                      </div>
                    </td>
                    <td className={styles.changeCell}>
                      <div className={`${styles.changeIndicator} ${stock.change >= 0 ? styles.positive : styles.negative}`}>
                        <span className={styles.changeValue}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                        </span>
                        <span className={styles.changePercent}>
                          ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </span>
                        <span className={styles.changeIcon}>
                          {stock.change >= 0 ? '🔼' : '🔽'}
                        </span>
                      </div>
                    </td>
                    <td className={styles.volumeCell}>
                      {stock.volume.toLocaleString('en-NP')}
                    </td>
                    <td className={styles.sectorCell}>
                      <Badge bg={getSectorColor(stock.sector)} className={styles.sectorBadge}>
                        {stock.sector}
                      </Badge>
                    </td>
                    <td className={styles.actionCell}>
                      <div className={styles.actionButtons}>
                        <Button size="sm" variant="success" className={styles.buyBtn}>
                          Buy
                        </Button>
                        <Button size="sm" variant="danger" className={styles.sellBtn}>
                          Sell
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {filteredStocks.length === 0 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsContent}>
                <span className={styles.noResultsIcon}>🔍</span>
                <h5>No stocks found</h5>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </Card.Body>

        <Card.Footer className={styles.marketListFooter}>
          <div className={styles.footerContent}>
            <small className="text-muted">
              Showing {filteredStocks.length} of {nepseStocks.length} NEPSE stocks
            </small>
            <small className="text-muted">
              Data updates every 5 seconds • Paper Trading Mode
            </small>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default MarketList;