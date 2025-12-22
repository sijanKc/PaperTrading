import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;

  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error('Error parsing user data', e);
  }

  // ADD DEBUG LOGS
  useEffect(() => {
    console.log('AdminRoute Debug:', {
      hasToken: !!token,
      user: user,
      userRole: user?.role,
      isAdmin: user?.role === 'admin',
      currentPath: location.pathname
    });
  }, [location]);

  // Check if authenticated
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check if admin
  if (user?.role !== 'admin') {
    console.log('User is not admin, role is:', user?.role);
    console.log('Redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('User is admin, allowing access');
  return children;
};

export default AdminRoute;