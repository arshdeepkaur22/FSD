import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProjectSubmission from "./pages/ProjectSubmission";

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
      </Routes>
    </Router>
  );
};

export default App;
