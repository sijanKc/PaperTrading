import React, { useState, useEffect, useRef } from 'react';
import styles from '../../admincss/MarketData.module.css';

const MarketData = () => {
  const formRef = useRef(null);
  // Market Data State
  const [stocks, setStocks] = useState([
    {
      id: 1,
      symbol: 'NIC',
      name: 'NIC Asia Bank',
      sector: 'Banking',
      currentPrice: 850,
      change: 2.5,
      volume: 45678,
      marketCap: 85.6,
      lotSize: 10,
      enabled: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 2,
      symbol: 'NBL',
      name: 'Nepal Bank Limited',
      sector: 'Banking',
      currentPrice: 450,
      change: 1.8,
      volume: 34567,
      marketCap: 45.2,
      lotSize: 10,
      enabled: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 3,
      symbol: 'SCB',
      name: 'Standard Chartered Bank',
      sector: 'Banking',
      currentPrice: 680,
      change: 3.2,
      volume: 56789,
      marketCap: 68.3,
      lotSize: 10,
      enabled: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 4,
      symbol: 'NTC',
      name: 'Nepal Telecom',
      sector: 'Telecom',
      currentPrice: 1120,
      change: 1.2,
      volume: 12345,
      marketCap: 112.5,
      lotSize: 10,
      enabled: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 5,
      symbol: 'HIDCL',
      name: 'Hydroelectricity Investment',
      sector: 'Hydropower',
      currentPrice: 320,
      change: -0.5,
      volume: 23456,
      marketCap: 32.1,
      lotSize: 10,
      enabled: true,
      lastUpdated: new Date().toISOString()
    }
  ]);

  // Form State
  const [newStock, setNewStock] = useState({
    symbol: '',
    name: '',
    sector: 'Banking',
    currentPrice: 0,
    volume: 0,
    marketCap: 0,
    lotSize: 10,
    enabled: true
  });

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editStockId, setEditStockId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [priceUpdateMode, setPriceUpdateMode] = useState('bulk'); // 'bulk' or 'individual'

  // API Configuration
  const [apiConfig, setApiConfig] = useState({
    dataSource: 'Manual', // Default to Manual Entry
    refreshInterval: 5000,
    autoRefresh: true,
    fallbackEnabled: true,
    manualOverride: true
  });

  // Market Hours
  const [marketHours, setMarketHours] = useState({
    open: '9:15',
    close: '15:30',
    preOpen: '9:00',
    postClose: '16:00',
    holidays: ['2024-01-15', '2024-01-26', '2024-02-19']
  });

  // Fetch stocks data
  const fetchStocksData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/stocks/admin/all', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
          // Normalize data for UI if needed
          const formattedStocks = data.stocks.map(s => ({
              id: s._id, // map _id to id
              symbol: s.symbol,
              name: s.name,
              sector: s.sector,
              currentPrice: s.currentPrice,
              change: parseFloat((s.changePercent || 0).toFixed(2)),
              volume: s.volume,
              marketCap: s.marketCap,
              lotSize: 10, // hardcoded for now or add to model
              enabled: s.isActive,
              lastUpdated: s.updatedAt || new Date().toISOString()
          }));
          setStocks(formattedStocks);
      } else {
          console.error('Failed to fetch stocks:', data.message);
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocksData();
  }, []);

  // Scroll to form when it opens
  useEffect(() => {
    if (showAddForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showAddForm]);

  // Filter stocks
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = (stock.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    // Case-insensitive sector matching with whitespace handling
    const matchesSector = sectorFilter === 'all' || 
      (stock.sector && stock.sector.trim().toLowerCase() === sectorFilter.trim().toLowerCase());
    return matchesSearch && matchesSector;
  });

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'number') {
      // Allow empty string for better UX, otherwise parse as float
      if (value === '') {
        setNewStock(prev => ({ ...prev, [name]: '' }));
      } else {
        setNewStock(prev => ({ ...prev, [name]: parseFloat(value) }));
      }
    } else {
      setNewStock(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Add new stock
  const handleAddStock = async () => {
    if (!newStock.symbol || !newStock.name) {
      alert('Please fill in symbol and name');
      return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/stocks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...newStock,
                // Ensure numeric values
                currentPrice: Number(newStock.currentPrice) || 0,
                volume: Number(newStock.volume) || 0,
                marketCap: Number(newStock.marketCap) || 0,
                lotSize: Number(newStock.lotSize) || 10,
                sector: newStock.sector || 'Others', // Ensure sector is set
                enabled: newStock.enabled
            })
        });
        const data = await response.json();

        if (data.success) {
            alert('Stock added successfully!');
            fetchStocksData(); // Refresh list
            setNewStock({
                symbol: '',
                name: '',
                sector: 'Banking',
                currentPrice: 0,
                volume: 0,
                marketCap: 0,
                lotSize: 10,
                enabled: true
            });
            setShowAddForm(false);
        } else {
            alert('Failed to add stock: ' + data.message);
        }
    } catch (error) {
        console.error('Error adding stock:', error);
        alert('Error adding stock. Check console.');
    }
  };

  // Edit stock
  const handleEditStock = (stock) => {
    setNewStock({
        ...stock,
        id: stock.id 
    });
    setEditStockId(stock.id);
    setShowAddForm(true);
  };

  // Update stock
  const handleUpdateStock = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/stocks/${editStockId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...newStock,
                // Ensure numeric values
                currentPrice: Number(newStock.currentPrice) || 0,
                volume: Number(newStock.volume) || 0,
                marketCap: Number(newStock.marketCap) || 0,
                lotSize: Number(newStock.lotSize) || 10,
                isActive: newStock.enabled // Map enabled to isActive
            })
        });
        const data = await response.json();

        if (data.success) {
            alert('Stock updated successfully!');
            fetchStocksData();
            setShowAddForm(false);
            setEditStockId(null);
            setNewStock({
                symbol: '',
                name: '',
                sector: 'Banking',
                currentPrice: 0,
                volume: 0,
                marketCap: 0,
                lotSize: 10,
                enabled: true
            });
        } else {
            alert('Failed to update stock: ' + data.message);
        }
    } catch (error) {
        console.error('Error updating stock:', error);
        alert('Error updating stock.');
    }
  };

  // Delete stock
  const handleDeleteStock = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/stocks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                alert('Stock deleted successfully');
                fetchStocksData();
            } else {
                alert('Failed to delete stock: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting stock:', error);
        }
    }
  };

  // Toggle stock status
  const handleToggleStock = async (id) => {
    const stock = stocks.find(s => s.id === id);
    if (!stock) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/stocks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                isActive: !stock.enabled
            })
        });
        const data = await response.json();
        if(data.success) {
            fetchStocksData();
        }
    } catch (error) {
        console.error('Error toggling stock:', error);
    }
  };

  // Bulk price update (Simulate Market Movement)
  const handleBulkPriceUpdate = async () => {
    const percentInput = prompt("Enter percentage fluctuation (e.g., 2 for +2%, -1.5 for -1.5%):", "0");
    if (percentInput === null) return;
    
    const percentage = parseFloat(percentInput);
    if (isNaN(percentage)) {
      alert("Invalid percentage!");
      return;
    }
    
    const confirmUpdate = window.confirm(`This will update ALL visible stocks by ${percentage}%. Continue?`);
    if (!confirmUpdate) return;
    
    setIsLoading(true);
    let updatedCount = 0;
    
    // Process purely in frontend loop for now as requested for "Manual Simulation"
    // In a real production app, this should be a single backend endpoint
    try {
        const token = localStorage.getItem('token');
        
        for (const stock of filteredStocks) {
            const fluctuation = percentage;
            // Add a tiny bit of randomness so not everything is exactly same % if user wants
            // But for now, stick to exactly what user typed for control
            
            const newPrice = stock.currentPrice * (1 + (fluctuation / 100));
            const roundedPrice = Math.round(newPrice * 100) / 100; // 2 decimal places
            
            if (roundedPrice < 0) continue; // Safety check

            await fetch(`http://localhost:5000/api/stocks/${stock.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPrice: roundedPrice })
            });
            updatedCount++;
        }
        
        alert(`Successfully updated ${updatedCount} stocks!`);
        fetchStocksData();
    } catch (error) {
        console.error("Bulk update error:", error);
        alert("Error during bulk update. Check console.");
    } finally {
        setIsLoading(false);
    }
  };

  // Individual price update
  const handleIndividualPriceUpdate = async (id, newPrice) => {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/stocks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPrice: newPrice })
        });
        fetchStocksData();
      } catch (error) {
          console.error('Price update error', error);
      }
  };

  // Update API config
  const handleApiConfigChange = (field, value) => {
    setApiConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save config
  const handleSaveConfig = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Configuration saved successfully!');
    }, 1000);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get sector color
  const getSectorColor = (sector) => {
    if (!sector) return '#6b7280'; // Default gray for undefined
    const normalizedSector = sector.toString().trim().toLowerCase();
    
    // keys must be lowercased for matching
    const colors = {
      banking: '#3b82f6',
      telecom: '#8b5cf6',
      hydropower: '#10b981',
      finance: '#f59e0b',
      insurance: '#ec4899',
      manufacturing: '#ef4444',
      others: '#6b7280'
    };
    return colors[normalizedSector] || colors.others;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading market data...</p>
      </div>
    );
  }

  return (
    <div className={styles.marketDataContainer}>
      
      {/* Header */}
      <div className={styles.headerSection}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>
            <span className={styles.titleIcon}>📈</span>
            Market Data Management
          </h1>
          <p className={styles.pageSubtitle}>
            Manage NEPSE stocks, prices, and market configurations
          </p>
        </div>
        
        <div className={styles.headerRight}>
          <button 
            className={styles.refreshButton}
            onClick={fetchStocksData}
          >
            🔄 Refresh Data
          </button>
          
          <button 
            className={styles.addButton}
            onClick={() => {
              setShowAddForm(true);
              setEditStockId(null);
              setNewStock({
                symbol: '',
                name: '',
                sector: 'Banking',
                currentPrice: 0,
                volume: 0,
                marketCap: 0,
                lotSize: 10,
                enabled: true
              });
            }}
          >
            ➕ Add New Stock
          </button>
        </div>
      </div>

      {/* Configuration Section */}
      <div className={styles.configSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>⚙️</span>
            Data Configuration
          </h2>
        </div>
        
        <div className={styles.configGrid}>
          <div className={styles.configCard}>
            <h3 className={styles.configTitle}>API Settings</h3>
            <div className={styles.configForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Data Source</label>
                <select
                  value={apiConfig.dataSource}
                  onChange={(e) => handleApiConfigChange('dataSource', e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="NEPSE API">NEPSE Official API</option>
                  <option value="Merolagani">Merolagani.com</option>
                  <option value="Sharesansar">ShareSansar</option>
                  <option value="Manual">Manual Entry</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Auto-refresh Interval
                  <span className={styles.helperText}>Seconds between updates</span>
                </label>
                <div className={styles.sliderContainer}>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={apiConfig.refreshInterval / 1000}
                    onChange={(e) => handleApiConfigChange('refreshInterval', parseInt(e.target.value) * 1000)}
                    className={styles.slider}
                    disabled={!apiConfig.autoRefresh}
                  />
                  <div className={styles.sliderLabels}>
                    <span>1s</span>
                    <span className={styles.sliderValue}>{apiConfig.refreshInterval / 1000}s</span>
                    <span>60s</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={apiConfig.autoRefresh}
                    onChange={(e) => handleApiConfigChange('autoRefresh', e.target.checked)}
                    className={styles.checkbox}
                  />
                  Enable Auto-refresh
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={apiConfig.fallbackEnabled}
                    onChange={(e) => handleApiConfigChange('fallbackEnabled', e.target.checked)}
                    className={styles.checkbox}
                  />
                  Enable Fallback Source
                </label>
              </div>
            </div>
          </div>
          
          <div className={styles.configCard}>
            <h3 className={styles.configTitle}>Market Hours</h3>
            <div className={styles.marketHours}>
              <div className={styles.hoursRow}>
                <span className={styles.hoursLabel}>Market Open:</span>
                <span className={styles.hoursValue}>{marketHours.open}</span>
              </div>
              <div className={styles.hoursRow}>
                <span className={styles.hoursLabel}>Market Close:</span>
                <span className={styles.hoursValue}>{marketHours.close}</span>
              </div>
              <div className={styles.hoursRow}>
                <span className={styles.hoursLabel}>Pre-market:</span>
                <span className={styles.hoursValue}>{marketHours.preOpen}</span>
              </div>
              <div className={styles.hoursRow}>
                <span className={styles.hoursLabel}>Post-market:</span>
                <span className={styles.hoursValue}>{marketHours.postClose}</span>
              </div>
            </div>
            
            <div className={styles.holidaysSection}>
              <h4 className={styles.holidaysTitle}>Upcoming Holidays</h4>
              <div className={styles.holidaysList}>
                {marketHours.holidays.map((holiday, index) => (
                  <div key={index} className={styles.holidayItem}>
                    📅 {holiday}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.configCard}>
            <h3 className={styles.configTitle}>Quick Actions</h3>
            <div className={styles.quickActions}>
              <button 
                className={styles.actionButton}
                onClick={handleBulkPriceUpdate}
              >
                📊 Update All Prices
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => setPriceUpdateMode(priceUpdateMode === 'bulk' ? 'individual' : 'bulk')}
              >
                {priceUpdateMode === 'bulk' ? '✏️ Edit Individual' : '📦 Bulk Edit'}
              </button>
              
              <button 
                className={`${styles.actionButton} ${styles.saveButton}`}
                onClick={handleSaveConfig}
              >
                💾 Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Stock Form */}
      {showAddForm && (
        <div className={styles.addStockSection} ref={formRef}>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>
              {editStockId ? '✏️ Edit Stock' : '➕ Add New Stock'}
            </h3>
            <button 
              className={styles.closeForm}
              onClick={() => setShowAddForm(false)}
            >
              ✕
            </button>
          </div>
          
          <div className={styles.stockForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Stock Symbol *
                  <input
                    type="text"
                    name="symbol"
                    value={newStock.symbol}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="e.g., NIC"
                    required
                  />
                </label>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Company Name *
                  <input
                    type="text"
                    name="name"
                    value={newStock.name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="e.g., NIC Asia Bank Limited"
                    required
                  />
                </label>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Sector</label>
                <select
                  name="sector"
                  value={newStock.sector}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                >
                  <option value="Banking">🏦 Banking</option>
                  <option value="Finance">💼 Finance</option>
                  <option value="Insurance">🛡️ Insurance</option>
                  <option value="Hydropower">⚡ Hydropower</option>
                  <option value="Telecom">📱 Telecom</option>
                  <option value="Manufacturing">🏭 Manufacturing</option>
                  <option value="Others">📊 Others</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Current Price (₹)
                  <input
                    type="number"
                    name="currentPrice"
                    value={newStock.currentPrice}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    min="0"
                    step="0.01"
                  />
                </label>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Volume (Shares)
                  <input
                    type="number"
                    name="volume"
                    value={newStock.volume}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    min="0"
                  />
                </label>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Market Cap (₹ Cr)
                  <input
                    type="number"
                    name="marketCap"
                    value={newStock.marketCap}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    min="0"
                    step="0.1"
                  />
                </label>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Lot Size
                  <input
                    type="number"
                    name="lotSize"
                    value={newStock.lotSize}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    min="1"
                  />
                </label>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="enabled"
                    checked={newStock.enabled}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  Trading Enabled
                </label>
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              
              {editStockId ? (
                <button 
                  className={styles.updateButton}
                  onClick={handleUpdateStock}
                >
                  Update Stock
                </button>
              ) : (
                <button 
                  className={styles.addButton}
                  onClick={handleAddStock}
                >
                  Add Stock
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stocks List */}
      <div className={styles.stocksSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📊</span>
              NEPSE Stocks
            </h2>
            <span className={styles.stockCount}>
              {filteredStocks.length} stocks
            </span>
          </div>
          
          <div className={styles.sectionControls}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button 
                  className={styles.clearSearch}
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
            
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className={styles.sectorFilter}
            >
              <option value="all">All Sectors</option>
              <option value="Banking">🏦 Banking</option>
              <option value="Finance">💼 Finance</option>
              <option value="Insurance">🛡️ Insurance</option>
              <option value="Hydropower">⚡ Hydropower</option>
              <option value="Telecom">📱 Telecom</option>
            </select>
          </div>
        </div>
        
        <div className={styles.stocksTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCell}>Symbol</div>
            <div className={styles.tableCell}>Company</div>
            <div className={styles.tableCell}>Sector</div>
            <div className={styles.tableCell}>Price</div>
            <div className={styles.tableCell}>Change</div>
            <div className={styles.tableCell}>Volume</div>
            <div className={styles.tableCell}>Status</div>
            <div className={styles.tableCell}>Actions</div>
          </div>
          
          <div className={styles.tableBody}>
            {filteredStocks.map(stock => (
              <div key={stock.id} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <div className={styles.symbolCell}>
                    <span className={styles.stockSymbol}>{stock.symbol}</span>
                    {!stock.enabled && (
                      <span className={styles.disabledBadge}>🚫</span>
                    )}
                  </div>
                </div>
                
                <div className={styles.tableCell}>
                  <div className={styles.companyCell}>
                    <div className={styles.companyName}>{stock.name}</div>
                    <div className={styles.marketCap}>
                      Mkt Cap: ₹{stock.marketCap} Cr
                    </div>
                  </div>
                </div>
                
                <div className={styles.tableCell}>
                  <span 
                    className={styles.sectorBadge}
                    style={{ backgroundColor: getSectorColor(stock.sector) }}
                  >
                    {stock.sector}
                  </span>
                </div>
                
                <div className={styles.tableCell}>
                  <div className={styles.priceCell}>
                    <div className={styles.stockPrice}>
                      ₹{stock.currentPrice.toFixed(2)}
                    </div>
                    {priceUpdateMode === 'individual' && (
                      <div className={styles.priceEdit}>
                        <input
                          type="number"
                          defaultValue={stock.currentPrice}
                          onBlur={(e) => handleIndividualPriceUpdate(stock.id, parseFloat(e.target.value))}
                          className={styles.priceInput}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.tableCell}>
                  <span className={`${styles.changeBadge} ${stock.change >= 0 ? styles.positive : styles.negative}`}>
                    {stock.change >= 0 ? '↗' : '↘'} {Math.abs(stock.change).toFixed(2)}%
                  </span>
                </div>
                
                <div className={styles.tableCell}>
                  <div className={styles.volumeCell}>
                    {stock.volume.toLocaleString()}
                    <div className={styles.lotSize}>Lot: {stock.lotSize}</div>
                  </div>
                </div>
                
                <div className={styles.tableCell}>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={stock.enabled}
                      onChange={() => handleToggleStock(stock.id)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                
                <div className={styles.tableCell}>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEditStock(stock)}
                    >
                      ✏️
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteStock(stock.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className={styles.summarySection}>
        <h3 className={styles.summaryTitle}>
          <span className={styles.summaryIcon}>📈</span>
          Market Summary
        </h3>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stocks.length}</div>
              <div className={styles.statLabel}>Total Stocks</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                ₹{stocks.reduce((sum, stock) => sum + stock.currentPrice, 0).toFixed(0)}
              </div>
              <div className={styles.statLabel}>Total Value</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📈</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {stocks.filter(s => s.change > 0).length}
              </div>
              <div className={styles.statLabel}>Advancing</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📉</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {stocks.filter(s => s.change < 0).length}
              </div>
              <div className={styles.statLabel}>Declining</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⚡</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {stocks.filter(s => s.enabled).length}
              </div>
              <div className={styles.statLabel}>Active</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔄</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {formatDate(stocks[0]?.lastUpdated || new Date().toISOString())}
              </div>
              <div className={styles.statLabel}>Last Updated</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MarketData;