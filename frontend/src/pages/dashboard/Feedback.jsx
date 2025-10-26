import React, { useState } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import styles from './css/Feedback.module.css';

const Feedback = () => {
  const [activeTab, setActiveTab] = useState('give');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState({
    type: 'suggestion',
    title: '',
    description: '',
    email: ''
  });

  // Mock feedback data
  const feedbackHistory = [
    {
      id: 1,
      type: 'suggestion',
      title: 'Add more technical indicators',
      description: 'Would be great to have RSI, MACD, and Bollinger Bands in the analytics section.',
      status: 'under_review',
      date: '2024-01-15',
      response: 'Thank you for your suggestion! We are working on adding more technical indicators in the next update.'
    },
    {
      id: 2,
      type: 'bug',
      title: 'Chart not updating in real-time',
      description: 'The price charts sometimes freeze and require page refresh to update.',
      status: 'resolved',
      date: '2024-01-10',
      response: 'This issue has been fixed in the latest update. Please clear your cache if you still experience this.'
    },
    {
      id: 3,
      type: 'feature',
      title: 'Dark mode toggle',
      description: 'Please add a dark/light mode toggle in the settings.',
      status: 'implemented',
      date: '2024-01-05',
      response: 'Dark mode has been implemented! You can now toggle between themes in the header.'
    }
  ];

  const handleInputChange = (field, value) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    
    if (!feedback.title || !feedback.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate API call
    alert('Thank you for your feedback! We will review it shortly.');
    
    // Reset form
    setFeedback({
      type: 'suggestion',
      title: '',
      description: '',
      email: ''
    });
    setRating(0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'under_review': return { class: styles.statusReview, text: 'Under Review' };
      case 'resolved': return { class: styles.statusResolved, text: 'Resolved' };
      case 'implemented': return { class: styles.statusImplemented, text: 'Implemented' };
      default: return { class: styles.statusReview, text: 'Under Review' };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'suggestion': return '💡';
      case 'bug': return '🐛';
      case 'feature': return '🚀';
      case 'complaint': return '😞';
      default: return '📝';
    }
  };

  const FeedbackForm = () => (
    <div className={styles.feedbackForm}>
      <h3>Share Your Feedback</h3>
      <p className={styles.formSubtitle}>Help us improve SANCHAYA with your suggestions</p>

      <form onSubmit={handleSubmitFeedback}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Feedback Type</label>
            <select 
              value={feedback.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className={styles.formInput}
            >
              <option value="suggestion">💡 Suggestion</option>
              <option value="bug">🐛 Bug Report</option>
              <option value="feature">🚀 Feature Request</option>
              <option value="complaint">😞 Complaint</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Overall Rating</label>
            <div className={styles.ratingSection}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.star} ${star <= rating ? styles.starActive : ''}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </button>
              ))}
              <span className={styles.ratingText}>
                {rating === 0 ? 'Select rating' : `${rating}/5 stars`}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Title *</label>
          <input
            type="text"
            value={feedback.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Brief description of your feedback"
            className={styles.formInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description *</label>
          <textarea
            value={feedback.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Please provide detailed feedback..."
            rows="5"
            className={styles.formTextarea}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email (Optional)</label>
          <input
            type="email"
            value={feedback.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email if you'd like a response"
            className={styles.formInput}
          />
        </div>

        <div className={styles.formActions}>
          <button type="reset" className={styles.cancelButton}>
            Clear Form
          </button>
          <button type="submit" className={styles.submitButton}>
            📨 Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );

  const FeedbackHistory = () => (
    <div className={styles.feedbackHistory}>
      <h3>Your Feedback History</h3>
      <p className={styles.historySubtitle}>Track the status of your previous feedback submissions</p>

      <div className={styles.feedbackList}>
        {feedbackHistory.map((item) => {
          const status = getStatusBadge(item.status);
          
          return (
            <div key={item.id} className={styles.feedbackItem}>
              <div className={styles.feedbackHeader}>
                <div className={styles.feedbackType}>
                  <span className={styles.typeIcon}>{getTypeIcon(item.type)}</span>
                  <span className={styles.typeText}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </div>
                <div className={`${styles.statusBadge} ${status.class}`}>
                  {status.text}
                </div>
              </div>

              <div className={styles.feedbackContent}>
                <h4 className={styles.feedbackTitle}>{item.title}</h4>
                <p className={styles.feedbackDescription}>{item.description}</p>
                <div className={styles.feedbackDate}>
                  Submitted on {new Date(item.date).toLocaleDateString('en-NP')}
                </div>
              </div>

              {item.response && (
                <div className={styles.responseSection}>
                  <div className={styles.responseHeader}>
                    <span className={styles.responseIcon}>💬</span>
                    <span className={styles.responseTitle}>Developer Response</span>
                  </div>
                  <div className={styles.responseText}>{item.response}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {feedbackHistory.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <h4>No Feedback Yet</h4>
          <p>Your feedback submissions will appear here</p>
        </div>
      )}
    </div>
  );

  const CommunityIdeas = () => (
    <div className={styles.communitySection}>
      <h3>💡 Popular Community Requests</h3>
      <div className={styles.ideasGrid}>
        <div className={styles.ideaCard}>
          <div className={styles.ideaHeader}>
            <span className={styles.ideaIcon}>📱</span>
            <span className={styles.voteCount}>42 votes</span>
          </div>
          <h4>Mobile App</h4>
          <p>Native mobile application for iOS and Android</p>
          <button className={styles.voteButton}>+1 Vote</button>
        </div>

        <div className={styles.ideaCard}>
          <div className={styles.ideaHeader}>
            <span className={styles.ideaIcon}>🤖</span>
            <span className={styles.voteCount}>38 votes</span>
          </div>
          <h4>AI Trading Assistant</h4>
          <p>AI-powered trading suggestions and market analysis</p>
          <button className={styles.voteButton}>+1 Vote</button>
        </div>

        <div className={styles.ideaCard}>
          <div className={styles.ideaHeader}>
            <span className={styles.ideaIcon}>📊</span>
            <span className={styles.voteCount}>35 votes</span>
          </div>
          <h4>Advanced Charts</h4>
          <p>More chart types and technical analysis tools</p>
          <button className={styles.voteButton}>+1 Vote</button>
        </div>

        <div className={styles.ideaCard}>
          <div className={styles.ideaHeader}>
            <span className={styles.ideaIcon}>🌍</span>
            <span className={styles.voteCount}>28 votes</span>
          </div>
          <h4>International Markets</h4>
          <p>Support for international stock markets</p>
          <button className={styles.voteButton}>+1 Vote</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      
      <div className={styles.dashboardMain}>
        <Header />
        
        <main className={styles.feedbackContainer}>
          {/* Header */}
          <div className={styles.header}>
            <h1>💬 Feedback & Suggestions</h1>
            <p>Help us improve SANCHAYA by sharing your thoughts and ideas</p>
          </div>

          {/* Tabs Navigation */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabsNav}>
              <button
                onClick={() => setActiveTab('give')}
                className={`${styles.tabButton} ${activeTab === 'give' ? styles.tabActive : ''}`}
              >
                📝 Give Feedback
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`${styles.tabButton} ${activeTab === 'history' ? styles.tabActive : ''}`}
              >
                📋 My Feedback
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`${styles.tabButton} ${activeTab === 'community' ? styles.tabActive : ''}`}
              >
                💡 Community Ideas
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === 'give' && (
                <div className={styles.giveTab}>
                  <div className={styles.tabColumns}>
                    <div className={styles.mainColumn}>
                      <FeedbackForm />
                    </div>
                    <div className={styles.sidebarColumn}>
                      <div className={styles.tipsCard}>
                        <h4>💡 Tips for Good Feedback</h4>
                        <ul className={styles.tipsList}>
                          <li>Be specific and detailed</li>
                          <li>Include steps to reproduce bugs</li>
                          <li>Suggest solutions if possible</li>
                          <li>Be constructive and respectful</li>
                        </ul>
                      </div>

                      <div className={styles.statsCard}>
                        <h4>📊 Feedback Stats</h4>
                        <div className={styles.statsGrid}>
                          <div className={styles.stat}>
                            <span className={styles.statNumber}>24</span>
                            <span className={styles.statLabel}>Suggestions Implemented</span>
                          </div>
                          <div className={styles.stat}>
                            <span className={styles.statNumber}>48h</span>
                            <span className={styles.statLabel}>Avg. Response Time</span>
                          </div>
                          <div className={styles.stat}>
                            <span className={styles.statNumber}>89%</span>
                            <span className={styles.statLabel}>User Satisfaction</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className={styles.historyTab}>
                  <FeedbackHistory />
                </div>
              )}

              {activeTab === 'community' && (
                <div className={styles.communityTab}>
                  <CommunityIdeas />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Feedback;