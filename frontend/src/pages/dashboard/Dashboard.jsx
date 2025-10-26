// pages/dashboard/Dashboard.jsx
import React from 'react';
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import OverviewCards from "../../components/dashboard/OverviewCards";
import MarketList from "../../components/dashboard/MarketList";
import PortfolioPreview from "../../components/dashboard/PortfolioPreview";
import TradeShortcut from "../../components/dashboard/TradeShortcut";
import ChartWidget from "../../components/dashboard/ChartWidget";
import NewsFeed from "../../components/dashboard/NewsFeed";
import FooterDashboard from "../../components/dashboard/FooterDashboard";
import PaperTradingStats from "../../components/dashboard/PaperTradingStats";

const Dashboard = () => {
  return (
    <div className="dashboard-container bg-gray-50 min-h-screen flex">
      <Sidebar />
      
      <div className="dashboard-main flex-1 flex flex-col ml-64">
        <Header />
        
        <main className="dashboard-content flex-1 p-6 space-y-6">
          {/* Section 1: Overview Cards & Paper Trading */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <OverviewCards />
            </div>
            <div className="lg:col-span-1">
              <PaperTradingStats />
            </div>
          </section>

          {/* Section 2: Chart & Quick Trade */}
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <ChartWidget />
            </div>
            <div className="lg:col-span-1">
              <TradeShortcut />
            </div>
          </section>

          {/* Section 3: Portfolio & Market Data */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PortfolioPreview />
            <MarketList />
          </section>

          {/* Section 4: News Feed */}
          <section>
            <NewsFeed />
          </section>
        </main>

        <FooterDashboard />
      </div>
    </div>
  );
};

export default Dashboard;