import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Heart, ArrowLeft, Star } from "lucide-react";

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userRating, setUserRating] = useState(0);

  // Get user data once on component mount
  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Separate effect for fetching project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get(
          `http://localhost:5000/api/projects/${id}`,
          {
            headers,
          }
        );

        setProject(res.data);

        // Set user rating if they've rated this project before
        if (res.data.ratings && userData) {
          const foundRating = res.data.ratings.find(
            (r) => r.user === userData._id
          );
          if (foundRating) {
            setUserRating(foundRating.rating);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching project details", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, userData?._id]); // Only depend on the user ID, not the entire userData object

  // Like/Unlike Project Function
  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User not logged in");
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/projects/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the project with new likes data
      setProject((prevProject) => {
        if (!prevProject) return null;
        return {
          ...prevProject,
          likes: res.data.likes,
          likedByUser: res.data.likedByUser,
        };
      });
    } catch (error) {
      console.error(
        "Error liking project:",
        error.response?.data || error.message
      );
    }
  };

  // Rate Project Function
  const handleRate = async (rating) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User not logged in");
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/projects/${id}/rate`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserRating(rating);
      setProject((prevProject) => {
        if (!prevProject) return null;
        return {
          ...prevProject,
          averageRating: res.data.averageRating,
          ratings: res.data.ratings,
        };
      });
    } catch (error) {
      console.error(
        "Error rating project:",
        error.response?.data || error.message
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter flex items-center justify-center">
        <div className="text-xl">Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter flex items-center justify-center">
        <div className="text-xl">Project not found</div>
      </div>
    );
  }

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
                <a href="#" className="hover:text-purple-400 transition">
                  Your Submissions
                </a>
                <a href="#" className="hover:text-purple-400 transition">
                  Projects
                </a>
                <a href="#" className="hover:text-purple-400 transition">
                  Leaderboard
                </a>
              </nav>

              {userData && (
                <span className="text-gray-300">Hi, {userData.username}</span>
              )}

              <button className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full font-semibold transition transform active:scale-95">
                Submit Project
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Back button */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="flex items-center text-purple-400 hover:text-purple-300 mb-6 transition"
        >
          <ArrowLeft className="mr-2" size={20} />
          <span>Back to Projects</span>
        </Link>

        {/* Project Details */}
        <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl">
          {/* Project Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-purple-300 mb-2">
                  {project.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="bg-purple-900/30 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                  <span>
                    By {project.student ? project.student.username : "Unknown"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className="flex items-center text-lg transition-all"
                >
                  <span
                    className={`text-2xl ${
                      project.likedByUser ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    <Heart />
                  </span>
                  <span className="ml-2 text-gray-400 text-lg">
                    {project.likes || 0}
                  </span>
                </button>

                {/* Rating Display */}
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-2">
                    {project.averageRating
                      ? project.averageRating.toFixed(1)
                      : "0.0"}
                  </span>
                  <Star className="text-yellow-400" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Project Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left Column: Project Image */}
            <div className="lg:col-span-2">
              <img
                src={
                  project.image.startsWith("http")
                    ? project.image
                    : `http://localhost:5000${project.image}`
                }
                alt={project.title}
                className="w-full rounded-lg object-cover shadow-lg"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/350x200";
                }}
              />
            </div>
            <div className="lg:col-span-1">
              {/* Tech Stack */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-purple-300 mb-3">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack &&
                    project.techStack.split(",").map((tech, index) => (
                      <span
                        key={index}
                        className="bg-[#2C2C2C] text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                </div>
              </div>

              {/* User Rating Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-purple-300 mb-3">
                  Rate This Project
                </h3>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      className={`text-2xl ${
                        star <= userRating ? "text-yellow-400" : "text-gray-600"
                      } hover:text-yellow-300 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">
                  Description
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Middle Column: iframe/project demo */}
            </div>
          </div>

          <div className="">
            {project.link ? (
              <div className="bg-black/30 rounded-xl p-4 h-screen flex items-center justify-center">
                <iframe
                  src={project.link}
                  className="w-full h-full rounded-lg"
                  title={`${project.title} demo`}
                >
                  Your browser does not support iframes.
                </iframe>
              </div>
            ) : (
              <div className="bg-black/30 rounded-xl p-4 h-96 flex items-center justify-center">
                <p className="text-gray-400">No demo available</p>
              </div>
            )}

            {/* Project Description */}

            {/* Project Links */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
