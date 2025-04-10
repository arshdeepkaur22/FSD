import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heart, Star, MessageCircle, Eye, Calendar, Code, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const UserSubmissions = () => {
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [analyticsView, setAnalyticsView] = useState("overview"); // "overview", "detailed"
  
  const filters = ["All", "Most Liked", "Highest Rated", "Most Recent"];

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    const fetchUserProjects = async () => {
      setLoading(true);
      try {
        if (!token) {
          console.error("User not logged in");
          setLoading(false);
          return;
        }

        // Get projects submitted by the current user
        const res = await axios.get(
          `http://localhost:5000/api/projects/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        let projectsData = res.data.projects;
        
        // Apply filters
        if (activeFilter === "Most Liked") {
          projectsData = projectsData.sort((a, b) => b.likes - a.likes);
        } else if (activeFilter === "Highest Rated") {
          projectsData = projectsData.sort((a, b) => b.averageRating - a.averageRating);
        } else if (activeFilter === "Most Recent") {
          projectsData = projectsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching user projects", error);
      }
      setLoading(false);
    };
    
    fetchUserProjects();
  }, [activeFilter]);

  // Calculate analytics
  const totalProjects = projects.length;
  const totalLikes = projects.reduce((sum, project) => sum + (project.likes || 0), 0);
  const avgRating = projects.length 
    ? (projects.reduce((sum, project) => sum + (project.averageRating || 0), 0) / projects.length).toFixed(1)
    : 0;
  
  // Get project category distribution
  const categoryStats = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1;
    return acc;
  }, {});

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render rating stars
  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
      {/* Navbar - Same as Home component */}
      <nav className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold tracking-tight text-purple-400">
              Projecthub
            </div>
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-4 text-gray-300 hover:*:text-white">
                <Link to="/submissions" className="text-purple-400 transition">
                  Your Submissions
                </Link>
                <Link to="/" className="hover:text-purple-400 transition">
                  Projects
                </Link>
                <Link to="/leaderboard" className="hover:text-purple-400 transition">
                  Leaderboard
                </Link>
              </nav>

              {userData && (
                <span className="text-gray-300">Hi, {userData.username}</span>
              )}

              <Link to="/submit">
                <button className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full font-semibold transition transform active:scale-95">
                  Submit Project
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-300 mb-2">Your Project Submissions</h1>
            <p className="text-gray-400">
              Track performance and analytics for all your submitted projects
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setAnalyticsView("overview")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                analyticsView === "overview" 
                  ? "bg-purple-600 text-white" 
                  : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setAnalyticsView("detailed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                analyticsView === "detailed" 
                  ? "bg-purple-600 text-white" 
                  : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
              }`}
            >
              Detailed Analytics
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="bg-[#1E1E1E] rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-purple-300">Project Analytics</h2>
          
          {analyticsView === "overview" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#2A2A2A] rounded-xl p-4">
                <h3 className="text-gray-400 text-sm mb-1">Total Projects</h3>
                <p className="text-3xl font-bold text-white">{totalProjects}</p>
              </div>
              <div className="bg-[#2A2A2A] rounded-xl p-4">
                <h3 className="text-gray-400 text-sm mb-1">Total Likes</h3>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-white">{totalLikes}</p>
                  <Heart className="ml-2 text-red-500" size={20} />
                </div>
              </div>
              <div className="bg-[#2A2A2A] rounded-xl p-4">
                <h3 className="text-gray-400 text-sm mb-1">Average Rating</h3>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-white">{avgRating}</p>
                  <Star className="ml-2 text-yellow-400 fill-yellow-400" size={20} />
                </div>
              </div>
              <div className="bg-[#2A2A2A] rounded-xl p-4">
                <h3 className="text-gray-400 text-sm mb-1">Project Categories</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(categoryStats).map(([category, count]) => (
                    <span key={category} className="bg-[#1E1E1E] px-2 py-1 rounded-md text-xs">
                      {category}: {count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-400 text-sm border-b border-gray-700">
                  <tr>
                    <th className="pb-3">Project</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Likes</th>
                    <th className="pb-3">Rating</th>
                    <th className="pb-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {projects.map((project) => (
                    <tr key={project._id}>
                      <td className="py-3">{project.title}</td>
                      <td className="py-3">{project.category}</td>
                      <td className="py-3">{project.likes || 0}</td>
                      <td className="py-3">{project.averageRating.toFixed(1)}</td>
                      <td className="py-3">{formatDate(project.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-start space-x-4 mb-8 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-purple-600 text-white"
                  : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">You haven't submitted any projects yet.</p>
            <Link to="/submit">
              <button className="mt-4 bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full font-semibold transition">
                Submit Your First Project
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="relative">
                  <img
                    src={`http://localhost:5000${project.image}`}
                    alt={project.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/50 px-3 py-1 rounded-full text-xs">
                    {project.category}
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-purple-300">
                      {project.title}
                    </h2>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Code size={16} className="mr-1" />
                    <span>{project.techStack}</span>
                  </div>
                  
                  {/* Metrics Row */}
                  <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-800">
                    {/* Rating */}
                    <div className="flex items-center mr-4 mb-2">
                      {renderRatingStars(project.averageRating)}
                      <span className="ml-2 text-sm text-gray-400">
                        ({project.ratings?.length || 0} reviews)
                      </span>
                    </div>
                    
                    {/* Likes */}
                    <div className="flex items-center mr-4 mb-2">
                      <Heart
                        size={18}
                        className={`${
                          project.likedByUser ? "text-red-500 fill-red-500" : "text-gray-400"
                        }`}
                      />
                      <span className="ml-1 text-gray-400">
                        {project.likes || 0}
                      </span>
                    </div>
                    
                    {/* Date */}
                    <div className="flex items-center mb-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="ml-1 text-sm text-gray-500">
                        {formatDate(project.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex mt-4">
                    <Link 
                      to={`/project/${project._id}`}
                      className="flex-1 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-center py-2 rounded-l-lg text-sm font-medium transition"
                    >
                      <Eye size={16} className="inline mr-2" />
                      View Details
                    </Link>
                    <Link 
                      to={`/project/${project._id}/edit`}
                      className="flex-1 bg-purple-700 hover:bg-purple-800 text-center py-2 rounded-r-lg text-sm font-medium transition"
                    >
                      Edit Project
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSubmissions;