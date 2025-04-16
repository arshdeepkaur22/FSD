import React from "react";
import { Star } from "lucide-react";

const ProjectCard = ({
  project,
  onViewProject,
  onProvideSDGFeedback,
  onOpenGradingModal,
}) => {
  // Determine background gradient based on project category
  const getBgGradient = () => {
    switch (project.category.toLowerCase()) {
      case "react":
        return "from-white to-blue-700";
      case "node":
        return "from-green-900 to-green-700";
      case "html/css":
        return "from-orange-900 to-orange-700";
      case "javascript":
        return "from-yellow-900 to-yellow-700";
      default:
        return "from-purple-900 to-purple-800";
    }
  };

  // Determine badge color based on project category
  const getBadgeColor = () => {
    switch (project.category.toLowerCase()) {
      case "react":
        return "bg-blue-700";
      case "node":
        return "bg-green-700";
      case "html/css":
        return "bg-orange-700";
      case "javascript":
        return "bg-yellow-700";
      default:
        return "bg-purple-800";
    }
  };

  return (
    <div className="bg-[#1E1E1E] rounded-lg overflow-hidden border border-purple-800 hover:border-purple-600 transition-all shadow-lg">
      <div
        className={`bg-gradient-to-r ${getBgGradient()} px-4 py-3 flex justify-between items-center`}
      >
        <h3 className="font-bold truncate text-white">
          {project.projectTitle}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            project.submissionStatus === "Approved"
              ? "bg-green-500 text-black"
              : project.submissionStatus === "In Review"
              ? "bg-yellow-500 text-black"
              : "bg-gray-500 text-white"
          }`}
        >
          {project.submissionStatus}
        </span>
      </div>
      <div className="p-4">
        <div className="mb-3">
          <div className="flex justify-between items-center">
            <p className="font-medium">Team: {project.teamName}</p>
            <div className="flex items-center">
              <Star className="text-yellow-400 mr-1" size={16} />
              <span className="text-yellow-400">{project.rating}</span>
            </div>
          </div>
          <p className="mt-1">
            <span
              className={`text-white text-xs px-2 py-1 rounded ${getBadgeColor()}`}
            >
              {project.category}
            </span>
          </p>
          <p className="mt-3 text-gray-300 text-sm line-clamp-2">
            {project.description}
          </p>
        </div>
        <div className="mb-3">
          <p className="font-medium mb-1">Technologies:</p>
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="bg-[#2C2C2C] text-gray-300 text-xs px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium mb-1">Team Members:</p>
          <ul className="text-sm text-gray-300">
            {project.teamMembers.map((member, index) => (
              <li key={index} className="mb-1">
                {member.name} - {member.role}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-[#0F0F0F] p-3 flex justify-between gap-2">
        <button
          className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm flex-1 transition-colors"
          onClick={() => onViewProject(project)}
        >
          View Project
        </button>
        <button
          className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex-1 transition-colors"
          onClick={() => onProvideSDGFeedback(project)}
        >
          SDG Feedback
        </button>
        <button
          className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex-1 transition-colors"
          onClick={() => onOpenGradingModal(project)}
        >
          Grading
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
