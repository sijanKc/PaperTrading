import React, { useState } from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import styles from './css/HelpAndSupport.module.css';

const HelpAndSupport = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  // FAQ Data
  const faqCategories = [
    {
      id: 'getting-started',
      name: '🚀 Getting Started',
      icon: '🚀',
      questions: [
        {
          id: 1,
          question: 'How do I start paper trading?',
          answer: 'To start paper trading, simply navigate to the Trade section and select any stock. You\'ll start with virtual Nrs. 1,00,000 to practice trading without any real money involved.'
        },
        {
          id: 2,
          question: 'Is SANCHAYA free to use?',
          answer: 'Yes! SANCHAYA is completely free for paper trading and learning. We believe in making stock market education accessible to everyone in Nepal.'
        },
        {
          id: 3,
          question: 'Do I need a demat account?',
          answer: 'No demat account is required for paper trading. SANCHAYA is a simulation platform designed for learning and practice.'
        }
      ]
    },
    {
      id: 'trading',
      name: '💰 Trading',
      icon: '💰',
      questions: [
        {
          id: 4,
          question: 'How do I buy and sell stocks?',
          answer: 'Go to the Trade section, select a stock symbol, enter the quantity, and click "Buy" or "Sell". You can use market orders for immediate execution or limit orders for specific prices.'
        },
        {
          id: 5,
          question: 'What trading strategies can I practice?',
          answer: 'You can practice various strategies including day trading, swing trading, value investing, and technical analysis using our analytics tools.'
        },
        {
          id: 6,
          question: 'Are the stock prices real-time?',
          answer: 'Yes, we use real NEPSE data with a slight delay to simulate realistic market conditions for practice.'
        }
      ]
    },
    {
      id: 'portfolio',
      name: '💼 Portfolio',
      icon: '💼',
      questions: [
        {
          id: 7,
          question: 'How is my portfolio performance calculated?',
          answer: 'Portfolio performance is calculated based on your buy/sell transactions, current market prices, and includes metrics like total return, daily P&L, and percentage gains.'
        },
        {
          id: 8,
          question: 'Can I reset my portfolio?',
          answer: 'Yes, you can reset your portfolio from the sidebar "Quick Actions" section. This will clear all your trades and restart with Nrs. 1,00,000.'
        }
      ]
    },
    {
      id: 'technical',
      name: '🔧 Technical',
      icon: '🔧',
      questions: [
        {
          id: 9,
          question: 'The website is not loading properly. What should I do?',
          answer: 'Try clearing your browser cache and cookies, or use a different browser. If the issue persists, contact our support team.'
        },
        {
          id: 10,
          question: 'Is there a mobile app available?',
          answer: 'Currently, SANCHAYA is web-based and works great on mobile browsers. We\'re working on native mobile apps for iOS and Android.'
        }
      ]
    }
  ];

  // Contact options
  const contactOptions = [
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      action: 'mailto:support@sanchaya.com',
      buttonText: 'Send Email'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: '#chat',
      buttonText: 'Start Chat',
      available: true
    },
    {
      icon: '📞',
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      action: 'tel:+977-1-4000000',
      buttonText: 'Call Now'
    },
    {
      icon: '🆘',
      title: 'Emergency Support',
      description: 'Critical issues requiring immediate attention',
      action: '#emergency',
      buttonText: 'Get Help',
      emergency: true
    }
  ];

  // Video tutorials
  const videoTutorials = [
    {
      title: 'Getting Started Guide',
      duration: '5:30',
      thumbnail: '🎬',
      description: 'Learn how to navigate SANCHAYA and make your first trade'
    },
    {
      title: 'Portfolio Management',
      duration: '8:15',
      thumbnail: '📊',
      description: 'How to track and analyze your portfolio performance'
    },
    {
      title: 'Technical Analysis',
      duration: '12:45',
      thumbnail: '📈',
      description: 'Using charts and indicators for better trading decisions'
    },
    {
      title: 'Risk Management',
      duration: '7:20',
      thumbnail: '🛡️',
      description: 'Learn proper risk management techniques'
    }
  ];

  const toggleFaq = (faqId) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const FAQSection = () => (
    <div className={styles.faqSection}>
      <div className={styles.sectionHeader}>
        <h3>❓ Frequently Asked Questions</h3>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {filteredFaqs.length === 0 ? (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🔍</div>
          <h4>No results found</h4>
          <p>Try searching with different keywords or browse the categories below</p>
        </div>
      ) : (
        <div className={styles.faqCategories}>
          {filteredFaqs.map(category => (
            <div key={category.id} className={styles.faqCategory}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryIcon}>{category.icon}</span>
                <h4 className={styles.categoryName}>{category.name}</h4>
              </div>
              
              <div className={styles.faqList}>
                {category.questions.map(faq => (
                  <div key={faq.id} className={styles.faqItem}>
                    <button
                      className={`${styles.faqQuestion} ${openFaq === faq.id ? styles.faqOpen : ''}`}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span className={styles.questionText}>{faq.question}</span>
                      <span className={styles.faqToggle}>
                        {openFaq === faq.id ? '−' : '+'}
                      </span>
                    </button>
                    
                    {openFaq === faq.id && (
                      <div className={styles.faqAnswer}>
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ContactSection = () => (
    <div className={styles.contactSection}>
      <div className={styles.sectionHeader}>
        <h3>📞 Contact Support</h3>
        <p className={styles.sectionSubtitle}>We're here to help you succeed in your trading journey</p>
      </div>

      <div className={styles.contactGrid}>
        {contactOptions.map((option, index) => (
          <div key={index} className={`${styles.contactCard} ${option.emergency ? styles.emergencyCard : ''}`}>
            <div className={styles.contactIcon}>{option.icon}</div>
            <div className={styles.contactInfo}>
              <h4>{option.title}</h4>
              <p>{option.description}</p>
            </div>
            <button 
              className={`${styles.contactButton} ${option.emergency ? styles.emergencyButton : ''}`}
              onClick={() => option.action.startsWith('#') ? alert('Feature coming soon!') : window.open(option.action, '_blank')}
            >
              {option.buttonText}
            </button>
            {option.available && <div className={styles.availableBadge}>Available</div>}
          </div>
        ))}
      </div>

      <div className={styles.supportHours}>
        <h4>🕒 Support Hours</h4>
        <div className={styles.hoursGrid}>
          <div className={styles.hourSlot}>
            <span className={styles.day}>Sunday - Thursday</span>
            <span className={styles.time}>9:00 AM - 6:00 PM</span>
          </div>
          <div className={styles.hourSlot}>
            <span className={styles.day}>Friday</span>
            <span className={styles.time}>9:00 AM - 3:00 PM</span>
          </div>
          <div className={styles.hourSlot}>
            <span className={styles.day}>Emergency Support</span>
            <span className={styles.time}>24/7</span>
          </div>
        </div>
      </div>
    </div>
  );

  const TutorialsSection = () => (
    <div className={styles.tutorialsSection}>
      <div className={styles.sectionHeader}>
        <h3>🎬 Video Tutorials</h3>
        <p className={styles.sectionSubtitle}>Learn SANCHAYA through step-by-step video guides</p>
      </div>

      <div className={styles.tutorialsGrid}>
        {videoTutorials.map((tutorial, index) => (
          <div key={index} className={styles.tutorialCard}>
            <div className={styles.tutorialThumbnail}>
              <span className={styles.thumbnailIcon}>{tutorial.thumbnail}</span>
              <div className={styles.videoDuration}>{tutorial.duration}</div>
              <div className={styles.playButton}>▶</div>
            </div>
            <div className={styles.tutorialInfo}>
              <h4>{tutorial.title}</h4>
              <p>{tutorial.description}</p>
              <button className={styles.watchButton}>
                Watch Tutorial
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.learningPath}>
        <h4>📚 Learning Path</h4>
        <div className={styles.pathSteps}>
          <div className={styles.pathStep}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h5>Basic Navigation</h5>
              <p>Learn the interface and basic features</p>
            </div>
          </div>
          <div className={styles.pathStep}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h5>First Trade</h5>
              <p>Execute your first buy and sell orders</p>
            </div>
          </div>
          <div className={styles.pathStep}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h5>Portfolio Management</h5>
              <p>Track performance and analyze results</p>
            </div>
          </div>
          <div className={styles.pathStep}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h5>Advanced Strategies</h5>
              <p>Learn technical analysis and risk management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CommunitySection = () => (
    <div className={styles.communitySection}>
      <div className={styles.sectionHeader}>
        <h3>👥 Community Support</h3>
        <p className={styles.sectionSubtitle}>Connect with other traders and learn together</p>
      </div>

      <div className={styles.communityGrid}>
        <div className={styles.communityCard}>
          <div className={styles.communityIcon}>💬</div>
          <h4>Trader's Forum</h4>
          <p>Discuss strategies, ask questions, and share experiences with fellow traders</p>
          <button className={styles.communityButton}>Join Discussion</button>
        </div>

        <div className={styles.communityCard}>
          <div className={styles.communityIcon}>📱</div>
          <h4>Telegram Group</h4>
          <p>Real-time chat with active traders and market discussions</p>
          <button className={styles.communityButton}>Join Group</button>
        </div>

        <div className={styles.communityCard}>
          <div className={styles.communityIcon}>🎯</div>
          <h4>Mentorship Program</h4>
          <p>Get personalized guidance from experienced traders</p>
          <button className={styles.communityButton}>Find Mentor</button>
        </div>

        <div className={styles.communityCard}>
          <div className={styles.communityIcon}>📅</div>
          <h4>Weekly Webinars</h4>
          <p>Live sessions with market experts and Q&A opportunities</p>
          <button className={styles.communityButton}>View Schedule</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      
      <div className={styles.dashboardMain}>
        <Header />
        
        <main className={styles.helpContainer}>
          {/* Header */}
          <div className={styles.header}>
            <h1>🆘 Help & Support</h1>
            <p>Get help, learn, and connect with our support resources</p>
          </div>

          {/* Quick Help Cards */}
          <div className={styles.quickHelp}>
            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>❓</div>
              <h3>FAQs</h3>
              <p>Find answers to common questions</p>
            </div>
            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>📞</div>
              <h3>Contact</h3>
              <p>Get in touch with our team</p>
            </div>
            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>🎬</div>
              <h3>Tutorials</h3>
              <p>Watch learning videos</p>
            </div>
            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>👥</div>
              <h3>Community</h3>
              <p>Connect with other traders</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabsNav}>
              <button
                onClick={() => setActiveTab('faq')}
                className={`${styles.tabButton} ${activeTab === 'faq' ? styles.tabActive : ''}`}
              >
                ❓ FAQs
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`${styles.tabButton} ${activeTab === 'contact' ? styles.tabActive : ''}`}
              >
                📞 Contact
              </button>
              <button
                onClick={() => setActiveTab('tutorials')}
                className={`${styles.tabButton} ${activeTab === 'tutorials' ? styles.tabActive : ''}`}
              >
                🎬 Tutorials
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`${styles.tabButton} ${activeTab === 'community' ? styles.tabActive : ''}`}
              >
                👥 Community
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === 'faq' && <FAQSection />}
              {activeTab === 'contact' && <ContactSection />}
              {activeTab === 'tutorials' && <TutorialsSection />}
              {activeTab === 'community' && <CommunitySection />}
            </div>
          </div>

          {/* Emergency Banner */}
          <div className={styles.emergencyBanner}>
            <div className={styles.emergencyContent}>
              <div className={styles.emergencyIcon}>🚨</div>
              <div className={styles.emergencyText}>
                <h4>Emergency Support</h4>
                <p>Critical issue requiring immediate attention? Contact emergency support</p>
              </div>
            </div>
            <button className={styles.emergencyButton}>
              Get Emergency Help
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HelpAndSupport;