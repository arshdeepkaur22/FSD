import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Award,
  Users,
  Star,
  ChevronDown,
  RefreshCw,
  ArrowUpDown,
  UserPlus,
  Trash2,
  Edit,
} from "lucide-react";
import axios from "axios";
import Header from "../../components/Header";

// SDG Options for the feedback modal
const sdgOptions = [
  "No Poverty",
  "Zero Hunger",
  "Good Health and Well-being",
  "Quality Education",
  "Gender Equality",
  "Clean Water and Sanitation",
  "Affordable and Clean Energy",
  "Decent Work and Economic Growth",
  "Industry, Innovation, and Infrastructure",
  "Reduced Inequality",
  "Sustainable Cities and Communities",
  "Responsible Consumption and Production",
  "Climate Action",
  "Life Below Water",
  "Life on Land",
  "Peace, Justice, and Strong Institutions",
  "Partnerships for the Goals",
];

// FeedbackModal Component
const FeedbackModal = ({
  project,
  feedbackText,
  setFeedbackText,
  suggestedSdg,
  setSuggestedSdg,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1A1A2E] rounded-xl p-6 w-full max-w-lg shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-blue-300">
          Provide SDG Mapping Feedback
        </h3>
        <div className="mb-4">
          <p className="mb-2 text-gray-300">Current SDG Goals:</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {project.sdgGoals &&
              project.sdgGoals.map((goal, index) => (
                <span
                  key={index}
                  className="bg-blue-800/60 px-3 py-1 rounded-full text-sm"
                >
                  {goal}
                </span>
              ))}
          </div>
          <select
            className="w-full bg-[#2C2C2C] text-white border-0 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            value={suggestedSdg}
            onChange={(e) => setSuggestedSdg(e.target.value)}
          >
            <option value="">Suggest Alternative SDG</option>
            {sdgOptions.map((sdg) => (
              <option key={sdg} value={sdg}>
                {sdg}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className="w-full bg-[#2C2C2C] text-white border-0 rounded-lg p-3 h-32 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          placeholder="Provide detailed feedback on SDG mapping"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        ></textarea>
        <div className="flex justify-end space-x-3">
          <button
            className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-colors shadow-sm"
            onClick={onSubmit}
            disabled={!feedbackText}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

// ProjectGradingModal Component
const ProjectGradingModal = ({ project, onGradeProject, onClose }) => {
  const [projectGrade, setProjectGrade] = useState(project.grade || "");

  const handleSaveGrade = () => {
    onGradeProject(projectGrade);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1A1A2E] rounded-xl p-6 w-full max-w-lg shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-blue-300">
          Grade Project: {project.title}
        </h3>
        <div className="mb-6">
          <p className="text-gray-300 mb-3">Assign a grade to this project:</p>
          <select
            className="w-full bg-[#2C2C2C] text-white border-0 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            value={projectGrade}
            onChange={(e) => setProjectGrade(e.target.value)}
          >
            <option value="">Select Grade</option>
            <option value="A">A</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="B-">B-</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="C-">C-</option>
            <option value="D">D</option>
            <option value="F">F</option>
          </select>

          {project.teamMembers && project.teamMembers.length > 0 && (
            <div className="mt-4 bg-gray-800/40 rounded-lg p-4">
              <p className="text-gray-300 mb-2 font-medium">Team Members:</p>
              <ul className="text-sm text-gray-400 space-y-2">
                {project.teamMembers.map((member, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      {member.name} -{" "}
                      <span className="text-gray-500">{member.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-yellow-400 text-sm mt-3">
                Note: Team members will be graded separately if needed.
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-colors shadow-sm"
            onClick={handleSaveGrade}
          >
            Save Grade
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [gradingModal, setGradingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [suggestedSdg, setSuggestedSdg] = useState("");
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState(null);

  // Student management state
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [yearFilter, setYearFilter] = useState("All Years");

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
    // If teacher role, also fetch students
    const userRole = localStorage.getItem("userRole");
    if (userRole === "teacher") {
      fetchStudents();
    }
  }, []);

  // Refetch students when active tab changes to students
  useEffect(() => {
    if (activeTab === "students") {
      fetchStudents();
    }
  }, [activeTab]);

  // Apply project filters
  useEffect(() => {
    fetchProjects();
  }, [searchTerm, statusFilter]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/projects?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(response.data.projects);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Fetch students stats (for grades and project counts)
      const response = await axios.get(
        "http://localhost:5000/api/projects/students/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Fetched students data:", response.data);

      // Update students state
      setStudents(response.data);
      setStudentsError(null);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudentsError("Failed to load student data. Please try again.");
    } finally {
      setStudentsLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDepartmentFilter("All Departments");
    setYearFilter("All Years");
  };

  // Project handlers
  const handleProvideSDGFeedback = (project) => {
    setSelectedProject(project);
    setFeedbackModal(true);
  };

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleOpenGradingModal = (project) => {
    setSelectedProject(project);
    setGradingModal(true);
  };

  // Function to handle viewing a student's projects
  const handleViewStudentProjects = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  const handleLikeProject = async (projectId) => {
    try {
      console.log(`Liking project ${projectId}`);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to like projects");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/like`,
        {}, // Empty body is fine
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Like response:", response.data);

      // Update the local state
      const updatedProjects = projects.map((p) => {
        if (p._id === projectId) {
          return {
            ...p,
            likes: response.data.likes,
          };
        }
        return p;
      });

      setProjects(updatedProjects);
    } catch (err) {
      console.error("Error liking project:", err);
      const errorMessage =
        err.response?.data?.message || err.response?.data?.error || err.message;
      alert(`Failed to like project: ${errorMessage}`);
    }
  };

  const handleRateProject = async (projectId, rating) => {
    try {
      console.log(`Rating project ${projectId} with ${rating} stars`);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token) {
        alert("Please login to rate projects");
        return;
      }

      // Make sure rating is a number
      const numericRating = parseInt(rating, 10);

      // Send the rating to the server
      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/rate`,
        { rating: numericRating }, // Ensure we're sending a number
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Rating response:", response.data);

      // Update the local state - importantly, we're updating the user's rating
      const updatedProjects = projects.map((p) => {
        if (p._id === projectId) {
          // Create a copy of the current ratings
          let updatedRatings = [...(p.ratings || [])];

          // Find if user already rated this project
          const existingRatingIndex = updatedRatings.findIndex(
            (r) => r.user === userId
          );

          if (existingRatingIndex >= 0) {
            // Update existing rating
            updatedRatings[existingRatingIndex] = {
              ...updatedRatings[existingRatingIndex],
              rating: numericRating,
            };
          } else {
            // Add new rating
            updatedRatings.push({
              user: userId,
              rating: numericRating,
            });
          }

          return {
            ...p,
            averageRating: response.data.averageRating,
            status: response.data.status || p.status, // Update status if it changed
            ratings: updatedRatings,
          };
        }
        return p;
      });

      setProjects(updatedProjects);
    } catch (err) {
      console.error("Error rating project:", err);
      alert(
        `Failed to rate project: ${err.response?.data?.message || err.message}`
      );
    }
  };

  // Grade a project (letter grade)
  const handleGradeProject = async (grade) => {
    try {
      console.log(
        `Grading project ${selectedProject._id} with grade: ${grade}`
      );

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(
        `http://localhost:5000/api/projects/${selectedProject._id}/grade`,
        { grade },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Grade response:", response.data);

      // Update the local state with both grade and status
      const updatedProjects = projects.map((p) => {
        if (p._id === selectedProject._id) {
          return {
            ...p,
            grade: response.data.grade,
            status: response.data.status, // Update status as well
          };
        }
        return p;
      });

      setProjects(updatedProjects);

      // Close the modal
      setGradingModal(false);
    } catch (err) {
      console.error("Error grading project:", err);
      const errorMessage =
        err.response?.data?.message || err.response?.data?.error || err.message;
      alert(`Failed to update grade: ${errorMessage}`);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const token = localStorage.getItem("token");

      // Make sure the token is being set correctly
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Log the request details for debugging
      console.log("Submitting feedback for project:", selectedProject._id);
      console.log("Token:", token);

      const response = await axios.post(
        `http://localhost:5000/api/projects/${selectedProject._id}/feedback`,
        {
          feedbackText,
          suggestedSdg,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Feedback submission response:", response.data);

      // Success - refresh projects to get updated data
      fetchProjects();

      // Reset and close modal
      setFeedbackModal(false);
      setFeedbackText("");
      setSuggestedSdg("");
    } catch (err) {
      console.error(
        "Error submitting feedback:",
        err.response?.data || err.message
      );
      alert(
        `Failed to submit feedback: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const handleChangeProjectStatus = async (projectId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/projects/${projectId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the local state
      const updatedProjects = projects.map((p) =>
        p._id === projectId ? { ...p, status } : p
      );

      setProjects(updatedProjects);
    } catch (err) {
      console.error("Error changing project status:", err);
      alert("Failed to update project status. Please try again.");
    }
  };

  // Project card component
  // Simple and Sweet Project Card Component
  const ProjectCard = ({ project }) => {
    // Ensure averageRating exists with a default value
    const averageRating = project.averageRating || 0;
    const currentUserId = localStorage.getItem("userId");

    // Find user's current rating for this project
    const userRating =
      project.ratings?.find((r) => r.user === currentUserId)?.rating || 0;

    return (
      <div className="bg-gray-900 rounded-md overflow-hidden shadow-md">
        <div className="p-4">
          {/* Header row with title and status */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium text-white text-lg">{project.title}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                project.status === "Approved"
                  ? "bg-green-500/20 text-green-400"
                  : project.status === "In Review"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : project.status === "Rejected"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {project.status}
            </span>
          </div>

          {/* Student name and rating */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-gray-400">
              {project.student?.name ||
                project.student?.username ||
                "Anonymous"}
            </div>
            <div className="flex items-center gap-0.5">
              {project.grade && (
                <span
                  className={`text-xs px-2 py-0.5 mr-2 rounded-full ${
                    project.grade.startsWith("A")
                      ? "bg-green-900/20 text-green-400"
                      : project.grade.startsWith("B")
                      ? "bg-white/20 text-white"
                      : project.grade.startsWith("C")
                      ? "bg-yellow-900/20 text-yellow-400"
                      : "bg-red-900/20 text-red-400"
                  }`}
                >
                  {project.grade}
                </span>
              )}
              <Star className="text-yellow-400" size={12} />
              <span className="text-yellow-400 text-xs">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Short description */}
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {project.description}
          </p>

          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.techStack
              .split(",")
              .slice(0, 3)
              .map((tech, index) => (
                <span
                  key={index}
                  className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full"
                >
                  {tech.trim()}
                </span>
              ))}
            {project.techStack.split(",").length > 3 && (
              <span className="text-xs text-gray-500">
                +{project.techStack.split(",").length - 3}
              </span>
            )}
          </div>

          {/* Rating stars */}
          <div className="flex items-center mb-1">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRateProject(project._id, star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={14}
                    className={
                      star <= userRating ? "text-yellow-400" : "text-gray-700"
                    }
                    fill={star <= userRating ? "currentColor" : "none"}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 text-center border-t border-gray-800 text-xs">
          <button
            className="py-2 text-white hover:bg-blue-900/10 transition-colors"
            onClick={() => handleViewProject(project._id)}
          >
            View
          </button>
          <button
            className="py-2 text-white hover:bg-blue-900/10 transition-colors border-x border-gray-800"
            onClick={() => handleProvideSDGFeedback(project)}
          >
            Feedback
          </button>
          <button
            className="py-2 text-white hover:bg-blue-900/10 transition-colors"
            onClick={() => handleOpenGradingModal(project)}
          >
            Grade
          </button>
        </div>
      </div>
    );
  };
  // Render projects view
  const renderProjectsView = () => {
    return (
      <div>
        {/* Search and Filter Bar */}
        <div className="bg-[#1A1A2E] rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full bg-[#2C2C2C] text-white border-0 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="bg-[#2C2C2C] text-white border-0 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status: All</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button
                onClick={resetFilters}
                className="bg-blue-700 hover:bg-blue-600 rounded-lg p-2 shadow-sm"
                title="Reset filters"
              >
                <RefreshCw size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-400">
                <p>No projects match your search criteria.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render students view
  const renderStudentsView = () => {
    // Filter students based on search term
    const filteredStudents = students.filter((student) => {
      if (!searchTerm) return true;

      // Convert username (number) to string for searching
      const usernameStr = student.username?.toString() || "";

      return (
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usernameStr.includes(searchTerm) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    return (
      <div>
        {/* Search and Filter Bar */}
        <div className="bg-[#1A1A2E] rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search students by name, ID, or email..."
                className="w-full bg-[#2C2C2C] text-white border-0 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSearchTerm("");
                  fetchStudents();
                }}
                className="bg-blue-700 hover:bg-blue-600 rounded-lg p-2 shadow-sm"
                title="Reset filters"
              >
                <RefreshCw size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-[#1A1A2E] rounded-xl overflow-hidden shadow-lg">
          {studentsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : studentsError ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{studentsError}</p>
              <button
                onClick={fetchStudents}
                className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#2A2A2A] text-left">
                  <tr>
                    <th className="px-6 py-3 text-gray-400 font-medium">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-gray-400 font-medium">
                      Name
                    </th>
                    <th className="px-6 py-3 text-gray-400 font-medium">
                      Email
                    </th>
                    <th className="px-6 py-3 text-gray-400 font-medium">
                      Projects
                    </th>
                    <th className="px-6 py-3 text-gray-400 font-medium">
                      Avg. Grade
                    </th>
                    <th className="px-6 py-3 text-gray-400 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-[#2C2C2C] transition-colors"
                      >
                        <td className="px-6 py-4">
                          {/* Display username as Student ID */}
                          <div className="text-white font-mono">
                            {student.username}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-200">
                            {student.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-indigo-900/40 text-indigo-300 px-2 py-1 rounded-full text-xs">
                            {student.projectsCount || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {student.averageGrade ? (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                student.averageGrade?.startsWith("A")
                                  ? "bg-green-900/60 text-green-300"
                                  : student.averageGrade?.startsWith("B")
                                  ? "bg-white/60 text-white"
                                  : student.averageGrade?.startsWith("C")
                                  ? "bg-yellow-900/60 text-yellow-300"
                                  : student.averageGrade === "N/A"
                                  ? "bg-gray-800 text-gray-300"
                                  : "bg-red-900/60 text-red-300"
                              }`}
                            >
                              {student.averageGrade}
                            </span>
                          ) : (
                            <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              handleViewStudentProjects(student.id)
                            }
                            className="text-white hover:text-blue-300 transition flex items-center"
                          >
                            <span>View Projects</span>
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
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-400"
                      >
                        {searchTerm ? (
                          <p>
                            No students found matching your search criteria.
                          </p>
                        ) : (
                          <p>No students data available.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-white">
            Teacher Dashboard
          </h1>

          {/* Tabs */}
          <div className="flex space-x-2 bg-[#1A1A2E] p-1 rounded-lg shadow-inner">
            <button
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === "projects"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
              }`}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button>
            <button
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === "students"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
              }`}
              onClick={() => setActiveTab("students")}
            >
              Students
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#0F0F1A]/50 backdrop-blur-sm rounded-xl shadow-xl p-6">
          {activeTab === "projects"
            ? renderProjectsView()
            : renderStudentsView()}
        </div>
      </div>

      {/* Modals */}
      {feedbackModal && selectedProject && (
        <FeedbackModal
          project={selectedProject}
          feedbackText={feedbackText}
          setFeedbackText={setFeedbackText}
          suggestedSdg={suggestedSdg}
          setSuggestedSdg={setSuggestedSdg}
          onSubmit={handleSubmitFeedback}
          onClose={() => setFeedbackModal(false)}
        />
      )}

      {gradingModal && selectedProject && (
        <ProjectGradingModal
          project={selectedProject}
          onGradeProject={handleGradeProject}
          onClose={() => setGradingModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
