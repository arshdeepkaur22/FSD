import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

import AdminDashboard from "./pages/admind/admindashboard";
import ManagementDashboard from "./pages/management/ManagementDashboard";

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
       
        

        
        <Route path="/management" element={<AdminDashboard />} />
        <Route path="/admin" element={<ManagementDashboard />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
