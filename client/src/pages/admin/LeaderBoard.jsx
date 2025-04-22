import React, { useState } from "react";
import { Search, Filter, Trophy, Medal, Star, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import Button from "../../components/admin/Button";
import Card from "../../components/admin/Card";

export default function Leaderboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Sample project data for leaderboard
  const projects = [
    {
      id: 1,
      title: "Smart Irrigation System",
      student: "Alex Wong",
      category: "IoT",
      sdgs: ["SDG 6", "SDG 13"],
      rating: 4.9,
      likes: 245,
      views: 1250,
      change: "up",
      rank: 1,
    },
    {
      id: 2,
      title: "Sustainable Fashion Marketplace",
      student: "Maria Garcia",
      category: "Website",
      sdgs: ["SDG 12", "SDG 8"],
      rating: 4.8,
      likes: 210,
      views: 980,
      change: "up",
      rank: 2,
    },
    {
      id: 3,
      title: "Ocean Cleanup Tracker",
      student: "James Wilson",
      category: "Mobile App",
      sdgs: ["SDG 14", "SDG 13"],
      rating: 4.7,
      likes: 198,
      views: 1100,
      change: "down",
      rank: 3,
    },
    {
      id: 4,
      title: "AI Weather Prediction",
      student: "Emily Davis",
      category: "AI",
      sdgs: ["SDG 13", "SDG 11"],
      rating: 4.6,
      likes: 185,
      views: 950,
      change: "same",
      rank: 4,
    },
    {
      id: 5,
      title: "Recycling Education Game",
      student: "Mike Johnson",
      category: "Game",
      sdgs: ["SDG 12", "SDG 4"],
      rating: 4.5,
      likes: 172,
      views: 820,
      change: "up",
      rank: 5,
    },
    {
      id: 6,
      title: "Community Food Sharing",
      student: "Lisa Chen",
      category: "Mobile App",
      sdgs: ["SDG 2", "SDG 11"],
      rating: 4.4,
      likes: 168,
      views: 790,
      change: "down",
      rank: 6,
    },
    {
      id: 7,
      title: "Renewable Energy Dashboard",
      student: "David Kim",
      category: "Website",
      sdgs: ["SDG 7", "SDG 13"],
      rating: 4.3,
      likes: 155,
      views: 720,
      change: "up",
      rank: 7,
    },
    {
      id: 8,
      title: "Mental Health Support App",
      student: "Sarah Johnson",
      category: "Mobile App",
      sdgs: ["SDG 3"],
      rating: 4.2,
      likes: 142,
      views: 680,
      change: "down",
      rank: 8,
    },
  ];

  // Filter projects based on search term and category filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort projects based on sort criteria
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "likes") return b.likes - a.likes;
    if (sortBy === "views") return b.views - a.views;
    return a.rank - b.rank; // Default sort by rank
  });

  const categories = ["all", "Website", "Game", "Mobile App", "AI", "IoT"];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy size={20} className="text-yellow-400" />;
    if (rank === 2) return <Trophy size={20} className="text-gray-400" />;
    if (rank === 3) return <Trophy size={20} className="text-amber-700" />;
    return <span className="text-gray-400 font-medium">{rank}</span>;
  };

  const getChangeIcon = (change) => {
    if (change === "up") return <ArrowUp size={16} className="text-green-400" />;
    if (change === "down") return <ArrowDown size={16} className="text-red-400" />;
    return null;
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
      case "IoT":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leaderboard & Ranking</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Medal size={16} className="mr-2" />
          Update Rankings
        </Button>
      </div>

      <Card className="bg-[#1E1E1E] border-none shadow-lg">
        <div>
          <div>Project Leaderboard</div>
          <div className="text-gray-400">
            Top-rated projects based on viewer ratings and engagement
          </div>
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
              <Filter size={18} className="text-gray-500" />
              <select
                className="bg-[#2C2C2C] border-none rounded-md p-2 text-sm text-white"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <select
                className="bg-[#2C2C2C] border-none rounded-md p-2 text-sm text-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rank">Sort by Rank</option>
                <option value="rating">Sort by Rating</option>
                <option value="likes">Sort by Likes</option>
                <option value="views">Sort by Views</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Rank</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Project</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">SDGs</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Rating</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Likes</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Views</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-800 hover:bg-[#2C2C2C]">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getRankIcon(project.rank)}
                        {getChangeIcon(project.change)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-gray-400">by {project.student}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryBadgeClass(project.category)}`}>
                        {project.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {project.sdgs.map((sdg, index) => (
                          <span key={index} className="text-xs bg-green-800/60 text-green-200 px-2 py-1 rounded-full">
                            {sdg}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <Star size={16} className="text-yellow-400 mr-1" />
                        <span>{project.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">{project.likes}</td>
                    <td className="py-3 px-4 text-center">{project.views}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="h-8 w-8 p-0 bg-transparent hover:bg-gray-800 rounded-md">
                        <MoreHorizontal className="h-4 w-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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