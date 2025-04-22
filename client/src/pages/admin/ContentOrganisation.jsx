import React, { useState } from "react";
import { Search, FolderPlus, Tag, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Button from "../../components/admin/Button";
import Card from "../../components/admin/Card";

export default function ContentOrganization() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("categories");

  // Sample categories data
  const categories = [
    { id: 1, name: "Website", description: "Web-based projects and applications", count: 156 },
    { id: 2, name: "Game", description: "Interactive games and simulations", count: 89 },
    { id: 3, name: "Mobile App", description: "Applications for mobile devices", count: 124 },
    { id: 4, name: "AI", description: "Artificial intelligence and machine learning projects", count: 67 },
    { id: 5, name: "IoT", description: "Internet of Things projects", count: 42 },
    { id: 6, name: "Data Visualization", description: "Projects focused on visualizing data", count: 38 },
    { id: 7, name: "Blockchain", description: "Blockchain and cryptocurrency projects", count: 21 },
    { id: 8, name: "Other", description: "Miscellaneous projects", count: 45 },
  ];

  // Sample SDG data
  const sdgs = [
    { id: 1, name: "SDG 1", fullName: "No Poverty", count: 45, color: "from-red-500 to-red-700" },
    { id: 2, name: "SDG 2", fullName: "Zero Hunger", count: 67, color: "from-yellow-500 to-yellow-700" },
    { id: 3, name: "SDG 3", fullName: "Good Health and Well-being", count: 89, color: "from-green-500 to-green-700" },
    { id: 4, name: "SDG 4", fullName: "Quality Education", count: 112, color: "from-red-500 to-red-700" },
    { id: 5, name: "SDG 5", fullName: "Gender Equality", count: 56, color: "from-orange-500 to-orange-700" },
    { id: 6, name: "SDG 6", fullName: "Clean Water and Sanitation", count: 78, color: "from-blue-500 to-blue-700" },
    {
      id: 7,
      name: "SDG 7",
      fullName: "Affordable and Clean Energy",
      count: 92,
      color: "from-yellow-500 to-yellow-700",
    },
    { id: 8, name: "SDG 8", fullName: "Decent Work and Economic Growth", count: 63, color: "from-red-500 to-red-700" },
    {
      id: 9,
      name: "SDG 9",
      fullName: "Industry, Innovation and Infrastructure",
      count: 85,
      color: "from-orange-500 to-orange-700",
    },
    { id: 10, name: "SDG 10", fullName: "Reduced Inequality", count: 47, color: "from-pink-500 to-pink-700" },
    {
      id: 11,
      name: "SDG 11",
      fullName: "Sustainable Cities and Communities",
      count: 74,
      color: "from-yellow-500 to-yellow-700",
    },
    {
      id: 12,
      name: "SDG 12",
      fullName: "Responsible Consumption and Production",
      count: 68,
      color: "from-brown-500 to-brown-700",
    },
    { id: 13, name: "SDG 13", fullName: "Climate Action", count: 103, color: "from-green-500 to-green-700" },
    { id: 14, name: "SDG 14", fullName: "Life Below Water", count: 52, color: "from-blue-500 to-blue-700" },
    { id: 15, name: "SDG 15", fullName: "Life on Land", count: 61, color: "from-green-500 to-green-700" },
    {
      id: 16,
      name: "SDG 16",
      fullName: "Peace, Justice and Strong Institutions",
      count: 39,
      color: "from-blue-500 to-blue-700",
    },
    { id: 17, name: "SDG 17", fullName: "Partnerships for the Goals", count: 57, color: "from-blue-500 to-blue-700" },
  ];

  // Filter data based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredSdgs = sdgs.filter(
    (sdg) =>
      sdg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sdg.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Content Organization</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          {activeTab === "categories" ? (
            <>
              <FolderPlus size={16} className="mr-2" />
              Add Category
            </>
          ) : (
            <>
              <Tag size={16} className="mr-2" />
              Add SDG Mapping
            </>
          )}
        </Button>
      </div>

      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === "categories" ? "default" : "outline"}
          className={activeTab === "categories" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-800 bg-[#2C2C2C]"}
          onClick={() => setActiveTab("categories")}
        >
          Project Categories
        </Button>
        <Button
          variant={activeTab === "sdgs" ? "default" : "outline"}
          className={activeTab === "sdgs" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-800 bg-[#2C2C2C]"}
          onClick={() => setActiveTab("sdgs")}
        >
          SDG Mappings
        </Button>
      </div>

      <Card className="bg-[#1E1E1E] border-none shadow-lg">
        <div>
          <div>{activeTab === "categories" ? "Project Categories" : "SDG Mappings"}</div>
          <div className="text-gray-400">
            {activeTab === "categories"
              ? "Organize projects by type and category"
              : "Map projects to Sustainable Development Goals"}
          </div>
        </div>
        <div>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              placeholder={`Search ${activeTab === "categories" ? "categories" : "SDGs"}...`}
              className="pl-10 bg-[#2C2C2C] border-none rounded-md p-2 w-full text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === "categories" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <div key={category.id} className="bg-[#2C2C2C] rounded-lg p-4 hover:bg-[#3C3C3C] transition-colors">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{category.name}</h3>
                    <button className="h-8 w-8 p-0 bg-transparent hover:bg-gray-800 rounded-md">
                      <MoreHorizontal className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{category.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs bg-blue-600/30 text-blue-400 px-2 py-1 rounded-full">
                      {category.count} Projects
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Projects
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSdgs.map((sdg) => (
                <div key={sdg.id} className="bg-[#2C2C2C] rounded-lg p-4 hover:bg-[#3C3C3C] transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sdg.color} flex items-center justify-center mr-3`}
                      >
                        <span className="font-bold text-xs">{sdg.name}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{sdg.name}</h3>
                        <p className="text-sm text-gray-400">{sdg.fullName}</p>
                      </div>
                    </div>
                    <button className="h-8 w-8 p-0 bg-transparent hover:bg-gray-800 rounded-md">
                      <MoreHorizontal className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs bg-green-600/30 text-green-400 px-2 py-1 rounded-full">
                      {sdg.count} Projects
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Projects
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(activeTab === "categories" && filteredCategories.length === 0) ||
          (activeTab === "sdgs" && filteredSdgs.length === 0) ? (
            <div className="text-center py-8 text-gray-500">
              No {activeTab === "categories" ? "categories" : "SDGs"} found matching your search criteria.
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}