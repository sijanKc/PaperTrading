import React, { useState } from 'react';
import api from '../../services/api';
import styles from '../../pages/dashboard/css/InvestmentAdvisor.module.css';

const InvestmentAdvisor = () => {
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState(null);
    const [error, setError] = useState(null);

    const handleOptimize = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/analytics/recommendations');
            if (response.data.success) {
                setRecommendation(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch recommendations:', err);
            setError('Could not process optimization. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val) => {
        return `Rs. ${Number(val).toLocaleString('en-NP', { minimumFractionDigits: 2 })}`;
    };

    return (
        <div className={styles.advisorContainer}>
            <div className={styles.advisorHeader}>
                <div className={styles.headerInfo}>
                    <h2>🧠 AI Portfolio Optimizer (Knapsack DP)</h2>
                    <p>Mathematically optimize your portfolio to maximize predicted returns within your budget.</p>
                </div>
                <button 
                    className={styles.optimizeBtn}
                    onClick={handleOptimize}
                    disabled={loading}
                >
                    {loading ? 'Analyzing...' : '🚀 Optimize My Portfolio'}
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {loading && (
                <div className={styles.loader}>
                    <p>Running Dynamic Programming simulations...</p>
                </div>
            )}

            {!loading && recommendation && (
                <div className={styles.resultsGrid}>
                    <div className={styles.portfolioList}>
                        <h3>✅ Recommended Stock Allocation</h3>
                        <table className={styles.stocksTable}>
                            <thead>
                                <tr>
                                    <th>Stock</th>
                                    <th>Current Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recommendation.recommendedPortfolio.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <span className={styles.stockSymbol}>{item.symbol}</span>
                                            <span className={styles.stockName}>{item.name}</span>
                                        </td>
                                        <td>{formatCurrency(item.price)}</td>
                                        <td>
                                            <span className={styles.qtyBadge}>{item.quantity} Units</span>
                                        </td>
                                        <td>{formatCurrency(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                                {recommendation.recommendedPortfolio.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No profitable combination found within budget.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Total Investment</span>
                            <span className={styles.summaryValue}>{formatCurrency(recommendation.budgetUsed)}</span>
                        </div>
                        
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Profit Potential (Score)</span>
                            <span className={`${styles.summaryValue} ${styles.profitValue}`}>
                                +{recommendation.optimizedReturnScore}%
                            </span>
                        </div>

                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Budget Utilization</span>
                            <span className={styles.summaryValue}>
                                {((recommendation.budgetUsed / recommendation.budget) * 100).toFixed(2)}%
                            </span>
                        </div>

                        <div className={styles.algobadge}>
                            <strong>Algorithm Info:</strong><br />
                            This recommendation uses the **Unbounded Knapsack Algorithm** (Dynamic Programming). 
                            Complexity: O(W × N).
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentAdvisor;
