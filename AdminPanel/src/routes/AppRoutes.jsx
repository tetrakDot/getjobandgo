import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Companies from '../pages/Companies';
import Jobs from '../pages/Jobs';
import Applications from '../pages/Applications';
import Students from '../pages/Students';
import Settings from '../pages/Settings';
import ActivityLogs from '../pages/ActivityLogs';
import Evaluations from '../pages/Evaluations';
import HelpRequests from '../pages/HelpRequests';
import CareerWall from '../pages/CareerWall';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="companies" element={<Companies />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="applications" element={<Applications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="evaluator" element={<Evaluations />} />
        <Route path="activities" element={<ActivityLogs />} />
        <Route path="help" element={<HelpRequests />} />
        <Route path="career-wall" element={<CareerWall />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
