import React, { useState } from "react";
import axios from "axios";

const ProjectSubmission = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    category: "Other",
    image: null,
  });

  const categories = ["Website", "Game", "Mobile App", "AI", "Other"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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
            // Assuming you'll send an authentication token
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
