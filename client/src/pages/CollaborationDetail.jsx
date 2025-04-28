import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collaborationsApi } from "../services/api";
import GitHubService from "../services/githubService"; // This import now works with the ES modules syntax
import Header from "../components/Header";

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
    githubProfile: "",
  });
  const [mentorshipForm, setMentorshipForm] = useState({
    topic: "",
    description: "",
    preferredTimeSlots: "",
  });
  const [applying, setApplying] = useState(false);
  const [requestingMentorship, setRequestingMentorship] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showMentorshipForm, setShowMentorshipForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [repoInfo, setRepoInfo] = useState(null);
  const [loadingRepo, setLoadingRepo] = useState(false);

  const fetchCollaboration = async () => {
    setLoading(true);
    try {
      const response = await collaborationsApi.getCollaborationById(id);
      setCollaboration(response.data);

      // Extract current user ID from token for owner checks
      try {
        const token = localStorage.getItem("token");
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

      // If collaboration has a GitHub repository, fetch its info
      if (response.data.githubRepository) {
        fetchRepositoryInfo(response.data.githubRepository);
      }
    } catch (err) {
      console.error("Error fetching collaboration:", err);
      setError("Failed to load collaboration details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRepositoryInfo = async (repoUrl) => {
    if (!repoUrl) return;

    setLoadingRepo(true);
    try {
      const result = await GitHubService.getRepositoryInfo(repoUrl);
      if (result.success) {
        setRepoInfo(result.data);
      }
    } catch (error) {
      console.error("Error fetching repository info:", error);
    } finally {
      setLoadingRepo(false);
    }
  };

  useEffect(() => {
    fetchCollaboration();
  }, [id]);

  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      await collaborationsApi.applyToCollaboration(id, applicationForm);
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

  const handleMentorshipRequest = async (e) => {
    e.preventDefault();
    setRequestingMentorship(true);

    try {
      await collaborationsApi.requestMentorship(id, mentorshipForm);
      alert("Mentorship request submitted successfully!");
      setShowMentorshipForm(false);
      fetchCollaboration();
    } catch (error) {
      alert(
        "Failed to submit mentorship request: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setRequestingMentorship(false);
    }
  };

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      await collaborationsApi.updateApplicationStatus(
        id,
        applicationId,
        status
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

  const handleMentorshipStatus = async (requestId, status) => {
    try {
      await collaborationsApi.respondToMentorshipRequest(id, requestId, status);
      alert(`Mentorship request ${status.toLowerCase()} successfully`);
      fetchCollaboration();
    } catch (error) {
      alert(
        "Failed to update mentorship request: " +
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
        await collaborationsApi.closeCollaboration(id);
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

  // Check if the user has already requested mentorship
  let userMentorshipRequest = null;
  if (currentUserId && collaboration?.mentorshipRequests) {
    userMentorshipRequest = collaboration.mentorshipRequests.find(
      (req) => req.user && req.user._id === currentUserId
    );
  }

  // Check if the user can apply or request mentorship
  const canApply =
    !isOwner && !userApplication && collaboration?.status === "Open";
  const canRequestMentorship =
    !isOwner &&
    (!userMentorshipRequest || userMentorshipRequest.status === "Rejected") &&
    collaboration?.status === "Open";

  // Get creator display name
  const creatorName =
    collaboration?.createdBy?.username ||
    collaboration?.createdBy?.email ||
    "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
      <Header></Header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl p-8">
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/collaborationHub")}
              className="flex items-center text-white hover:text-purple-300 transition"
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

                  {/* GitHub Repository (if available) */}
                  {collaboration.githubRepository && (
                    <div className="bg-[#2C2C2C] rounded-xl p-6">
                      <h2 className="text-xl font-semibold text-purple-300 mb-4">
                        GitHub Repository
                      </h2>

                      <div className="flex items-center mb-4">
                        <svg
                          className="w-5 h-5 text-white mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                        <a
                          href={collaboration.githubRepository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-white transition"
                        >
                          {collaboration.githubRepository}
                        </a>
                      </div>

                      {loadingRepo ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                      ) : repoInfo ? (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center bg-[#333] rounded-md px-3 py-1">
                              <svg
                                className="w-4 h-4 text-yellow-400 mr-1"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
                              </svg>
                              <span>{repoInfo.stars || 0} Stars</span>
                            </div>
                            <div className="flex items-center bg-[#333] rounded-md px-3 py-1">
                              <svg
                                className="w-4 h-4 text-white mr-1"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                              </svg>
                              <span>{repoInfo.forks || 0} Forks</span>
                            </div>
                            <div className="flex items-center bg-[#333] rounded-md px-3 py-1">
                              <svg
                                className="w-4 h-4 text-white mr-1"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
                              </svg>
                              <span>{repoInfo.issues || 0} Issues</span>
                            </div>
                          </div>

                          {repoInfo.languages && (
                            <div className="mt-3">
                              <h3 className="text-sm font-medium text-gray-300 mb-2">
                                Languages:
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(repoInfo.languages).map(
                                  ([language, percentage]) => (
                                    <span
                                      key={language}
                                      className="text-xs px-2 py-1 bg-[#333] rounded-md"
                                    >
                                      {language}: {percentage}%
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">
                          Repository information unavailable
                        </p>
                      )}
                    </div>
                  )}

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
                              {userApplication.skills &&
                                userApplication.skills.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-[#444444] text-gray-200 px-2 py-1 rounded"
                                  >
                                    {skill}
                                  </span>
                                ))}
                            </div>
                          </div>
                          {userApplication.githubProfile && (
                            <div className="mt-3">
                              <h3 className="text-sm text-gray-400 mb-1">
                                GitHub Profile:
                              </h3>
                              <a
                                href={userApplication.githubProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-white transition text-sm"
                              >
                                {userApplication.githubProfile}
                              </a>
                            </div>
                          )}
                          <div className="border-t border-gray-600 my-3 pt-3">
                            <h3 className="text-sm text-gray-400 mb-1">
                              Your message:
                            </h3>
                            <p className="text-gray-200">
                              {userApplication.message}
                            </p>
                          </div>
                        </div>

                        {/* Mentorship Request Button */}
                        {canRequestMentorship && (
                          <div className="mt-4">
                            {!showMentorshipForm ? (
                              <button
                                onClick={() => setShowMentorshipForm(true)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition"
                              >
                                Request Mentorship
                              </button>
                            ) : (
                              <MentorshipRequestForm
                                mentorshipForm={mentorshipForm}
                                handleInputChange={(e) =>
                                  handleInputChange(e, setMentorshipForm)
                                }
                                handleSubmit={handleMentorshipRequest}
                                isSubmitting={requestingMentorship}
                                onCancel={() => setShowMentorshipForm(false)}
                              />
                            )}
                          </div>
                        )}
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
                                onChange={(e) =>
                                  handleInputChange(e, setApplicationForm)
                                }
                                required
                                className="w-full bg-[#363636] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="E.g., React, Node.js, MongoDB"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="githubProfile"
                                className="block text-sm font-medium text-gray-300 mb-2"
                              >
                                GitHub Profile URL
                              </label>
                              <input
                                type="url"
                                id="githubProfile"
                                name="githubProfile"
                                value={applicationForm.githubProfile}
                                onChange={(e) =>
                                  handleInputChange(e, setApplicationForm)
                                }
                                className="w-full bg-[#363636] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://github.com/yourusername"
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                Optional: Add your GitHub profile for
                                verification
                              </p>
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
                                onChange={(e) =>
                                  handleInputChange(e, setApplicationForm)
                                }
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

                        {/* Mentorship Request Button for users who can't apply but can request mentorship */}
                        {canRequestMentorship && (
                          <div className="mt-4">
                            {!showMentorshipForm ? (
                              <button
                                onClick={() => setShowMentorshipForm(true)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition"
                              >
                                Request Mentorship
                              </button>
                            ) : (
                              <MentorshipRequestForm
                                mentorshipForm={mentorshipForm}
                                handleInputChange={(e) =>
                                  handleInputChange(e, setMentorshipForm)
                                }
                                handleSubmit={handleMentorshipRequest}
                                isSubmitting={requestingMentorship}
                                onCancel={() => setShowMentorshipForm(false)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Show mentorship request status if user has requested mentorship */}
                  {userMentorshipRequest && (
                    <div className="bg-[#2C2C2C] rounded-xl p-6">
                      <h2 className="text-xl font-semibold text-purple-300 mb-4">
                        Your Mentorship Request
                      </h2>
                      <div className="bg-[#363636] rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-300">Status:</span>
                          <span
                            className={`text-sm font-semibold px-3 py-1 rounded-full ${
                              userMentorshipRequest.status === "Accepted"
                                ? "bg-green-600 text-white"
                                : userMentorshipRequest.status === "Rejected"
                                ? "bg-red-600 text-white"
                                : "bg-yellow-600 text-white"
                            }`}
                          >
                            {userMentorshipRequest.status}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-sm text-gray-400 mb-1">Topic:</h3>
                          <p className="text-gray-200 font-medium">
                            {userMentorshipRequest.topic}
                          </p>
                        </div>

                        <div className="mt-3">
                          <h3 className="text-sm text-gray-400 mb-1">
                            Preferred Time Slots:
                          </h3>
                          <p className="text-gray-200">
                            {userMentorshipRequest.preferredTimeSlots}
                          </p>
                        </div>

                        <div className="border-t border-gray-600 my-3 pt-3">
                          <h3 className="text-sm text-gray-400 mb-1">
                            Description:
                          </h3>
                          <p className="text-gray-200 whitespace-pre-line">
                            {userMentorshipRequest.description}
                          </p>
                        </div>

                        {userMentorshipRequest.status === "Accepted" &&
                          userMentorshipRequest.mentorMessage && (
                            <div className="border-t border-gray-600 my-3 pt-3">
                              <h3 className="text-sm text-gray-400 mb-1">
                                Message from Mentor:
                              </h3>
                              <p className="text-gray-200 whitespace-pre-line">
                                {userMentorshipRequest.mentorMessage}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
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
                          Offering Mentorship:
                        </h3>
                        <p className="font-medium">
                          {collaboration.offersMentorship ? "Yes" : "No"}
                        </p>
                      </div>

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
                          {collaboration.applicants?.length || 0}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm text-gray-400 mb-1">
                          Mentorship Requests:
                        </h3>
                        <p className="font-medium">
                          {collaboration.mentorshipRequests?.length || 0}
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

                              {applicant.githubProfile && (
                                <div className="mb-3">
                                  <span className="text-xs text-gray-400">
                                    GitHub:
                                  </span>
                                  <div className="mt-1">
                                    <a
                                      href={applicant.githubProfile}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-white hover:text-white transition text-xs"
                                    >
                                      {applicant.githubProfile}
                                    </a>
                                  </div>
                                </div>
                              )}

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

                  {/* Mentorship Requests Section (Only for owner) 
                  {isOwner &&
                    collaboration.mentorshipRequests &&
                    collaboration.mentorshipRequests.length > 0 && (
                      <div className="bg-[#2C2C2C] rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-4">
                          Mentorship Requests (
                          {collaboration.mentorshipRequests.length})
                        </h2>
                        <div className="space-y-4">
                          {collaboration.mentorshipRequests.map((request) => (
                            <div
                              key={request._id}
                              className="bg-[#363636] rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">
                                  {request.user?.username ||
                                    request.user?.email ||
                                    "Anonymous"}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    request.status === "Accepted"
                                      ? "bg-green-600 text-white"
                                      : request.status === "Rejected"
                                      ? "bg-red-600 text-white"
                                      : "bg-yellow-600 text-white"
                                  }`}
                                >
                                  {request.status}
                                </span>
                              </div>

                              <div className="mb-3">
                                <span className="text-xs text-gray-400">
                                  Topic:
                                </span>
                                <p className="text-gray-200 mt-1 font-medium">
                                  {request.topic}
                                </p>
                              </div>

                              <div className="mb-3">
                                <span className="text-xs text-gray-400">
                                  Preferred Time Slots:
                                </span>
                                <p className="text-gray-200 mt-1">
                                  {request.preferredTimeSlots || "Flexible"}
                                </p>
                              </div>

                              <div className="border-t border-gray-600 py-2 my-2">
                                <span className="text-xs text-gray-400">
                                  Description:
                                </span>
                                <p className="mt-1 text-sm whitespace-pre-line">
                                  {request.description || "No description"}
                                </p>
                              </div>

                              {request.status === "Pending" && (
                                <div className="space-y-3 mt-3">
                                  {request.status === "Pending" && (
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() =>
                                          handleMentorshipStatus(
                                            request._id,
                                            "Accepted"
                                          )
                                        }
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded transition"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleMentorshipStatus(
                                            request._id,
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
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
*/}

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mentorship Request Form Component
const MentorshipRequestForm = ({
  mentorshipForm,
  handleInputChange,
  handleSubmit,
  isSubmitting,
  onCancel,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="topic"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Mentorship Topic
        </label>
        <input
          type="text"
          id="topic"
          name="topic"
          value={mentorshipForm.topic}
          onChange={handleInputChange}
          required
          className="w-full bg-[#363636] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="E.g., React Hooks, MongoDB Aggregation, CI/CD Setup"
        />
      </div>

      <div>
        <label
          htmlFor="preferredTimeSlots"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Preferred Time Slots
        </label>
        <input
          type="text"
          id="preferredTimeSlots"
          name="preferredTimeSlots"
          value={mentorshipForm.preferredTimeSlots}
          onChange={handleInputChange}
          className="w-full bg-[#363636] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="E.g., Weekdays after 6pm, Weekend mornings"
        />
        <p className="text-xs text-gray-400 mt-1">
          Optional: Specify your availability for mentoring sessions
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          What do you want to learn?
        </label>
        <textarea
          id="description"
          name="description"
          value={mentorshipForm.description}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full bg-[#363636] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Describe what you'd like to learn and any specific questions or challenges you're facing..."
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Request Mentorship"}
        </button>
      </div>
    </form>
  );
};

export default CollaborationDetail;
