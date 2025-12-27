import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import UserModal from './UserModal';
import styles from '../../admincss/UserList.module.css';

const UserList = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // Default to 'all', but can set to 'pending' for focus
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt'); // Match backend default
  const [sortOrder, setSortOrder] = useState('desc'); // Match backend default
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1); // From backend pagination
  const [totalCount, setTotalCount] = useState(0);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Stats state - Now fetched from backend
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0, // New for pending approvals
    suspended: 0,
    banned: 0,
    premium: 0,
    admins: 0
  });

  // Selected users for bulk actions
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch users from backend (server-side filtering/pagination/sorting)
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', currentPage);
      params.append('limit', itemsPerPage);
      
      const response = await fetch(`http://localhost:5000/api/admin/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('UserList API Response:', data); // Debug log
      
      if (data.success) {
        setUsers(data.data.users || []);
        setTotalPages(data.data.pagination?.pages || 1);
        setTotalCount(data.data.pagination?.total || 0);
        // No need for client-side filtering anymore - backend handles it
      } else {
        console.error('Failed to fetch users:', data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch admin stats separately
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats({
          total: data.stats.users.total || 0,
          active: data.stats.users.active || 0,
          pending: data.stats.users.pending || 0, // New from backend
          suspended: 0, // Can derive or fetch separately if needed
          banned: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Trigger fetch on changes (server-side)
  useEffect(() => {
    fetchUsers();
    fetchStats(); // Fetch stats independently
  }, [searchTerm, statusFilter, roleFilter, sortBy, sortOrder, currentPage, itemsPerPage]);

  // User selection (for current page only)
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
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

  const handleSaveUser = async (userData) => {
    // Implement API call to save/update user if needed
    console.log('Save user:', userData); // Placeholder - add PUT /api/admin/users/:id
    setIsModalOpen(false);
    fetchUsers(); // Refresh after save
  };

  // New: Handle approve/reject individual user
  const handleApproveUser = async (userId, approve = true) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approve })
      });
      const data = await response.json();
      if (data.success) {
        alert(approve ? 'User approved! They can now access the dashboard.' : 'User rejected/unapproved.');
        fetchUsers(); // Refresh list
        fetchStats(); // Refresh stats
      } else {
        alert('Failed to update approval status.');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Error updating user approval.');
    }
  };

  const handleSuspendUser = (userId) => {
    if (window.confirm('Suspend this user?')) {
      // Implement API call to /api/admin/users/:id/status {status: 'suspended'}
      console.log('Suspend user:', userId); // Placeholder
      fetchUsers();
    }
  };

  const handleBanUser = (userId) => {
    if (window.confirm('Ban this user permanently?')) {
      // Implement API call to /api/admin/users/:id/status {status: 'banned'}
      console.log('Ban user:', userId); // Placeholder
      fetchUsers();
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Delete this user account? This action cannot be undone.')) {
      // Implement DELETE /api/admin/users/:id
      console.log('Delete user:', userId); // Placeholder
      fetchUsers();
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  // Bulk actions - Updated to include approve
  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }

    const confirmMessage = {
      approve: `Approve ${selectedUsers.length} selected user(s)? They will gain dashboard access.`,
      reject: `Reject ${selectedUsers.length} selected user(s)? They will remain pending.`,
      suspend: `Suspend ${selectedUsers.length} selected user(s)?`,
      ban: `Ban ${selectedUsers.length} selected user(s) permanently?`,
      delete: `Delete ${selectedUsers.length} selected user(s)? This cannot be undone.`,
      activate: `Activate ${selectedUsers.length} selected user(s)?`
    };

    if (window.confirm(confirmMessage[action])) {
      // For approve/reject, loop over selected and call API
      if (action === 'approve' || action === 'reject') {
        const approve = action === 'approve';
        for (const userId of selectedUsers) {
          await handleApproveUser(userId, approve);
        }
      } else {
        // Other actions: Implement bulk API if available, else loop
        console.log(`Bulk ${action}:`, selectedUsers); // Placeholder
      }
      setSelectedUsers([]);
      fetchUsers();
      fetchStats();
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

  // Pagination handlers (server-side)
  const handlePageChange = (page) => {
    setCurrentPage(page);
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

      {/* Stats Cards - Updated to include pending */}
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
          
          <div className={`${styles.statCard} ${styles.pending}`}> {/* New */}
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.pending}</div>
              <div className={styles.statLabel}>Pending</div>
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

        {/* Filters - Updated to include 'pending' */}
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Approval</option> {/* New */}
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
              <option value="createdAt">Join Date</option> {/* Match backend */}
              <option value="name">Name</option>
              <option value="portfolioValue">Portfolio Value</option>
              <option value="totalTrades">Total Trades</option>
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

        {/* Bulk Actions - Updated to include approve/reject */}
        <div className={styles.bulkActionsContainer}>
          <div className={styles.bulkSelection}>
            <input
              type="checkbox"
              checked={selectedUsers.length > 0 && selectedUsers.length === users.length}
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
              onClick={() => handleBulkAction('approve')}
              disabled={selectedUsers.length === 0}
            >
              Approve
            </button>
            <button
              className={`${styles.bulkButton} ${styles.warning}`}
              onClick={() => handleBulkAction('reject')}
              disabled={selectedUsers.length === 0}
            >
              Reject
            </button>
            <button
              className={styles.bulkButton}
              onClick={() => handleBulkAction('activate')}
              disabled={selectedUsers.length === 0}
            >
              Activate
            </button>
            <button
              className={styles.bulkButton}
              onClick={() => handleBulkAction('suspend')}
              disabled={selectedUsers.length === 0}
            >
              Suspend
            </button>
            <button
              className={styles.bulkButton}
              onClick={() => handleBulkAction('ban')}
              disabled={selectedUsers.length === 0}
            >
              Ban
            </button>
            <button
              className={`${styles.bulkButton} ${styles.danger}`}
              onClick={() => handleBulkAction('delete')}
              disabled={selectedUsers.length === 0}
            >
              Delete
            </button>
            <button
              className={`${styles.bulkButton} ${styles.success}`}
              onClick={handleExportData}
            >
              Export
            </button>
          </div>
        </div>

      </div>

      {/* Users Grid/List */}
      <div className={styles.usersContainer}>
        {users.length === 0 ? (
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
                setCurrentPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.usersGrid}>
            {users.map(user => (
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
                  onApprove={(userId) => handleApproveUser(userId, true)}
                  onReject={(userId) => handleApproveUser(userId, false)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination - Server-side */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} users
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
                    onClick={() => handlePageChange(pageNum)}
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
                      onClick={() => handlePageChange(totalPages)}
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