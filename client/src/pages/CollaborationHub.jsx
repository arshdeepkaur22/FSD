import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CollaborationHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("browse");
  const [collaborations, setCollaborations] = useState([]);
  const [myCreatedRequests, setMyCreatedRequests] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    projectDescription: "",
    description: "",
    requiredSkills: "",
    positionsAvailable: 1,
    deadline: "",
  });

  // Fetch all collaboration requests (open by default)
  const fetchCollaborations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/collaborations",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCollaborations(response.data.collaborations || []);
    } catch (error) {
      console.error("Error fetching collaborations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my created requests
  const fetchMyCreatedRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/collaborations/my/created",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMyCreatedRequests(response.data.collaborations || []);
    } catch (error) {
      console.error("Error fetching my created requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my applications
  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/collaborations/my/applications",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMyApplications(response.data.applications || []);
    } catch (error) {
      console.error("Error fetching my applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "browse") {
      fetchCollaborations();
    } else if (activeTab === "my-requests") {
      fetchMyCreatedRequests();
    } else if (activeTab === "my-applications") {
      fetchMyApplications();
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = {
        ...formData,
        requiredSkills: formData.requiredSkills,
        positionsAvailable: parseInt(formData.positionsAvailable, 10),
      };

      await axios.post(
        "http://localhost:5000/api/collaborations/create",
        submissionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Reset form
      setFormData({
        title: "",
        projectDescription: "",
        description: "",
        requiredSkills: "",
        positionsAvailable: 1,
        deadline: "",
      });

      alert("Collaboration request created successfully!");
      setActiveTab("my-requests");
      fetchMyCreatedRequests();
    } catch (error) {
      console.error("Error creating collaboration request:", error);
      alert(
        "Failed to create collaboration request: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRequest = async (id) => {
    if (window.confirm("Are you sure you want to close this collaboration request?")) {
      try {
        await axios.put(
          `http://localhost:5000/api/collaborations/${id}/close`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Collaboration request closed successfully");
        fetchMyCreatedRequests();
      } catch (error) {
        alert(
          "Failed to close request: " +
            (error.response?.data?.message || error.message)
        );
      }
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
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-8 text-purple-300 text-center">
            Collaboration Hub
          </h1>

          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-gray-700 mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "browse"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("browse")}
            >
              Browse All Requests
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "create"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("create")}
            >
              Create Request
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "my-requests"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("my-requests")}
            >
              My Requests
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "my-applications"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("my-applications")}
            >
              My Applications
            </button>
          </div>

          {/* Browse All Collaboration Requests */}
          {activeTab === "browse" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="flex justify-center items-center py-20 col-span-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : collaborations.length === 0 ? (
                  <p className="text-center col-span-full py-10 text-gray-400">
                    No collaboration requests available.
                  </p>
                ) : (
                  collaborations.map((collab) => (
                    <div
                      key={collab._id}
                      className="bg-[#2C2C2C] rounded-xl shadow-lg p-6 transition-transform hover:scale-105"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-purple-300 truncate">
                          {collab.title}
                        </h3>
                        <span 
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            collab.status === "Open" 
                              ? "bg-green-600 text-white" 
                              : collab.status === "Filled"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                        >
                          {collab.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-gray-400 text-sm mb-1">Project:</h4>
                        <p className="font-medium line-clamp-2">
                          {collab.projectDescription || "No description provided"}
                        </p>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-gray-400 text-sm mb-1">
                          Skills Required:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(collab.requiredSkills) && collab.requiredSkills.length > 0 ? (
                            collab.requiredSkills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="text-xs bg-[#3A3A3A] text-gray-200 px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs bg-[#3A3A3A] text-gray-200 px-2 py-1 rounded">
                              No skills specified
                            </span>
                          )}
                          {Array.isArray(collab.requiredSkills) && collab.requiredSkills.length > 3 && (
                            <span className="text-xs bg-[#3A3A3A] text-gray-200 px-2 py-1 rounded">
                              +{collab.requiredSkills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-gray-400 text-sm mb-1">
                          Positions:
                        </h4>
                        <p>{collab.positionsAvailable} available</p>
                      </div>

                      {collab.deadline && (
                        <div className="mb-4">
                          <h4 className="text-gray-400 text-sm mb-1">
                            Deadline:
                          </h4>
                          <p>
                            {new Date(collab.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-400">
                          By: {collab.createdBy?.username || "Unknown"}
                        </span>
                        <Link
                          to={`/collaborations/${collab._id}`}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Create Collaboration Request */}
          {activeTab === "create" && (
            <div>
              <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
                {/* Collaboration Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Collaboration Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="E.g., 'Frontend Developer Needed for Music App'"
                  />
                </div>

                {/* Project Description */}
                <div>
                  <label
                    htmlFor="projectDescription"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Project Description
                  </label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe your project, its goals, and what makes it exciting"
                  />
                </div>

                {/* Collaboration Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Collaboration Details
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe what you need help with, responsibilities, expectations, etc."
                  />
                </div>

                {/* Required Skills */}
                <div>
                  <label
                    htmlFor="requiredSkills"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Required Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    id="requiredSkills"
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="E.g., React, Node.js, MongoDB"
                  />
                </div>

                {/* Positions Available */}
                <div>
                  <label
                    htmlFor="positionsAvailable"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Positions Available
                  </label>
                  <input
                    type="number"
                    id="positionsAvailable"
                    name="positionsAvailable"
                    value={formData.positionsAvailable}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label
                    htmlFor="deadline"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Application Deadline (optional)
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Collaboration Request"}
                </button>
              </form>
            </div>
          )}

          {/* My Created Requests */}
          {activeTab === "my-requests" && (
            <div>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : myCreatedRequests.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 mb-4">You haven't created any collaboration requests yet.</p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
                  >
                    Create New Request
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-purple-300 mb-4">Your Created Collaboration Requests</h2>
                  <div className="space-y-4">
                    {myCreatedRequests.map((request) => (
                      <div key={request._id} className="bg-[#2C2C2C] rounded-xl p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-purple-300 mb-2">{request.title}</h3>
                            <p className="text-sm text-gray-400 mb-3">
                              Created on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              request.status === "Open" 
                                ? "bg-green-600 text-white" 
                                : request.status === "Filled"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-600 text-white"
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-gray-400 text-sm mb-1">Project:</h4>
                          <p className="text-gray-200">{request.projectDescription}</p>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-gray-400 text-sm mb-1">Applicants:</h4>
                          <p className="text-gray-200">
                            {request.applicants.length} total applications 
                            ({request.applicants.filter(app => app.status === "Accepted").length} accepted)
                          </p>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Link
                            to={`/collaborations/${request._id}`}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center font-medium py-2 rounded-lg transition"
                          >
                            View Details
                          </Link>
                          {request.status === "Open" && (
                            <button
                              onClick={() => handleCloseRequest(request._id)}
                              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition"
                            >
                              Close Request
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* My Applications */}
          {activeTab === "my-applications" && (
            <div>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : myApplications.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 mb-4">You haven't applied to any collaboration requests yet.</p>
                  <button
                    onClick={() => setActiveTab("browse")}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
                  >
                    Browse Requests
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-purple-300 mb-4">Your Applications</h2>
                  <div className="space-y-4">
                    {myApplications.map((item, index) => (
                      <div key={index} className="bg-[#2C2C2C] rounded-xl p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-purple-300 mb-2">{item.collaboration.title}</h3>
                            <p className="text-sm text-gray-400 mb-1">
                              Created by: {item.collaboration.createdBy?.username || item.collaboration.createdBy?.email || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-400 mb-3">
                              Applied on: {new Date(item.application.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full mb-2 ${
                                item.collaboration.status === "Open" 
                                  ? "bg-green-600 text-white" 
                                  : item.collaboration.status === "Filled"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-600 text-white"
                              }`}
                            >
                              Request: {item.collaboration.status}
                            </span>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                item.application.status === "Accepted"
                                  ? "bg-green-600 text-white"
                                  : item.application.status === "Rejected"
                                  ? "bg-red-600 text-white"
                                  : "bg-yellow-600 text-white"
                              }`}
                            >
                              Application: {item.application.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Link
                            to={`/collaborations/${item.collaboration._id}`}
                            className="w-full block text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationHub;