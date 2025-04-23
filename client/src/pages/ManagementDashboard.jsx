import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ManagementDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/management/dashboard');
        setDashboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!dashboardData) return <div>No data available</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Institutional Management Dashboard</h1>
      
      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Institutional Performance Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium">Participation Rate</h3>
            <p className="text-2xl font-bold">{dashboardData.performanceMetrics.participationRate}%</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium">Project Quality Score</h3>
            <p className="text-2xl font-bold">{dashboardData.performanceMetrics.projectQualityScore}/10</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium">Engagement Level</h3>
            <p className="text-2xl font-bold">{dashboardData.performanceMetrics.engagementLevel}%</p>
          </div>
        </div>
      </div>

      {/* SDG Contributions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">SDG Contributions & Trends</h2>
        <div className="h-80">
          <BarChart width={800} height={300} data={dashboardData.sdgContributions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sdgNumber" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="contributionScore" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      {/* Project Impact */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Project Impact Analysis</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Educational Goals</h3>
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
            <h3 className="text-lg font-medium mb-4">Sustainability Goals</h3>
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Industry Engagement & Networking</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Organization</th>
                <th className="px-4 py-2">Partnership Type</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.industryPartnerships.map((partnership, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{partnership.organizationName}</td>
                  <td className="px-4 py-2">{partnership.partnershipType}</td>
                  <td className="px-4 py-2">{partnership.contactPerson}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full ${
                      partnership.status === 'Active' ? 'bg-green-100 text-green-800' :
                      partnership.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Generated Reports</h2>
        <div className="space-y-4">
          {dashboardData.reports.map((report, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{report.reportType}</h3>
                  <p className="text-sm text-gray-500">Period: {report.period}</p>
                </div>
                <div className="text-sm text-gray-500">
                  Generated: {new Date(report.generatedAt).toLocaleDateString()}
                </div>
                <a
                  href={report.fileUrl}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
  );
};

export default ManagementDashboard; 