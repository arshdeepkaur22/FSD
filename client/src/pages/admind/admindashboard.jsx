import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Users,
  Award,
  RefreshCw,
  Building,
  BookOpen,
  ChevronDown,
  Star,
  BarChart3,
  FileText,
  Settings,
  Activity,
  TrendingUp,
  User,
} from "lucide-react";
import axios from "axios";
import Header from "../components/Header";

// Department options
const departmentOptions = [
  "All Departments",
  "Computer Engineering",
  "Computer Science and Engineering",
  "Mechanical Engineering",
  "Electronics and Computer Science"
];

// User roles
const roleOptions = ["All Roles", "admin", "teacher", "student"];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  
  // States for different data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Overview stats
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalStudents: 0,
    totalTeachers: 0,
    pendingProjects: 0,
    approvedProjects: 0,
    rejectedProjects: 0,
  });
  
  // Users list
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Projects list
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  
  // Top projects (leaderboard)
  const [topProjects, setTopProjects] = useState([]);

  useEffect(() => {
    // Fetch all data when component mounts
    fetchOverviewStats();
    fetchUsers();
    fetchProjects();
    fetchTopProjects();
  }, []);

  // Apply filters when search term or filters change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, departmentFilter, roleFilter, users, projects]);

  const fetchOverviewStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
      setError("Failed to load dashboard statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users data. Please try again.");
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(response.data.projects);
      setFilteredProjects(response.data.projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects data. Please try again.");
    }
  };

  const fetchTopProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/projects/top", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTopProjects(response.data.projects);
    } catch (err) {
      console.error("Error fetching top projects:", err);
    }
  };

  const applyFilters = () => {
    // Filter users
    const filteredUsersList = users.filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toString().includes(searchTerm);
      
      const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
      
      const matchesDepartment = 
        departmentFilter === "All Departments" || 
        user.department === departmentFilter;
      
      return matchesSearch && matchesRole && matchesDepartment;
    });
    
    setFilteredUsers(filteredUsersList);
    
    // Filter projects
    const filteredProjectsList = projects.filter(project => {
      const matchesSearch = 
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = 
        departmentFilter === "All Departments" || 
        project.department === departmentFilter;
      
      return matchesSearch && matchesDepartment;
    });
    
    setFilteredProjects(filteredProjectsList);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("All Departments");
    setRoleFilter("All Roles");
    setFilteredUsers(users);
    setFilteredProjects(projects);
  };

  const changeUserStatus = async (userId, isActive) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, 
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update local state
      const updatedUsers = users.map(user => 
        user._id === userId ? { ...user, isActive } : user
      );
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers.filter(user => {
        const matchesSearch = 
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toString().includes(searchTerm);
        
        const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
        
        const matchesDepartment = 
          departmentFilter === "All Departments" || 
          user.department === departmentFilter;
        
        return matchesSearch && matchesRole && matchesDepartment;
      }));
      
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Failed to update user status. Please try again.");
    }
  };

  const changeProjectStatus = async (projectId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/projects/${projectId}/status`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update local state
      const updatedProjects = projects.map(project => 
        project._id === projectId ? { ...project, status } : project
      );
      
      setProjects(updatedProjects);
      
      // Update filtered projects
      applyFilters();
      
      // Also update stats
      fetchOverviewStats();
      
    } catch (err) {
      console.error("Error updating project status:", err);
      alert("Failed to update project status. Please try again.");
    }
  };

  // Stats Card Component
  const StatCard = ({ title, value, icon, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-lg flex justify-between items-center`}>
      <div>
        <p className="text-gray-300 text-sm">{title}</p>
        <h3 className="text-white text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="bg-white/10 rounded-full p-3">
        {icon}
      </div>
    </div>
  );

  // Render the overview section
  const renderOverview = () => (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-white">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<Users size={24} className="text-blue-300" />} 
          bgColor="bg-gradient-to-br from-blue-900/50 to-blue-800/30" 
        />
        <StatCard 
          title="Total Teachers" 
          value={stats.totalTeachers} 
          icon={<BookOpen size={24} className="text-green-300" />} 
          bgColor="bg-gradient-to-br from-green-900/50 to-green-800/30" 
        />
        <StatCard 
          title="Total Projects" 
          value={stats.totalProjects} 
          icon={<Activity size={24} className="text-purple-300" />} 
          bgColor="bg-gradient-to-br from-purple-900/50 to-purple-800/30" 
        />
        <StatCard 
          title="Pending Review" 
          value={stats.pendingProjects} 
          icon={<FileText size={24} className="text-yellow-300" />} 
          bgColor="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30" 
        />
        <StatCard 
          title="Approved Projects" 
          value={stats.approvedProjects} 
          icon={<Award size={24} className="text-green-300" />} 
          bgColor="bg-gradient-to-br from-green-900/50 to-green-800/30" 
        />
        <StatCard 
          title="Rejected Projects" 
          value={stats.rejectedProjects} 
          icon={<TrendingUp size={24} className="text-red-300" />} 
          bgColor="bg-gradient-to-br from-red-900/50 to-red-800/30" 
        />
      </div>
      
      {/* Top Projects Leaderboard */}
      <div className="bg-[#1A1A2E] rounded-xl p-6 shadow-lg mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white">Top Rated Projects</h3>
          <Link to="/projects" className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
            View All
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2A2A2A] text-left">
              <tr>
                <th className="px-6 py-3 text-gray-400 font-medium text-sm">Project</th>
                <th className="px-6 py-3 text-gray-400 font-medium text-sm">Student</th>
                <th className="px-6 py-3 text-gray-400 font-medium text-sm">Department</th>
                <th className="px-6 py-3 text-gray-400 font-medium text-sm">Rating</th>
                <th className="px-6 py-3 text-gray-400 font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {topProjects.length > 0 ? (
                topProjects.map((project, index) => (
                  <tr key={project._id} className="hover:bg-[#2C2C2C] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-[#2C2C2C] w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          <span className={`text-xs font-semibold ${
                            index === 0 ? "text-yellow-400" : 
                            index === 1 ? "text-gray-300" : 
                            index === 2 ? "text-amber-700" : "text-blue-400"
                          }`}>
                            #{index + 1}
                          </span>
                        </div>
                        <div className="font-medium text-white">{project.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {project.student?.name || project.student?.username || "Anonymous"}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {project.department || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star className="text-yellow-400 mr-1" size={16} />
                        <span className="text-yellow-400">{project.averageRating?.toFixed(1) || "0.0"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === "Approved" ? "bg-green-900/20 text-green-400" :
                        project.status === "Rejected" ? "bg-red-900/20 text-red-400" :
                        project.status === "In Review" ? "bg-yellow-900/20 text-yellow-400" :
                        "bg-gray-800 text-gray-300"
                      }`}>
                        {project.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No top projects available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-[#1A1A2E] rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {/* Mock activity items */}
          <div className="flex items-start p-3 rounded-lg bg-[#2C2C2C]/50">
            <div className="bg-blue-900/30 p-2 rounded-full mr-3">
              <User size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm">New student registered: <span className="text-blue-400">Jessica Lee</span></p>
              <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start p-3 rounded-lg bg-[#2C2C2C]/50">
            <div className="bg-green-900/30 p-2 rounded-full mr-3">
              <FileText size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-white text-sm">Project <span className="text-green-400">AI Chatbot Assistant</span> was approved</p>
              <p className="text-gray-400 text-xs mt-1">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start p-3 rounded-lg bg-[#2C2C2C]/50">
            <div className="bg-yellow-900/30 p-2 rounded-full mr-3">
              <Star size={16} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-white text-sm">Dr. Smith rated project <span className="text-yellow-400">Smart Home System</span> with 5 stars</p>
              <p className="text-gray-400 text-xs mt-1">Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the users management section
  const renderUsersManagement = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Users Management</h2>
        <button className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center">
          <UserPlus size={16} className="mr-2" />
          Add New User
        </button>
      </div>
      
      {/* Filter Bar */}
      <div className="bg-[#1A1A2E] rounded-xl p-4 mb-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users by name, email or ID..."
              className="w-full bg-[#2C2C2C] text-white border-0 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="bg-[#2C2C2C] text-white border-0 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <select
              className="bg-[#2C2C2C] text-white border-0 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <button
              onClick={resetFilters}
              className="bg-blue-700 hover:bg-blue-600 rounded-lg p-2 shadow-sm"
              title="Reset filters"
            >
              <RefreshCw size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-[#1A1A2E] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#2A2A2A] text-left">
              <tr>
                <th className="px-6 py-3 text-gray-400 font-medium">ID</th>
                <th className="px-6 py-3 text-gray-400 font-medium">Name</th>
                <th className="px-6 py-3 text-gray-400 font-medium">Email</th>
                <th className="px-6 py-3 text-gray-400 font-medium">Role</th>
                <th className="px-6 py-3 text-gray-400 font-medium">Department</th>
                <th className="px-6 py-3 text-gray-400 font-medium">Status</th>
                <th className="px-6 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#2C2C2C] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-mono">{user.username || user._id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-200">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin" ? "bg-purple-900/30 text-purple-300" :
                        user.role === "teacher" ? "bg-blue-900/30 text-blue-300" :
                        "bg-green-900/30 text-green-300"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {user.department || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.isActive ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"
                      }`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          className="text-gray-400 hover:text-white transition"
                          onClick={() => changeUserStatus(user._id, !user.isActive)}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <Link
                          to={`/users/${user._id}`}
                          className="text-blue-400 hover:text-blue-300 transition"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render the projects section
  const renderProjects = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Projects Management</h2>
        <div className="flex space-x-2">
          <button className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
            Export Report
          </button>
        </div>
      </div>
      
      {/* Filter Bar */}
      <div className="bg-[#1A1A2E] rounded-xl p-4 mb-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full bg-[#2C2C2C] text-white border-0 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="bg-[#2C2C2C] text-white border-0 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <button
              onClick={resetFilters}
              className="bg-blue-700 hover:bg-blue-600 rounded-lg p-2 shadow-sm"
              title="Reset filters"
            >
              <RefreshCw size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Projects Table */}
      <div className="bg-[#1A1A2E] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#2A2A2A] text-left">
              <tr>
                <th className="px-6 py-3 text-gray-400 font-medium">Project</th>
                <th className="px-6 py-3 text-gray-400 font-medium">Student</th>
                <th className="px-6 py-3 text-gray-400 font-medium">Department</th>
                <th className="px-6 py-3 text-gray-400 font-medium">Rating</th>
                <th className="px-6 py-3 text-gray-400 font-medium">Status</th>
                <th className="px-6 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-[#2C2C2C] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{project.title}</div>
                      <div className="text-gray-500 text-xs mt-1">{project.techStack}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {project.student?.name || project.student?.username || "Anonymous"}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {project.department || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star className="text-yellow-400 mr-1" size={16} />
                        <span className="text-yellow-400">{project.averageRating?.toFixed(1) || "0.0"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === "Approved" ? "bg-green-900/20 text-green-400" :
                        project.status === "Rejected" ? "bg-red-900/20 text-red-400" :
                        project.status === "In Review" ? "bg-yellow-900/20 text-yellow-400" :
                        "bg-gray-800 text-gray-300"
                      }`}>
                        {project.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <select
                          className="bg-[#2C2C2C] text-white border-0 rounded-lg py-1 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={project.status || "Pending"}
                          onChange={(e) => changeProjectStatus(project._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Review">In Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <Link
                          to={`/projects/${project._id}`}
                          className="text-blue-400 hover:text-blue-300 transition"
                          >
                            
                          View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No projects found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  
    // Render the settings section
    const renderSettings = () => (
      <div>
        <h2 className="text-xl font-semibold mb-6 text-white">System Settings</h2>
        
        <div className="bg-[#1A1A2E] rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-white mb-6">General Configuration</h3>
          
          <div className="space-y-6">
            {/* Department Settings */}
            <div>
              <h4 className="text-gray-300 text-base mb-3">Department Management</h4>
              <div className="bg-[#2C2C2C] rounded-lg p-4">
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-2">Add New Department</label>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Department name" 
                      className="flex-grow bg-[#222230] text-white border border-gray-700 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg">
                      Add
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Current Departments</label>
                  <div className="max-h-48 overflow-y-auto">
                    <div className="space-y-2">
                      {departmentOptions.filter(d => d !== "All Departments").map((dept, index) => (
                        <div key={index} className="flex justify-between items-center bg-[#222230] p-2 rounded">
                          <span className="text-gray-300">{dept}</span>
                          <div className="flex space-x-2">
                            <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                            <button className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Email Settings */}
            <div>
              <h4 className="text-gray-300 text-base mb-3">Email Configuration</h4>
              <div className="bg-[#2C2C2C] rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">SMTP Server</label>
                    <input 
                      type="text" 
                      placeholder="smtp.example.com" 
                      className="w-full bg-[#222230] text-white border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">SMTP Port</label>
                    <input 
                      type="number" 
                      placeholder="587" 
                      className="w-full bg-[#222230] text-white border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email Username</label>
                    <input 
                      type="email" 
                      placeholder="admin@example.com" 
                      className="w-full bg-[#222230] text-white border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full bg-[#222230] text-white border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-2">Default Sender Name</label>
                  <input 
                    type="text" 
                    placeholder="Project Portal Admin" 
                    className="w-full bg-[#222230] text-white border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                    Save Email Settings
                  </button>
                </div>
              </div>
            </div>
            
            {/* System Maintenance */}
            <div>
              <h4 className="text-gray-300 text-base mb-3">System Maintenance</h4>
              <div className="bg-[#2C2C2C] rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
                  <div className="flex-1">
                    <h5 className="text-white text-sm font-medium mb-1">Database Backup</h5>
                    <p className="text-gray-400 text-xs mb-3">Last backup: Apr 24, 2025, 03:15 AM</p>
                    <button className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm w-full">
                      Run Backup Now
                    </button>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-white text-sm font-medium mb-1">Clear Cache</h5>
                    <p className="text-gray-400 text-xs mb-3">Clear system cache to improve performance</p>
                    <button className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm w-full">
                      Clear Cache
                    </button>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-white text-sm font-medium mb-1">System Logs</h5>
                    <p className="text-gray-400 text-xs mb-3">View detailed system logs</p>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm w-full">
                      View Logs
                    </button>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-white text-sm font-medium mb-2">Maintenance Mode</h5>
                  <div className="flex items-center justify-between bg-[#222230] p-3 rounded-lg">
                    <div>
                      <p className="text-gray-300 text-sm">Put system in maintenance mode</p>
                      <p className="text-gray-500 text-xs mt-1">All users will be logged out and unable to access the system</p>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  
    const UserPlus = ({ size, className }) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    );
  
    if (error) {
      return (
        <div className="min-h-screen bg-[#16162A] text-gray-200 p-6">
          <Header />
          <div className="mt-16 max-w-7xl mx-auto">
            <div className="bg-red-900/20 border border-red-700/30 text-red-300 p-4 rounded-xl shadow">
              <h3 className="text-lg font-medium mb-2">Error</h3>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-[#16162A] text-gray-200">
        <Header />
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="lg:w-64 mb-8 lg:mb-0">
              <div className="bg-[#1A1A2E] rounded-xl shadow-lg p-4">
                <div className="mb-6">
                  <h2 className="font-semibold text-white text-xl mb-2">Admin Dashboard</h2>
                  <p className="text-gray-400 text-sm">Manage your projects portal</p>
                </div>
                
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === "overview"
                        ? "bg-blue-700/30 text-blue-300"
                        : "text-gray-300 hover:bg-[#2C2C2C] hover:text-white"
                    }`}
                  >
                    <BarChart3 size={18} />
                    <span>Overview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === "users"
                        ? "bg-blue-700/30 text-blue-300"
                        : "text-gray-300 hover:bg-[#2C2C2C] hover:text-white"
                    }`}
                  >
                    <Users size={18} />
                    <span>Users</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === "projects"
                        ? "bg-blue-700/30 text-blue-300"
                        : "text-gray-300 hover:bg-[#2C2C2C] hover:text-white"
                    }`}
                  >
                    <FileText size={18} />
                    <span>Projects</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === "settings"
                        ? "bg-blue-700/30 text-blue-300"
                        : "text-gray-300 hover:bg-[#2C2C2C] hover:text-white"
                    }`}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                </nav>
                
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <div className="bg-blue-900/20 text-blue-300 p-4 rounded-lg text-sm">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Activity size={16} className="mr-2" />
                      System Status
                    </h4>
                    <p className="text-gray-400 text-xs mb-2">Server Load: 23%</p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "23%" }}></div>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">Memory Usage: 1.2GB / 4GB</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:flex-1 lg:pl-8">
              {activeTab === "overview" && renderOverview()}
              {activeTab === "users" && renderUsersManagement()}
              {activeTab === "projects" && renderProjects()}
              {activeTab === "settings" && renderSettings()}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;