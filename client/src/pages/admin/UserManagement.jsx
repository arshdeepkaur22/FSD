import React, { useState } from "react";
import { Search, Filter, UserPlus, MoreHorizontal, Edit, Trash2, Shield, User } from 'lucide-react';
import Button from "../../components/admin/Button";
import Card from "../../components/admin/Card";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Sample user data
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "student",
      status: "active",
      joinDate: "2023-05-15",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah.smith@example.com",
      role: "faculty",
      status: "active",
      joinDate: "2023-04-10",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.j@example.com",
      role: "student",
      status: "inactive",
      joinDate: "2023-06-22",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "faculty",
      status: "active",
      joinDate: "2023-03-05",
    },
    {
      id: 5,
      name: "Alex Wong",
      email: "alex.w@example.com",
      role: "student",
      status: "active",
      joinDate: "2023-07-18",
    },
    {
      id: 6,
      name: "Maria Garcia",
      email: "maria.g@example.com",
      role: "student",
      status: "active",
      joinDate: "2023-05-30",
    },
    {
      id: 7,
      name: "James Wilson",
      email: "james.w@example.com",
      role: "viewer",
      status: "active",
      joinDate: "2023-06-12",
    },
    {
      id: 8,
      name: "Lisa Chen",
      email: "lisa.c@example.com",
      role: "viewer",
      status: "inactive",
      joinDate: "2023-04-25",
    },
  ];

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case "faculty":
        return <Shield size={16} className="text-blue-400" />;
      case "student":
        return <User size={16} className="text-green-400" />;
      case "viewer":
        return <User size={16} className="text-gray-400" />;
      default:
        return <User size={16} />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "faculty":
        return "bg-blue-500/20 text-blue-400";
      case "student":
        return "bg-green-500/20 text-green-400";
      case "viewer":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus size={16} className="mr-2" />
          Add New User
        </Button>
      </div>

      <Card className="bg-[#1E1E1E] border-none shadow-lg">
        <div>
          <div>User Accounts</div>
          <div className="text-gray-400">Manage student, faculty, and viewer accounts</div>
        </div>
        <div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                placeholder="Search users..."
                className="pl-10 bg-[#2C2C2C] border-none rounded-md p-2 w-full text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <select
                className="bg-[#2C2C2C] border-none rounded-md p-2 text-sm text-white"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
                <option value="viewer">Viewers</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Join Date</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-[#2C2C2C]">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                          <span className="font-bold text-sm">{user.name.charAt(0)}</span>
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{user.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeClass(user.role)}`}>
                          <span className="flex items-center">
                            {getRoleIcon(user.role)}
                            <span className="ml-1 capitalize">{user.role}</span>
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(user.status)}`}>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{user.joinDate}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="relative inline-block">
                        <button className="h-8 w-8 p-0 bg-transparent hover:bg-gray-800 rounded-md">
                          <MoreHorizontal className="h-4 w-4 mx-auto" />
                        </button>
                        {/* Dropdown menu would go here */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">No users found matching your search criteria.</div>
          )}

          <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
            <div>
              Showing {filteredUsers.length} of {users.length} users
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