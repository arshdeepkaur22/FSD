import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('token') !== null;
  
  // Get user role (student or teacher)
  const userRole = localStorage.getItem('userRole');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    navigate('/login');
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Add search functionality here
    console.log('Searching for:', searchTerm);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold tracking-tight text-purple-400">
            Projecthub
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search Projects"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#2C2C2C] text-white pl-10 pr-4 py-2 rounded-full w-72 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                />
                <svg 
                  className="absolute left-3 top-3 w-5 h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </form>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex space-x-4 text-gray-300 hover:*:text-white">
              {isLoggedIn ? (
                <>
                  {/* Common links for logged in users */}
                  <Link to="/" className="hover:text-purple-400 transition">
                    Home
                  </Link>
                  <Link to="/collaborationHub" className="hover:text-purple-400 transition">
                    Collaborations
                  </Link>
                  <Link to="/leaderboard" className="hover:text-purple-400 transition">
                    Leaderboard
                  </Link>
                  <Link to="/mysubmissions" className="hover:text-purple-400 transition">
                    My Submissions
                  </Link>
                  
                  {/* Student-specific links */}
                  {userRole === 'student' && (
                    <Link to="/projectSubmission" className="hover:text-purple-400 transition">
                      My Submissions
                    </Link>
                  )}
                  
                  {/* Teacher-specific links */}
                  {userRole === 'teacher' && (
                    <>
                      <Link to="/dashboard" className="hover:text-purple-400 transition">
                        Dashboard
                      </Link>
                      <Link to="/students" className="hover:text-purple-400 transition">
                        Students
                      </Link>
                    </>
                  )}
                  
                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout}
                    className="hover:text-purple-400 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Links for non-logged in users */}
                  <Link to="/" className="hover:text-purple-400 transition">
                    Home
                  </Link>
                  <Link to="/login" className="hover:text-purple-400 transition">
                    Login
                  </Link>
                  <Link to="/register" className="hover:text-purple-400 transition">
                    Register
                  </Link>
                </>
              )}
            </nav>
            
            {/* Submit Project Button - only show if logged in */}
            {isLoggedIn && (
              <Link 
                to="/projectSubmission" 
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full font-semibold transition transform active:scale-95"
              >
                Submit Project
              </Link>
            )}


            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;