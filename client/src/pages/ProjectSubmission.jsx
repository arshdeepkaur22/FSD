import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const ProjectSubmission = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    category: "Other",
    githubLink: "",
    deployedLink: "",
    sdgGoals: [],
    sdgJustification: "",
    image: null,
  });

  const categories = ["Website", "Game", "Mobile App", "AI", "Other"];
  
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

    // Create form data for file upload
    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("description", formData.description);
    submissionData.append("techStack", formData.techStack);
    submissionData.append("category", formData.category);
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
        githubLink: "",
        deployedLink: "",
        sdgGoals: [],
        sdgJustification: "",
        image: null,
      });

      // Optional: Show success message
      alert("Project submitted successfully!");
    } catch (error) {
      console.error("Error submitting project", error);
      alert("Failed to submit project. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
      {/* Navbar (same as Home component) */}
      <Header></Header>

      {/* Project Submission Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-purple-300 text-center">
            Submit Your Project
          </h1>

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
              <p className="text-xs text-gray-400 mt-1">
                Optional: Link to your GitHub repository
              </p>
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
              <p className="text-xs text-gray-400 mt-1">
                Optional: Link to your live/deployed project
              </p>
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

            {/* SDG Goals - New Field */}
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

            {/* SDG Justification - New Field */}
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
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full transition transform active:scale-95 mt-4"
              >
                Submit Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmission;