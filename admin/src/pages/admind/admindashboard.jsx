import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  Award,
  RefreshCw,
  Star,
  FileText,
  Activity,
  TrendingUp,
  User,
  Search,
} from "lucide-react";
import Header from "./adminheader"; // Use your existing Header component

const AdminDashboard = () => {
  // State variables
  const [projects, setProjects] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  // Stats state variables with default values
  const [projectStats, setProjectStats] = useState({
    total: 0,
    approved: 0,
    inReview: 0,
    pending: 0,
    rejected: 0,
    avgRating: "0.0",
  });

  const [collabStats, setCollabStats] = useState({
    total: 0,
    open: 0,
    closed: 0,
    mentorship: 0,
    applicants: 0,
  });

  const [studentStats, setStudentStats] = useState({
    total: 0,
    active: 0,
    topPerforming: 0,
  });

  const [userStats, setUserStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,
    totalManagement: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });

  const [sdgData, setSdgData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  // Department options
  const departmentOptions = [
    "All Departments",
    "Computer Engineering",
    "Computer Science and Engineering",
    "Mechanical Engineering",
    "Electronics and Computer Science",
  ];

  // User roles
  const roleOptions = [
    "All Roles",
    "admin",
    "management",
    "teacher",
    "student",
  ];

  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        console.log("Fetching data from analytics endpoints...");

        // Fetch projects data
        let projectsData = [];
        try {
          const response = await axios.get(
            "http://localhost:5000/api/projectAnalytics/projects"
          );
          console.log("Projects response:", response.data);
          if (response.data && Array.isArray(response.data.projects)) {
            projectsData = response.data.projects;
          } else if (response.data && response.data.projects) {
            projectsData = response.data.projects;
          }
        } catch (projectError) {
          console.error("Error fetching projects:", projectError);
        }

        // Fetch collaborations data
        let collabsData = [];
        try {
          const response = await axios.get(
            "http://localhost:5000/api/collaborationAnalytics/collaborations"
          );
          console.log("Collaborations response:", response.data);
          if (response.data && Array.isArray(response.data.collaborations)) {
            collabsData = response.data.collaborations;
          } else if (response.data && response.data.collaborations) {
            collabsData = response.data.collaborations;
          }
        } catch (collabError) {
          console.error("Error fetching collaborations:", collabError);
        }

        // Fetch students data
        let studentsData = [];
        try {
          const response = await axios.get(
            "http://localhost:5000/api/projectAnalytics/students/stats"
          );
          console.log("Students response:", response.data);
          if (response.data && Array.isArray(response.data)) {
            studentsData = response.data;
          } else {
            console.warn("Students data is not an array:", response.data);
          }
        } catch (studentError) {
          console.error("Error fetching students:", studentError);
        }

        // Fetch users data - mock for now
        const mockUsers = [
          {
            _id: "1",
            username: "admin1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
            isActive: true,
          },
          {
            _id: "2",
            username: "teacher1",
            name: "Professor Rahul",
            email: "smith@example.com",
            role: "teacher",
            isActive: true,
          },
          {
            _id: "3",
            username: "manager1",
            name: "manager",
            email: "manager@example.com",
            role: "management",
            isActive: true,
          },
          {
            _id: "4",
            username: "12345",
            name: "Anastasia ",
            email: "10194@example.com",
            role: "student",
            isActive: true,
          },
          {
            _id: "5",
            username: "12346",
            name: "Achille ",
            email: "Achille@example.com",
            role: "student",
            isActive: false,
          },
        ];

        // Update state with fetched data
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setCollaborations(Array.isArray(collabsData) ? collabsData : []);
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setUsers(mockUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error in data fetching:", error);
        setError(
          "Failed to load dashboard data. Please check if the server is running properly."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics when data changes
  useEffect(() => {
    if (!loading) {
      calculateProjectStats();
      calculateCollabStats();
      calculateStudentStats();
      calculateUserStats();
      calculateSdgData();
      calculatePerformanceData();
    }
  }, [projects, collaborations, students, users, loading]);

  // Apply filters when search term or filters change
  useEffect(() => {
    // This would filter the users and projects based on search and filters
    console.log("Filters changed:", {
      searchTerm,
      departmentFilter,
      roleFilter,
    });
  }, [searchTerm, departmentFilter, roleFilter]);

  // Calculate project statistics
  const calculateProjectStats = () => {
    try {
      if (!Array.isArray(projects)) {
        console.warn("Projects is not an array:", projects);
        return;
      }

      // Count by status
      let approved = 0;
      let inReview = 0;
      let pending = 0;
      let rejected = 0;
      let totalRating = 0;
      let ratedCount = 0;

      projects.forEach((project) => {
        if (!project) return;

        // Count statuses
        if (project.status === "Approved") approved++;
        else if (project.status === "In Review") inReview++;
        else if (project.status === "Pending") pending++;
        else if (project.status === "Rejected") rejected++;

        // Sum ratings
        if (
          project.averageRating &&
          typeof project.averageRating === "number" &&
          project.averageRating > 0
        ) {
          totalRating += project.averageRating;
          ratedCount++;
        }
      });

      const avgRating =
        ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : "0.0";

      setProjectStats({
        total: projects.length,
        approved,
        inReview,
        pending,
        rejected,
        avgRating,
      });
    } catch (error) {
      console.error("Error calculating project stats:", error);
      setProjectStats({
        total: 0,
        approved: 0,
        inReview: 0,
        pending: 0,
        rejected: 0,
        avgRating: "0.0",
      });
    }
  };

  // Calculate collaboration statistics
  const calculateCollabStats = () => {
    try {
      if (!Array.isArray(collaborations)) {
        console.warn("Collaborations is not an array:", collaborations);
        return;
      }

      let open = 0;
      let closed = 0;
      let mentorship = 0;
      let totalApplicants = 0;

      collaborations.forEach((collab) => {
        if (!collab) return;

        // Count statuses
        if (collab.status === "Open") open++;
        else if (collab.status === "Closed") closed++;

        // Count mentorship offerings
        if (collab.offersMentorship === true) mentorship++;

        // Count applicants
        if (collab.applicants && Array.isArray(collab.applicants)) {
          totalApplicants += collab.applicants.length;
        }
      });

      setCollabStats({
        total: collaborations.length,
        open,
        closed,
        mentorship,
        applicants: totalApplicants,
      });
    } catch (error) {
      console.error("Error calculating collaboration stats:", error);
      setCollabStats({
        total: 0,
        open: 0,
        closed: 0,
        mentorship: 0,
        applicants: 0,
      });
    }
  };

  // Calculate student statistics
  const calculateStudentStats = () => {
    try {
      if (!Array.isArray(students)) {
        console.warn("Students is not an array:", students);
        setStudentStats({
          total: 0,
          active: 0,
          topPerforming: 0,
        });
        return;
      }

      // Count active students (with at least one project)
      let active = 0;
      let topPerforming = 0;

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        if (!student) continue;

        if (
          typeof student.projectsCount === "number" &&
          student.projectsCount > 0
        ) {
          active++;
        }

        if (student.averageGrade === "A") {
          topPerforming++;
        }
      }

      setStudentStats({
        total: students.length,
        active,
        topPerforming,
      });
    } catch (error) {
      console.error("Error calculating student stats:", error);
      setStudentStats({
        total: 0,
        active: 0,
        topPerforming: 0,
      });
    }
  };

  // Calculate user statistics
  const calculateUserStats = () => {
    try {
      if (!Array.isArray(users)) {
        console.warn("Users is not an array:", users);
        return;
      }

      let totalStudents = 0;
      let totalTeachers = 0;
      let totalAdmins = 0;
      let totalManagement = 0;
      let activeUsers = 0;
      let inactiveUsers = 0;

      users.forEach((user) => {
        if (!user) return;

        // Count by role
        if (user.role === "student") totalStudents++;
        else if (user.role === "teacher") totalTeachers++;
        else if (user.role === "admin") totalAdmins++;
        else if (user.role === "management") totalManagement++;

        // Count by status
        if (user.isActive) activeUsers++;
        else inactiveUsers++;
      });

      setUserStats({
        totalStudents,
        totalTeachers,
        totalAdmins,
        totalManagement,
        activeUsers,
        inactiveUsers,
      });
    } catch (error) {
      console.error("Error calculating user stats:", error);
      setUserStats({
        totalStudents: 0,
        totalTeachers: 0,
        totalAdmins: 0,
        totalManagement: 0,
        activeUsers: 0,
        inactiveUsers: 0,
      });
    }
  };

  // Format data for SDG chart
  const calculateSdgData = () => {
    try {
      if (!Array.isArray(projects) || projects.length === 0) {
        setSdgData([{ sdgGoal: "No Data", contributionCount: 0 }]);
        return;
      }

      // Count SDG goals
      const sdgCounts = {};

      projects.forEach((project) => {
        if (!project || !project.sdgGoals || !Array.isArray(project.sdgGoals))
          return;

        project.sdgGoals.forEach((goal) => {
          if (!goal) return;
          sdgCounts[goal] = (sdgCounts[goal] || 0) + 1;
        });
      });

      // Convert to chart data format
      const formattedData = Object.entries(sdgCounts).map(([goal, count]) => ({
        sdgGoal: goal,
        contributionCount: count,
      }));

      if (formattedData.length === 0) {
        setSdgData([{ sdgGoal: "No Data", contributionCount: 0 }]);
      } else {
        setSdgData(formattedData);
      }
    } catch (error) {
      console.error("Error formatting SDG data:", error);
      setSdgData([{ sdgGoal: "Error", contributionCount: 0 }]);
    }
  };

  // Format data for performance chart
  const calculatePerformanceData = () => {
    try {
      if (!Array.isArray(students) || students.length === 0) {
        setPerformanceData([
          { grade: "Excellent (A)", count: 0 },
          { grade: "Good (B)", count: 0 },
          { grade: "Average (C)", count: 0 },
          { grade: "Poor (D/F)", count: 0 },
          { grade: "No Rating", count: 0 },
        ]);
        return;
      }

      // Initialize counts
      const performanceCounts = {
        "Excellent (A)": 0,
        "Good (B)": 0,
        "Average (C)": 0,
        "Poor (D/F)": 0,
        "No Rating": 0,
      };

      // Count students by grade
      students.forEach((student) => {
        if (!student || !student.averageGrade) {
          performanceCounts["No Rating"]++;
          return;
        }

        const grade = student.averageGrade;

        if (grade === "A" || grade === "A-") {
          performanceCounts["Excellent (A)"]++;
        } else if (grade === "B+" || grade === "B" || grade === "B-") {
          performanceCounts["Good (B)"]++;
        } else if (grade === "C+" || grade === "C" || grade === "C-") {
          performanceCounts["Average (C)"]++;
        } else if (grade === "D" || grade === "F") {
          performanceCounts["Poor (D/F)"]++;
        } else {
          performanceCounts["No Rating"]++;
        }
      });

      // Convert to chart data format
      setPerformanceData(
        Object.entries(performanceCounts).map(([grade, count]) => ({
          grade,
          count,
        }))
      );
    } catch (error) {
      console.error("Error formatting performance data:", error);
      setPerformanceData([{ grade: "Error", count: 0 }]);
    }
  };

  // Reset filter function
  const resetFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("All Departments");
    setRoleFilter("All Roles");
  };

  // Stats Card Component
  const StatCard = ({ title, value, icon, bgColor }) => (
    <div
      className={`${bgColor} rounded-xl p-6 shadow-lg flex justify-between items-center`}
    >
      <div>
        <p className="text-gray-300 text-sm">{title}</p>
        <h3 className="text-white text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="bg-white/10 rounded-full p-3">{icon}</div>
    </div>
  );

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter flex items-center justify-center">
        <div className="bg-red-600/20 border border-red-500 text-red-400 p-6 rounded-lg text-center max-w-lg">
          <h3 className="text-xl font-bold mb-2">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white font-inter">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight text-white">
                ProjectNest
              </span>
              <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                Management
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              {/* Navigation Links */}
              <nav className="flex space-x-4 text-gray-300">
                {/* <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
                <Link to="/leaderboard" className="hover:text-white transition">
                  Leaderboard
                </Link>
                <Link
                  to="/collaborationHub"
                  className="hover:text-white transition"
                >
                  Collaborations
                </Link>
                <Link to="/mentorship" className="hover:text-white transition">
                  Mentorships
                </Link>
                <Link
                  to="/management/reports"
                  className="hover:text-white transition"
                >
                  Reports
                </Link>
                <Link
                  to="/management/partnerships"
                  className="hover:text-white transition"
                >
                  Partnerships
                </Link> */}
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("userRole");
                    localStorage.removeItem("user");
                    navigate("/login");
                  }}
                  className="hover:text-white transition"
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-300">
            Institutional Management Dashboard
          </h1>
        </div>

        {/* Tabs - Same style as Management Dashboard */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex -mb-px">
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-purple-500 text-purple-300"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-purple-500 text-purple-300"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "projects"
                  ? "border-purple-500 text-purple-300"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-purple-500 text-purple-300"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard
                title="Total Students"
                value={userStats.totalStudents || studentStats.total}
                icon={<Users size={24} className="text-blue-300" />}
                bgColor="bg-gradient-to-br from-blue-900/50 to-blue-800/30"
              />
              <StatCard
                title="Total Teachers"
                value={userStats.totalTeachers}
                icon={<Award size={24} className="text-green-300" />}
                bgColor="bg-gradient-to-br from-green-900/50 to-green-800/30"
              />
              <StatCard
                title="Total Projects"
                value={projectStats.total}
                icon={<Activity size={24} className="text-purple-300" />}
                bgColor="bg-gradient-to-br from-purple-900/50 to-purple-800/30"
              />
            </div>

            {/* Status / Role Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Project Status */}
              <div className="bg-[#1E1E1E] rounded-xl shadow-lg p-6 border border-[#2C2C2C]">
                <h2 className="text-xl font-semibold mb-4 text-blue-300">
                  Project Status
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Projects</span>
                    <span className="font-bold text-xl">
                      {projectStats.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Approved Projects</span>
                    <span className="font-bold text-green-400">
                      {projectStats.approved}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>In Review</span>
                    <span className="font-bold text-yellow-400">
                      {projectStats.inReview}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending</span>
                    <span className="font-bold text-gray-400">
                      {projectStats.pending}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rejected</span>
                    <span className="font-bold text-red-400">
                      {projectStats.rejected}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span>Average Rating</span>
                    <div className="flex items-center">
                      <span className="font-bold mr-2">
                        {projectStats.avgRating}
                      </span>
                      <svg
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Distribution */}
              <div className="bg-[#1E1E1E] rounded-xl shadow-lg p-6 border border-[#2C2C2C]">
                <h2 className="text-xl font-semibold mb-4 text-purple-300">
                  User Distribution
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Users</span>
                    <span className="font-bold text-xl">
                      {userStats.totalStudents +
                        userStats.totalTeachers +
                        userStats.totalAdmins +
                        userStats.totalManagement}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Students</span>
                    <span className="font-bold text-blue-400">
                      {userStats.totalStudents}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Teachers</span>
                    <span className="font-bold text-green-400">
                      {userStats.totalTeachers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Management</span>
                    <span className="font-bold text-amber-400">
                      {userStats.totalManagement}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Admins</span>
                    <span className="font-bold text-purple-400">
                      {userStats.totalAdmins}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span>Active Users</span>
                    <span className="font-bold text-green-400">
                      {userStats.activeUsers}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SDG Contributions */}
            <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 mb-6 border border-[#2C2C2C]">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">
                SDG Contributions & Trends
              </h2>
              <div className="h-80">
                <BarChart width={800} height={300} data={sdgData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="sdgGoal" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#333",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    labelStyle={{ color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="contributionCount"
                    name="Project Count"
                    fill="#8884d8"
                  />
                </BarChart>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 border border-[#2C2C2C]">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">
                Recent System Activity
              </h2>
              <div className="space-y-4">
                {/* Mock activity items */}
                <div className="flex items-start p-3 rounded-lg bg-[#2C2C2C]/50">
                  <div className="bg-blue-900/30 p-2 rounded-full mr-3">
                    <User size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm">
                      New student registered:{" "}
                      <span className="text-blue-400">Nikita Sharma</span>
                    </p>
                    <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start p-3 rounded-lg bg-[#2C2C2C]/50">
                  <div className="bg-green-900/30 p-2 rounded-full mr-3">
                    <FileText size={16} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm">
                      Project{" "}
                      <span className="text-green-400">
                        AI Chatbot Assistant
                      </span>{" "}
                      was approved
                    </p>
                    <p className="text-gray-400 text-xs mt-1">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start p-3 rounded-lg bg-[#2C2C2C]/50">
                  <div className="bg-yellow-900/30 p-2 rounded-full mr-3">
                    <Star size={16} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm">
                      Prof. Ramesh Gupta rated project{" "}
                      <span className="text-yellow-400">Smart Home System</span>{" "}
                      with 5 stars
                    </p>
                    <p className="text-gray-400 text-xs mt-1">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-purple-300">
                Users Management
              </h2>
              <button className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center">
                <User className="mr-2" size={16} />
                Add New User
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#1E1E1E] rounded-xl p-4 shadow-lg border border-[#2C2C2C]">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search users by name, email or ID..."
                    className="w-full bg-[#2C2C2C] text-white border-0 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="bg-[#2C2C2C] text-white border-0 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <select
                    className="bg-[#2C2C2C] text-white border-0 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={resetFilters}
                    className="bg-purple-700 hover:bg-purple-600 rounded-lg p-2 shadow-sm"
                    title="Reset filters"
                  >
                    <RefreshCw size={18} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg border border-[#2C2C2C]">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#2A2A2A] text-left">
                    <tr className="border-b border-gray-700">
                      <th className="px-6 py-3 text-gray-400 font-medium">
                        ID
                      </th>
                      <th className="px-6 py-3 text-gray-400 font-medium">
                        Name
                      </th>
                      <th className="px-6 py-3 text-gray-400 font-medium">
                        Email
                      </th>
                      <th className="px-6 py-3 text-gray-400 font-medium">
                        Role
                      </th>
                      <th className="px-6 py-3 text-gray-400 font-medium">
                        Status
                      </th>
                      <th className="px-6 py-3 text-gray-400 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-gray-700 hover:bg-[#2C2C2C]"
                        >
                          <td className="px-6 py-4">
                            <div className="text-white font-mono">
                              {user.username || user._id}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-200">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {user.email}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-purple-900/30 text-purple-300"
                                  : user.role === "management"
                                  ? "bg-amber-900/30 text-amber-300"
                                  : user.role === "teacher"
                                  ? "bg-blue-900/30 text-blue-300"
                                  : "bg-green-900/30 text-green-300"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.isActive
                                  ? "bg-green-900/20 text-green-400"
                                  : "bg-red-900/20 text-red-400"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-3">
                              <button className="text-gray-400 hover:text-white transition">
                                {user.isActive ? "Deactivate" : "Activate"}
                              </button>
                              <Link
                                to={`/users/${user._id}`}
                                className="text-purple-400 hover:text-purple-300 transition"
                              >
                                Edit
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-gray-400"
                        >
                          No users found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-purple-300">
                Projects Management
              </h2>
              <div className="flex space-x-2">
                <button className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                  Export Report
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#1E1E1E] rounded-xl p-4 shadow-lg border border-[#2C2C2C]">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full bg-[#2C2C2C] text-white border-0 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="bg-[#2C2C2C] text-white border-0 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={resetFilters}
                    className="bg-purple-700 hover:bg-purple-600 rounded-lg p-2 shadow-sm"
                    title="Reset filters"
                  >
                    <RefreshCw size={18} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Table */}
            <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg border border-[#2C2C2C]">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left">Title</th>
                      <th className="px-4 py-3 text-left">Student</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">SDG Goals</th>
                      <th className="px-4 py-3 text-left">Grade</th>
                      <th className="px-4 py-3 text-left">Rating</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => (
                      <tr
                        key={project?._id || index}
                        className="border-b border-gray-700 hover:bg-[#2C2C2C]"
                      >
                        <td className="px-4 py-3">
                          {project?.title || "Untitled"}
                        </td>
                        <td className="px-4 py-3">
                          {project?.student?.name || "Unknown"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              project?.status === "Approved"
                                ? "bg-green-900/30 text-green-400"
                                : project?.status === "In Review"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : project?.status === "Pending"
                                ? "bg-gray-900/30 text-gray-400"
                                : "bg-red-900/30 text-red-400"
                            }`}
                          >
                            {project?.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {project?.sdgGoals &&
                            Array.isArray(project.sdgGoals) &&
                            project.sdgGoals.length > 0 ? (
                              project.sdgGoals.map((goal, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full"
                                >
                                  {goal}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {project?.grade || "Not graded"}
                        </td>
                        <td className="px-4 py-3">
                          {project?.averageRating > 0 ? (
                            <div className="flex items-center">
                              <span className="mr-1">
                                {project.averageRating.toFixed(1)}
                              </span>
                              <svg
                                className="w-4 h-4 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          ) : (
                            "Not rated"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-3">
                            <select
                              className="bg-[#2C2C2C] text-white border-0 rounded-lg py-1 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                              value={project?.status || "Pending"}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Review">In Review</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                            {project?._id ? (
                              <Link
                                to={`/projects/${project._id}`}
                                className="text-purple-400 hover:text-purple-300 transition"
                              >
                                View
                              </Link>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 border border-[#2C2C2C]">
              <h2 className="text-xl font-semibold mb-4 text-purple-300">
                System Configuration
              </h2>

              <div className="space-y-6">
                {/* Department Management */}
                <div className="bg-[#2A2A2A] p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Department Management
                  </h3>

                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">
                      Add New Department
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Department name"
                        className="flex-grow bg-[#222230] text-white border border-gray-700 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-r-lg">
                        Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Current Departments
                    </label>
                    <div className="max-h-48 overflow-y-auto">
                      <div className="space-y-2">
                        {departmentOptions
                          .filter((d) => d !== "All Departments")
                          .map((dept, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-[#222230] p-2 rounded"
                            >
                              <span className="text-gray-300">{dept}</span>
                              <div className="flex space-x-2">
                                <button className="text-blue-400 hover:text-blue-300 text-sm">
                                  Edit
                                </button>
                                <button className="text-red-400 hover:text-red-300 text-sm">
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Maintenance */}
                <div className="bg-[#2A2A2A] p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">
                    System Maintenance
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-[#222230] p-4 rounded-lg">
                      <h4 className="font-medium text-gray-300 mb-2">
                        Database Backup
                      </h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Last backup: Apr 25, 2025, 08:15 AM
                      </p>
                      <button className="w-full bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                        Run Backup
                      </button>
                    </div>
                    <div className="bg-[#222230] p-4 rounded-lg">
                      <h4 className="font-medium text-gray-300 mb-2">
                        Clear Cache
                      </h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Improve system performance
                      </p>
                      <button className="w-full bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                        Clear System Cache
                      </button>
                    </div>
                    <div className="bg-[#222230] p-4 rounded-lg">
                      <h4 className="font-medium text-gray-300 mb-2">
                        Server Status
                      </h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Currently running normally
                      </p>
                      <button className="w-full bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                        View System Logs
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#222230] p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-300">
                          Maintenance Mode
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">
                          Put the system in maintenance mode
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
