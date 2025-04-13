import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories matching the model
  const categories = ["All", "Website", "Game", "Mobile App", "AI", "Other"];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const query =
          activeCategory !== "All" ? `?category=${activeCategory}` : "";

        const res = await axios.get(
          `http://localhost:5000/api/projects${query}`
        );
        setProjects(res.data.projects || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching projects", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [activeCategory]);

  const handleLike = async (projectId) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to like projects");
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state to reflect new like count
      setProjects(
        projects.map((project) =>
          project._id === projectId
            ? { ...project, likes: res.data.likes }
            : project
        )
      );
    } catch (error) {
      console.error("Error liking project", error);
      alert("Failed to like project");
    }
  };


  // Function to render SDG goals badges
  const renderSdgBadges = (sdgGoals) => {
    if (!sdgGoals || sdgGoals.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {sdgGoals.slice(0, 2).map((goal, index) => (
          <span
            key={index}
            className="text-xs bg-green-800/60 text-green-200 px-2 py-1 rounded-full"
          >
            {goal}
          </span>
        ))}
        {sdgGoals.length > 2 && (
          <span className="text-xs bg-green-800/60 text-green-200 px-2 py-1 rounded-full">
            +{sdgGoals.length - 2} more
          </span>
        )}
      </div>
    );
  };
  // Add this to your Home component, near the top with your other state variables:

  // Check if user is a teacher
  const getUserRole = () => {
    const userRole = localStorage.getItem("userRole");
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return parsed.role || userRole;
      } catch (e) {
        return userRole;
      }
    }
    return userRole;
  };

  const userRole = getUserRole();
  const isTeacher = userRole === "teacher";

  // Then update your handleRate function to check if user is a teacher:

  const handleRate = async (projectId, rating) => {
    try {
      // Check if user is a teacher
      if (!isTeacher) {
        alert("Only teachers can rate projects");
        return;
      }

      // Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to rate projects");
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/rate`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state to reflect new rating
      setProjects(
        projects.map((project) =>
          project._id === projectId
            ? { ...project, averageRating: res.data.averageRating }
            : project
        )
      );
    } catch (error) {
      console.error("Error rating project", error);
      alert("Failed to rate project");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
      {/* Include the Header component */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Student Project Showcase
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover innovative projects created by students. From web
            development to AI, explore a diverse range of technical achievements
            aligned with Sustainable Development Goals.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => setActiveCategory(activeCategory)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <>
            {projects.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-4">
                  No projects found in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-900/30"
                  >
                    <div className="relative">
                      <img
                        src={
                          project.image
                            ? `http://localhost:5000${project.image}`
                            : "https://via.placeholder.com/800x400?text=No+Image"
                        }
                        alt={project.title}
                        className="w-full h-56 object-cover transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-black/50 px-3 py-1 rounded-full text-xs">
                        {project.category}
                      </div>
                    </div>
                    <div className="p-5">
                      <h2 className="text-xl font-bold mb-2 text-purple-300">
                        {project.title}
                      </h2>
                      <p className="text-gray-400 text-sm mb-3">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <span className="mr-2">💻</span>
                        <span>{project.techStack}</span>
                      </div>

                      {/* Student Info */}
                      {/* Student Info */}
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <span className="mr-2">👤</span>
                        <span>
                          By:{" "}
                          {project.student
                            ? typeof project.student === "object"
                              ? // Try various common name fields
                                project.student.username ||
                                project.student.name ||
                                project.student.fullName ||
                                "Anonymous"
                              : // If student is just an ID
                                "Anonymous"
                            : "Anonymous"}
                        </span>
                      </div>

                      {/* GitHub & Deployed Links */}
                      <div className="flex flex-col space-y-2 mb-4">
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                            GitHub Repository
                          </a>
                        )}

                        {project.deployedLink && (
                          <a
                            href={project.deployedLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-green-400 hover:text-green-300 text-sm"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            View Live Project
                          </a>
                        )}
                      </div>

                      {/* SDG Goals */}
                      {renderSdgBadges(project.sdgGoals)}

                      {/* Likes and Ratings */}
                      <div className="flex justify-between items-center border-t border-[#2C2C2C] pt-4 mt-4">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(project._id)}
                            className="flex items-center text-gray-400 hover:text-purple-400 transition"
                          >
                            <svg
                              className="w-5 h-5 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v1.217a4.5 4.5 0 00.728 2.475l2.609 3.945c.246.37.594.637.996.765a1.5 1.5 0 001.645-.48l1.600-2.048a2.63 2.63 0 00.521-1.574l-.006-.617a2.63 2.63 0 00-.645-1.676l-1.093-1.235A2.63 2.63 0 009 8.646V6.5a1.5 1.5 0 00-1.5-1.5H6.5A1.5 1.5 0 005 6.5v3.833z" />
                            </svg>
                            {project.likes || 0}
                          </button>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleRate(project._id, star)}
                                disabled={!isTeacher}
                                title={
                                  isTeacher
                                    ? "Click to rate"
                                    : "Only teachers can rate projects"
                                }
                                className={`text-xl transition-colors duration-200 ${
                                  star <= (project.averageRating || 0)
                                    ? "text-yellow-500"
                                    : isTeacher
                                    ? "text-gray-400 hover:text-yellow-400"
                                    : "text-gray-400"
                                }`}
                              >
                                ★
                              </button>
                            ))}
                            <span className="ml-2 text-gray-400 text-sm">
                              {project.averageRating
                                ? project.averageRating.toFixed(1)
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* View Details Button - Update this section in your Home.jsx */}
                        <Link
                          to={`/projects/${project._id}`}
                          className="text-purple-400 hover:text-purple-300 text-sm flex items-center"
                        >
                          View Details
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </Link>

                        {/* Alternatively, make the entire card clickable */}
                        {/* Wrap the entire card in a Link component */}
                        <Link
                          to={`/projects/${project._id}`}
                          className="block bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-900/30"
                        >
                          {/* Card content... */}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
