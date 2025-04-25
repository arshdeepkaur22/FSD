import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProjectSubmission from "./pages/ProjectSubmission";
import Dashboard from "./pages/Teachers/Dashboard";
import Leaderboard from "./pages/Teachers/Leaderboard";
import FeedbackModal from "./pages/Teachers/FeedbackModal";
import CollaborationDetail from "./pages/CollaborationDetail";
import CollaborationHub from "./pages/CollaborationHub";
import Project from "./pages/Project";
import UserSubmissions from "./pages/UserSubmissions";
import Mentorship from "./pages/Mentorship";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ProjectModeration from "./pages/admin/ProjectModeration";
import ContentOrganization from "./pages/admin/ContentOrganisation";
import AdminLeaderboard from "./pages/admin/LeaderBoard";
import Notifications from "./pages/admin/Notifications";
import Reports from "./pages/admin/Reports";
import SdgTracking from "./pages/admin/SDGTracking";
import ManagementDashboard from "./pages/management/ManagementDashboard";

// Protected Route component for authenticated routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Teacher Route component for teacher-only routes
const TeacherRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  // Check user role from stored user data
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const isTeacher = userData.role === "teacher";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isTeacher) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Student Route component for student-only routes
const StudentRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  // Check user role from stored user data
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const isStudent = userData.role === "student";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isStudent) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// const AdminRoute = ({ children }) => {
//   const isAuthenticated = localStorage.getItem("token") !== null;

//   const userData = JSON.parse(localStorage.getItem("user") || "{}");
//   const isAdmin = userData.role === "admin";

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!isAdmin) {
//     return <Navigate to="/" replace />; // Or show "Unauthorized" page
//   }

//   return children;
// };

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<Project />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/mentorship" element={<Mentorship />} />

        {/* Protected Routes (require authentication) */}
        <Route
          path="/projectSubmission"
          element={
            <ProtectedRoute>
              <ProjectSubmission />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collaborations/:id"
          element={
            <ProtectedRoute>
              <CollaborationDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collaborationHub"
          element={
            <ProtectedRoute>
              <CollaborationHub />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mysubmissions"
          element={
            <ProtectedRoute>
              <UserSubmissions />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/dashboard"
          element={
            <TeacherRoute>
              <Dashboard />
            </TeacherRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <TeacherRoute>
              <FeedbackModal />
            </TeacherRoute>
          }
        />

        {/* <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <AdminRoute>
              <ProjectModeration />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <AdminRoute>
              <ContentOrganization />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/leaderboard"
          element={
            <AdminRoute>
              <AdminLeaderboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <AdminRoute>
              <Notifications />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/sdg-tracking"
          element={
            <AdminRoute>
              <SdgTracking />
            </AdminRoute>
          }
        />
       
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <AdminRoute>
              <ProjectModeration />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <AdminRoute>
              <ContentOrganization />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/leaderboard"
          element={
            <AdminRoute>
              <AdminLeaderboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <AdminRoute>
              <Notifications />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/sdg-tracking"
          element={
            <AdminRoute>
              <SdgTracking />
            </AdminRoute>
          }
        /> */}

        {/* <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <AdminRoute>
              <ProjectModeration />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <AdminRoute>
              <ContentOrganization />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/leaderboard"
          element={
            <AdminRoute>
              <AdminLeaderboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <AdminRoute>
              <Notifications />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/sdg-tracking"
          element={
            <AdminRoute>
              <SdgTracking />
            </AdminRoute>
          }
        /> */}

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/projects" element={<ProjectModeration />} />
        <Route path="/admin/content" element={<ContentOrganization />} />
        <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/sdg-tracking" element={<SdgTracking />} />
        <Route path="/management" element={<ManagementDashboard />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
