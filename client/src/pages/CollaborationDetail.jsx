import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CollaborationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collaboration, setCollaboration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    skills: "",
    message: "",
  });
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchCollaboration = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/collaborations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        }
      );

      setCollaboration(response.data);

      // Extract current user ID from token for owner checks
      try {
        if (token) {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            const userId = payload?.id || payload?.userId;
            setCurrentUserId(userId);

            if (userId && response.data.createdBy?._id) {
              setIsOwner(response.data.createdBy._id === userId);
            }
          }
        }
      } catch (err) {
        console.error("Error checking ownership:", err);
      }
    } catch (err) {
      console.error("Error fetching collaboration:", err);
      setError("Failed to load collaboration details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaboration();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      await axios.post(
        `http://localhost:5000/api/collaborations/${id}/apply`,
        applicationForm,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Application submitted successfully!");
      setShowApplicationForm(false);
      fetchCollaboration();
    } catch (error) {
      alert(
        "Failed to submit application: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setApplying(false);
    }
  };

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/collaborations/${id}/applications/${applicationId}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(`Applicant ${status.toLowerCase()} successfully`);
      fetchCollaboration();
    } catch (error) {
      alert(
        "Failed to update application: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCloseRequest = async () => {
    if (
      window.confirm(
        "Are you sure you want to close this collaboration request?"
      )
    ) {
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
        fetchCollaboration();
      } catch (error) {
        alert(
          "Failed to close request: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  // Check if the user has already applied
  let userApplication = null;
  if (currentUserId && collaboration?.applicants) {
    userApplication = collaboration.applicants.find(
      (app) => app.user && app.user._id === currentUserId
    );
  }

  // Check if the user can apply
  const canApply =
    !isOwner && !userApplication && collaboration?.status === "Open";

  // Get creator display name
  const creatorName =
    collaboration?.createdBy?.username ||
    collaboration?.createdBy?.email ||
    "Unknown";

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
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/collaborations")}
              className="flex items-center text-purple-400 hover:text-purple-300 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Collaborations
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error || !collaboration ? (
            <div className="text-center py-16">
              <p className="text-xl text-red-400 mb-4">
                {error || "Collaboration not found"}
              </p>
              <button
                onClick={() => navigate("/collaborations")}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
              >
                Back to Collaborations
              </button>
            </div>
          ) : (
            <div>
              {/* Collaboration Header */}
              <div className="mb-8">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-purple-300">
                    {collaboration.title}
                  </h1>
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      collaboration.status === "Open"
                        ? "bg-green-600 text-white"
                        : collaboration.status === "Filled"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {collaboration.status}
                  </span>
                </div>
                <p className="text-gray-400 mt-2">Created by {creatorName}</p>
                <p className="text-gray-400 text-sm">
                  Created on{" "}
                  {new Date(collaboration.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Collaboration Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Project Description */}
                  <div className="bg-[#2C2C2C] rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-purple-300 mb-4">
                      Project Description
                    </h2>
                    <p className="text-gray-200 whitespace-pre-line">
                      {collaboration.projectDescription ||
                        "No project description provided."}
                    </p>
                  </div>

                  {/* Collaboration Details */}
                  <div className="bg-[#2C2C2C] rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-purple-300 mb-4">
                      Collaboration Details
                    </h2>
                    <p className="text-gray-200 whitespace-pre-line">
                      {collaboration.description}
                    </p>
                  </div>

                  {/* Owner Actions or Application UI */}
                  <div className="bg-[#2C2C2C] rounded-xl p-6">
                    {isOwner ? (
                      <div>
                        <h2 className="text-xl font-semibold text-purple-300 mb-4">
                          Manage Collaboration
                        </h2>
                        <button
                          onClick={handleCloseRequest}
                          disabled={collaboration.status !== "Open"}
                          className={`w-full py-3 rounded-lg font-medium ${
                            collaboration.status === "Open"
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-gray-700 text-gray-400 cursor-not-allowed"
                          } transition`}
                        >
                          {collaboration.status === "Open"
                            ? "Close Request"
                            : "Request Closed"}
                        </button>
                      </div>
                    ) : userApplication ? (
                      <div>
                        <h2 className="text-xl font-semibold text-purple-300 mb-4">
                          Your Application
                        </h2>
                        <div className="bg-[#363636] rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300">Status:</span>
                            <span
                              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                userApplication.status === "Accepted"
                                  ? "bg-green-600 text-white"
                                  : userApplication.status === "Rejected"
                                  ? "bg-red-600 text-white"
                                  : "bg-yellow-600 text-white"
                              }`}
                            >
                              {userApplication.status}
                            </span>
                          </div>
                          <div className="mt-3">
                            <h3 className="text-sm text-gray-400 mb-1">
                              Your skills:
                            </h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {userApplication.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-[#444444] text-gray-200 px-2 py-1 rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="border-t border-gray-600 my-3 pt-3">
                            <h3 className="text-sm text-gray-400 mb-1">
                              Your message:
                            </h3>
                            <p className="text-gray-200">
                              {userApplication.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : canApply ? (
                      <div>
                        <h2 className="text-xl font-semibold text-purple-300 mb-4">
                          Apply for Collaboration
                        </h2>
                        {!showApplicationForm ? (
                          <button
                            onClick={() => setShowApplicationForm(true)}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition"
                          >
                            Apply Now
                          </button>
                        ) : (
                          <form onSubmit={handleApply} className="space-y-4">
                            <div>
                              <label
                                htmlFor="skills"
                                className="block text-sm font-medium text-gray-300 mb-2"
                              >
                                Your Skills (comma separated)
                              </label>
                              <input
                                type="text"
                                id="skills"
                                name="skills"
                                value={applicationForm.skills}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#363636] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="E.g., React, Node.js, MongoDB"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="message"
                                className="block text-sm font-medium text-gray-300 mb-2"
                              >
                                Why do you want to collaborate?
                              </label>
                              <textarea
                                id="message"
                                name="message"
                                value={applicationForm.message}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="w-full bg-[#363636] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Describe why you're interested and what you can contribute..."
                              />
                            </div>
                            <div className="flex space-x-3">
                              <button
                                type="button"
                                onClick={() => setShowApplicationForm(false)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={applying}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-70"
                              >
                                {applying
                                  ? "Submitting..."
                                  : "Submit Application"}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-xl text-gray-400">
                          {collaboration.status === "Open"
                            ? "You've already applied to this request"
                            : "Applications are Closed"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Collaboration Info Card */}
                  <div className="bg-[#2C2C2C] rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-purple-300 mb-4">
                      Details
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm text-gray-400 mb-1">
                          Positions Available:
                        </h3>
                        <p className="font-medium">
                          {collaboration.positionsAvailable}
                        </p>
                      </div>

                      {collaboration.deadline && (
                        <div>
                          <h3 className="text-sm text-gray-400 mb-1">
                            Application Deadline:
                          </h3>
                          <p className="font-medium">
                            {new Date(
                              collaboration.deadline
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm text-gray-400 mb-1">
                          Required Skills:
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Array.isArray(collaboration.requiredSkills) &&
                          collaboration.requiredSkills.length > 0 ? (
                            collaboration.requiredSkills.map((skill, index) => (
                              <span
                                key={index}
                                className="text-xs bg-[#3A3A3A] text-gray-200 px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">
                              No specific skills required
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm text-gray-400 mb-1">
                          Total Applicants:
                        </h3>
                        <p className="font-medium">
                          {collaboration.applicants.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Applicants Section (Only for owner) */}
                  {isOwner &&
                    collaboration.applicants &&
                    collaboration.applicants.length > 0 && (
                      <div className="bg-[#2C2C2C] rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-4">
                          Applicants ({collaboration.applicants.length})
                        </h2>
                        <div className="space-y-4">
                          {collaboration.applicants.map((applicant) => (
                            <div
                              key={applicant._id}
                              className="bg-[#363636] rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">
                                  {applicant.user?.username ||
                                    applicant.user?.email ||
                                    "Anonymous"}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    applicant.status === "Accepted"
                                      ? "bg-green-600 text-white"
                                      : applicant.status === "Rejected"
                                      ? "bg-red-600 text-white"
                                      : "bg-yellow-600 text-white"
                                  }`}
                                >
                                  {applicant.status}
                                </span>
                              </div>

                              <div className="mb-3">
                                <span className="text-xs text-gray-400">
                                  Skills:
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {applicant.skills &&
                                  Array.isArray(applicant.skills) &&
                                  applicant.skills.length > 0 ? (
                                    applicant.skills.map((skill, idx) => (
                                      <span
                                        key={idx}
                                        className="text-xs bg-[#444444] text-gray-200 px-2 py-1 rounded"
                                      >
                                        {skill}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-gray-400">
                                      None specified
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="border-t border-gray-600 py-2 my-2">
                                <span className="text-xs text-gray-400">
                                  Message:
                                </span>
                                <p className="mt-1 text-sm">
                                  {applicant.message || "No message"}
                                </p>
                              </div>

                              {applicant.status === "Pending" &&
                                collaboration.status === "Open" && (
                                  <div className="flex space-x-2 mt-3">
                                    <button
                                      onClick={() =>
                                        handleApplicationStatus(
                                          applicant._id,
                                          "Accepted"
                                        )
                                      }
                                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded transition"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleApplicationStatus(
                                          applicant._id,
                                          "Rejected"
                                        )
                                      }
                                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded transition"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationDetail;
