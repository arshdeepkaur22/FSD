import React, { useState } from "react";
import { Search, Filter, Eye, ThumbsUp, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import Button from "../../components/admin/Button";
import Card from "../../components/admin/Card";

export default function ProjectModeration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  // Sample project data
  const projects = [
    {
      id: 1,
      title: "AI Crop Disease Detection",
      student: "Alex Wong",
      category: "AI",
      sdgs: ["SDG 2", "SDG 15"],
      status: "pending",
      submittedDate: "2023-07-18",
      description: "An AI-powered mobile application that can detect crop diseases from images and suggest treatments.",
    },
    {
      id: 2,
      title: "Water Quality Monitor",
      student: "Maria Garcia",
      category: "Mobile App",
      sdgs: ["SDG 6", "SDG 3"],
      status: "pending",
      submittedDate: "2023-07-15",
      description: "A device and app that monitors water quality in real-time and alerts users to contamination.",
    },
    {
      id: 3,
      title: "Recycling Game",
      student: "James Wilson",
      category: "Game",
      sdgs: ["SDG 12"],
      status: "pending",
      submittedDate: "2023-07-10",
      description: "An educational game teaching children about proper waste sorting and recycling practices.",
    },
    {
      id: 4,
      title: "Solar Energy Calculator",
      student: "Emily Davis",
      category: "Website",
      sdgs: ["SDG 7", "SDG 13"],
      status: "approved",
      submittedDate: "2023-07-05",
      description: "A web tool that helps users calculate potential solar energy savings for their homes.",
    },
    {
      id: 5,
      title: "Food Waste Tracker",
      student: "Mike Johnson",
      category: "Mobile App",
      sdgs: ["SDG 2", "SDG 12"],
      status: "rejected",
      submittedDate: "2023-07-01",
      description: "An app that helps restaurants and cafeterias track and reduce food waste.",
    },
  ];

  // Filter projects based on search term and status filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      case "pending":
        return "bg-amber-500/20 text-amber-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case "AI":
        return "bg-purple-500/20 text-purple-400";
      case "Mobile App":
        return "bg-blue-500/20 text-blue-400";
      case "Game":
        return "bg-green-500/20 text-green-400";
      case "Website":
        return "bg-cyan-500/20 text-cyan-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Project Moderation</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-gray-800 bg-[#2C2C2C]">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">View All Projects</Button>
        </div>
      </div>

      <Card className="bg-[#1E1E1E] border-none shadow-lg">
        <div>
          <div>Project Submissions</div>
          <div className="text-gray-400">Approve or reject project submissions</div>
        </div>
        <div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                placeholder="Search projects..."
                className="pl-10 bg-[#2C2C2C] border-none rounded-md p-2 w-full text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="bg-[#2C2C2C] border-none rounded-md p-2 text-sm text-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="p-4 rounded-lg bg-[#2C2C2C] hover:bg-[#3C3C3C] transition-colors">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <div className="flex items-start">
                      <h3 className="font-medium text-lg">{project.title}</h3>
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{project.description}</p>

                    <div className="flex flex-wrap items-center mt-3 gap-2">
                      <div className="flex items-center text-gray-400 text-sm">
                        <span className="mr-2">👤</span>
                        <span>By: {project.student}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryBadgeClass(project.category)}`}>
                        {project.category}
                      </span>
                      {project.sdgs.map((sdg, index) => (
                        <span key={index} className="text-xs bg-green-800/60 text-green-200 px-2 py-1 rounded-full">
                          {sdg}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm" className="border-gray-700 bg-[#252525]">
                      <Eye size={16} className="mr-2" />
                      View
                    </Button>

                    {project.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-800 bg-red-900/20 text-red-400 hover:bg-red-900/30"
                        >
                          <XCircle size={16} className="mr-2" />
                          Reject
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle size={16} className="mr-2" />
                          Approve
                        </Button>
                      </>
                    )}

                    <button className="h-8 w-8 p-0 bg-transparent hover:bg-gray-800 rounded-md">
                      <MoreHorizontal className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-gray-500">No projects found matching your search criteria.</div>
          )}

          <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
            <div>
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="border-gray-800 bg-[#2C2C2C]">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="border-gray-800 bg-[#2C2C2C]">
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}