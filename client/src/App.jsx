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
import managementDashboard from "./pages/management/ManagementDashboard";

import AdminDashboard from "./pages/admind/admindashboard";
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

        
        <Route path="/management" element={<AdminDashboard />} />
        <Route path="/admin" element={<ManagementDashboard />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
