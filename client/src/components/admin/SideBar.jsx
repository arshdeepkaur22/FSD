import React, { useState } from "react";
import { Users, CheckSquare, FolderKanban, Trophy, Bell, BarChart2, Globe, Home, Menu, X } from 'lucide-react';

export default function Sidebar({ activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "users", label: "User Management", icon: Users },
    { id: "projects", label: "Project Moderation", icon: CheckSquare },
    { id: "content", label: "Content Organization", icon: FolderKanban },
    { id: "leaderboard", label: "Leaderboard & Ranking", icon: Trophy },
    { id: "notifications", label: "Notifications & Alerts", icon: Bell },
    { id: "reports", label: "Reports & Insights", icon: BarChart2 },
    { id: "sdg", label: "SDG Tracking", icon: Globe },
  ];

  return (
    <>
      <div
        className={`${collapsed ? "w-20" : "w-64"} bg-[#0F0F0F] h-screen transition-all duration-300 flex flex-col shadow-xl`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {!collapsed && (
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
              Admin Panel
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <div className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activePage === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-[#1E1E1E] hover:text-white"
                  }`}
                >
                  <item.icon size={20} />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="font-bold">A</span>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-400">admin@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}