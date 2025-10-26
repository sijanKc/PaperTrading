import React, { useState } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import styles from './css/Settings.module.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    theme: 'light',
    language: 'english',
    currency: 'npr',
    timezone: 'Asia/Kathmandu',
    notifications: true,
    autoRefresh: true,
    
    // Trading Settings
    defaultOrderType: 'market',
    defaultQuantity: 10,
    confirmOrders: true,
    stopLossDefault: 2,
    takeProfitDefault: 5,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    priceAlerts: true,
    tradeExecutions: true,
    portfolioUpdates: true,
    newsUpdates: false,
    
    // Privacy Settings
    profileVisibility: 'public',
    showPortfolioValue: true,
    showTradingActivity: false,
    dataSharing: true,
    
    // Account Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    exportData: false
  });

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = () => {
    // Simulate API call to save settings
    alert('Settings saved successfully!');
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        theme: 'light',
        language: 'english',
        currency: 'npr',
        timezone: 'Asia/Kathmandu',
        notifications: true,
        autoRefresh: true,
        defaultOrderType: 'market',
        defaultQuantity: 10,
        confirmOrders: true,
        stopLossDefault: 2,
        takeProfitDefault: 5,
        emailNotifications: true,
        pushNotifications: false,
        priceAlerts: true,
        tradeExecutions: true,
        portfolioUpdates: true,
        newsUpdates: false,
        profileVisibility: 'public',
        showPortfolioValue: true,
        showTradingActivity: false,
        dataSharing: true,
        twoFactorAuth: false,
        sessionTimeout: 30,
        exportData: false
      });
      alert('Settings reset to default values!');
    }
  };

  const GeneralSettings = () => (
    <div className={styles.settingsSection}>
      <div className={styles.sectionHeader}>
        <h3>⚙️ General Preferences</h3>
        <p className={styles.sectionDescription}>Customize your overall app experience</p>
      </div>

      <div className={styles.settingsGrid}>
        <div className={styles.settingGroup}>
          <label className={styles.settingLabel}>Theme</label>
          <select 
            value={settings.theme}
            onChange={(e) => handleSettingChange('general', 'theme', e.target.value)}
            className={styles.settingInput}
          >
            <option value="light">🌞 Light Mode</option>
            <option value="dark">🌙 Dark Mode</option>
            <option value="auto">🔄 Auto (System)</option>
          </select>
        </div>

        <div className={styles.settingGroup}>
          <label className={styles.settingLabel}>Language</label>
          <select 
            value={settings.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
            className={styles.settingInput}
          >
            <option value="english">🇺🇸 English</option>
            <option value="nepali">🇳🇵 Nepali</option>
            <option value="hindi">🇮🇳 Hindi</option>
          </select>
        </div>

        <div className={styles.settingGroup}>
          <label className={styles.settingLabel}>Currency</label>
          <select 
            value={settings.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className={styles.settingInput}
          >
            <option value="npr">NPR - Nepalese Rupee</option>
            <option value="usd">USD - US Dollar</option>
            <option value="inr">INR - Indian Rupee</option>
          </select>
        </div>

        <div className={styles.settingGroup}>
          <label className={styles.settingLabel}>Timezone</label>
          <select 
            value={settings.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className={styles.settingInput}
          >
            <option value="Asia/Kathmandu">Kathmandu (GMT+5:45)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">New York (EST)</option>
          </select>
        </div>
      </div>

      <div className={styles.toggleGroup}>
        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Enable Notifications</span>
            <span className={styles.toggleDescription}>Receive alerts and updates</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('general', 'notifications', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Auto Refresh Data</span>
            <span className={styles.toggleDescription}>Automatically update market data</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.autoRefresh}
              onChange={(e) => handleSettingChange('general', 'autoRefresh', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const TradingSettings = () => (
    <div className={styles.settingsSection}>
      <div className={styles.sectionHeader}>
        <h3>💰 Trading Preferences</h3>
        <p className={styles.sectionDescription}>Configure your default trading behavior</p>
      </div>

      <div className={styles.settingsGrid}>
        <div className={styles.settingGroup}>
          <label className={styles.settingLabel}>Default Order Type</label>
          <select 
            value={settings.defaultOrderType}
            onChange={(e) => handleSettingChange('trading', 'defaultOrderType', e.target.value)}
            className={styles.settingInput}
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
            <option value="stop">Stop Order</option>
          </select>
        </div>

        <div className={styles.settingGroup}>
          <label className={styles.settingLabel}>Default Quantity</label>
          <input
            type="number"
            value={settings.defaultQuantity}
            onChange={(e) => handleSettingChange('trading', 'defaultQuantity', parseInt(e.target.value))}
            className={styles.settingInput}
            min="1"
            max="1000"
          />
        </div>

        <div className={styles.settingGroup}>
          <label className={styles.settingLabel}>Default Stop Loss (%)</label>
          <input
            type="number"
            value={settings.stopLossDefault}
            onChange={(e) => handleSettingChange('trading', 'stopLossDefault', parseFloat(e.target.value))}
            className={styles.settingInput}
            min="0.1"
            max="20"
            step="0.1"
          />
        </div>

        <div className={styles.settingGroup}>
          <label className={styles.settingLabel}>Default Take Profit (%)</label>
          <input
            type="number"
            value={settings.takeProfitDefault}
            onChange={(e) => handleSettingChange('trading', 'takeProfitDefault', parseFloat(e.target.value))}
            className={styles.settingInput}
            min="0.1"
            max="50"
            step="0.1"
          />
        </div>
      </div>

      <div className={styles.toggleGroup}>
        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Confirm Orders</span>
            <span className={styles.toggleDescription}>Show confirmation before executing trades</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.confirmOrders}
              onChange={(e) => handleSettingChange('trading', 'confirmOrders', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className={styles.settingsSection}>
      <div className={styles.sectionHeader}>
        <h3>🔔 Notification Settings</h3>
        <p className={styles.sectionDescription}>Manage how and when you receive notifications</p>
      </div>

      <div className={styles.toggleGroup}>
        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Email Notifications</span>
            <span className={styles.toggleDescription}>Receive updates via email</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Push Notifications</span>
            <span className={styles.toggleDescription}>Browser push notifications</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Price Alerts</span>
            <span className={styles.toggleDescription}>Notifications for price movements</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.priceAlerts}
              onChange={(e) => handleSettingChange('notifications', 'priceAlerts', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Trade Executions</span>
            <span className={styles.toggleDescription}>Notifications when trades are executed</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.tradeExecutions}
              onChange={(e) => handleSettingChange('notifications', 'tradeExecutions', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Portfolio Updates</span>
            <span className={styles.toggleDescription}>Daily/weekly portfolio performance</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.portfolioUpdates}
              onChange={(e) => handleSettingChange('notifications', 'portfolioUpdates', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Market News</span>
            <span className={styles.toggleDescription}>Important market news and updates</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.newsUpdates}
              onChange={(e) => handleSettingChange('notifications', 'newsUpdates', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const PrivacySettings = () => (
    <div className={styles.settingsSection}>
      <div className={styles.sectionHeader}>
        <h3>🛡️ Privacy & Security</h3>
        <p className={styles.sectionDescription}>Control your privacy and data sharing preferences</p>
      </div>

      <div className={styles.settingsGrid}>
        <div className={styles.settingGroup}>
          <label className={styles.settingLabel}>Profile Visibility</label>
          <select 
            value={settings.profileVisibility}
            onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
            className={styles.settingInput}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
          </select>
        </div>

        <div className={styles.settingGroup}>
          <label className={styles.settingLabel}>Session Timeout</label>
          <select 
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('privacy', 'sessionTimeout', parseInt(e.target.value))}
            className={styles.settingInput}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </select>
        </div>
      </div>

      <div className={styles.toggleGroup}>
        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Show Portfolio Value</span>
            <span className={styles.toggleDescription}>Display total portfolio value publicly</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.showPortfolioValue}
              onChange={(e) => handleSettingChange('privacy', 'showPortfolioValue', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Show Trading Activity</span>
            <span className={styles.toggleDescription}>Display recent trades publicly</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.showTradingActivity}
              onChange={(e) => handleSettingChange('privacy', 'showTradingActivity', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Data Sharing</span>
            <span className={styles.toggleDescription}>Share anonymous usage data to improve app</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.dataSharing}
              onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Two-Factor Authentication</span>
            <span className={styles.toggleDescription}>Extra security for your account</span>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => handleSettingChange('privacy', 'twoFactorAuth', e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const AccountSettings = () => (
    <div className={styles.settingsSection}>
      <div className={styles.sectionHeader}>
        <h3>👤 Account Management</h3>
        <p className={styles.sectionDescription}>Manage your account and data</p>
      </div>

      <div className={styles.accountActions}>
        <div className={styles.actionCard}>
          <div className={styles.actionIcon}>📥</div>
          <div className={styles.actionInfo}>
            <h4>Export Data</h4>
            <p>Download your trading history and portfolio data</p>
          </div>
          <button className={styles.actionButton}>
            Export Data
          </button>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.actionIcon}>🗑️</div>
          <div className={styles.actionInfo}>
            <h4>Clear Data</h4>
            <p>Delete all your trading history and start fresh</p>
          </div>
          <button className={styles.actionButtonDanger}>
            Clear Data
          </button>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.actionIcon}>🔒</div>
          <div className={styles.actionInfo}>
            <h4>Change Password</h4>
            <p>Update your account password</p>
          </div>
          <button className={styles.actionButton}>
            Change Password
          </button>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.actionIcon}>📧</div>
          <div className={styles.actionInfo}>
            <h4>Email Preferences</h4>
            <p>Manage your email subscription settings</p>
          </div>
          <button className={styles.actionButton}>
            Manage Emails
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      
      <div className={styles.dashboardMain}>
        <Header />
        
        <main className={styles.settingsContainer}>
          {/* Header */}
          <div className={styles.header}>
            <h1>⚙️ Settings</h1>
            <p>Customize your SANCHAYA experience</p>
          </div>

          <div className={styles.settingsLayout}>
            {/* Sidebar Navigation */}
            <div className={styles.settingsSidebar}>
              <div className={styles.sidebarSection}>
                <h3>Preferences</h3>
                <nav className={styles.sidebarNav}>
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`${styles.sidebarButton} ${activeTab === 'general' ? styles.sidebarActive : ''}`}
                  >
                    <span className={styles.navIcon}>⚙️</span>
                    <span className={styles.navLabel}>General</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('trading')}
                    className={`${styles.sidebarButton} ${activeTab === 'trading' ? styles.sidebarActive : ''}`}
                  >
                    <span className={styles.navIcon}>💰</span>
                    <span className={styles.navLabel}>Trading</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`${styles.sidebarButton} ${activeTab === 'notifications' ? styles.sidebarActive : ''}`}
                  >
                    <span className={styles.navIcon}>🔔</span>
                    <span className={styles.navLabel}>Notifications</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`${styles.sidebarButton} ${activeTab === 'privacy' ? styles.sidebarActive : ''}`}
                  >
                    <span className={styles.navIcon}>🛡️</span>
                    <span className={styles.navLabel}>Privacy & Security</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`${styles.sidebarButton} ${activeTab === 'account' ? styles.sidebarActive : ''}`}
                  >
                    <span className={styles.navIcon}>👤</span>
                    <span className={styles.navLabel}>Account</span>
                  </button>
                </nav>
              </div>

              <div className={styles.sidebarActions}>
                <button className={styles.saveButton} onClick={saveSettings}>
                  💾 Save Changes
                </button>
                <button className={styles.resetButton} onClick={resetSettings}>
                  🔄 Reset to Default
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className={styles.settingsContent}>
              {activeTab === 'general' && <GeneralSettings />}
              {activeTab === 'trading' && <TradingSettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'privacy' && <PrivacySettings />}
              {activeTab === 'account' && <AccountSettings />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;