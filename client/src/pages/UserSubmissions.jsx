import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Heart,
  Star,
  MessageCircle,
  Eye,
  Calendar,
  Code,
  ExternalLink,
  Edit,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProjectEditModal from "./ProjectEditModal";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserSubmissions = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [analyticsView, setAnalyticsView] = useState("overview"); // "overview", "detailed"
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const navigate = useNavigate();
  const filters = ["All", "Most Liked", "Highest Rated", "Most Recent"];
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  useEffect(() => {
    // Fetch user projects from backend
    const fetchUserProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token || !userData._id) {
          setError("You need to be logged in to view your projects");
          setLoading(false);
          return;
        }

        // Get projects submitted by the current user
        const res = await axios.get(
          `http://localhost:5000/api/projects/user/${userData._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let projectsData = res.data.projects || [];

        // Apply filters
        if (activeFilter === "Most Liked") {
          projectsData = projectsData.sort(
            (a, b) => (b.likes || 0) - (a.likes || 0)
          );
        } else if (activeFilter === "Highest Rated") {
          projectsData = projectsData.sort(
            (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
          );
        } else if (activeFilter === "Most Recent") {
          projectsData = projectsData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        }

        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching user projects", error);
        setError("Failed to load your projects. Please try again later.");
      }
      setLoading(false);
    };

    fetchUserProjects();
  }, [activeFilter]);

  // Calculate analytics
  const totalProjects = projects.length;
  const totalLikes = projects.reduce(
    (sum, project) => sum + (project.likes || 0),
    0
  );
  const totalComments = projects.reduce(
    (sum, project) => sum + (project.feedback?.length || 0),
    0
  );
  const avgRating = projects.length
    ? (
        projects.reduce(
          (sum, project) => sum + (project.averageRating || 0),
          0
        ) / projects.length
      ).toFixed(1)
    : 0;

  // Get project category distribution
  const categoryStats = projects.reduce((acc, project) => {
    acc[project.category || "Uncategorized"] =
      (acc[project.category || "Uncategorized"] || 0) + 1;
    return acc;
  }, {});

  const sdgGoalsStats = projects.reduce((acc, project) => {
    if (project.sdgGoals && project.sdgGoals.length) {
      project.sdgGoals.forEach((goal) => {
        acc[goal] = (acc[goal] || 0) + 1;
      });
    }
    return acc;
  }, {});

  // Get tech stack distribution
  const techStackStats = projects.reduce((acc, project) => {
    if (project.techStack) {
      const techs = project.techStack.split(",").map((tech) => tech.trim());
      techs.forEach((tech) => {
        if (tech) acc[tech] = (acc[tech] || 0) + 1;
      });
    }
    return acc;
  }, {});

  // Handle like project
  const handleLikeProject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update project in local state
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, likes: (project.likes || 0) + 1, likedByUser: true }
            : project
        )
      );
    } catch (error) {
      console.error("Error liking project", error);
    }
  };

  // Open edit modal for a project
  const handleEditProject = (project) => {
    setCurrentProject(project);
    setEditModalOpen(true);
  };

  // Handle project update after edit
  const handleProjectUpdate = (updatedProject) => {
    // Update the project in the local state
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project._id === updatedProject._id ? updatedProject : project
      )
    );
  };

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
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-500"
            }`}
          />
        ))}
      </div>
    );
  };

  // Prepare chart data for categories
  const categoryChartData = Object.entries(categoryStats).map(
    ([name, value]) => ({ name, value })
  );

  // Generate timeline data
  const generateTimelineData = () => {
    const monthData = {};

    projects.forEach((project) => {
      const date = new Date(project.createdAt);
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;

      if (!monthData[monthYear]) {
        monthData[monthYear] = { name: monthYear, projects: 0, likes: 0 };
      }

      monthData[monthYear].projects += 1;
      monthData[monthYear].likes += project.likes || 0;
    });

    return Object.values(monthData).sort((a, b) => {
      const [aMonth, aYear] = a.name.split(" ");
      const [bMonth, bYear] = b.name.split(" ");
      return (
        new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`)
      );
    });
  };

  const sdgGoalsChartData = Object.entries(sdgGoalsStats)
  .map(([name, value]) => ({ name, value }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 7); // Take top 7 for readability

  const timelineData = generateTimelineData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
      {/* Navbar */}
      <Header />

      {/* Page Header */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-300 mb-2">
              Your Project Submissions
            </h1>
            <p className="text-gray-400">
              Track performance and analytics for all your submitted projects
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setAnalyticsView("overview")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                analyticsView === "overview"
                  ? "bg-blue-600 text-white"
                  : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setAnalyticsView("detailed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                analyticsView === "detailed"
                  ? "bg-blue-600 text-white"
                  : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
              }`}
            >
              Detailed Analytics
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-400 rounded-lg p-4 mb-6">
            <p className="text-white">{error}</p>
          </div>
        )}

        {/* Analytics Dashboard */}
        <div className="bg-[#1E1E1E] rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-300">
            Project Analytics
          </h2>

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
                  <Star
                    className="ml-2 text-yellow-400 fill-yellow-400"
                    size={20}
                  />
                </div>
              </div>
              <div className="bg-[#2A2A2A] rounded-xl p-4">
                <h3 className="text-gray-400 text-sm mb-1">Total Feedback</h3>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-white">
                    {totalComments}
                  </p>
                  <MessageCircle className="ml-2 text-blue-400" size={20} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category and Department Distribution Charts */}
              <div className="bg-[#252525] rounded-xl p-4">
                <h3 className="text-gray-300 text-sm mb-3">
                  SDG Goals Distribution
                </h3>
                <div className="h-64">
                  {projects.length > 0 &&
                  Object.keys(sdgGoalsStats).length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sdgGoalsChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${
                              name.length > 12
                                ? name.substring(0, 12) + "..."
                                : name
                            }: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sdgGoalsChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[(index + 3) % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [
                            `${value} Projects`,
                            name,
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No SDG goals data available
                    </div>
                  )}
                </div>
              </div>

              {/* Technology Usage */}
              <div className="bg-[#252525] rounded-xl p-4">
                <h3 className="text-gray-300 text-sm mb-3">Technology Usage</h3>
                {Object.keys(techStackStats).length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={Object.entries(techStackStats)
                        .slice(0, 5)
                        .map(([name, value]) => ({ name, value }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#333",
                          borderColor: "#555",
                        }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    No technology data available
                  </div>
                )}
              </div>

              {/* Timeline Chart */}
              <div className="bg-[#252525] rounded-xl p-4">
                <h3 className="text-gray-300 text-sm mb-3">
                  Project Activity Timeline
                </h3>
                {timelineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={timelineData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#333",
                          borderColor: "#555",
                        }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="projects"
                        stroke="#82ca9d"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="likes" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    Not enough timeline data available
                  </div>
                )}
              </div>

              {/* Project Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-gray-400 text-sm border-b border-gray-700">
                    <tr>
                      <th className="pb-3 pl-2">Project</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Likes</th>
                      <th className="pb-3">Rating</th>
                      <th className="pb-3">Comments</th>
                      <th className="pb-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {projects.map((project) => (
                      <tr key={project._id} className="hover:bg-[#222]">
                        <td className="py-3 pl-2 font-medium">
                          {project.title}
                        </td>
                        <td className="py-3">
                          {project.category || "Uncategorized"}
                        </td>
                        <td className="py-3">
                          {project.department || "Unspecified"}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              project.status === "Approved"
                                ? "bg-green-900/30 text-green-400"
                                : project.status === "In Review"
                                ? "bg-blue-900/30 text-blue-400"
                                : project.status === "Rejected"
                                ? "bg-red-900/30 text-red-400"
                                : "bg-gray-800 text-gray-400"
                            }`}
                          >
                            {project.status || "Pending"}
                          </span>
                        </td>
                        <td className="py-3">{project.likes || 0}</td>
                        <td className="py-3">
                          {(project.averageRating || 0).toFixed(1)}
                        </td>
                        <td className="py-3">
                          {project.feedback?.length || 0}
                        </td>
                        <td className="py-3">
                          {formatDate(project.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Add Project and Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {/* Submit New Project Button */}
          <button
            onClick={() => navigate("/submit")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full font-medium flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Submit New Project
          </button>

          {/* Filter Tabs */}
          <div className="flex justify-start space-x-4 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-[#2C2C2C] text-gray-400 hover:bg-[#3C3C3C]"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4"></div>
            <p className="text-gray-400">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-[#1E1E1E] rounded-2xl p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-gray-400 mb-2">
              You haven't submitted any projects yet.
            </p>
            <p className="text-gray-500 mb-6 text-sm">
              Start showcasing your work by submitting your first project.
            </p>
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
                className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-900/10 hover:translate-y-[-2px] transition"
              >
                <div className="relative">
                  <img
                    src={
                      project.image
                        ? `http://localhost:5000${project.image}`
                        : "/placeholder-project.jpg"
                    }
                    alt={project.title}
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-project.jpg";
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-black/50 px-3 py-1 rounded-full text-xs">
                    {project.category || "Uncategorized"}
                  </div>
                  {project.status && (
                    <div
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs ${
                        project.status === "Approved"
                          ? "bg-green-900/80 text-green-400"
                          : project.status === "In Review"
                          ? "bg-blue-900/80 text-blue-400"
                          : project.status === "Rejected"
                          ? "bg-red-900/80 text-red-400"
                          : "bg-gray-800/80 text-gray-400"
                      }`}
                    >
                      {project.status}
                    </div>
                  )}
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation
                      handleEditProject(project);
                    }}
                    className="absolute bottom-3 right-3 bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition"
                  >
                    <Edit size={16} className="text-white" />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-blue-300">
                        {project.title}
                      </h2>
                      {project.department && (
                        <p className="text-sm text-gray-400">
                          Department: {project.department}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition"
                          title="GitHub Repository"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                      )}
                      {project.deployedLink && (
                        <a
                          href={project.deployedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition"
                          title="Live Demo"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">
                    {project.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Code size={16} className="mr-1" />
                    <span>
                      {project.techStack || "No technologies specified"}
                    </span>
                  </div>

                  {project.sdgGoals && project.sdgGoals.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.sdgGoals.map((goal, index) => (
                        <span
                          key={index}
                          className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded-md text-xs"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Metrics Row */}
                  <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-800">
                    {/* Rating */}
                    <div className="flex items-center mr-4 mb-2">
                      {renderRatingStars(project.averageRating || 0)}
                      <span className="ml-2 text-sm text-gray-400">
                        ({project.ratings?.length || 0})
                      </span>
                    </div>

                    {/* Likes */}
                    <div className="flex items-center mr-4 mb-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent link navigation
                          handleLikeProject(project._id);
                        }}
                        className="flex items-center"
                        disabled={project.likedByUser}
                      >
                        <Heart
                          size={18}
                          className={`${
                            project.likedByUser
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400 hover:text-red-400"
                          }`}
                        />
                        <span className="ml-1 text-gray-400">
                          {project.likes || 0}
                        </span>
                      </button>
                    </div>

                    {/* Feedback Count - Visible only to the student */}
                    <div className="flex items-center mr-4 mb-2">
                      <MessageCircle size={18} className="text-blue-400" />
                      <span className="ml-1 text-gray-400">
                        {project.feedback?.length || 0}
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
                      to={`/projects/${project._id}`}
                      className="flex-1 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-center py-2 rounded-l-lg text-sm font-medium transition"
                    >
                      <Eye size={16} className="inline mr-2" />
                      View Details
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevent link navigation
                        handleEditProject(project);
                      }}
                      className="flex-1 bg-purple-700 hover:bg-purple-800 text-center py-2 rounded-r-lg text-sm font-medium transition"
                    >
                      <Edit size={16} className="inline mr-2" />
                      Edit Project
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Project Modal */}
      {editModalOpen && (
        <ProjectEditModal
          project={currentProject}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdate={handleProjectUpdate}
        />
      )}
    </div>
  );
};

export default UserSubmissions;