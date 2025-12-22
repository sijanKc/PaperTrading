import React, { useState, useEffect } from 'react';
import styles from '../../admincss/CompetitionManager.module.css';

const CompetitionManager = () => {
  // Competitions State
  const [competitions, setCompetitions] = useState([
    {
      id: 1,
      name: 'NEPSE Masters Challenge',
      status: 'active',
      type: 'public',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      duration: '28 days',
      participants: 45,
      maxParticipants: 100,
      entryFee: 0,
      prizePool: 50000,
      startingBalance: 100000,
      rules: {
        maxDailyTrades: 10,
        allowedSectors: ['Banking', 'Finance'],
        minHoldingPeriod: 1
      },
      leaderboard: [
        { rank: 1, name: 'John Doe', profit: 25600, return: 25.6 },
        { rank: 2, name: 'Jane Smith', profit: 18900, return: 18.9 },
        { rank: 3, name: 'Bob Wilson', profit: 12500, return: 12.5 }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Banking Sector Battle',
      status: 'upcoming',
      type: 'private',
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      duration: '15 days',
      participants: 28,
      maxParticipants: 50,
      entryFee: 500,
      prizePool: 25000,
      startingBalance: 50000,
      rules: {
        maxDailyTrades: 5,
        allowedSectors: ['Banking'],
        minHoldingPeriod: 2
      },
      leaderboard: [],
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      name: 'Beginners Tournament',
      status: 'completed',
      type: 'public',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      duration: '31 days',
      participants: 120,
      maxParticipants: 150,
      entryFee: 0,
      prizePool: 75000,
      startingBalance: 50000,
      rules: {
        maxDailyTrades: 15,
        allowedSectors: ['All'],
        minHoldingPeriod: 0
      },
      leaderboard: [
        { rank: 1, name: 'Alice Johnson', profit: 35600, return: 71.2 },
        { rank: 2, name: 'Charlie Brown', profit: 28900, return: 57.8 },
        { rank: 3, name: 'David Lee', profit: 24500, return: 49.0 }
      ],
      createdAt: '2023-12-20'
    }
  ]);

  // New Competition Form
  const [newCompetition, setNewCompetition] = useState({
    name: '',
    description: '',
    type: 'public',
    startDate: '',
    endDate: '',
    duration: 30,
    maxParticipants: 100,
    entryFee: 0,
    prizePool: 0,
    startingBalance: 100000,
    rules: {
      maxDailyTrades: 10,
      allowedSectors: ['All'],
      minHoldingPeriod: 1,
      shortSelling: false,
      marginTrading: false
    },
    prizes: [
      { position: 1, prize: 'Champion Trophy' },
      { position: 2, prize: 'Runner-up Certificate' },
      { position: 3, prize: 'Consolation Prize' }
    ]
  });

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'details', 'leaderboard'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingCompetition, setEditingCompetition] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    upcoming: 0,
    completed: 0,
    totalParticipants: 0,
    totalPrizePool: 0
  });

  // Calculate stats
  useEffect(() => {
    const newStats = {
      total: competitions.length,
      active: competitions.filter(c => c.status === 'active').length,
      upcoming: competitions.filter(c => c.status === 'upcoming').length,
      completed: competitions.filter(c => c.status === 'completed').length,
      totalParticipants: competitions.reduce((sum, comp) => sum + comp.participants, 0),
      totalPrizePool: competitions.reduce((sum, comp) => sum + comp.prizePool, 0)
    };
    setStats(newStats);
  }, [competitions]);

  // Filter competitions
  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCompetition(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : 
              value
    }));
  };

  // Handle rules changes
  const handleRuleChange = (rule, value) => {
    setNewCompetition(prev => ({
      ...prev,
      rules: {
        ...prev.rules,
        [rule]: value
      }
    }));
  };

  // Handle prize changes
  const handlePrizeChange = (index, value) => {
    const updatedPrizes = [...newCompetition.prizes];
    updatedPrizes[index] = { ...updatedPrizes[index], prize: value };
    setNewCompetition(prev => ({
      ...prev,
      prizes: updatedPrizes
    }));
  };

  // Calculate duration
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Create new competition
  const handleCreateCompetition = () => {
    if (!newCompetition.name || !newCompetition.startDate || !newCompetition.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const duration = calculateDuration(newCompetition.startDate, newCompetition.endDate);
    
    const competitionData = {
      id: competitions.length + 1,
      name: newCompetition.name,
      status: new Date(newCompetition.startDate) > new Date() ? 'upcoming' : 'active',
      type: newCompetition.type,
      startDate: newCompetition.startDate,
      endDate: newCompetition.endDate,
      duration: `${duration} days`,
      participants: 0,
      maxParticipants: newCompetition.maxParticipants,
      entryFee: newCompetition.entryFee,
      prizePool: newCompetition.prizePool,
      startingBalance: newCompetition.startingBalance,
      rules: newCompetition.rules,
      leaderboard: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCompetitions(prev => [...prev, competitionData]);
    setShowCreateForm(false);
    setNewCompetition({
      name: '',
      description: '',
      type: 'public',
      startDate: '',
      endDate: '',
      duration: 30,
      maxParticipants: 100,
      entryFee: 0,
      prizePool: 0,
      startingBalance: 100000,
      rules: {
        maxDailyTrades: 10,
        allowedSectors: ['All'],
        minHoldingPeriod: 1,
        shortSelling: false,
        marginTrading: false
      },
      prizes: [
        { position: 1, prize: 'Champion Trophy' },
        { position: 2, prize: 'Runner-up Certificate' },
        { position: 3, prize: 'Consolation Prize' }
      ]
    });
  };

  // Edit competition
  const handleEditCompetition = (comp) => {
    setEditingCompetition(comp);
    setNewCompetition({
      name: comp.name,
      description: comp.description || '',
      type: comp.type,
      startDate: comp.startDate,
      endDate: comp.endDate,
      duration: parseInt(comp.duration),
      maxParticipants: comp.maxParticipants,
      entryFee: comp.entryFee,
      prizePool: comp.prizePool,
      startingBalance: comp.startingBalance,
      rules: comp.rules,
      prizes: comp.prizes || [
        { position: 1, prize: 'Champion Trophy' },
        { position: 2, prize: 'Runner-up Certificate' },
        { position: 3, prize: 'Consolation Prize' }
      ]
    });
    setShowCreateForm(true);
  };

  // Update competition
  const handleUpdateCompetition = () => {
    if (!editingCompetition) return;

    const duration = calculateDuration(newCompetition.startDate, newCompetition.endDate);
    const status = new Date(newCompetition.startDate) > new Date() ? 'upcoming' : 'active';

    setCompetitions(prev =>
      prev.map(comp =>
        comp.id === editingCompetition.id
          ? {
              ...comp,
              ...newCompetition,
              status,
              duration: `${duration} days`
            }
          : comp
      )
    );

    setShowCreateForm(false);
    setEditingCompetition(null);
    setNewCompetition({
      name: '',
      description: '',
      type: 'public',
      startDate: '',
      endDate: '',
      duration: 30,
      maxParticipants: 100,
      entryFee: 0,
      prizePool: 0,
      startingBalance: 100000,
      rules: {
        maxDailyTrades: 10,
        allowedSectors: ['All'],
        minHoldingPeriod: 1,
        shortSelling: false,
        marginTrading: false
      },
      prizes: [
        { position: 1, prize: 'Champion Trophy' },
        { position: 2, prize: 'Runner-up Certificate' },
        { position: 3, prize: 'Consolation Prize' }
      ]
    });
  };

  // Delete competition
  const handleDeleteCompetition = (id) => {
    if (window.confirm('Are you sure you want to delete this competition?')) {
      setCompetitions(prev => prev.filter(comp => comp.id !== id));
    }
  };

  // Change competition status
  const handleStatusChange = (id, newStatus) => {
    setCompetitions(prev =>
      prev.map(comp =>
        comp.id === id
          ? { ...comp, status: newStatus }
          : comp
      )
    );
  };

  // Add participant
  const handleAddParticipant = (compId, userId) => {
    // In real app, this would be an API call
    setCompetitions(prev =>
      prev.map(comp =>
        comp.id === compId && comp.participants < comp.maxParticipants
          ? { ...comp, participants: comp.participants + 1 }
          : comp
      )
    );
  };

  // View competition details
  const handleViewDetails = (comp) => {
    setSelectedCompetition(comp);
    setViewMode('details');
  };

  // View leaderboard
  const handleViewLeaderboard = (comp) => {
    setSelectedCompetition(comp);
    setViewMode('leaderboard');
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', color: 'green', icon: '⚡' },
      upcoming: { label: 'Upcoming', color: 'blue', icon: '📅' },
      completed: { label: 'Completed', color: 'gray', icon: '✅' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`${styles.statusBadge} ${styles[config.color]}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  // Get type badge
  const getTypeBadge = (type) => {
    return (
      <span className={`${styles.typeBadge} ${type === 'public' ? styles.public : styles.private}`}>
        {type === 'public' ? '🌐 Public' : '🔒 Private'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading competitions...</p>
      </div>
    );
  }

  return (
    <div className={styles.competitionManagerContainer}>
      
      {/* Header */}
      <div className={styles.headerSection}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>
            <span className={styles.titleIcon}>🏆</span>
            Competition Manager
          </h1>
          <p className={styles.pageSubtitle}>
            Create and manage paper trading competitions
          </p>
        </div>
        
        <div className={styles.headerRight}>
          <button 
            className={styles.createButton}
            onClick={() => {
              setShowCreateForm(true);
              setEditingCompetition(null);
            }}
          >
            ➕ Create Competition
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.total}`}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.total}</div>
              <div className={styles.statLabel}>Total Competitions</div>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.active}`}>
            <div className={styles.statIcon}>⚡</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.active}</div>
              <div className={styles.statLabel}>Active</div>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.upcoming}`}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.upcoming}</div>
              <div className={styles.statLabel}>Upcoming</div>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.completed}`}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.completed}</div>
              <div className={styles.statLabel}>Completed</div>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.participants}`}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.totalParticipants}</div>
              <div className={styles.statLabel}>Total Participants</div>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.prizes}`}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{formatCurrency(stats.totalPrizePool)}</div>
              <div className={styles.statLabel}>Total Prize Pool</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className={styles.createFormSection}>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>
              {editingCompetition ? '✏️ Edit Competition' : '🏆 Create New Competition'}
            </h3>
            <button 
              className={styles.closeForm}
              onClick={() => setShowCreateForm(false)}
            >
              ✕
            </button>
          </div>
          
          <div className={styles.competitionForm}>
            <div className={styles.formGrid}>
              {/* Basic Information */}
              <div className={styles.formSection}>
                <h4 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>📝</span>
                  Basic Information
                </h4>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Competition Name *
                    <input
                      type="text"
                      name="name"
                      value={newCompetition.name}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="e.g., NEPSE Trading Challenge"
                      required
                    />
                  </label>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Description
                    <textarea
                      name="description"
                      value={newCompetition.description}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      placeholder="Describe the competition..."
                      rows="3"
                    />
                  </label>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type</label>
                    <select
                      name="type"
                      value={newCompetition.type}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                    >
                      <option value="public">🌐 Public (Anyone can join)</option>
                      <option value="private">🔒 Private (Invite only)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Max Participants
                      <input
                        type="number"
                        name="maxParticipants"
                        value={newCompetition.maxParticipants}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        min="2"
                        max="1000"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Dates & Duration */}
              <div className={styles.formSection}>
                <h4 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>📅</span>
                  Schedule
                </h4>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Start Date *
                      <input
                        type="date"
                        name="startDate"
                        value={newCompetition.startDate}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                      />
                    </label>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      End Date *
                      <input
                        type="date"
                        name="endDate"
                        value={newCompetition.endDate}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                      />
                    </label>
                  </div>
                </div>
                
                {newCompetition.startDate && newCompetition.endDate && (
                  <div className={styles.durationDisplay}>
                    Duration: {calculateDuration(newCompetition.startDate, newCompetition.endDate)} days
                  </div>
                )}
              </div>

              {/* Financial Settings */}
              <div className={styles.formSection}>
                <h4 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>💰</span>
                  Financial Settings
                </h4>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Starting Virtual Balance
                      <div className={styles.inputGroup}>
                        <span className={styles.currencySymbol}>₹</span>
                        <input
                          type="number"
                          name="startingBalance"
                          value={newCompetition.startingBalance}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          min="1000"
                          step="1000"
                        />
                      </div>
                    </label>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Entry Fee
                      <div className={styles.inputGroup}>
                        <span className={styles.currencySymbol}>₹</span>
                        <input
                          type="number"
                          name="entryFee"
                          value={newCompetition.entryFee}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          min="0"
                          step="100"
                        />
                      </div>
                    </label>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Prize Pool
                      <div className={styles.inputGroup}>
                        <span className={styles.currencySymbol}>₹</span>
                        <input
                          type="number"
                          name="prizePool"
                          value={newCompetition.prizePool}
                          onChange={handleInputChange}
                          className={styles.formInput}
                          min="0"
                          step="1000"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Trading Rules */}
              <div className={styles.formSection}>
                <h4 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>📜</span>
                  Trading Rules
                </h4>
                
                <div className={styles.rulesGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Max Daily Trades
                      <input
                        type="number"
                        value={newCompetition.rules.maxDailyTrades}
                        onChange={(e) => handleRuleChange('maxDailyTrades', parseInt(e.target.value))}
                        className={styles.formInput}
                        min="1"
                        max="50"
                      />
                    </label>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Minimum Holding Period (Days)
                      <input
                        type="number"
                        value={newCompetition.rules.minHoldingPeriod}
                        onChange={(e) => handleRuleChange('minHoldingPeriod', parseInt(e.target.value))}
                        className={styles.formInput}
                        min="0"
                        max="30"
                      />
                    </label>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Allowed Sectors</label>
                    <select
                      value={newCompetition.rules.allowedSectors[0]}
                      onChange={(e) => handleRuleChange('allowedSectors', [e.target.value])}
                      className={styles.formSelect}
                    >
                      <option value="All">All Sectors</option>
                      <option value="Banking">🏦 Banking Only</option>
                      <option value="Finance">💼 Finance Only</option>
                      <option value="Banking,Finance">🏦 Banking + 💼 Finance</option>
                    </select>
                  </div>
                  
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={newCompetition.rules.shortSelling}
                        onChange={(e) => handleRuleChange('shortSelling', e.target.checked)}
                        className={styles.checkbox}
                      />
                      Allow Short Selling
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={newCompetition.rules.marginTrading}
                        onChange={(e) => handleRuleChange('marginTrading', e.target.checked)}
                        className={styles.checkbox}
                      />
                      Allow Margin Trading
                    </label>
                  </div>
                </div>
              </div>

              {/* Prizes */}
              <div className={styles.formSection}>
                <h4 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>🎁</span>
                  Prizes
                </h4>
                
                <div className={styles.prizesGrid}>
                  {newCompetition.prizes.map((prize, index) => (
                    <div key={index} className={styles.prizeItem}>
                      <div className={styles.positionBadge}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {prize.position}
                      </div>
                      <input
                        type="text"
                        value={prize.prize}
                        onChange={(e) => handlePrizeChange(index, e.target.value)}
                        className={styles.prizeInput}
                        placeholder="Prize description"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
              
              {editingCompetition ? (
                <button 
                  className={styles.updateButton}
                  onClick={handleUpdateCompetition}
                >
                  Update Competition
                </button>
              ) : (
                <button 
                  className={styles.createButton}
                  onClick={handleCreateCompetition}
                >
                  Create Competition
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Competitions List */}
      {viewMode === 'list' && (
        <div className={styles.competitionsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLeft}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📋</span>
                All Competitions
              </h2>
              <span className={styles.competitionCount}>
                {filteredCompetitions.length} competitions
              </span>
            </div>
            
            <div className={styles.sectionControls}>
              <div className={styles.searchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Search competitions..."
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.statusFilter}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div className={styles.competitionsGrid}>
            {filteredCompetitions.map(competition => (
              <div key={competition.id} className={styles.competitionCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.competitionInfo}>
                    <h3 className={styles.competitionName}>{competition.name}</h3>
                    <div className={styles.competitionMeta}>
                      {getStatusBadge(competition.status)}
                      {getTypeBadge(competition.type)}
                    </div>
                  </div>
                  
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.viewButton}
                      onClick={() => handleViewDetails(competition)}
                    >
                      👁️ View
                    </button>
                  </div>
                </div>
                
                <div className={styles.cardBody}>
                  <div className={styles.competitionDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>📅 Duration:</span>
                      <span className={styles.detailValue}>
                        {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
                      </span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>👥 Participants:</span>
                      <span className={styles.detailValue}>
                        {competition.participants} / {competition.maxParticipants}
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${(competition.participants / competition.maxParticipants) * 100}%` }}
                          ></div>
                        </div>
                      </span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>💰 Prize Pool:</span>
                      <span className={styles.detailValue}>
                        {formatCurrency(competition.prizePool)}
                      </span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>🎯 Starting Balance:</span>
                      <span className={styles.detailValue}>
                        {formatCurrency(competition.startingBalance)}
                      </span>
                    </div>
                  </div>
                  
                  {competition.leaderboard && competition.leaderboard.length > 0 && (
                    <div className={styles.leaderboardPreview}>
                      <div className={styles.previewTitle}>🏆 Top 3</div>
                      <div className={styles.topPerformers}>
                        {competition.leaderboard.slice(0, 3).map(player => (
                          <div key={player.rank} className={styles.performer}>
                            <span className={styles.rank}>#{player.rank}</span>
                            <span className={styles.name}>{player.name}</span>
                            <span className={`${styles.return} ${player.return >= 0 ? styles.positive : styles.negative}`}>
                              {player.return >= 0 ? '↗' : '↘'} {Math.abs(player.return).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={styles.cardFooter}>
                  <div className={styles.footerActions}>
                    <button 
                      className={styles.actionButton}
                      onClick={() => handleEditCompetition(competition)}
                    >
                      ✏️ Edit
                    </button>
                    
                    <button 
                      className={styles.actionButton}
                      onClick={() => handleViewLeaderboard(competition)}
                    >
                      📊 Leaderboard
                    </button>
                    
                    {competition.status === 'active' && (
                      <button 
                        className={`${styles.actionButton} ${styles.endButton}`}
                        onClick={() => handleStatusChange(competition.id, 'completed')}
                      >
                        ✅ End
                      </button>
                    )}
                    
                    {competition.status === 'upcoming' && (
                      <button 
                        className={`${styles.actionButton} ${styles.startButton}`}
                        onClick={() => handleStatusChange(competition.id, 'active')}
                      >
                        🚀 Start
                      </button>
                    )}
                    
                    <button 
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteCompetition(competition.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competition Details View */}
      {viewMode === 'details' && selectedCompetition && (
        <div className={styles.detailsSection}>
          <div className={styles.detailsHeader}>
            <button 
              className={styles.backButton}
              onClick={() => setViewMode('list')}
            >
              ← Back to List
            </button>
            
            <h2 className={styles.detailsTitle}>{selectedCompetition.name}</h2>
            
            <div className={styles.detailsActions}>
              <button 
                className={styles.editButton}
                onClick={() => handleEditCompetition(selectedCompetition)}
              >
                ✏️ Edit
              </button>
            </div>
          </div>
          
          <div className={styles.detailsContent}>
            <div className={styles.detailsGrid}>
              <div className={styles.detailsCard}>
                <h3 className={styles.cardTitle}>
                  <span className={styles.cardIcon}>📋</span>
                  Competition Details
                </h3>
                <div className={styles.detailsList}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Status:</span>
                    {getStatusBadge(selectedCompetition.status)}
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Type:</span>
                    {getTypeBadge(selectedCompetition.type)}
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Duration:</span>
                    <span>{selectedCompetition.duration}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Start Date:</span>
                    <span>{formatDate(selectedCompetition.startDate)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>End Date:</span>
                    <span>{formatDate(selectedCompetition.endDate)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Created:</span>
                    <span>{formatDate(selectedCompetition.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.detailsCard}>
                <h3 className={styles.cardTitle}>
                  <span className={styles.cardIcon}>💰</span>
                  Financial Details
                </h3>
                <div className={styles.detailsList}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Starting Balance:</span>
                    <span className={styles.detailValue}>
                      {formatCurrency(selectedCompetition.startingBalance)}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Entry Fee:</span>
                    <span className={styles.detailValue}>
                      {selectedCompetition.entryFee > 0 
                        ? formatCurrency(selectedCompetition.entryFee)
                        : 'Free'}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Prize Pool:</span>
                    <span className={styles.detailValue}>
                      {formatCurrency(selectedCompetition.prizePool)}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Max Participants:</span>
                    <span>{selectedCompetition.maxParticipants}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Current Participants:</span>
                    <span>{selectedCompetition.participants}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.detailsCard}>
                <h3 className={styles.cardTitle}>
                  <span className={styles.cardIcon}>📜</span>
                  Trading Rules
                </h3>
                <div className={styles.rulesList}>
                  <div className={styles.ruleItem}>
                    <span className={styles.ruleIcon}>📊</span>
                    <span>Max Daily Trades: {selectedCompetition.rules.maxDailyTrades}</span>
                  </div>
                  <div className={styles.ruleItem}>
                    <span className={styles.ruleIcon}>⏳</span>
                    <span>Min Holding Period: {selectedCompetition.rules.minHoldingPeriod} days</span>
                  </div>
                  <div className={styles.ruleItem}>
                    <span className={styles.ruleIcon}>🏦</span>
                    <span>Allowed Sectors: {selectedCompetition.rules.allowedSectors.join(', ')}</span>
                  </div>
                  <div className={styles.ruleItem}>
                    <span className={styles.ruleIcon}>📉</span>
                    <span>Short Selling: {selectedCompetition.rules.shortSelling ? 'Allowed' : 'Not Allowed'}</span>
                  </div>
                  <div className={styles.ruleItem}>
                    <span className={styles.ruleIcon}>💳</span>
                    <span>Margin Trading: {selectedCompetition.rules.marginTrading ? 'Allowed' : 'Not Allowed'}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.detailsCard}>
                <h3 className={styles.cardTitle}>
                  <span className={styles.cardIcon}>🎁</span>
                  Prizes
                </h3>
                <div className={styles.prizesList}>
                  {(selectedCompetition.prizes || [
                    { position: 1, prize: 'Champion Trophy' },
                    { position: 2, prize: 'Runner-up Certificate' },
                    { position: 3, prize: 'Consolation Prize' }
                  ]).map((prize, index) => (
                    <div key={index} className={styles.prizeItem}>
                      <div className={styles.prizePosition}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {prize.position}
                      </div>
                      <div className={styles.prizeDescription}>{prize.prize}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard View */}
      {viewMode === 'leaderboard' && selectedCompetition && (
        <div className={styles.leaderboardSection}>
          <div className={styles.leaderboardHeader}>
            <button 
              className={styles.backButton}
              onClick={() => setViewMode('list')}
            >
              ← Back to List
            </button>
            
            <h2 className={styles.leaderboardTitle}>
              🏆 {selectedCompetition.name} - Leaderboard
            </h2>
          </div>
          
          <div className={styles.leaderboardContent}>
            <div className={styles.leaderboardStats}>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Total Participants</div>
                <div className={styles.statValue}>{selectedCompetition.participants}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Prize Pool</div>
                <div className={styles.statValue}>{formatCurrency(selectedCompetition.prizePool)}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Time Remaining</div>
                <div className={styles.statValue}>{selectedCompetition.duration}</div>
              </div>
            </div>
            
            <div className={styles.leaderboardTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableCell}>Rank</div>
                <div className={styles.tableCell}>Participant</div>
                <div className={styles.tableCell}>Portfolio Value</div>
                <div className={styles.tableCell}>Profit/Loss</div>
                <div className={styles.tableCell}>Return %</div>
                <div className={styles.tableCell}>Trades</div>
              </div>
              
              <div className={styles.tableBody}>
                {selectedCompetition.leaderboard && selectedCompetition.leaderboard.length > 0 ? (
                  selectedCompetition.leaderboard.map((player, index) => (
                    <div key={player.rank} className={styles.tableRow}>
                      <div className={styles.tableCell}>
                        <div className={styles.rankCell}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${player.rank}`}
                        </div>
                      </div>
                      <div className={styles.tableCell}>
                        <div className={styles.participantCell}>
                          <div className={styles.participantName}>{player.name}</div>
                          <div className={styles.participantId}>ID: USR{player.rank.toString().padStart(3, '0')}</div>
                        </div>
                      </div>
                      <div className={styles.tableCell}>
                        <div className={styles.portfolioValue}>
                          {formatCurrency(selectedCompetition.startingBalance + player.profit)}
                        </div>
                      </div>
                      <div className={styles.tableCell}>
                        <span className={`${styles.profitBadge} ${player.profit >= 0 ? styles.positive : styles.negative}`}>
                          {player.profit >= 0 ? '↗' : '↘'} {formatCurrency(Math.abs(player.profit))}
                        </span>
                      </div>
                      <div className={styles.tableCell}>
                        <span className={`${styles.returnBadge} ${player.return >= 0 ? styles.positive : styles.negative}`}>
                          {player.return >= 0 ? '+' : ''}{player.return.toFixed(2)}%
                        </span>
                      </div>
                      <div className={styles.tableCell}>
                        <div className={styles.tradesCount}>
                          {Math.floor(Math.random() * 50) + 10}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noData}>
                    <div className={styles.noDataIcon}>📊</div>
                    <h3>No Leaderboard Data</h3>
                    <p>Leaderboard will appear once the competition starts</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompetitionManager;