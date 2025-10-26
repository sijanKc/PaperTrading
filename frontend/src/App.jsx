import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Contact from "./pages/Contact";
import Started from "./pages/Started";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard"; 
import Portfolio from "./pages/dashboard/Portfolio";
import StrategyTester from "./pages/dashboard/StrategyTester";
import TradingJournal from "./pages/dashboard/TradingJournal";
import Leaderboard from "./pages/dashboard/Leaderboard";
import Transactions from "./pages/dashboard/Transactions";
import Trade from "./pages/dashboard/Trade";
import Analytics from "./pages/dashboard/Analytics";
import Feedback from "./pages/dashboard/Feedback";
import HelpAndSupport from "./pages/dashboard/HelpAndSupport";
import Settings from "./pages/dashboard/Settings";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/started" element={<Started />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/strategytester" element={<StrategyTester />} />
        <Route path="/journal" element={<TradingJournal />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/help" element={<HelpAndSupport />} />
        <Route path="/settings" element={<Settings />} />

        {/* Optional: 404 Page */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;