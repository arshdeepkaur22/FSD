import React, { useState } from 'react';

// Mock data - Replace with actual API call
const initialPartnerships = [
  {
    id: 1,
    organizationName: 'Tech Corp',
    partnershipType: 'Research Collaboration',
    contactPerson: 'John Smith',
    email: 'john@techcorp.com',
    status: 'Active',
    startDate: '2024-01-15',
    projectCount: 3
  },
  // ...add more mock partnerships as needed
];

const Partnerships = () => {
  const [partnerships, setPartnerships] = useState(initialPartnerships);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Partnership Management</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
            Add New Partnership
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-[#1E1E1E] rounded-lg p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search partnerships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2C2C2C] text-white px-4 py-2 rounded-md 
                          placeholder-gray-400 focus:outline-none focus:ring-2 
                          focus:ring-blue-500 border border-gray-700"
              />
            </div>
            <select className="bg-[#2C2C2C] text-white px-4 py-2 rounded-md border border-gray-700">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Partnerships Table */}
        <div className="bg-[#1E1E1E] rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#2C2C2C]">
                  <th className="px-6 py-3 text-left text-gray-300">Organization</th>
                  <th className="px-6 py-3 text-left text-gray-300">Type</th>
                  <th className="px-6 py-3 text-left text-gray-300">Contact</th>
                  <th className="px-6 py-3 text-left text-gray-300">Projects</th>
                  <th className="px-6 py-3 text-left text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {partnerships.map((partnership) => (
                  <tr key={partnership.id} className="hover:bg-[#2C2C2C]/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{partnership.organizationName}</div>
                        <div className="text-sm text-gray-400">Since {partnership.startDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{partnership.partnershipType}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white">{partnership.contactPerson}</div>
                        <div className="text-sm text-gray-400">{partnership.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{partnership.projectCount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        partnership.status === 'Active' ? 'bg-green-900 text-green-200' :
                        partnership.status === 'Pending' ? 'bg-yellow-900 text-yellow-200' :
                        'bg-red-900 text-red-200'
                      }`}>
                        {partnership.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partnerships;