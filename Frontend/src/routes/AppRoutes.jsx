import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import HomePage from '../pages/HomePage';
import StudentLoginPage from '../pages/auth/StudentLoginPage';
import StudentRegisterPage from '../pages/auth/StudentRegisterPage';
import CompanyLoginPage from '../pages/auth/CompanyLoginPage';
import CompanyRegisterPage from '../pages/auth/CompanyRegisterPage';
import StudentDashboardPage from '../pages/dashboard/StudentDashboardPage';
import CompanyDashboardPage from '../pages/dashboard/CompanyDashboardPage';
import JobsListPage from '../pages/jobs/JobsListPage';
import JobDetailPage from '../pages/jobs/JobDetailPage';
import ApplicationsPage from '../pages/jobs/ApplicationsPage';
import CompaniesListPage from '../pages/companies/CompaniesListPage';
import CompanyDetailPage from '../pages/companies/CompanyDetailPage';
import CompanyProfilePage from '../pages/companies/CompanyProfilePage';
import StudentsListPage from '../pages/students/StudentsListPage';
import StudentDetailPage from '../pages/students/StudentDetailPage';
import StudentProfilePage from '../pages/students/StudentProfilePage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<StudentLoginPage />} />
        <Route path="/auth/register" element={<StudentRegisterPage />} />
        <Route path="/auth/company/login" element={<CompanyLoginPage />} />
        <Route path="/auth/company/register" element={<CompanyRegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={['student']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/student/applications" element={<ApplicationsPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['company']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
          <Route path="/company/profile" element={<CompanyProfilePage />} />
        </Route>
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/jobs" element={<JobsListPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/companies" element={<CompaniesListPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
        <Route path="/students" element={<StudentsListPage />} />
        <Route path="/students/:id" element={<StudentDetailPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

