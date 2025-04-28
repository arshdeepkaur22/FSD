import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import {
  Search,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Mentorship = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("available");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableMentors, setAvailableMentors] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestForm, setRequestForm] = useState({
    topic: "",
    description: "",
    preferredTimeSlots: "",
  });
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  // Get user info from localStorage
  const getUserData = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  };

  const userData = getUserData();
  const isTeacher = userData?.role === "teacher";
  const userId = userData?._id;

  // Load data based on active tab
  useEffect(() => {
    if (!userId) return;

    if (activeTab === "available") {
      fetchAvailableMentors();
    } else if (activeTab === "pending") {
      fetchPendingRequests();
    } else if (activeTab === "active") {
      fetchActiveSessions();
    }
  }, [activeTab, userId]);

  // Fetch available mentors (collaborations that offer mentorship)
  const fetchAvailableMentors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/collaborations",
        {
          params: {
            offersMentorship: true,
            status: "Open",
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAvailableMentors(response.data.collaborations || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching available mentors:", err);
      setError("Failed to load available mentors");
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending requests (different for teachers and students)
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      if (isTeacher) {
        // SIMPLIFIED: For teachers - get ALL pending mentorship requests
        const response = await axios.get(
          "http://localhost:5000/api/collaborations/mentorship/all-pending",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setPendingRequests(response.data.requests || []);
      } else {
        // For students - get their own pending requests
        const response = await axios.get(
          "http://localhost:5000/api/collaborations/my/applications",
          {
            params: { userId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Filter to pending mentorship requests only
        const pendingRequests = (response.data.mentorshipRequests || []).filter(
          (req) => req.request && req.request.status === "Pending"
        );

        setPendingRequests(pendingRequests);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
      setError("Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch active mentoring sessions (different for teachers and students)
  const fetchActiveSessions = async () => {
    setLoading(true);
    try {
      if (isTeacher) {
        // SIMPLIFIED: For teachers - get ALL active mentorship sessions
        const response = await axios.get(
          "http://localhost:5000/api/collaborations/mentorship/all-active",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setActiveSessions(response.data.requests || []);
      } else {
        // For students - get their own accepted requests
        const response = await axios.get(
          "http://localhost:5000/api/collaborations/my/applications",
          {
            params: { userId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Filter to accepted mentorship requests only
        const acceptedRequests = (
          response.data.mentorshipRequests || []
        ).filter((req) => req.request && req.request.status === "Accepted");

        setActiveSessions(acceptedRequests);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching active sessions:", err);
      setError("Failed to load active mentoring sessions");
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the request form
  const handleOpenRequestForm = (mentor) => {
    setSelectedMentor(mentor);
    setRequestForm({
      topic: "",
      description: "",
      preferredTimeSlots: "",
    });
    setShowRequestForm(true);
  };

  // Handle input changes for forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submitting a mentorship request
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("You must be logged in to request mentorship");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/collaborations/${selectedMentor._id}/mentorship`,
        {
          ...requestForm,
          userId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("Mentorship request submitted successfully");
      setShowRequestForm(false);

      // If we're on the pending tab, refresh the data
      if (activeTab === "pending") {
        fetchPendingRequests();
      }
    } catch (err) {
      console.error("Error submitting request:", err);
      alert(
        "Failed to submit request: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle responding to a mentorship request (for teachers)
  const handleOpenResponseForm = (request) => {
    setSelectedRequest(request);
    setResponseMessage("");
    setShowResponseForm(true);
  };

  // Handle submitting a response to a mentorship request
  const handleSubmitResponse = async (status) => {
    if (!selectedRequest || !userId) return;

    setLoading(true);
    try {
      const collabId = selectedRequest.collaboration._id;
      const requestId = selectedRequest._id;

      await axios.put(
        `http://localhost:5000/api/collaborations/${collabId}/mentorship/${requestId}`,
        {
          status,
          mentorMessage: responseMessage,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert(`Mentorship request ${status.toLowerCase()}`);
      setShowResponseForm(false);

      // Refresh the pending requests list
      fetchPendingRequests();

      // If we just accepted a request, also refresh active sessions
      if (status === "Accepted") {
        fetchActiveSessions();
      }
    } catch (err) {
      console.error("Error responding to request:", err);
      alert(
        "Failed to respond: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search term
  const filterItems = (items) => {
    if (!searchTerm.trim()) return items;

    return items.filter((item) => {
      // Different properties to search depending on the type of item
      if (activeTab === "available") {
        return (
          (item.title &&
            item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.projectDescription &&
            item.projectDescription
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (item.requiredSkills &&
            item.requiredSkills.some((skill) =>
              skill.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        );
      } else {
        // For requests and sessions
        return (
          (item.topic &&
            item.topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.description &&
            item.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (item.collaboration?.title &&
            item.collaboration.title
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
        );
      }
    });
  };

  // Render loading state
  const renderLoading = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className="text-center py-12 bg-[#2C2C2C]/50 rounded-lg">
      <p className="text-red-400 mb-4">{error}</p>
      <button
        onClick={() => {
          if (activeTab === "available") fetchAvailableMentors();
          else if (activeTab === "pending") fetchPendingRequests();
          else fetchActiveSessions();
        }}
        className="px-4 py-2 bg-white hover:bg-white text-white rounded-lg"
      >
        Retry
      </button>
    </div>
  );

  // Render the available mentors section
  const renderAvailableMentors = () => {
    const filteredMentors = filterItems(availableMentors);

    if (!filteredMentors || filteredMentors.length === 0) {
      return (
        <div className="text-center py-12 bg-[#2C2C2C]/50 rounded-lg">
          <p className="text-gray-300">No mentors currently available.</p>
          <p className="text-gray-400 mt-2">
            Check back later or try a different search term.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor._id}
            className="bg-[#2C2C2C] rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-3">
              <h3 className="font-bold text-white truncate">{mentor.title}</h3>
            </div>
            <div className="p-5">
              <p className="text-gray-300 mb-4 line-clamp-3">
                {mentor.projectDescription}
              </p>

              {mentor.requiredSkills && mentor.requiredSkills.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">
                    Skills:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {mentor.requiredSkills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-[#3A3A3A] text-gray-200 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.requiredSkills.length > 3 && (
                      <span className="bg-[#3A3A3A] text-gray-200 text-xs px-2 py-1 rounded">
                        +{mentor.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <span className="text-sm text-gray-400">
                  By:{" "}
                  {mentor.createdBy?.username ||
                    mentor.createdBy?.email ||
                    "Anonymous"}
                </span>
              </div>

              <button
                onClick={() => handleOpenRequestForm(mentor)}
                disabled={isTeacher}
                className={`w-full py-2 text-white font-medium rounded-lg transition ${
                  isTeacher
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isTeacher ? "" : "Request Mentorship"}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render pending requests section (different for teachers and students)
  const renderPendingRequests = () => {
    const filteredRequests = filterItems(pendingRequests);

    if (!filteredRequests || filteredRequests.length === 0) {
      return (
        <div className="text-center py-12 bg-[#2C2C2C]/50 rounded-lg">
          <p className="text-gray-300">No pending mentorship requests.</p>
          {!isTeacher && (
            <button
              onClick={() => setActiveTab("available")}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Find a Mentor
            </button>
          )}
        </div>
      );
    }

    return isTeacher ? (
      // Teacher view - list of requests from students
      <div className="space-y-6">
        {filteredRequests.map((request) => (
          <div
            key={request._id}
            className="bg-[#2C2C2C] rounded-lg p-5 border-l-4 border-yellow-600"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-purple-300">
                  {request.topic || "No topic provided"}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  For: {request.collaboration?.title || "Unknown project"}
                </p>
              </div>
              <span className="bg-yellow-500/20 text-yellow-200 text-xs px-3 py-1 rounded-full">
                Pending
              </span>
            </div>

            <div className="mt-3">
              <p className="text-gray-300 text-sm whitespace-pre-line">
                {request.description || "No description provided"}
              </p>
            </div>

            {request.preferredTimeSlots && (
              <div className="mt-3 flex items-center text-sm text-gray-400">
                <Clock size={16} className="mr-2" />
                <span>Preferred times: {request.preferredTimeSlots}</span>
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Requested by:{" "}
                <span className="text-gray-300">
                  {request.user?.username ||
                    request.user?.email ||
                    "Unknown student"}
                </span>
              </p>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleOpenResponseForm(request)}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
              >
                Respond
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      // Student view - their own pending requests
      <div className="space-y-6">
        {filteredRequests.map((item, index) => (
          <div
            key={index}
            className="bg-[#2C2C2C] rounded-lg p-5 border-l-4 border-yellow-600"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-purple-300">
                  {item.request?.topic || "No topic provided"}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  For: {item.collaboration?.title || "Unknown project"}
                </p>
              </div>
              <span className="bg-yellow-500/20 text-yellow-200 text-xs px-3 py-1 rounded-full">
                Pending
              </span>
            </div>

            <div className="mt-3">
              <p className="text-gray-300 text-sm whitespace-pre-line">
                {item.request?.description || "No description provided"}
              </p>
            </div>

            {item.request?.preferredTimeSlots && (
              <div className="mt-3 flex items-center text-sm text-gray-400">
                <Clock size={16} className="mr-2" />
                <span>Preferred times: {item.request.preferredTimeSlots}</span>
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Sent to:{" "}
                <span className="text-gray-300">
                  {item.collaboration?.createdBy?.username || "Unknown teacher"}
                </span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Sent on:{" "}
                <span className="text-gray-300">
                  {item.request?.createdAt
                    ? new Date(item.request.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render active sessions section (different for teachers and students)
  const renderActiveSessions = () => {
    const filteredSessions = filterItems(activeSessions);

    if (!filteredSessions || filteredSessions.length === 0) {
      return (
        <div className="text-center py-12 bg-[#2C2C2C]/50 rounded-lg">
          <p className="text-gray-300">No active mentoring sessions.</p>
          <button
            onClick={() => setActiveTab(isTeacher ? "pending" : "available")}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            {isTeacher ? "View Pending Requests" : "Find a Mentor"}
          </button>
        </div>
      );
    }

    return isTeacher ? (
      // Teacher view - students they're mentoring
      <div className="space-y-6">
        {filteredSessions.map((session) => (
          <div
            key={session._id}
            className="bg-[#2C2C2C] rounded-lg p-5 border-l-4 border-green-600"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-purple-300">
                  {session.topic || "No topic provided"}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  For: {session.collaboration?.title || "Unknown project"}
                </p>
              </div>
              <span className="bg-green-500/20 text-green-200 text-xs px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="mt-3">
              <p className="text-gray-300 text-sm whitespace-pre-line">
                {session.description || "No description provided"}
              </p>
            </div>

            {session.preferredTimeSlots && (
              <div className="mt-3 flex items-center text-sm text-gray-400">
                <Clock size={16} className="mr-2" />
                <span>Preferred times: {session.preferredTimeSlots}</span>
              </div>
            )}

            {session.mentorMessage && (
              <div className="mt-4 bg-indigo-900/30 rounded-lg p-3 border border-indigo-800/50">
                <h4 className="text-sm font-medium text-indigo-300 mb-1">
                  Your Message:
                </h4>
                <p className="text-sm text-gray-300">{session.mentorMessage}</p>
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Student:{" "}
                <span className="text-gray-300">
                  {session.user?.username ||
                    session.user?.email ||
                    "Unknown student"}
                </span>
              </p>
            </div>

            <div className="mt-4">
              <button
                onClick={() => alert("Messaging feature coming soon!")}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
              >
                <MessageSquare size={18} className="mr-2" />
                Message Student
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      // Student view - their active mentorship
      <div className="space-y-6">
        {filteredSessions.map((item, index) => (
          <div
            key={index}
            className="bg-[#2C2C2C] rounded-lg p-5 border-l-4 border-green-600"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-purple-300">
                  {item.request?.topic || "No topic provided"}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  For: {item.collaboration?.title || "Unknown project"}
                </p>
              </div>
              <span className="bg-green-500/20 text-green-200 text-xs px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="mt-3">
              <p className="text-gray-300 text-sm whitespace-pre-line">
                {item.request?.description || "No description provided"}
              </p>
            </div>

            {item.request?.mentorMessage && (
              <div className="mt-4 bg-indigo-900/30 rounded-lg p-3 border border-indigo-800/50">
                <h4 className="text-sm font-medium text-indigo-300 mb-1">
                  Message from Mentor:
                </h4>
                <p className="text-sm text-gray-300">
                  {item.request.mentorMessage}
                </p>
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Mentor:{" "}
                <span className="text-gray-300">
                  {item.collaboration?.createdBy?.username ||
                    item.collaboration?.createdBy?.email ||
                    "Unknown teacher"}
                </span>
              </p>
            </div>

            <div className="mt-4">
              <button
                onClick={() => alert("Messaging feature coming soon!")}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
              >
                <MessageSquare size={18} className="mr-2" />
                Message Mentor
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Mentorship Hub</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isTeacher ? "bg-blue-600" : "bg-indigo-600"
              }`}
            >
              {isTeacher ? "Teacher" : "Student"} View
            </span>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-gray-700 mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "available"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("available")}
            >
              Request Mentorship
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "pending"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              {isTeacher ? "Pending Requests" : "My Requests"}
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "active"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active Mentorship Sessions
            </button>
          </div>

          {/* Search Bar */}

          {/* Main Content */}
          <div>
            {loading
              ? renderLoading()
              : error
              ? renderError()
              : activeTab === "available"
              ? renderAvailableMentors()
              : activeTab === "pending"
              ? renderPendingRequests()
              : renderActiveSessions()}
          </div>
        </div>
      </div>

      {/* Mentorship Request Modal */}
      {showRequestForm && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-lg border-2 border-indigo-800/50">
            <h3 className="text-xl font-bold text-indigo-300 mb-4">
              Request Mentorship
            </h3>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  name="topic"
                  value={requestForm.topic}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#2C2C2C] text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="E.g., React State Management"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Preferred Time Slots (Optional)
                </label>
                <input
                  type="text"
                  name="preferredTimeSlots"
                  value={requestForm.preferredTimeSlots}
                  onChange={handleInputChange}
                  className="w-full bg-[#2C2C2C] text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="E.g., Weekdays after 5pm, Weekend mornings"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={requestForm.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full bg-[#2C2C2C] text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe what you want to learn and any specific topics you need help with..."
                ></textarea>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Response Modal for Teachers */}
      {showResponseForm && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-lg border-2 border-indigo-800/50">
            <h3 className="text-xl font-bold text-indigo-300 mb-4">
              Respond to Mentorship Request
            </h3>

            <div className="mb-4">
              <h4 className="font-medium text-gray-300">Request Details</h4>
              <p>
                <span className="text-gray-400">Topic:</span>{" "}
                {selectedRequest.topic}
              </p>
              <p>
                <span className="text-gray-400">From:</span>{" "}
                {selectedRequest.user?.username || "Unknown student"}
              </p>
              <p className="text-sm text-gray-300 mt-2">
                {selectedRequest.description}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Message to Student (Optional)
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={4}
                className="w-full bg-[#2C2C2C] text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Provide details about the mentoring arrangement..."
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowResponseForm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitResponse("Rejected")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex-1 flex items-center justify-center"
              >
                <XCircle size={16} className="mr-2" />
                Decline Request
              </button>
              <button
                onClick={() => handleSubmitResponse("Accepted")}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex-1 flex items-center justify-center"
              >
                <CheckCircle size={16} className="mr-2" />
                Accept Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentorship;
