import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Badge, 
  Form, 
  InputGroup, 
  Button, 
  Dropdown, 
  Spinner,
  Alert
} from 'react-bootstrap';
import styles from '../css/MarketList.module.css';

const MarketList = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  // Fetch stocks from backend
  const fetchStocks = async () => {
    try {
      setError('');
      const response = await fetch('http://localhost:5000/api/market/stocks');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setStocks(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch stocks');
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setError('Failed to load market data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load stocks on component mount
  useEffect(() => {
    fetchStocks();

    // Set up real-time updates every 2 minutes (matching backend)
    const interval = setInterval(fetchStocks, 120000);
    return () => clearInterval(interval);
  }, []);

  // Filter and sort stocks
  const filteredStocks = stocks
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

  const sectors = ['all', ...new Set(stocks.map(stock => stock.sector))];

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
      'HydroPower': 'info',
      'Finance': 'warning',
      'Development Bank': 'secondary'
    };
    return colors[sector] || 'light';
  };

  if (loading) {
    return (
      <div className={`${styles.marketListWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen}`}>
        <Card className={styles.marketListCard}>
          <Card.Body className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 mb-0">Loading NEPSE market data...</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${styles.marketListWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarOpen} ${theme === 'dark' ? styles.darkTheme : ''}`}>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      
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
                onClick={fetchStocks}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : '🔄 Refresh'}
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
                        रु {stock.currentPrice?.toFixed(2) || '0.00'}
                      </div>
                      <div className={styles.priceRange}>
                        H: रु {stock.dayHigh?.toFixed(2) || '0.00'} | L: रु {stock.dayLow?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className={styles.changeCell}>
                      <div className={`${styles.changeIndicator} ${(stock.changePercent || 0) >= 0 ? styles.positive : styles.negative}`}>
                        <span className={styles.changeValue}>
                          {(stock.change || 0) >= 0 ? '+' : ''}{(stock.change || 0).toFixed(2)}
                        </span>
                        <span className={styles.changePercent}>
                          ({(stock.changePercent || 0) >= 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%)
                        </span>
                        <span className={styles.changeIcon}>
                          {(stock.changePercent || 0) >= 0 ? '🔼' : '🔽'}
                        </span>
                      </div>
                    </td>
                    <td className={styles.volumeCell}>
                      {(stock.volume || 0).toLocaleString('en-NP')}
                    </td>
                    <td className={styles.sectorCell}>
                      <Badge bg={getSectorColor(stock.sector)} className={styles.sectorBadge}>
                        {stock.sector}
                      </Badge>
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
              Showing {filteredStocks.length} of {stocks.length} NEPSE stocks
            </small>
            <small className="text-muted">
              Data updates every 2 minutes • Paper Trading Mode
            </small>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default MarketList;