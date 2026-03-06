import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiClient } from './services/apiClient';

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Log platform visit
    apiClient.post('/auth/log_visit/', { path: location.pathname })
      .catch((err) => console.error("Could not log visit", err));
  }, [location]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <PageTracker />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <AppRoutes />
    </AuthProvider>
  );
}
// server username and password
// sailesh@gmail.com
// 123456

export default App;

