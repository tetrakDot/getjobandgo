import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import HomePage from "../pages/HomePage";
import StudentLoginPage from "../pages/auth/StudentLoginPage";
import StudentRegisterPage from "../pages/auth/StudentRegisterPage";
import CompanyLoginPage from "../pages/auth/CompanyLoginPage";
import CompanyRegisterPage from "../pages/auth/CompanyRegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyOTPPage from "../pages/auth/VerifyOTPPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import StudentDashboardPage from "../pages/dashboard/StudentDashboardPage";
import CompanyDashboardPage from "../pages/dashboard/CompanyDashboardPage";
import JobsListPage from "../pages/jobs/JobsListPage";
import JobDetailPage from "../pages/jobs/JobDetailPage";
import ApplicationsPage from "../pages/jobs/ApplicationsPage";
import CompaniesListPage from "../pages/companies/CompaniesListPage";
import CompanyDetailPage from "../pages/companies/CompanyDetailPage";
import CompanyProfilePage from "../pages/companies/CompanyProfilePage";
import StudentsListPage from "../pages/students/StudentsListPage";
import StudentDetailPage from "../pages/students/StudentDetailPage";
import StudentProfilePage from "../pages/students/StudentProfilePage";
import AiResumeEvaluator from "../pages/AiResumeEvaluator";
import PremiumPage from "../pages/PremiumPage";
import NotFoundPage from "../pages/NotFoundPage";
import AboutPage from "../pages/AboutPage";
import NeedHelpPage from "../pages/NeedHelpPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing (No Sidebar) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/help" element={<NeedHelpPage />} />

      {/* Auth Routes (No Sidebar) */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<StudentLoginPage />} />
        <Route path="/auth/register" element={<StudentRegisterPage />} />
        <Route path="/auth/company/login" element={<CompanyLoginPage />} />
        <Route path="/auth/company/register" element={<CompanyRegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Pages with Global Navigation (Sidebar + Topbar) */}
      <Route element={<DashboardLayout />}>
        {/* Public Browse Pages */}
        <Route path="/2ex" element={<AiResumeEvaluator />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/jobs" element={<JobsListPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/companies" element={<CompaniesListPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
        <Route path="/students" element={<StudentsListPage />} />
        <Route path="/students/:id" element={<StudentDetailPage />} />

        {/* Student Protected */}
        <Route element={<ProtectedRoute roles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/student/applications" element={<ApplicationsPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
        </Route>

        {/* Company Protected */}
        <Route element={<ProtectedRoute roles={["company"]} />}>
          <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
          <Route path="/company/profile" element={<CompanyProfilePage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
