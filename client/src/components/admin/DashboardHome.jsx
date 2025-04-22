import React from "react";
import { Users, CheckSquare, FolderKanban, Globe, TrendingUp, AlertTriangle } from 'lucide-react';
import Card from "./Card";

export default function DashboardHome() {
  // Sample data
  const stats = [
    { id: 1, title: "Total Users", value: "1,284", icon: Users, change: "+12%", color: "from-blue-500 to-blue-700" },
    {
      id: 2,
      title: "Pending Projects",
      value: "42",
      icon: CheckSquare,
      change: "+5%",
      color: "from-amber-500 to-amber-700",
    },
    {
      id: 3,
      title: "Total Projects",
      value: "856",
      icon: FolderKanban,
      change: "+18%",
      color: "from-green-500 to-green-700",
    },
    { id: 4, title: "SDG Coverage", value: "14/17", icon: Globe, change: "+2", color: "from-purple-500 to-purple-700" },
  ];

  const recentActivity = [
    {
      id: 1,
      user: "John Doe",
      action: "submitted a new project",
      time: "5 minutes ago",
      project: "AI Weather Prediction",
    },
    {
      id: 2,
      user: "Sarah Smith",
      action: "rated a project",
      time: "15 minutes ago",
      project: "Sustainable Energy App",
    },
    { id: 3, user: "Mike Johnson", action: "commented on", time: "1 hour ago", project: "Ocean Cleanup Tracker" },
    { id: 4, user: "Emily Davis", action: "joined as a faculty member", time: "2 hours ago", project: "" },
    { id: 5, user: "Admin", action: "approved", time: "3 hours ago", project: "Smart Irrigation System" },
  ];

  const pendingApprovals = [
    { id: 1, title: "AI Crop Disease Detection", student: "Alex Wong", category: "AI", sdgs: ["SDG 2", "SDG 15"] },
    {
      id: 2,
      title: "Water Quality Monitor",
      student: "Maria Garcia",
      category: "Mobile App",
      sdgs: ["SDG 6", "SDG 3"],
    },
    { id: 3, title: "Recycling Game", student: "James Wilson", category: "Game", sdgs: ["SDG 12"] },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center space-x-2 bg-[#1E1E1E] rounded-lg p-2">
          <span className="text-sm text-gray-400">Last updated:</span>
          <span className="text-sm">Today, 10:30 AM</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.id} className="bg-[#1E1E1E] border-none shadow-lg">
            <div className="pb-2">
              <div className="flex justify-between items-start">
                <div className="text-lg font-medium text-gray-200">{stat.title}</div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon size={18} />
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp size={16} className="mr-1" />
                  {stat.change}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-[#1E1E1E] border-none shadow-lg">
          <div>
            <div>Recent Activity</div>
            <div className="text-gray-400">Latest actions across the platform</div>
          </div>
          <div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#2C2C2C] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-sm">{activity.user.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-gray-400">{activity.action}</span>{" "}
                      {activity.project && <span className="font-medium text-blue-400">{activity.project}</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="bg-[#1E1E1E] border-none shadow-lg">
          <div className="flex flex-row items-center justify-between">
            <div>
              <div>Pending Approvals</div>
              <div className="text-gray-400">Projects awaiting moderation</div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-500">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div>
            <div className="space-y-4">
              {pendingApprovals.map((project) => (
                <div key={project.id} className="p-3 rounded-lg bg-[#2C2C2C] hover:bg-[#3C3C3C] transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-sm text-gray-400">By {project.student}</p>
                    </div>
                    <span className="text-xs bg-blue-600/30 text-blue-400 px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.sdgs.map((sdg, index) => (
                      <span key={index} className="text-xs bg-green-800/60 text-green-200 px-2 py-1 rounded-full">
                        {sdg}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <button className="px-3 py-1 text-xs bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30 transition-colors">
                      Reject
                    </button>
                    <button className="px-3 py-1 text-xs bg-green-600/20 text-green-400 rounded-md hover:bg-green-600/30 transition-colors">
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}