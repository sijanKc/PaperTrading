import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import api from '../../services/api';
import styles from './css/HealthCheck.module.css';

const HealthCheck = () => {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [endpoints, setEndpoints] = useState([
        { name: 'Root API', path: '/', status: 'pending', method: 'GET' },
        { name: 'Health Check', path: '/health', status: 'pending', method: 'GET' },
        { name: 'Market Stats', path: '/market/stats', status: 'pending', method: 'GET' },
        { name: 'Stocks List', path: '/stocks', status: 'pending', method: 'GET' },
        { name: 'Docs', path: '/docs', status: 'pending', method: 'GET' }
    ]);

    const checkSystemHealth = async () => {
        setLoading(true);
        try {
            const response = await api.get('/health');
            setHealth(response.data);
            
            // Check individual endpoints
            const updatedEndpoints = await Promise.all(endpoints.map(async (ep) => {
                try {
                    await api.get(ep.path);
                    return { ...ep, status: 'ok' };
                } catch (err) {
                    return { ...ep, status: 'error' };
                }
            }));
            setEndpoints(updatedEndpoints);
        } catch (error) {
            console.error('Health check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkSystemHealth();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'ok': return styles.statusOk;
            case 'error': return styles.statusError;
            default: return styles.statusPending;
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <Sidebar />
            <div className={styles.dashboardMain}>
                <Header />
                <main className={styles.healthContainer}>
                    <div className={styles.header}>
                        <h1>🛡️ System Health & Diagnostics</h1>
                        <p>Verify backend connectivity and system status.</p>
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.card}>
                            <h3>🔌 Integration Status</h3>
                            <div className={styles.statusItem}>
                                <span className={styles.label}>Backend Status</span>
                                <span className={`${styles.value} ${health ? styles.statusOk : styles.statusError}`}>
                                    {health ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </div>
                            <div className={styles.statusItem}>
                                <span className={styles.label}>Database</span>
                                <span className={`${styles.value} ${health?.database === 'Connected' ? styles.statusOk : styles.statusError}`}>
                                    {health?.database || 'Unknown'}
                                </span>
                            </div>
                            <div className={styles.statusItem}>
                                <span className={styles.label}>Environment</span>
                                <span className={styles.value}>Development</span>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h3>⏱️ Performance</h3>
                            <div className={styles.statusItem}>
                                <span className={styles.label}>Server Uptime</span>
                                <span className={styles.value}>
                                    {health ? `${(health.uptime / 3600).toFixed(2)} hours` : 'N/A'}
                                </span>
                            </div>
                            <div className={styles.statusItem}>
                                <span className={styles.label}>Latent Check</span>
                                <span className={styles.value}>{new Date().toLocaleTimeString()}</span>
                            </div>
                            <button 
                                className={styles.refreshButton} 
                                onClick={checkSystemHealth}
                                disabled={loading}
                            >
                                {loading ? 'Checking...' : '🔄 Run Diagnostics'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3>🛣️ API Endpoint Status</h3>
                        <div className={styles.endpointList}>
                            {endpoints.map((ep) => (
                                <div key={ep.name} className={styles.endpointItem}>
                                    <div className={styles.endpointInfo}>
                                        <span className={styles.method}>{ep.method}</span>
                                        <span className={styles.url}>{ep.path}</span>
                                        <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{ep.name}</span>
                                    </div>
                                    <div className={`${styles.value} ${getStatusClass(ep.status)}`}>
                                        {ep.status.toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HealthCheck;
