import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Heart, Star, ArrowUp, ArrowDown, Medal, Crown, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

const Leaderboard = () => {
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [sortBy, setSortBy] = useState("likes");
  const [orderBy, setOrderBy] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [userPosition, setUserPosition] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [userProject, setUserProject] = useState(null);

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
      // Get top projects for display
      const res = await axios.get(
        `http://localhost:5000/api/projects?sortBy=${sortBy}&orderBy=${orderBy}&limit=20`
      );
      setProjects(res.data.projects);
      
      // Get all projects to determine user position
      const allRes = await axios.get(
        `http://localhost:5000/api/projects?sortBy=${sortBy}&orderBy=${orderBy}&limit=500`
      );
      setAllProjects(allRes.data.projects);
      
      // If user is logged in, find their position
      if (userData?._id) {
        const userId = userData._id;
        
        // Find user's best performing project
        const userProjects = allRes.data.projects.filter(
          project => project.student?._id === userId || project.student === userId
        );
        
        if (userProjects.length > 0) {
          // Get best project based on current sort criteria
          const bestProject = userProjects.reduce((best, current) => {
            if (sortBy === "likes") {
              return (current.likes || 0) > (best.likes || 0) ? current : best;
            } else if (sortBy === "averageRating") {
              return (current.averageRating || 0) > (best.averageRating || 0) ? current : best;
            } else { // createdAt
              return new Date(current.createdAt) > new Date(best.createdAt) ? current : best;
            }
          }, userProjects[0]);
          
          // Find position of best project
          const position = allRes.data.projects.findIndex(
            p => p._id === bestProject._id
          );
          
          if (position !== -1) {
            setUserPosition(position + 1); // +1 because index is zero-based
            setUserProject(bestProject);
          }
        } else {
          setUserPosition(null);
          setUserProject(null);
        }
      }
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

  // Helper to get position label
  const getPositionLabel = (position) => {
    if (position === 1) return "1st";
    if (position === 2) return "2nd";
    if (position === 3) return "3rd";
    return `${position}th`;
  };

  // Helper to get correct emoji for position
  const getPositionIcon = (position) => {
    if (position === 1) return <Crown size={24} className="text-yellow-400" />;
    if (position === 2) return <Medal size={24} className="text-gray-400" />;
    if (position === 3) return <Award size={24} className="text-amber-700" />;
    if (position <= 10) return <Star size={24} className="text-blue-400" />;
    return <Star size={24} className="text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
      {/* Navbar */}
      <Header></Header>

      {/* Leaderboard Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Project Leaderboard
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the highest ranked and most popular projects on
            ProjectNest. Sort by likes, ratings, or newest additions.
          </p>
        </div>

        {/* User Position Card */}
        {userData && userPosition && userProject ? (
          <div className="bg-[#1E1E1E]/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center justify-center md:justify-start">
                {getPositionIcon(userPosition)}
                <div className="ml-3 text-xl font-bold text-white">
                  Your Position: <span className="text-purple-400">{getPositionLabel(userPosition)}</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center md:items-start">
                <div className="text-lg text-gray-300 mb-2">
                  Top Project: <span className="text-blue-300">{userProject.title}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Heart size={18} className="text-red-400" />
                    <span className="ml-2 text-gray-300">
                      {userProject.likes || 0}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star size={18} className="text-yellow-400" />
                    <span className="ml-2 text-gray-300">
                      {userProject.averageRating?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <Link 
                to={`/project/${userProject._id}`}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm font-medium transition"
              >
                View Your Project
              </Link>
            </div>
          </div>
        ) : userData && (
          <div >
            
          </div>
        )}

        {/* Sorting Options */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => handleSort("likes")}
              className={`flex items-center px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                sortBy === "likes"
                  ? "bg-blue-600 text-white"
                  : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
              }`}
            >
              <Heart size={16} className="mr-2" />
              Most Liked
              {getSortIcon("likes")}
            </button>
            <button
              onClick={() => handleSort("averageRating")}
              className={`flex items-center px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                sortBy === "averageRating"
                  ? "bg-blue-600 text-white"
                  : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
              }`}
            >
              <Star size={16} className="mr-2" />
              Top Rated
              {getSortIcon("averageRating")}
            </button>
            <button
              onClick={() => handleSort("createdAt")}
              className={`flex items-center px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                sortBy === "createdAt"
                  ? "bg-blue-600 text-white"
                  : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
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
                className={`block bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-purple-900/30 hover:translate-x-1 ${
                  userData && (project.student?._id === userData._id || project.student === userData._id)
                    ? "border-1 border-purple-100"
                    : ""
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Rank and Image */}
                  <div className="relative md:w-1/4">
                    <img
                      src={project.image ? `http://localhost:5000${project.image}` : '/placeholder-project.jpg'}
                      alt="Project"
                      className="w-full h-36 md:h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-project.jpg";
                      }}
                    />
                    <div className="absolute top-0 left-0 bg-black/70 p-2 flex items-center justify-center">
                      {getMedalIcon(index)}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/50 px-3 py-1 rounded-full text-xs">
                      {project.category}
                    </div>
                    
                    {/* User's project indicator */}
                    {userData && (project.student?._id === userData._id || project.student === userData._id) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-purple-700/80 py-1 text-xs text-center font-bold">
                        YOUR PROJECT
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
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
                            className={
                              project.likedByUser
                                ? "text-red-500"
                                : "text-gray-400"
                            }
                          />
                          <span className="ml-2 text-gray-300">
                            {project.likes || 0}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star size={18} className="text-yellow-400" />
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