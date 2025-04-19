import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const ProjectEditModal = ({ project, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    category: "Other",
    githubLink: "",
    deployedLink: "",
    sdgGoals: [],
    sdgJustification: "",
    department: "", // New field for department
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const categories = ["Website", "Game", "Mobile App", "AI", "Other"];
  const departments = ["Computer Engineering", "Computer Science and Engineering", "Mechanical Engineering", "Electronics and Computer Science"]; // Added departments
  
  const sdgOptions = [
    'No Poverty', 
    'Zero Hunger', 
    'Good Health and Well-being', 
    'Quality Education',
    'Gender Equality', 
    'Clean Water and Sanitation',
    'Affordable and Clean Energy',
    'Decent Work and Economic Growth',
    'Industry, Innovation, and Infrastructure',
    'Reduced Inequality',
    'Sustainable Cities and Communities',
    'Responsible Consumption and Production',
    'Climate Action',
    'Life Below Water',
    'Life on Land',
    'Peace, Justice, and Strong Institutions',
    'Partnerships for the Goals'
  ];

  // Initialize form with project data when it changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        techStack: project.techStack || "",
        category: project.category || "Other",
        githubLink: project.githubLink || "",
        deployedLink: project.deployedLink || "",
        sdgGoals: project.sdgGoals || [],
        sdgJustification: project.sdgJustification || "",
        department: project.department || "", // Set department
        image: null // We don't set the image from the project
      });

      // If there's an image in the project, set the preview
      if (project.image) {
        setPreviewImage(`http://localhost:5000${project.image}`);
      } else {
        setPreviewImage(null);
      }
    }
  }, [project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSDGChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData(prev => ({
      ...prev,
      sdgGoals: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file,
    }));

    // Create preview URL for the image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(project?.image ? `http://localhost:5000${project.image}` : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Create form data for file upload
      const submissionData = new FormData();
      submissionData.append("title", formData.title);
      submissionData.append("description", formData.description);
      submissionData.append("techStack", formData.techStack);
      submissionData.append("category", formData.category);
      submissionData.append("githubLink", formData.githubLink);
      submissionData.append("deployedLink", formData.deployedLink);
      submissionData.append("department", formData.department); // Add department
      
      // Add SDG goals and justification
      formData.sdgGoals.forEach(goal => {
        submissionData.append("sdgGoals", goal);
      });
      submissionData.append("sdgJustification", formData.sdgJustification);
      
      // Only append image if a new one was selected
      if (formData.image) {
        submissionData.append("image", formData.image);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Send the update request
      const response = await axios.put(
        `http://localhost:5000/api/projects/${project._id}`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If successful, call the onUpdate callback with the updated project
      if (response.data) {
        onUpdate(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error updating project", error);
      setError(error.response?.data?.error || "Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-purple-300">Edit Project</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400 rounded-lg p-3 mb-4">
              <p className="text-white text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your project title"
              />
            </div>

            {/* Department - New Field */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Project Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your project in detail"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label
                htmlFor="techStack"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Tech Stack
              </label>
              <input
                type="text"
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                required
                className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Technologies used (e.g., React, Node.js, MongoDB)"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Project Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Links Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GitHub Repository Link */}
              <div>
                <label
                  htmlFor="githubLink"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  GitHub Repository Link
                </label>
                <input
                  type="url"
                  id="githubLink"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleInputChange}
                  className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://github.com/username/repository"
                  pattern="https://github.com/.*"
                  title="Please enter a valid GitHub repository URL"
                />
              </div>

              {/* Deployed Project Link */}
              <div>
                <label
                  htmlFor="deployedLink"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Deployed Project Link
                </label>
                <input
                  type="url"
                  id="deployedLink"
                  name="deployedLink"
                  value={formData.deployedLink}
                  onChange={handleInputChange}
                  className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://your-deployed-project.com"
                />
              </div>
            </div>

            {/* SDG Goals */}
            <div>
              <label
                htmlFor="sdgGoals"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Sustainable Development Goals (SDGs)
              </label>
              <select
                id="sdgGoals"
                name="sdgGoals"
                value={formData.sdgGoals}
                onChange={handleSDGChange}
                required
                multiple
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
                Hold Ctrl (or Cmd) to select multiple goals
              </p>
            </div>

            {/* SDG Justification */}
            <div>
              <label
                htmlFor="sdgJustification"
                className="block text-sm font-medium text-gray-300 mb-1"
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

            {/* Project Image */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Project Screenshot/Image
              </label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg file:mr-4 file:rounded-full file:border-0 file:bg-purple-600 file:text-white file:px-3 file:py-1 file:text-sm hover:file:bg-purple-700"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Leave empty to keep current image
                  </p>
                </div>
                {previewImage && (
                  <div className="flex-shrink-0">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="h-24 w-40 object-cover rounded-lg" 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditModal;