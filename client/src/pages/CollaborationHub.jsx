import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collaborationsApi } from "../services/api";
import Header from "../components/Header";

const CollaborationHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("browse");
  const [collaborations, setCollaborations] = useState([]);
  const [myCreatedRequests, setMyCreatedRequests] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myMentorshipRequests, setMyMentorshipRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    projectDescription: "",
    description: "",
    requiredSkills: "",
    positionsAvailable: 1,
    deadline: "",
    githubRepository: "",
    offersMentorship: false,
    sdgGoals: [],
    sdgJustification: "",
  });

  // SDG options for the form
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

  // Fetch all collaboration requests (open by default)
  const fetchCollaborations = async () => {
    setLoading(true);
    try {
      const response = await collaborationsApi.getAllCollaborations();
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
      const response = await collaborationsApi.getMyCreatedCollaborations();
      setMyCreatedRequests(response.data.collaborations || []);
    } catch (error) {
      console.error("Error fetching my created requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my applications and mentorship requests
  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const response = await collaborationsApi.getMyApplications();
      setMyApplications(response.data.applications || []);
      setMyMentorshipRequests(response.data.mentorshipRequests || []);
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
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSDGChange = (e) => {
    const options = e.target.options;
    const selectedSDGs = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedSDGs.push(options[i].value);
      }
    }

    setFormData((prev) => ({
      ...prev,
      sdgGoals: selectedSDGs,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user from localStorage
      const userStr = localStorage.getItem("user");
      console.log("Raw user string from localStorage:", userStr);

      const user = userStr ? JSON.parse(userStr) : {};
      console.log("Parsed user object:", user);

      if (!user._id) {
        alert("You need to be logged in to create a collaboration");
        setLoading(false);
        return;
      }

      const submissionData = {
        ...formData,
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((skill) => skill.trim()),
        positionsAvailable: parseInt(formData.positionsAvailable, 10),
        createdBy: user._id, // Make sure this is included
      };

      console.log("Submitting collaboration with data:", submissionData);
      await collaborationsApi.createCollaboration(submissionData);

      // Reset form
      setFormData({
        title: "",
        projectDescription: "",
        description: "",
        requiredSkills: "",
        positionsAvailable: 1,
        deadline: "",
        githubRepository: "",
        offersMentorship: false,
        sdgGoals: [],
        sdgJustification: "",
      });

      alert("Collaboration request created successfully!");
      setActiveTab("my-requests");
      fetchMyCreatedRequests();
    } catch (error) {
      console.error(
        "Error creating collaboration request:",
        error.response?.data || error
      );
      alert(
        "Failed to create collaboration request: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRequest = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to close this collaboration request?"
      )
    ) {
      try {
        await collaborationsApi.closeCollaboration(id);
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

  console.log(
    "User data in localStorage:",
    JSON.parse(localStorage.getItem("user"))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
      <Header></Header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-8 text-blue-100 text-center">
            Collaboration Hub
          </h1>

          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-gray-700 mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "browse"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("browse")}
            >
              Browse All Requests
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "create"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("create")}
            >
              Create Request
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "my-requests"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("my-requests")}
            >
              My Requests
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "my-applications"
                  ? "text-white border-b-2 border-white"
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
                        <h3 className="text-xl font-bold text-white truncate">
                          {collab.title}
                        </h3>
                        <div className="flex flex-col gap-1 items-end">
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
                          {collab.offersMentorship && (
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-600 text-white">
                              Offers Mentorship
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-gray-400 text-sm mb-1">Project:</h4>
                        <p className="font-medium line-clamp-2">
                          {collab.projectDescription ||
                            "No description provided"}
                        </p>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-gray-400 text-sm mb-1">
                          Skills Required:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(collab.requiredSkills) &&
                          collab.requiredSkills.length > 0 ? (
                            collab.requiredSkills
                              .slice(0, 3)
                              .map((skill, index) => (
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
                          {Array.isArray(collab.requiredSkills) &&
                            collab.requiredSkills.length > 3 && (
                              <span className="text-xs bg-[#3A3A3A] text-gray-200 px-2 py-1 rounded">
                                +{collab.requiredSkills.length - 3} more
                              </span>
                            )}
                        </div>
                      </div>

                      {/* SDG Goals if any */}
                      {Array.isArray(collab.sdgGoals) &&
                        collab.sdgGoals.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-gray-400 text-sm mb-1">
                              SDG Goals:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {collab.sdgGoals
                                .slice(0, 2)
                                .map((goal, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-[#3A3A3A] text-gray-200 px-2 py-1 rounded"
                                  >
                                    {goal}
                                  </span>
                                ))}
                              {collab.sdgGoals.length > 2 && (
                                <span className="text-xs bg-[#3A3A3A] text-gray-200 px-2 py-1 rounded">
                                  +{collab.sdgGoals.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      {/* GitHub Repo if available */}
                      {collab.githubRepository && (
                        <div className="mb-3">
                          <h4 className="text-gray-400 text-sm mb-1">
                            GitHub Repository:
                          </h4>
                          <a
                            href={collab.githubRepository}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-white transition text-sm truncate block"
                          >
                            {collab.githubRepository.replace(
                              "https://github.com/",
                              ""
                            )}
                          </a>
                        </div>
                      )}

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
                          className="px-4 py-2 bg-blue-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
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
              <form
                onSubmit={handleSubmit}
                className="space-y-6 max-w-3xl mx-auto"
              >
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

                {/* GitHub Repository */}
                <div>
                  <label
                    htmlFor="githubRepository"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    GitHub Repository (optional)
                  </label>
                  <input
                    type="url"
                    id="githubRepository"
                    name="githubRepository"
                    value={formData.githubRepository}
                    onChange={handleInputChange}
                    className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://github.com/username/repository"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Link to your project's GitHub repository
                  </p>
                </div>

                {/* SDG Goals */}
                <div>
                  <label
                    htmlFor="sdgGoals"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Sustainable Development Goals (optional)
                  </label>
                  <select
                    id="sdgGoals"
                    name="sdgGoals"
                    multiple
                    value={formData.sdgGoals}
                    onChange={handleSDGChange}
                    className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    size="4"
                  >
                    {sdgOptions.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Hold Ctrl/Cmd key to select multiple goals
                  </p>
                </div>

                {/* SDG Justification - Only show if SDG goals are selected */}
                {formData.sdgGoals.length > 0 && (
                  <div>
                    <label
                      htmlFor="sdgJustification"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      SDG Justification
                    </label>
                    <textarea
                      id="sdgJustification"
                      name="sdgJustification"
                      value={formData.sdgJustification}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Explain how your project contributes to the selected SDGs"
                    />
                  </div>
                )}

                {/* Mentorship Option */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="offersMentorship"
                    name="offersMentorship"
                    checked={formData.offersMentorship}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-[#2C2C2C] rounded border-gray-600 focus:ring-purple-500"
                  />
                  <label
                    htmlFor="offersMentorship"
                    className="ml-2 text-sm font-medium text-gray-300"
                  >
                    Offer Mentorship for this Project
                  </label>
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
                  className="w-full bg-blue-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
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
                  <p className="text-gray-400 mb-4">
                    You haven't created any collaboration requests yet.
                  </p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="px-4 py-2 bg-blue-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
                  >
                    Create New Request
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Your Created Collaboration Requests
                  </h2>
                  <div className="space-y-4">
                    {myCreatedRequests.map((request) => (
                      <div
                        key={request._id}
                        className="bg-[#2C2C2C] rounded-xl p-6"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">
                              {request.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-3">
                              Created on{" "}
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                            {request.offersMentorship && (
                              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-600 text-white">
                                Offers Mentorship
                              </span>
                            )}
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
                          <h4 className="text-gray-400 text-sm mb-1">
                            Project:
                          </h4>
                          <p className="text-gray-200">
                            {request.projectDescription}
                          </p>
                        </div>

                        {request.githubRepository && (
                          <div className="mb-4">
                            <h4 className="text-gray-400 text-sm mb-1">
                              GitHub Repository:
                            </h4>
                            <a
                              href={request.githubRepository}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white hover:text-white transition"
                            >
                              {request.githubRepository.replace(
                                "https://github.com/",
                                ""
                              )}
                            </a>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-gray-400 text-sm mb-1">
                              Applicants:
                            </h4>
                            <p className="text-gray-200">
                              {request.applicants.length} total applications (
                              {
                                request.applicants.filter(
                                  (app) => app.status === "Accepted"
                                ).length
                              }{" "}
                              accepted)
                            </p>
                          </div>

                          {request.offersMentorship && (
                            <div>
                              <h4 className="text-gray-400 text-sm mb-1">
                                Mentorship Requests:
                              </h4>
                              <p className="text-gray-200">
                                {request.mentorshipRequests?.length || 0}{" "}
                                requests (
                                {request.mentorshipRequests?.filter(
                                  (req) => req.status === "Accepted"
                                ).length || 0}{" "}
                                accepted)
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-3">
                          <Link
                            to={`/collaborations/${request._id}`}
                            className="flex-1 bg-blue-600 hover:bg-purple-700 text-white text-center font-medium py-2 rounded-lg transition"
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

          {/* My Applications and Mentorship Requests */}
          {activeTab === "my-applications" && (
            <div>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : myApplications.length === 0 &&
                myMentorshipRequests.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 mb-4">
                    You haven't applied to any collaboration requests yet.
                  </p>
                  <button
                    onClick={() => setActiveTab("browse")}
                    className="px-4 py-2 bg-blue-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
                  >
                    Browse Requests
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Applications Section */}
                  {myApplications.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-4">
                        Your Applications
                      </h2>
                      <div className="space-y-4">
                        {myApplications.map((item, index) => (
                          <div
                            key={index}
                            className="bg-[#2C2C2C] rounded-xl p-6"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                  {item.collaboration.title}
                                </h3>
                                <p className="text-sm text-gray-400 mb-1">
                                  Created by:{" "}
                                  {item.collaboration.createdBy?.username ||
                                    item.collaboration.createdBy?.email ||
                                    "Unknown"}
                                </p>
                                <p className="text-sm text-gray-400 mb-3">
                                  Applied on:{" "}
                                  {new Date(
                                    item.application.appliedAt
                                  ).toLocaleDateString()}
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

                            {item.application.githubProfile && (
                              <div className="mt-3 mb-4">
                                <h4 className="text-gray-400 text-sm mb-1">
                                  Your GitHub Profile:
                                </h4>
                                <a
                                  href={item.application.githubProfile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white hover:text-white transition"
                                >
                                  {item.application.githubProfile}
                                </a>
                              </div>
                            )}

                            <div className="mt-4">
                              <Link
                                to={`/collaborations/${item.collaboration._id}`}
                                className="w-full block text-center bg-blue-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mentorship Requests Section */}
                  {myMentorshipRequests.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-4">
                        Your Mentorship Requests
                      </h2>
                      <div className="space-y-4">
                        {myMentorshipRequests.map((item, index) => (
                          <div
                            key={index}
                            className="bg-[#2C2C2C] rounded-xl p-6"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                  {item.collaboration.title}
                                </h3>
                                <p className="text-sm text-gray-400 mb-1">
                                  Created by:{" "}
                                  {item.collaboration.createdBy?.username ||
                                    item.collaboration.createdBy?.email ||
                                    "Unknown"}
                                </p>
                                <p className="text-sm text-gray-400 mb-3">
                                  Requested on:{" "}
                                  {new Date(
                                    item.request.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    item.request.status === "Accepted"
                                      ? "bg-green-600 text-white"
                                      : item.request.status === "Rejected"
                                      ? "bg-red-600 text-white"
                                      : "bg-yellow-600 text-white"
                                  }`}
                                >
                                  Mentorship: {item.request.status}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 mb-3">
                              <h4 className="text-gray-400 text-sm mb-1">
                                Topic:
                              </h4>
                              <p className="text-white font-medium">
                                {item.request.topic}
                              </p>
                            </div>

                            {item.request.mentorMessage && (
                              <div className="mt-3 mb-4 bg-[#363636] p-3 rounded-lg">
                                <h4 className="text-gray-400 text-sm mb-1">
                                  Mentor's Message:
                                </h4>
                                <p className="text-gray-200 italic">
                                  {item.request.mentorMessage}
                                </p>
                              </div>
                            )}

                            <div className="mt-4">
                              <Link
                                to={`/collaborations/${item.collaboration._id}`}
                                className="w-full block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationHub;
