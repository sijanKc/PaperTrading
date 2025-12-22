import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from '../../admincss/AdminLayout.module.css'; // UNCOMMENT THIS LINE

const AdminLayout = ({ children, activeTab, onTabChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`${styles.adminLayout} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarCollapsed}`}>
      
      {/* Use Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className={styles.adminMain}>
        
        {/* Use Header Component */}
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeTab={activeTab}
        />

        {/* Content Area */}
        <div className={styles.adminContent}>
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;