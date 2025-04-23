import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";


const ProjectSubmission = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    category: "Other",
    department: "", // New department field
    githubLink: "",
    deployedLink: "",
    sdgGoals: [],
    sdgJustification: "",
    image: null,
  });
  const navigate = useNavigate();


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSDGChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevState) => ({
      ...prevState,
      sdgGoals: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    // Validate department is selected
    if (!formData.department) {
      setError("Please select a department");
      setIsSubmitting(false);
      return;
    }

    // Create form data for file upload
    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("description", formData.description);
    submissionData.append("techStack", formData.techStack);
    submissionData.append("category", formData.category);
    submissionData.append("department", formData.department); // Add department
    submissionData.append("githubLink", formData.githubLink);
    submissionData.append("deployedLink", formData.deployedLink);
    
    // Don't need to explicitly add student ID, as it will be extracted from token on server side

    // Add SDG goals and justification
    formData.sdgGoals.forEach(goal => {
      submissionData.append("sdgGoals", goal);
    });
    submissionData.append("sdgJustification", formData.sdgJustification);
    
    if (formData.image) {
      submissionData.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/projects/upload",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Sending authentication token
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        techStack: "",
        category: "Other",
        department: "",
        githubLink: "",
        deployedLink: "",
        sdgGoals: [],
        sdgJustification: "",
        image: null,
      });

      // Show success message
      setSuccess("Project submitted successfully!");
      navigate('/dashboard');

      // Clear file input
      document.getElementById('image').value = '';
    } catch (error) {
      console.error("Error submitting project", error);
      setError(error.response?.data?.error || "Failed to submit project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
      {/* Navbar */}
      <Header />

      {/* Project Submission Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-purple-300 text-center">
            Submit Your Project
          </h1>

          {error && (
            <div className="bg-red-500/20 border border-red-400 rounded-lg p-3 mb-6">
              <p className="text-white text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-400 rounded-lg p-3 mb-6">
              <p className="text-white text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
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
                className="block text-sm font-medium text-gray-300 mb-2"
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
                className="block text-sm font-medium text-gray-300 mb-2"
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
                className="block text-sm font-medium text-gray-300 mb-2"
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

            {/* Links Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GitHub Repository Link */}
              <div>
                <label
                  htmlFor="githubLink"
                  className="block text-sm font-medium text-gray-300 mb-2"
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
                  className="block text-sm font-medium text-gray-300 mb-2"
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

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-300 mb-2"
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

            {/* SDG Goals */}
            <div>
              <label
                htmlFor="sdgGoals"
                className="block text-sm font-medium text-gray-300 mb-2"
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
                size="5"
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

            {/* Project Image */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Project Screenshot/Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-lg file:mr-4 file:rounded-full file:border-0 file:bg-purple-600 file:text-white file:px-4 file:py-2 file:text-sm hover:file:bg-purple-700"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full transition transform active:scale-95 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmission;