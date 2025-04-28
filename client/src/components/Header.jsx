import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Check if user is logged in (ensure it's a proper token, not null or undefined)
  const isLoggedIn = !!token;

  // Get user data from localStorage only if logged in
  const userData = isLoggedIn
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : {};
  const userRole = isLoggedIn
    ? userData.role || localStorage.getItem("userRole")
    : null;

  // Determine user type (only if logged in)
  const isStudent = isLoggedIn && userRole === "student";
  const isTeacher = isLoggedIn && userRole === "teacher";

  // Clear all user data and navigate to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Add search functionality here
    console.log("Searching for:", searchTerm);

    // Navigate to search results page (if implemented)
    // navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              ProjectNest
            </span>
            {isTeacher && (
              <span className="bg-purple-700 text-white text-xs px-2 py-1 rounded-full">
                Teacher
              </span>
            )}
            {isStudent && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                Student
              </span>
            )}
          </Link>

          <div className="flex items-center space-x-6">
            {/* Search Bar */}

            {/* Navigation Links - Conditional based on user role */}
            <nav className="flex space-x-4 text-gray-300">
              {/* Common links for all users */}
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>

              {isLoggedIn ? (
                <>
                  {/* Links for all authenticated users */}
                  <Link
                    to="/leaderboard"
                    className="hover:text-white transition"
                  >
                    Leaderboard
                  </Link>

                  {isStudent && (
                    <Link
                      to="/collaborationHub"
                      className="hover:text-white transition"
                    >
                      Collaborations
                    </Link>
                  )}

                  <Link
                    to="/mentorship"
                    className="hover:text-white transition"
                  >
                    Mentorships
                  </Link>

                  {/* Student-specific links */}
                  {isStudent && (
                    <Link
                      to="/mysubmissions"
                      className="hover:text-white transition"
                    >
                      My Projects
                    </Link>
                  )}

                  {/* Teacher-specific links */}
                  {isTeacher && (
                    <Link
                      to="/dashboard"
                      className="hover:text-white transition"
                    >
                      Dashboard
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="hover:text-white transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Links for non-logged in users (viewers) */}
                  <Link to="/login" className="hover:text-white transition">
                    Login
                  </Link>
                  <Link to="/register" className="hover:text-white transition">
                    Register
                  </Link>
                </>
              )}
            </nav>

            {/* Action Buttons - Conditional based on user role */}
            <div className="flex space-x-3">
              {/* Student-specific action button - shown only if logged in and is a student */}
              {isLoggedIn && isStudent && (
                <Link
                  to="/projectSubmission"
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full font-semibold transition transform active:scale-95"
                >
                  Submit Project
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
