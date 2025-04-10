import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Heart, Star, ArrowUp, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [sortBy, setSortBy] = useState("likes");
  const [orderBy, setOrderBy] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    fetchLeaderboardData();
  }, [sortBy, orderBy]);

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/projects?sortBy=${sortBy}&orderBy=${orderBy}&limit=20`
      );
      setProjects(res.data.projects);
    } catch (error) {
      console.error("Error fetching leaderboard data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle ordering if clicking the same field
      setOrderBy(orderBy === "desc" ? "asc" : "desc");
    } else {
      // Default to descending order when changing sort field
      setSortBy(field);
      setOrderBy("desc");
    }
  };

  // Helper function to get medal icon for top 3 positions
  const getMedalIcon = (index) => {
    if (index === 0) return <Trophy size={24} className="text-yellow-400" />;
    if (index === 1) return <Trophy size={24} className="text-gray-400" />;
    if (index === 2) return <Trophy size={24} className="text-amber-700" />;
    return <span className="text-gray-500 text-lg font-bold">{index + 1}</span>;
  };

  // Sort icon helper
  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return orderBy === "desc" ? (
      <ArrowDown size={16} className="ml-1" />
    ) : (
      <ArrowUp size={16} className="ml-1" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold tracking-tight text-purple-400">
              Projecthub
            </div>
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-4 text-gray-300 hover:*:text-white">
                <Link to="/submissions" className="hover:text-purple-400 transition">
                  Your Submissions
                </Link>
                <Link to="/" className="hover:text-purple-400 transition">
                  Projects
                </Link>
                <Link to="/leaderboard" className="hover:text-purple-400 transition text-purple-400">
                  Leaderboard
                </Link>
              </nav>

              {userData && (
                <span className="text-gray-300">Hi, {userData.username}</span>
              )}

              <Link to="/submit" className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full font-semibold transition transform active:scale-95">
                Submit Project
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Leaderboard Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-300 mb-4">Project Leaderboard</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the highest ranked and most popular projects on Projecthub. Sort by likes, ratings, or newest additions.
          </p>
        </div>

        {/* Sorting Options */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => handleSort("likes")}
              className={`flex items-center px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                sortBy === "likes" ? "bg-purple-600 text-white" : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
              }`}
            >
              <Heart size={16} className="mr-2" />
              Most Liked
              {getSortIcon("likes")}
            </button>
            <button
              onClick={() => handleSort("averageRating")}
              className={`flex items-center px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                sortBy === "averageRating" ? "bg-purple-600 text-white" : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
              }`}
            >
              <Star size={16} className="mr-2" />
              Top Rated
              {getSortIcon("averageRating")}
            </button>
            <button
              onClick={() => handleSort("createdAt")}
              className={`flex items-center px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                sortBy === "createdAt" ? "bg-purple-600 text-white" : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
              }`}
            >
              Newest
              {getSortIcon("createdAt")}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project, index) => (
              <Link
                to={`/project/${project._id}`}
                key={project._id}
                className="block bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-purple-900/30 hover:translate-x-1"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Rank and Image */}
                  <div className="relative md:w-1/4">
                    <img
                      src={`http://localhost:5000${project.image}`}
                      alt="Project"
                      className="w-full h-36 md:h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-black/70 p-2 flex items-center justify-center">
                      {getMedalIcon(index)}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/50 px-3 py-1 rounded-full text-xs">
                      {project.category}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-purple-300">
                        {project.title}
                      </h2>
                      <p className="text-gray-400 text-sm mt-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <Heart
                            size={18}
                            className={project.likedByUser ? "text-red-500" : "text-gray-400"}
                          />
                          <span className="ml-2 text-gray-300">{project.likes || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Star
                            size={18}
                            className="text-yellow-400"
                          />
                          <span className="ml-2 text-gray-300">
                            {project.averageRating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        By {project.student?.username || "Anonymous"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {projects.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-400">
            <p>No projects found. Be the first to submit a project!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;