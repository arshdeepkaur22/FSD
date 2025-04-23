import React, { useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [reportType, setReportType] = useState('');
  const [period, setPeriod] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/management/reports', {
        reportType,
        period,
        metrics: {
          // Add any specific metrics you want to include in the report
        }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Report Generation</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleGenerateReport} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Report Type</option>
              <option value="performance">Performance Report</option>
              <option value="sdg">SDG Impact Report</option>
              <option value="partnerships">Partnerships Report</option>
              <option value="comprehensive">Comprehensive Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Period</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Generating Report...' : 'Generate Report'}
          </button>

          {success && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
              Report generated successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Reports; 