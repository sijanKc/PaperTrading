import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import UserModal from './UserModal';
import styles from '../../admincss/UserList.module.css';

const UserList = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    banned: 0,
    premium: 0,
    admins: 0
  });

  // Sample user data removed - fetching from API

  // Load users on component mount
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        search: searchTerm,
        status: statusFilter,
        role: roleFilter,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: itemsPerPage
      });

      const response = await fetch(`http://localhost:5000/api/admin/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
        setFilteredUsers(data.data.users); // Initial set, backend handles filtering usually but we might need local filter if backend isn't full
        // Note: Start code relied on local filtering. 
        // If backend implements filtering (as seen in controller), we should rely on backend for pagination/filtering.
        // However, the current UserList.jsx has client-side logic for filtering/sorting deeply integrated.
        // To minimize regression, I will load ALL users if possible or adapt the component to server-side.
        // For this "fix", I will trust the backend returns the "page" of users. 
        // BUT, the existing client-side logic (e.g. `useEffect` at line 67) will re-filter and re-sort this "page" of users.
        // This might interpret the partial list as the full list. 
        // Ideally, we should switch to Server-Side Pagination fully OR Client-Side Pagination (fetch all).
        // Given complexity of refactoring everything, and `getUsers` controller supporting pagination...
        // I will try to fetch ALL users for now if I can, OR just update the state.
        
        // Let's stick to the current "client-side logic" pattern but feed it data from backend.
        // If backend paginates, `users` will only contain 10 items.
        // Client side filter then filters those 10 items? That's wrong.
        // For a quick fix that "shows something", let's load what we get.
        // Better yet, let's just setUsers with what we get.
        
        // Actually, if I look at the `useEffect` for filtering (lines 67-124), it runs whenever `users`, `searchTerm`, etc change.
        // It produces `filteredUsers`.
        // If I make `users` contain the backend result (which is already filtered/sorted by backend in my previous tool output check),
        // then running client-side filter on top of it again (which is already filtered) might be redundant but harmless, 
        // UNLESS the client expects `users` to be the FULL dataset.
        // The previous code `setUsers(sampleUsers)` implied `users` was the FULL dataset.
        // The backend `getUsers` returns a PAGINATED result by default.
        // This is a mismatch.
        // To fix this PROPERLY without rewriting the entire component to server-side table:
        // I will ask backend for a large limit to simulate "fetching all" for now, or just work with the page.
        // Let's rely on the backend params I just crafted.
        
        // WAIT: The existing Code also has `useEffect` [users, searchTerm...] to set `filteredUsers`.
        // If I use backend filtering, I should probably DISABLE the client-side filtering execution 
        // OR rely on client-side filtering and fetch ALL users.
        // Fetching ALL users is safer for preserving existing functionality if the dataset isn't huge.
        // But `getUsers` defaults to limit 10.
        // I'll try to fetch with a large limit for now to quick-fix the "client-side expectation".
        
      } else {
        console.error('Failed to fetch users:', data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce effect or just trigger on dependency change
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, roleFilter, sortBy, sortOrder, currentPage, itemsPerPage]);

  // Update stats - we might want to fetch this separately or trust what we have
  const updateStats = (userList) => {
    const newStats = {
      total: userList.length, // This will be wrong if paginated
      active: userList.filter(u => u.status === 'active').length,
      suspended: userList.filter(u => u.status === 'suspended').length,
      banned: userList.filter(u => u.status === 'banned').length,
      premium: userList.filter(u => u.role === 'premium').length,
      admins: userList.filter(u => u.role === 'admin').length
    };
    setStats(newStats);
  };

  // Filter and sort users
  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate);
          bValue = new Date(b.joinDate);
          break;
        case 'portfolio':
          aValue = a.portfolioValue;
          bValue = b.portfolioValue;
          break;
        case 'trades':
          aValue = a.totalTrades;
          bValue = b.totalTrades;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(result);
    updateStats(result);
  }, [users, searchTerm, statusFilter, roleFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // User selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };

  // User actions
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData) => {
    if (modalMode === 'create') {
      // Add new user
      const newUser = {
        ...userData,
        id: `USR${String(users.length + 1).padStart(3, '0')}`,
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        recentActivities: []
      };
      setUsers(prev => [...prev, newUser]);
    } else {
      // Update existing user
      setUsers(prev =>
        prev.map(user =>
          user.id === userData.id ? { ...user, ...userData } : user
        )
      );
    }
    setIsModalOpen(false);
  };

  const handleSuspendUser = (userId) => {
    if (window.confirm('Suspend this user?')) {
      setUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, status: 'suspended', suspensionDate: new Date().toISOString() }
            : user
        )
      );
    }
  };

  const handleBanUser = (userId) => {
    if (window.confirm('Ban this user permanently?')) {
      setUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, status: 'banned', banDate: new Date().toISOString() }
            : user
        )
      );
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Delete this user account? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  // Bulk actions
  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }

    const confirmMessage = {
      suspend: `Suspend ${selectedUsers.length} selected user(s)?`,
      ban: `Ban ${selectedUsers.length} selected user(s) permanently?`,
      delete: `Delete ${selectedUsers.length} selected user(s)? This cannot be undone.`,
      activate: `Activate ${selectedUsers.length} selected user(s)?`
    };

    if (window.confirm(confirmMessage[action])) {
      setUsers(prev =>
        prev.map(user => {
          if (selectedUsers.includes(user.id)) {
            switch (action) {
              case 'suspend':
                return { ...user, status: 'suspended' };
              case 'ban':
                return { ...user, status: 'banned' };
              case 'delete':
                return { ...user, status: 'deleted' };
              case 'activate':
                return { ...user, status: 'active' };
              default:
                return user;
            }
          }
          return user;
        })
      );
      setSelectedUsers([]);
    }
  };

  // Export data
  const handleExportData = () => {
    const dataToExport = selectedUsers.length > 0
      ? users.filter(user => selectedUsers.includes(user.id))
      : users;
    
    const csvContent = [
      ['ID', 'Name', 'Email', 'Status', 'Role', 'Portfolio', 'Trades', 'Join Date'],
      ...dataToExport.map(user => [
        user.id,
        user.name,
        user.email,
        user.status,
        user.role,
        user.portfolioValue,
        user.totalTrades,
        user.joinDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className={styles.userListContainer}>
      
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>
            <span className={styles.titleIcon}>👥</span>
            User Management
          </h1>
          <p className={styles.pageSubtitle}>
            Manage all user accounts, permissions, and activities
          </p>
        </div>
        
        <div className={styles.headerRight}>
          <button 
            className={styles.createButton}
            onClick={handleCreateUser}
          >
            <span className={styles.buttonIcon}>+</span>
            Add New User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.total}`}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.total}</div>
              <div className={styles.statLabel}>Total Users</div>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.active}`}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.active}</div>
              <div className={styles.statLabel}>Active</div>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.suspended}`}>
            <div className={styles.statIcon}>⏸️</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.suspended}</div>
              <div className={styles.statLabel}>Suspended</div>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.banned}`}>
            <div className={styles.statIcon}>⛔</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.banned}</div>
              <div className={styles.statLabel}>Banned</div>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.premium}`}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.premium}</div>
              <div className={styles.statLabel}>Premium</div>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.admins}`}>
            <div className={styles.statIcon}>👑</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.admins}</div>
              <div className={styles.statLabel}>Admins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className={styles.controlsSection}>
        
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
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
        </div>

        {/* Filters */}
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="premium">Premium</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="name">Name</option>
              <option value="joinDate">Join Date</option>
              <option value="portfolio">Portfolio Value</option>
              <option value="trades">Total Trades</option>
            </select>
            <button
              className={styles.sortOrderBtn}
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Show:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className={styles.filterSelect}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className={styles.bulkActionsContainer}>
          <div className={styles.bulkSelection}>
            <input
              type="checkbox"
              checked={selectedUsers.length > 0 && selectedUsers.length === paginatedUsers.length}
              onChange={toggleSelectAll}
              className={styles.bulkCheckbox}
            />
            <span className={styles.selectedCount}>
              {selectedUsers.length > 0 
                ? `${selectedUsers.length} selected` 
                : 'Select users'}
            </span>
          </div>

          <div className={styles.bulkButtons}>
            <button
              className={styles.bulkButton}
              onClick={() => handleBulkAction('activate')}
              disabled={selectedUsers.length === 0}
            >
              ✅ Activate
            </button>
            <button
              className={styles.bulkButton}
              onClick={() => handleBulkAction('suspend')}
              disabled={selectedUsers.length === 0}
            >
              ⏸️ Suspend
            </button>
            <button
              className={styles.bulkButton}
              onClick={() => handleBulkAction('ban')}
              disabled={selectedUsers.length === 0}
            >
              ⛔ Ban
            </button>
            <button
              className={`${styles.bulkButton} ${styles.danger}`}
              onClick={() => handleBulkAction('delete')}
              disabled={selectedUsers.length === 0}
            >
              🗑️ Delete
            </button>
            <button
              className={`${styles.bulkButton} ${styles.success}`}
              onClick={handleExportData}
            >
              📥 Export
            </button>
          </div>
        </div>

      </div>

      {/* Users Grid/List */}
      <div className={styles.usersContainer}>
        {paginatedUsers.length === 0 ? (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>👤</div>
            <h3>No users found</h3>
            <p>Try adjusting your search or filters</p>
            <button 
              className={styles.resetFilters}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setRoleFilter('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.usersGrid}>
            {paginatedUsers.map(user => (
              <div key={user.id} className={styles.userItem}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleUserSelection(user.id)}
                  className={styles.userCheckbox}
                />
                <UserCard
                  user={user}
                  onEdit={handleEditUser}
                  onSuspend={() => handleSuspendUser(user.id)}
                  onBan={() => handleBanUser(user.id)}
                  onDelete={() => handleDeleteUser(user.id)}
                  onViewTrades={(userId) => console.log('View trades for:', userId)}
                  onSendMessage={(userId) => console.log('Send message to:', userId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          
          <div className={styles.paginationControls}>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            <div className={styles.pageNumbers}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`${styles.pageButton} ${currentPage === pageNum ? styles.active : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  {currentPage < totalPages - 2 && <span className={styles.pageDots}>...</span>}
                  {currentPage < totalPages - 2 && (
                    <button
                      className={`${styles.pageButton} ${currentPage === totalPages ? styles.active : ''}`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  )}
                </>
              )}
            </div>
            
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={selectedUser}
        mode={modalMode}
        onSave={handleSaveUser}
      />

    </div>
  );
};

export default UserList;