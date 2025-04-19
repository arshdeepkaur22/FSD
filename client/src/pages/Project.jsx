import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  // Get authentication status and user role
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const isAuthenticated = !!token;
  const isTeacher = userData.role === "teacher";
  const isOwner = project?.student?._id === userData._id || project?.student === userData._id;

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setProject(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching project details", error);
        setError("Failed to load project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleLike = async () => {
    try {
      if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        navigate("/login", { state: { from: `/projects/${id}` } });
        return;
      }

      console.log(`Liking project: ${id}`);

      const res = await axios.post(
        `http://localhost:5000/api/projects/${id}/like`,
        {}, // Empty body is fine
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Like response:", res.data);

      // Update local state to reflect new like count
      setProject({
        ...project,
        likes: res.data.likes,
      });
    } catch (error) {
      console.error("Error liking project:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      alert(`Failed to like project: ${errorMessage}`);
    }
  };

  // Fixed rating handler for the Project view
  const handleRate = async (rating) => {
    try {
      if (!isAuthenticated) {
        navigate("/login", { state: { from: `/projects/${id}` } });
        return;
      }

      // Only teachers can rate
      if (!isTeacher) {
        alert("Only teachers can rate projects");
        return;
      }

      console.log(`Rating project ${id} with ${rating} stars`);

      // Make sure rating is a valid number
      const numericRating = parseInt(rating, 10);

      // Send the rating request
      const res = await axios.post(
        `http://localhost:5000/api/projects/${id}/rate`,
        { rating: numericRating }, // Ensure we're sending a number
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Rating response:", res.data);

      // Update local state to reflect new rating
      setProject({
        ...project,
        averageRating: res.data.averageRating,
      });

      setUserRating(numericRating);
    } catch (error) {
      console.error("Error rating project:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      alert(`Failed to rate project: ${errorMessage}`);
    }
  };

  // Function to render SDG goals badges
  const renderSdgBadges = (sdgGoals) => {
    if (!sdgGoals || sdgGoals.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {sdgGoals.map((goal, index) => (
          <span
            key={index}
            className="text-xs bg-green-800/60 text-green-200 px-2 py-1 rounded-full"
          >
            {goal}
          </span>
        ))}
      </div>
    );
  };

  // Get grade color based on the letter grade
  const getGradeColor = (grade) => {
    if (!grade) return "bg-gray-800 text-gray-300";

    if (grade.startsWith("A")) return "bg-green-900/60 text-green-300";
    if (grade.startsWith("B")) return "bg-white/60 text-white";
    if (grade.startsWith("C")) return "bg-yellow-900/60 text-yellow-300";
    return "bg-red-900/60 text-red-300";
  };

  const getStudentName = () => {
    if (!project || !project.student) return "Anonymous";

    // If student is fully populated
    if (typeof project.student === "object") {
      // Try different common name fields
      return (
        project.student.name ||
        project.student.username ||
        project.student.fullName ||
        "Anonymous"
      );
    }

    // If student is just an ID and not populated
    return "Anonymous";
  };

  // Handle iframe loading state
  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  const handleIframeError = () => {
    setIframeLoading(false);
    setIframeError(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-[#1E1E1E] rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-400 mb-6">{error || "Project not found"}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-purple-300 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Projects
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Image */}
            <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl mb-8">
              <div className="relative">
                <img
                  src={
                    project.image
                      ? `http://localhost:5000${project.image}`
                      : "https://via.placeholder.com/800x400?text=No+Image"
                  }
                  alt={project.title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-xs">
                  {project.category}
                </div>

                {/* Display project grade badge if available */}
                {project.grade && (
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(
                        project.grade
                      )}`}
                    >
                      Grade: {project.grade}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4 text-purple-300">
                  {project.title}
                </h1>
                <div className="flex items-center text-gray-400 text-sm mb-6">
                  <span>Created by {getStudentName()}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>

                  {/* Show project status */}
                  <span className="mx-2">•</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      project.status === "Approved"
                        ? "bg-green-800 text-green-200"
                        : project.status === "In Review"
                        ? "bg-yellow-800 text-yellow-200"
                        : project.status === "Rejected"
                        ? "bg-red-800 text-red-200"
                        : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 text-purple-200">
                    Project Description
                  </h2>
                  <p className="text-gray-300 whitespace-pre-line">
                    {project.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 text-purple-200">
                    Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.split(",").map((tech, index) => (
                      <span
                        key={index}
                        className="bg-[#2A2A2A] px-3 py-1 rounded-lg text-sm"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {project.sdgGoals && project.sdgGoals.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 text-purple-200">
                      SDG Goals
                    </h2>
                    {renderSdgBadges(project.sdgGoals)}
                    {project.sdgJustification && (
                      <div className="mt-3 text-gray-300">
                        <h3 className="text-lg font-medium mb-1 text-purple-200">
                          Justification
                        </h3>
                        <p>{project.sdgJustification}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Team Members Section (if any) */}
                {project.teamMembers && project.teamMembers.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 text-purple-200">
                      Team Members
                    </h2>
                    <div className="bg-[#2A2A2A] rounded-lg p-4">
                      {project.teamMembers.map((member, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center mb-2 last:mb-0 pb-2 last:pb-0 border-b border-gray-700 last:border-0"
                        >
                          <div>
                            <span className="font-medium">{member.name}</span>
                            <span className="text-gray-400 text-sm ml-2">
                              ({member.role})
                            </span>
                          </div>
                          {member.grade && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${getGradeColor(
                                member.grade
                              )}`}
                            >
                              {member.grade}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Deployed Project Preview (iframe) */}
            {project.deployedLink && (
              <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-purple-200">
                    Live Project Preview
                  </h2>
                  <div
                    className="relative overflow-hidden rounded-lg"
                    style={{ height: "500px" }}
                  >
                    {iframeLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                      </div>
                    )}

                    {iframeError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1A1A1A] p-4 text-center">
                        <svg
                          className="w-16 h-16 text-gray-500 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <p className="text-gray-400 mb-2">
                          Unable to load the project preview.
                        </p>
                        <a
                          href={project.deployedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-purple-300 transition"
                        >
                          Open in new tab instead
                        </a>
                      </div>
                    ) : (
                      <iframe
                        src={project.deployedLink}
                        className="w-full h-full border-0"
                        title={`${project.title} preview`}
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        loading="lazy"
                      />
                    )}
                  </div>

                  <div className="mt-4 text-center">
                    <a
                      href={project.deployedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-purple-300 transition"
                    >
                      Open in new tab →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Teacher Feedback Section - Only visible to the project owner */}
            {isOwner && project.feedback && project.feedback.length > 0 && (
              <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-purple-200">
                  Teacher Feedback
                </h2>

                <div className="space-y-4">
                  {project.feedback.map((item, index) => (
                    <div key={index} className="bg-[#2A2A2A] rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-purple-300">
                            {item.teacher?.name ||
                              item.teacher?.username ||
                              "Teacher"}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {item.suggestedSdg && (
                          <span className="bg-green-800/50 text-green-200 text-xs px-2 py-1 rounded-full">
                            Suggested SDG: {item.suggestedSdg}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details Card */}
            <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-200">
                Project Details
              </h2>

              <div className="space-y-4">
                {/* Project Grade (if available) */}
                {project.grade && (
                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">
                      Project Grade
                    </h3>
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-lg ${getGradeColor(
                          project.grade
                        )}`}
                      >
                        {project.grade}
                      </span>
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div>
                  <h3 className="text-sm text-gray-400 mb-2">Rating</h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(star)}
                          className={`text-2xl transition-colors duration-200 ${
                            star <= (userRating || project.averageRating || 0)
                              ? "text-yellow-500"
                              : isTeacher
                              ? "text-gray-400 hover:text-yellow-400"
                              : "text-gray-400"
                          }`}
                          disabled={!isAuthenticated || !isTeacher}
                          title={
                            !isAuthenticated
                              ? "Login to rate"
                              : !isTeacher
                              ? "Only teachers can rate projects"
                              : "Click to rate"
                          }
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-300">
                      {project.averageRating
                        ? project.averageRating.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {project.ratings?.length || 0} ratings
                    {!isTeacher && " (Only teachers can rate projects)"}
                  </p>
                </div>

                {/* Like */}
                <div>
                  {isAuthenticated ? (
                    <button
                      onClick={handleLike}
                      className="flex items-center bg-[#2A2A2A] hover:bg-[#3A3A3A] px-4 py-2 rounded-full transition"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      Like this project ({project.likes || 0})
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      state={{ from: `/projects/${id}` }}
                      className="flex items-center bg-[#2A2A2A] hover:bg-[#3A3A3A] px-4 py-2 rounded-full transition"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      Login to like ({project.likes || 0})
                    </Link>
                  )}
                </div>

                {/* Feedback Count - Only visible to the project owner */}
                {isOwner && project.feedback && project.feedback.length > 0 && (
                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">Feedback</h3>
                    <div className="flex items-center">
                      <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-lg">
                        {project.feedback.length} comments
                      </span>
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="space-y-2">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-white hover:text-white transition"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                      View GitHub Repository
                    </a>
                  )}

                  {project.deployedLink && (
                    <a
                      href={project.deployedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-400 hover:text-green-300 transition"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
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

                {/* Additional Project Details */}
                <div className="border-t border-gray-700 pt-4 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400 text-sm">Category:</div>
                    <div className="text-right">{project.category}</div>

                    {project.department && (
                      <>
                        <div className="text-gray-400 text-sm">Department:</div>
                        <div className="text-right">{project.department}</div>
                      </>
                    )}

                    <div className="text-gray-400 text-sm">Status:</div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          project.status === "Approved"
                            ? "bg-green-800 text-green-200"
                            : project.status === "In Review"
                            ? "bg-yellow-800 text-yellow-200"
                            : project.status === "Rejected"
                            ? "bg-red-800 text-red-200"
                            : "bg-gray-800 text-gray-200"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <div className="text-gray-400 text-sm">Created:</div>
                    <div className="text-right">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>

                    {project.updatedAt &&
                      project.updatedAt !== project.createdAt && (
                        <>
                          <div className="text-gray-400 text-sm">
                            Last Updated:
                          </div>
                          <div className="text-right">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Student Info Card */}
            {project.student && typeof project.student === "object" && (
              <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-200">
                  Student Information
                </h2>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold mr-3">
                    {project.student.name
                      ? project.student.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {project.student.name || "Anonymous"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {project.student.email || ""}
                    </p>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <Link
                    to={`/student/${project.student._id}`}
                    className="text-white hover:text-purple-300 transition"
                  >
                    View All Projects
                  </Link>
                </div>
              </div>
            )}

            {/* Similar Projects Card (optional) */}
            <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-200">
                Similar Projects
              </h2>
              <div className="text-center text-gray-400">
                <p>Similar projects feature coming soon</p>
              </div>
            </div>

            {/* Edit Project Button (only for owner) */}
            {isOwner && (
              <Link 
                to={`/project/${project._id}/edit`}
                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition"
              >
                Edit Your Project
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;