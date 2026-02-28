import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Routes>
        <Route path="/*" element={<AppRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
// server username and password
// sailesh@gmail.com
// 123456

export default App;

