import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ManagementDashboard = () => {
  // State variables
  const [projects, setProjects] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Stats state variables with default values
  const [projectStats, setProjectStats] = useState({
    total: 0,
    approved: 0,
    inReview: 0,
    pending: 0,
    rejected: 0,
    avgRating: '0.0'
  });
  
  const [collabStats, setCollabStats] = useState({
    total: 0,
    open: 0,
    closed: 0,
    mentorship: 0,
    applicants: 0
  });
  
  const [studentStats, setStudentStats] = useState({
    total: 0,
    active: 0,
    topPerforming: 0
  });
  
  const [sdgData, setSdgData] = useState([
    { sdgGoal: 'No Data', contributionCount: 0 }
  ]);
  
  const [performanceData, setPerformanceData] = useState([
    { grade: 'Excellent (A)', count: 0 },
    { grade: 'Good (B)', count: 0 },
    { grade: 'Average (C)', count: 0 },
    { grade: 'Poor (D/F)', count: 0 },
    { grade: 'No Rating', count: 0 }
  ]);
  
  // Calculated metrics with default values
  const [metrics, setMetrics] = useState({
    participationRate: 0,
    projectQualityScore: '0.0',
    engagementLevel: '0.0'
  });
  
  const navigate = useNavigate();
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Use the correct API endpoints
        console.log('Fetching data from correct endpoints...');
        
        // Fetch projects data - using the correct endpoint
        let projectsData = [];
        try {
          const response = await axios.get('http://localhost:5000/api/projectAnalytics/projects');
          console.log('Projects response:', response.data);
          if (response.data && Array.isArray(response.data.projects)) {
            projectsData = response.data.projects;
          } else if (response.data && response.data.projects) {
            projectsData = response.data.projects;
          }
        } catch (projectError) {
          console.error('Error fetching projects:', projectError);
        }
        
        // Fetch collaborations data - using the correct endpoint
        let collabsData = [];
        try {
          const response = await axios.get('http://localhost:5000/api/collaborationAnalytics/collaborations');
          console.log('Collaborations response:', response.data);
          if (response.data && Array.isArray(response.data.collaborations)) {
            collabsData = response.data.collaborations;
          } else if (response.data && response.data.collaborations) {
            collabsData = response.data.collaborations;
          }
        } catch (collabError) {
          console.error('Error fetching collaborations:', collabError);
        }
        
        // Fetch students data - using the correct endpoint
        let studentsData = [];
        try {
          const response = await axios.get('http://localhost:5000/api/projectAnalytics/students/stats');
          console.log('Students response:', response.data);
          if (response.data && Array.isArray(response.data)) {
            studentsData = response.data;
          } else if (response.data) {
            // Handle case where response might not be an array
            console.log('Students data is not an array, attempting to convert:', response.data);
            studentsData = Array.isArray(response.data) ? response.data : [];
          }
        } catch (studentError) {
          console.error('Error fetching students:', studentError);
        }
        
        // Update state with fetched data
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setCollaborations(Array.isArray(collabsData) ? collabsData : []);
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setLoading(false);
      } catch (error) {
        console.error('Error in data fetching:', error);
        setError('Failed to load dashboard data. Please check if the server is running properly.');
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
      calculateSdgData();
      calculatePerformanceData();
      calculateMetrics();
    }
  }, [projects, collaborations, students, loading]);
  
  // Calculate project statistics
  const calculateProjectStats = () => {
    try {
      if (!Array.isArray(projects)) {
        console.warn('Projects is not an array:', projects);
        return;
      }
      
      // Count by status
      let approved = 0;
      let inReview = 0;
      let pending = 0;
      let rejected = 0;
      let totalRating = 0;
      let ratedCount = 0;
      
      projects.forEach(project => {
        if (!project) return;
        
        // Count statuses
        if (project.status === 'Approved') approved++;
        else if (project.status === 'In Review') inReview++;
        else if (project.status === 'Pending') pending++;
        else if (project.status === 'Rejected') rejected++;
        
        // Sum ratings
        if (project.averageRating && typeof project.averageRating === 'number' && project.averageRating > 0) {
          totalRating += project.averageRating;
          ratedCount++;
        }
      });
      
      const avgRating = ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : '0.0';
      
      setProjectStats({
        total: projects.length,
        approved,
        inReview,
        pending,
        rejected,
        avgRating
      });
    } catch (error) {
      console.error('Error calculating project stats:', error);
      setProjectStats({
        total: 0,
        approved: 0,
        inReview: 0,
        pending: 0,
        rejected: 0,
        avgRating: '0.0'
      });
    }
  };
  
  // Calculate collaboration statistics
  const calculateCollabStats = () => {
    try {
      if (!Array.isArray(collaborations)) {
        console.warn('Collaborations is not an array:', collaborations);
        return;
      }
      
      let open = 0;
      let closed = 0;
      let mentorship = 0;
      let totalApplicants = 0;
      
      collaborations.forEach(collab => {
        if (!collab) return;
        
        // Count statuses
        if (collab.status === 'Open') open++;
        else if (collab.status === 'Closed') closed++;
        
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
        applicants: totalApplicants
      });
    } catch (error) {
      console.error('Error calculating collaboration stats:', error);
      setCollabStats({
        total: 0,
        open: 0,
        closed: 0,
        mentorship: 0,
        applicants: 0
      });
    }
  };
  
  // Calculate student statistics
  const calculateStudentStats = () => {
    try {
      if (!Array.isArray(students)) {
        console.warn('Students is not an array:', students);
        setStudentStats({
          total: 0,
          active: 0,
          topPerforming: 0
        });
        return;
      }
      
      // Count active students (with at least one project)
      let active = 0;
      let topPerforming = 0;
      
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        if (!student) continue;
        
        if (typeof student.projectsCount === 'number' && student.projectsCount > 0) {
          active++;
        }
        
        if (student.averageGrade === 'A') {
          topPerforming++;
        }
      }
      
      setStudentStats({
        total: students.length,
        active,
        topPerforming
      });
    } catch (error) {
      console.error('Error calculating student stats:', error);
      setStudentStats({
        total: 0,
        active: 0,
        topPerforming: 0
      });
    }
  };
  
  // Format data for SDG chart
  const calculateSdgData = () => {
    try {
      if (!Array.isArray(projects) || projects.length === 0) {
        setSdgData([{ sdgGoal: 'No Data', contributionCount: 0 }]);
        return;
      }
      
      // Count SDG goals
      const sdgCounts = {};
      
      projects.forEach(project => {
        if (!project || !project.sdgGoals || !Array.isArray(project.sdgGoals)) return;
        
        project.sdgGoals.forEach(goal => {
          if (!goal) return;
          sdgCounts[goal] = (sdgCounts[goal] || 0) + 1;
        });
      });
      
      // Convert to chart data format
      const formattedData = Object.entries(sdgCounts).map(([goal, count]) => ({
        sdgGoal: goal,
        contributionCount: count
      }));
      
      if (formattedData.length === 0) {
        setSdgData([{ sdgGoal: 'No Data', contributionCount: 0 }]);
      } else {
        setSdgData(formattedData);
      }
    } catch (error) {
      console.error('Error formatting SDG data:', error);
      setSdgData([{ sdgGoal: 'Error', contributionCount: 0 }]);
    }
  };
  
  // Format data for performance chart
  const calculatePerformanceData = () => {
    try {
      if (!Array.isArray(students) || students.length === 0) {
        setPerformanceData([
          { grade: 'Excellent (A)', count: 0 },
          { grade: 'Good (B)', count: 0 },
          { grade: 'Average (C)', count: 0 },
          { grade: 'Poor (D/F)', count: 0 },
          { grade: 'No Rating', count: 0 }
        ]);
        return;
      }
      
      // Initialize counts
      const performanceCounts = {
        'Excellent (A)': 0,
        'Good (B)': 0,
        'Average (C)': 0,
        'Poor (D/F)': 0,
        'No Rating': 0
      };
      
      // Count students by grade
      students.forEach(student => {
        if (!student || !student.averageGrade) {
          performanceCounts['No Rating']++;
          return;
        }
        
        const grade = student.averageGrade;
        
        if (grade === 'A' || grade === 'A-') {
          performanceCounts['Excellent (A)']++;
        } else if (grade === 'B+' || grade === 'B' || grade === 'B-') {
          performanceCounts['Good (B)']++;
        } else if (grade === 'C+' || grade === 'C' || grade === 'C-') {
          performanceCounts['Average (C)']++;
        } else if (grade === 'D' || grade === 'F') {
          performanceCounts['Poor (D/F)']++;
        } else {
          performanceCounts['No Rating']++;
        }
      });
      
      // Convert to chart data format
      setPerformanceData(Object.entries(performanceCounts).map(([grade, count]) => ({
        grade,
        count
      })));
    } catch (error) {
      console.error('Error formatting performance data:', error);
      setPerformanceData([
        { grade: 'Error', count: 0 }
      ]);
    }
  };
  
  // Calculate derived metrics
  const calculateMetrics = () => {
    try {
      const participationRate = studentStats.total > 0 
        ? Math.round((studentStats.active / studentStats.total) * 100)
        : 0;
        
      const projectQualityScore = parseFloat(projectStats.avgRating) > 0
        ? (parseFloat(projectStats.avgRating) * 2).toFixed(1)
        : "0.0";
        
      const engagementLevel = studentStats.total > 0
        ? (projectStats.total / studentStats.total).toFixed(1)
        : "0.0";
      
      setMetrics({
        participationRate,
        projectQualityScore,
        engagementLevel
      });
    } catch (error) {
      console.error('Error calculating metrics:', error);
      setMetrics({
        participationRate: 0,
        projectQualityScore: '0.0',
        engagementLevel: '0.0'
      });
    }
  };
  
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
                Admin
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              {/* Navigation Links */}
              <nav className="flex space-x-4 text-gray-300">
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
                <Link to="/leaderboard" className="hover:text-white transition">
                  Leaderboard
                </Link>
                <Link to="/collaborationHub" className="hover:text-white transition">
                  Collaborations
                </Link>
                <Link to="/mentorship" className="hover:text-white transition">
                  Mentorships
                </Link>
                <Link to="/management/reports" className="hover:text-white transition">
                  Reports
                </Link>
                <Link to="/management/partnerships" className="hover:text-white transition">
                  Partnerships
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('user');
                    navigate('/login');
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
          <h1 className="text-3xl font-bold text-blue-300">Admin Dashboard</h1>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex -mb-px">
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setActiveTab('projects')}
            >
              Projects
            </button>
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setActiveTab('students')}
            >
              Students
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sdg'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setActiveTab('sdg')}
            >
              SDG Impact
            </button>
          </nav>
        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Performance Overview */}
            <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 mb-6 border border-[#2C2C2C]">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Institutional Performance Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-900/30 border border-blue-800 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-300">Participation Rate</h3>
                  <p className="text-2xl font-bold">{metrics.participationRate}%</p>
                  <p className="text-sm text-gray-400 mt-1">Students with projects</p>
                </div>
                <div className="bg-green-900/30 border border-green-800 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-300">Project Quality Score</h3>
                  <p className="text-2xl font-bold">{metrics.projectQualityScore}/10</p>
                  <p className="text-sm text-gray-400 mt-1">Based on ratings</p>
                </div>
                <div className="bg-purple-900/30 border border-purple-800 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-300">Engagement Level</h3>
                  <p className="text-2xl font-bold">{metrics.engagementLevel}</p>
                  <p className="text-sm text-gray-400 mt-1">Projects per student</p>
                </div>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Project Stats */}
              <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 border border-[#2C2C2C]">
                <h2 className="text-xl font-semibold mb-4 text-blue-300">Project Statistics</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Projects</span>
                    <span className="font-bold text-xl">{projectStats.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Approved Projects</span>
                    <span className="font-bold text-green-400">{projectStats.approved}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>In Review</span>
                    <span className="font-bold text-yellow-400">{projectStats.inReview}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending</span>
                    <span className="font-bold text-gray-400">{projectStats.pending}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rejected</span>
                    <span className="font-bold text-red-400">{projectStats.rejected}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span>Average Rating</span>
                    <div className="flex items-center">
                      <span className="font-bold mr-2">{projectStats.avgRating}</span>
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Collaboration Stats */}
              <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 border border-[#2C2C2C]">
                <h2 className="text-xl font-semibold mb-4 text-purple-300">Collaboration Statistics</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Collaborations</span>
                    <span className="font-bold text-xl">{collabStats.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Open Collaborations</span>
                    <span className="font-bold text-green-400">{collabStats.open}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Closed Collaborations</span>
                    <span className="font-bold text-gray-400">{collabStats.closed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Offers Mentorship</span>
                    <span className="font-bold text-blue-400">{collabStats.mentorship}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span>Total Applicants</span>
                    <span className="font-bold">{collabStats.applicants}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Student Performance */}
            <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 mb-6 border border-[#2C2C2C]">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Student Performance Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <h3 className="text-lg font-medium mb-2">Performance Distribution</h3>
                  <div className="h-64">
                    <BarChart width={500} height={250} data={performanceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis type="number" stroke="#ccc" />
                      <YAxis dataKey="grade" type="category" stroke="#ccc" width={120} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '4px' }} 
                        labelStyle={{ color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="count" fill="#4F86F7" />
                    </BarChart>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Student Metrics</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-[#2C2C2C] rounded-lg">
                      <p className="text-sm text-gray-400">Total Students</p>
                      <p className="text-2xl font-bold">{studentStats.total}</p>
                    </div>
                    <div className="p-3 bg-[#2C2C2C] rounded-lg">
                      <p className="text-sm text-gray-400">Active Students</p>
                      <p className="text-2xl font-bold">{studentStats.active}</p>
                    </div>
                    <div className="p-3 bg-[#2C2C2C] rounded-lg">
                      <p className="text-sm text-gray-400">Top Performing Students</p>
                      <p className="text-2xl font-bold">{studentStats.topPerforming}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 border border-[#2C2C2C]">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Project Management</h2>
            
            {projects.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <p>No project data available.</p>
              </div>
            ) : (
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
                      <tr key={project?._id || index} className={`border-b border-gray-700 hover:bg-[#2C2C2C]`}>
                        <td className="px-4 py-3">{project?.title || "Untitled"}</td>
                        <td className="px-4 py-3">{project?.student?.name || "Unknown"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            project?.status === 'Approved' ? 'bg-green-900/30 text-green-400' :
                            project?.status === 'In Review' ? 'bg-yellow-900/30 text-yellow-400' :
                            project?.status === 'Pending' ? 'bg-gray-900/30 text-gray-400' :
                            'bg-red-900/30 text-red-400'
                          }`}>
                            {project?.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {project?.sdgGoals && Array.isArray(project.sdgGoals) && project.sdgGoals.length > 0 ? (
                              project.sdgGoals.map((goal, i) => (
                                <span key={i} className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                                  {goal}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">{project?.grade || "Not graded"}</td>
                        <td className="px-4 py-3">
                          {project?.averageRating > 0 ? (
                            <div className="flex items-center">
                              <span className="mr-1">{project.averageRating.toFixed(1)}</span>
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          ) : (
                            "Not rated"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {project?._id ? (
                            <a 
                              href={`/projects/${project._id}`}
                              className="text-blue-400 hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 border border-[#2C2C2C]">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Student Performance Management</h2>
            
            {!Array.isArray(students) || students.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <p>No student data available.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left">Student ID</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Projects</th>
                      <th className="px-4 py-3 text-left">Average Grade</th>
                      <th className="px-4 py-3 text-left">Rating</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student?.id || index} className={`border-b border-gray-700 hover:bg-[#2C2C2C]`}>
                        <td className="px-4 py-3">{student?.username || "N/A"}</td>
                        <td className="px-4 py-3">{student?.name || "Unknown"}</td>
                        <td className="px-4 py-3">{student?.email || "N/A"}</td>
                        <td className="px-4 py-3">{typeof student?.projectsCount === 'number' ? student.projectsCount : 0}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full ${
                            student?.averageGrade === 'A' ? 'bg-green-900/30 text-green-400' :
                            student?.averageGrade === 'B+' || student?.averageGrade === 'B' ? 'bg-blue-900/30 text-blue-400' :
                            student?.averageGrade === 'C' ? 'bg-yellow-900/30 text-yellow-400' :
                            student?.averageGrade === 'D' || student?.averageGrade === 'F' ? 'bg-red-900/30 text-red-400' :
                            'bg-gray-900/30 text-gray-400'
                          }`}>
                            {student?.averageGrade || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {student?.averageRating > 0 ? (
                            <div className="flex items-center">
                              <span className="mr-1">{student.averageRating.toFixed(1)}</span>
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          ) : (
                            "Not rated"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {student?.id ? (
                            <a 
                              href={`/projects/user/${student.id}`}
                              className="text-blue-400 hover:underline"
                            >
                              View Projects
                            </a>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* SDG Impact Tab */}
        {activeTab === 'sdg' && (
          <>
            {/* SDG Contributions */}
            <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 mb-6 border border-[#2C2C2C]">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">SDG Contributions & Trends</h2>
              
              {sdgData.length === 0 || (sdgData.length === 1 && sdgData[0].contributionCount === 0) ? (
                <div className="py-8 text-center text-gray-400">
                  <p>No SDG data available.</p>
                </div>
              ) : (
                <div className="h-80">
                  <BarChart width={800} height={300} data={sdgData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="sdgGoal" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '4px' }} 
                      labelStyle={{ color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="contributionCount" name="Project Count" fill="#8884d8" />
                  </BarChart>
                </div>
              )}
            </div>
            
            {/* SDG Projects Table */}
            <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 border border-[#2C2C2C]">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Projects by SDG Goals</h2>
              
              {sdgData.length === 0 || (sdgData.length === 1 && sdgData[0].contributionCount === 0) ? (
                <div className="py-8 text-center text-gray-400">
                  <p>No SDG data available.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3 text-left">SDG Goal</th>
                        <th className="px-4 py-3 text-left">Projects Count</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sdgData.map((sdg, index) => (
                        <tr key={index} className={`border-b border-gray-700 hover:bg-[#2C2C2C]`}>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full">
                              {sdg.sdgGoal}
                            </span>
                          </td>
                          <td className="px-4 py-3">{sdg.contributionCount}</td>
                          <td className="px-4 py-3">
                            <a 
                              href={`/projects/sdg/${encodeURIComponent(sdg.sdgGoal)}`}
                              className="text-blue-400 hover:underline"
                            >
                              View Projects
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagementDashboard;