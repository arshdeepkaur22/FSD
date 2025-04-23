import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { School } from 'lucide-react'; // Make sure to install lucide-react
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Mock data for the dashboard
const mockDashboardData = {
  performanceMetrics: {
    participationRate: 85,
    projectQualityScore: 8.5,
    engagementLevel: 92
  },
  sdgContributions: [
    { sdgNumber: 1, contributionScore: 75 },
    { sdgNumber: 2, contributionScore: 82 },
    { sdgNumber: 3, contributionScore: 68 },
    { sdgNumber: 4, contributionScore: 90 },
    { sdgNumber: 5, contributionScore: 85 },
    { sdgNumber: 6, contributionScore: 78 },
    { sdgNumber: 7, contributionScore: 72 },
    { sdgNumber: 8, contributionScore: 88 },
    { sdgNumber: 9, contributionScore: 70 },
    { sdgNumber: 10, contributionScore: 83 },
    { sdgNumber: 11, contributionScore: 77 },
    { sdgNumber: 12, contributionScore: 80 },
    { sdgNumber: 13, contributionScore: 85 },
    { sdgNumber: 14, contributionScore: 65 },
    { sdgNumber: 15, contributionScore: 73 },
    { sdgNumber: 16, contributionScore: 87 },
    { sdgNumber: 17, contributionScore: 79 }
  ],
  projectImpact: {
    educationalGoals: [
      { goal: 'Skill Development', achievement: 85 },
      { goal: 'Research Output', achievement: 70 },
      { goal: 'Industry Integration', achievement: 90 },
      { goal: 'Student Engagement', achievement: 95 }
    ],
    sustainabilityGoals: [
      { goal: 'Environmental Impact', achievement: 80 },
      { goal: 'Social Responsibility', achievement: 85 },
      { goal: 'Economic Viability', achievement: 75 },
      { goal: 'Community Engagement', achievement: 88 }
    ]
  },
  industryPartnerships: [
    {
      organizationName: 'Tech Corp',
      partnershipType: 'Research Collaboration',
      contactPerson: 'John Smith',
      status: 'Active'
    },
    {
      organizationName: 'Green Energy Inc',
      partnershipType: 'Sustainability Project',
      contactPerson: 'Sarah Johnson',
      status: 'Pending'
    },
    {
      organizationName: 'EduTech Solutions',
      partnershipType: 'Educational Program',
      contactPerson: 'Mike Brown',
      status: 'Active'
    }
  ],
  reports: [
    {
      reportType: 'Quarterly Performance',
      period: 'Q1 2024',
      generatedAt: '2024-03-15',
      fileUrl: '#'
    },
    {
      reportType: 'SDG Impact Analysis',
      period: '2023',
      generatedAt: '2024-01-10',
      fileUrl: '#'
    },
    {
      reportType: 'Partnership Overview',
      period: '2023',
      generatedAt: '2023-12-31',
      fileUrl: '#'
    }
  ]
};

const ManagementDashboard = () => {
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) return <div className="text-white">Loading...</div>;
  if (!dashboardData) return <div className="text-white">No data available</div>;

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-gray-100">
      {/* Navbar */}
      <nav className="bg-[#1E1E1E]/80 shadow-md mb-6 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            
            <h1 className="text-2xl font-bold text-white">ProjectNest</h1>
          </div>
          <div className="flex space-x-4">
            {['Projects', 'Reports', 'Partenerships', 'Settings'].map((tab) => (
              <button 
                key={tab}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab.toLowerCase() === tab.toLowerCase() 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-white">Management Dashboard</h1>
        
        {/* SDG Contributions */}
        <div className="bg-[#1E1E1E] rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">SDG Contributions & Trends</h2>
          <div className="h-80 w-full overflow-x-auto">
            <BarChart width={1200} height={300} data={dashboardData.sdgContributions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
              <XAxis 
                dataKey="sdgNumber" 
                stroke="#9CA3AF"
                label={{ value: 'SDG Number', position: 'bottom', offset: -7 }}
              />
              <YAxis 
                stroke="#9CA3AF"
                label={{ value: 'Contribution Score (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                formatter={(value) => [`${value}%`, 'Contribution Score']}
              />
              <Bar dataKey="contributionScore" fill="#6366F1" name="" />
            </BarChart>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-[#1E1E1E] rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Institutional Performance Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-900/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-200">Participation Rate</h3>
              <p className="text-2xl font-bold text-blue-100">{dashboardData.performanceMetrics.participationRate}%</p>
            </div>
            <div className="bg-green-900/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-200">Project Quality Score</h3>
              <p className="text-2xl font-bold text-green-100">{dashboardData.performanceMetrics.projectQualityScore}/10</p>
            </div>
            <div className="bg-purple-900/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-200">Engagement Level</h3>
              <p className="text-2xl font-bold text-purple-100">{dashboardData.performanceMetrics.engagementLevel}%</p>
            </div>
          </div>
        </div>

        {/* Project Impact */}
        <div className="bg-[#1E1E1E] rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Project Impact Analysis</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-white">Educational Goals</h3>
              <PieChart width={400} height={300}>
                <Pie
                  data={dashboardData.projectImpact.educationalGoals}
                  dataKey="achievement"
                  nameKey="goal"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {dashboardData.projectImpact.educationalGoals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4 text-white">Sustainability Goals</h3>
              <PieChart width={400} height={300}>
                <Pie
                  data={dashboardData.projectImpact.sustainabilityGoals}
                  dataKey="achievement"
                  nameKey="goal"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {dashboardData.projectImpact.sustainabilityGoals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>

        {/* Industry Partnerships */}
        <div className="bg-[#1E1E1E] rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Industry Engagement & Networking</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-gray-300">Organization</th>
                  <th className="px-4 py-2 text-gray-300">Partnership Type</th>
                  <th className="px-4 py-2 text-gray-300">Contact</th>
                  <th className="px-4 py-2 text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.industryPartnerships.map((partnership, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="px-4 py-2 text-gray-300">{partnership.organizationName}</td>
                    <td className="px-4 py-2 text-gray-300">{partnership.partnershipType}</td>
                    <td className="px-4 py-2 text-gray-300">{partnership.contactPerson}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full ${
                        partnership.status === 'Active' ? 'bg-green-900 text-green-200' :
                        partnership.status === 'Pending' ? 'bg-yellow-900 text-yellow-200' :
                        'bg-red-900 text-red-200'
                      }`}>
                        {partnership.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reports */}
        <div className="bg-[#1E1E1E] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Generated Reports</h2>
          <div className="space-y-4">
            {dashboardData.reports.map((report, index) => (
              <div key={index} className="border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-white">{report.reportType}</h3>
                    <p className="text-sm text-gray-400">Period: {report.period}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    Generated: {new Date(report.generatedAt).toLocaleDateString()}
                  </div>
                  <a
                    href={report.fileUrl}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;