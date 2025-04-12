import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProjectSubmission from "./pages/ProjectSubmission";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Students from "./pages/students";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/projectSubmission"
          element={<ProjectSubmission />}
        ></Route>
        <Route
          path="/Dashboard"
          element={<Dashboard />}
        ></Route>
        <Route path="/leaderboard" element={<Leaderboard />}></Route>
        <Route path="/students" element={<Students />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
