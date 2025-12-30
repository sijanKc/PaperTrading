import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Contact from "./pages/Contact";
import Started from "./pages/Started";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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
import Profile from "./pages/dashboard/Profile";
import Competitions from "./pages/dashboard/Competitions";
import HealthCheck from "./pages/dashboard/HealthCheck";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/admin/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/darkmode-fixes.css";



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
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard Routes - Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/strategytester" element={<ProtectedRoute><StrategyTester /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><TradingJournal /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/trade" element={<ProtectedRoute><Trade /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><HelpAndSupport /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/competitions" element={<ProtectedRoute><Competitions /></ProtectedRoute>} />
        <Route path="/health-check" element={<ProtectedRoute><HealthCheck /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        {/* Optional: 404 Page */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;