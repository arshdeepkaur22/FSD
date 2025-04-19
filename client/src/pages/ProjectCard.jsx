import React from "react";
import { Heart, Star, MessageCircle, Eye, Calendar, Code, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
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
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-lg transition hover:shadow-blue-900/10 hover:translate-y-[-2px]">
      <div className="relative">
        <img
          src={project.image ? `http://localhost:5000${project.image}` : '/placeholder-project.jpg'}
          alt={project.title}
          className="w-full h-56 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder-project.jpg";
          }}
        />
        <div className="absolute top-3 right-3 bg-black/50 px-3 py-1 rounded-full text-xs">
          {project.category || 'Uncategorized'}
        </div>
        {project.status && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs ${
            project.status === 'Approved' ? 'bg-green-900/80 text-green-400' :
            project.status === 'In Review' ? 'bg-blue-900/80 text-blue-400' :
            project.status === 'Rejected' ? 'bg-red-900/80 text-red-400' :
            'bg-gray-800/80 text-gray-400'
          }`}>
            {project.status}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold text-blue-300">
            {project.title}
          </h2>
          <div className="flex space-x-2">
            {project.githubLink && (
              <a 
                href={project.githubLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                title="GitHub Repository"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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
          <span>{project.techStack || 'No technologies specified'}</span>
        </div>
        
        {project.sdgGoals && project.sdgGoals.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.sdgGoals.map((goal, index) => (
              <span key={index} className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded-md text-xs">
                SDG {goal}
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
            <Heart
              size={18}
              className={`${
                project.likedByUser ? "text-red-500 fill-red-500" : "text-gray-400"
              }`}
            />
            <span className="ml-1 text-gray-400">
              {project.likes || 0}
            </span>
          </div>
          
          {/* Feedback Count */}
          <div className="flex items-center mr-4 mb-2">
            <MessageCircle
              size={18}
              className="text-gray-400"
            />
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
            to={`/project/${project._id}`}
            className="flex-1 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-center py-2 rounded-l-lg text-sm font-medium transition"
          >
            <Eye size={16} className="inline mr-2" />
            View Details
          </Link>
          <Link 
            to={`/project/${project._id}/edit`}
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-center py-2 rounded-r-lg text-sm font-medium transition"
          >
            Edit Project
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;