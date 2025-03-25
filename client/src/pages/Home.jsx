import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  // Categories matching the model
  const categories = ["All", "Website", "Game", "Mobile App", "AI", "Other"];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query =
          activeCategory !== "All" ? `?category=${activeCategory}` : "";

        const res = await axios.get(
          `http://localhost:5000/api/projects${query}`
        );
        setProjects(res.data.projects);
      } catch (error) {
        console.error("Error fetching projects", error);
      }
    };
    fetchProjects();
  }, [activeCategory]);

  const handleLike = async (projectId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/like`
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
    }
  };

  const handleRate = async (projectId, rating) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/rate`,
        { rating }
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
    }
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
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Projects"
                  className="bg-[#2C2C2C] text-white pl-10 pr-4 py-2 rounded-full w-72 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                />
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <nav className="flex space-x-4 text-gray-300 hover:*:text-white">
                <a href="#" className="hover:text-purple-400 transition">Your Submissions</a>
                <a href="#" className="hover:text-purple-400 transition">Projects</a>
                <a href="#" className="hover:text-purple-400 transition">Leaderboard</a>
              </nav>
              <button className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full font-semibold transition transform active:scale-95">
                Submit Project
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Tabs */}
      <div className="max-w-5xl mx-auto px-4 py-8">
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-900/30"
            >
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-black/50 px-3 py-1 rounded-full text-xs">
                  {project.category}
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold mb-2 text-purple-300">{project.title}</h2>
                <p className="text-gray-400 text-sm mb-3">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <span className="mr-2">💻</span>
                  <span>{project.techStack}</span>
                </div>

                {/* Likes and Ratings */}
                <div className="flex justify-between items-center border-t border-[#2C2C2C] pt-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(project._id)}
                      className="flex items-center text-gray-400 hover:text-purple-400 transition"
                    >
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v1.217a4.5 4.5 0 00.728 2.475l2.609 3.945c.246.37.594.637.996.765a1.5 1.5 0 001.645-.48l1.600-2.048a2.63 2.63 0 00.521-1.574l-.006-.617a2.63 2.63 0 00-.645-1.676l-1.093-1.235A2.63 2.63 0 009 8.646V6.5a1.5 1.5 0 00-1.5-1.5H6.5A1.5 1.5 0 005 6.5v3.833z" />
                      </svg>
                      {project.likes || 0}
                    </button>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(project._id, star)}
                          className={`text-xl transition-colors duration-200 ${
                            star <= (project.averageRating || 0)
                              ? "text-yellow-500"
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;