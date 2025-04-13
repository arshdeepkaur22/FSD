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
import Students from "./pages/Teachers/Students";
import FeedbackModal from "./pages/Teachers/FeedbackModal";
import CollaborationDetail from "./pages/CollaborationDetail";
import CollaborationHub from "./pages/CollaborationHub";
import Project from "./pages/Project"; // Assuming you have or will create this page
import UserSubmissions from "./pages/UserSubmissions";
import ProjectCard from "./pages/ProjectCard";

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
  const isTeacher = localStorage.getItem("userRole") === "teacher";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isTeacher) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<Project />} />

        {/* Protected Routes (need authentication) */}
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
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mysubmissions"
          element={
            <ProtectedRoute>
              <UserSubmissions></UserSubmissions>
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
          path="/students"
          element={
            <TeacherRoute>
              <Students />
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

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
