import React, { useState } from "react";
import { Search, Filter, Globe, BarChart2, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import Button from "../../components/admin/Button";
import Card from "../../components/admin/Card";

export default function SdgTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("projects");

  // Sample SDG data
  const sdgs = [
    {
      id: 1,
      name: "SDG 1",
      fullName: "No Poverty",
      description: "End poverty in all its forms everywhere",
      projects: 45,
      students: 38,
      impact: "Medium",
      change: "up",
      color: "from-red-500 to-red-700",
    },
    {
      id: 2,
      name: "SDG 2",
      fullName: "Zero Hunger",
      description: "End hunger, achieve food security and improved nutrition and promote sustainable agriculture",
      projects: 67,
      students: 52,
      impact: "High",
      change: "up",
      color: "from-yellow-500 to-yellow-700",
    },
    {
      id: 3,
      name: "SDG 3",
      fullName: "Good Health and Well-being",
      description: "Ensure healthy lives and promote well-being for all at all ages",
      projects: 89,
      students: 74,
      impact: "High",
      change: "up",
      color: "from-green-500 to-green-700",
    },
    {
      id: 4,
      name: "SDG 4",
      fullName: "Quality Education",
      description:
        "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all",
      projects: 112,
      students: 95,
      impact: "Very High",
      change: "up",
      color: "from-red-500 to-red-700",
    },
    {
      id: 5,
      name: "SDG 5",
      fullName: "Gender Equality",
      description: "Achieve gender equality and empower all women and girls",
      projects: 56,
      students: 48,
      impact: "Medium",
      change: "down",
      color: "from-orange-500 to-orange-700",
    },
    {
      id: 6,
      name: "SDG 6",
      fullName: "Clean Water and Sanitation",
      description: "Ensure availability and sustainable management of water and sanitation for all",
      projects: 78,
      students: 65,
      impact: "High",
      change: "up",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: 7,
      name: "SDG 7",
      fullName: "Affordable and Clean Energy",
      description: "Ensure access to affordable, reliable, sustainable and modern energy for all",
      projects: 92,
      students: 78,
      impact: "High",
      change: "up",
      color: "from-yellow-500 to-yellow-700",
    },
    {
      id: 13,
      name: "SDG 13",
      fullName: "Climate Action",
      description: "Take urgent action to combat climate change and its impacts",
      projects: 103,
      students: 87,
      impact: "Very High",
      change: "up",
      color: "from-green-500 to-green-700",
    },
  ];

  // Filter SDGs based on search term
  const filteredSdgs = sdgs.filter(
    (sdg) =>
      sdg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sdg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sdg.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort SDGs based on sort criteria
  const sortedSdgs = [...filteredSdgs].sort((a, b) => {
    if (sortBy === "projects") return b.projects - a.projects;
    if (sortBy === "students") return b.students - a.students;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const getImpactBadgeClass = (impact) => {
    switch (impact) {
      case "Very High":
        return "bg-green-500/20 text-green-400";
      case "High":
        return "bg-blue-500/20 text-blue-400";
      case "Medium":
        return "bg-amber-500/20 text-amber-400";
      case "Low":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getChangeIcon = (change) => {
    if (change === "up") return <ArrowUp size={16} className="text-green-400" />;
    if (change === "down") return <ArrowDown size={16} className="text-red-400" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">SDG Tracking</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <BarChart2 size={16} className="mr-2" />
          Generate Impact Report
        </Button>
      </div>

      <Card className="bg-[#1E1E1E] border-none shadow-lg">
        <div>
          <div>SDG Alignment</div>
          <div className="text-gray-400">
            Track project alignment with Sustainable Development Goals
          </div>
        </div>
        <div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                placeholder="Search SDGs..."
                className="pl-10 bg-[#2C2C2C] border-none rounded-md p-2 w-full text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <select
                className="bg-[#2C2C2C] border-none rounded-md p-2 text-sm text-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="projects">Sort by Projects</option>
                <option value="students">Sort by Students</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedSdgs.map((sdg) => (
              <div key={sdg.id} className="bg-[#2C2C2C] rounded-lg p-4 hover:bg-[#3C3C3C] transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${sdg.color} flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      <span className="font-bold text-xs">{sdg.name}</span>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{sdg.fullName}</h3>
                        {getChangeIcon(sdg.change)}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{sdg.description}</p>
                    </div>
                  </div>
                  <button className="h-8 w-8 p-0 bg-transparent hover:bg-gray-800 rounded-md">
                    <MoreHorizontal className="h-4 w-4 mx-auto" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-[#252525] p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Projects</div>
                    <div className="text-xl font-bold">{sdg.projects}</div>
                  </div>
                  <div className="bg-[#252525] p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Students</div>
                    <div className="text-xl font-bold">{sdg.students}</div>
                  </div>
                  <div className="bg-[#252525] p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Impact</div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${getImpactBadgeClass(sdg.impact)}`}>
                        {sdg.impact}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSdgs.length === 0 && (
            <div className="text-center py-8 text-gray-500">No SDGs found matching your search criteria.</div>
          )}
        </div>
      </Card>

      <Card className="bg-[#1E1E1E] border-none shadow-lg">
        <div>
          <div>SDG Impact Overview</div>
          <div className="text-gray-400">
            Overall contribution to Sustainable Development Goals
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center h-80 bg-[#2C2C2C] rounded-lg">
            <BarChart2 size={32} className="text-gray-500" />
            <span className="ml-2 text-gray-500">Chart Placeholder</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-[#2C2C2C] p-4 rounded-lg">
              <div className="text-sm text-gray-400">Total SDGs Covered</div>
              <div className="text-3xl font-bold mt-1">14/17</div>
              <div className="text-xs text-green-400 mt-1">82% coverage</div>
            </div>
            <div className="bg-[#2C2C2C] p-4 rounded-lg">
              <div className="text-sm text-gray-400">Most Popular SDG</div>
              <div className="text-xl font-bold mt-1">SDG 4: Quality Education</div>
              <div className="text-xs text-gray-400 mt-1">112 projects</div>
            </div>
            <div className="bg-[#2C2C2C] p-4 rounded-lg">
              <div className="text-sm text-gray-400">Least Covered SDG</div>
              <div className="text-xl font-bold mt-1">SDG 16: Peace & Justice</div>
              <div className="text-xs text-gray-400 mt-1">39 projects</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}