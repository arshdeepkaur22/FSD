import React, { useState } from "react";
import { BarChart2, PieChart, LineChart, Download, Calendar, Filter, RefreshCw } from 'lucide-react';
import Button from "../../components/admin/Button";
import Card from "../../components/admin/Card";

export default function Reports() {
  const [dateRange, setDateRange] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for charts would be here in a real implementation
  // For this example, we'll just show placeholders

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Insights</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-gray-800 bg-[#2C2C2C]">
            <Calendar size={16} className="mr-2" />
            {dateRange === "week" ? "This Week" : dateRange === "month" ? "This Month" : "This Year"}
          </Button>
          <Button variant="outline" className="border-gray-800 bg-[#2C2C2C]">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto">
        <Button
          variant={activeTab === "overview" ? "default" : "outline"}
          className={activeTab === "overview" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-800 bg-[#2C2C2C]"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === "projects" ? "default" : "outline"}
          className={activeTab === "projects" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-800 bg-[#2C2C2C]"}
          onClick={() => setActiveTab("projects")}
        >
          Project Trends
        </Button>
        <Button
          variant={activeTab === "sdg" ? "default" : "outline"}
          className={activeTab === "sdg" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-800 bg-[#2C2C2C]"}
          onClick={() => setActiveTab("sdg")}
        >
          SDG Contribution
        </Button>
        <Button
          variant={activeTab === "users" ? "default" : "outline"}
          className={activeTab === "users" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-800 bg-[#2C2C2C]"}
          onClick={() => setActiveTab("users")}
        >
          User Participation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-[#1E1E1E] border-none shadow-lg">
          <div className="pb-2">
            <div className="text-lg font-medium">Total Projects</div>
            <div className="text-gray-400">All time submissions</div>
          </div>
          <div>
            <div className="flex justify-between items-end">
              <div className="text-3xl font-bold">856</div>
              <div className="flex items-center text-green-400 text-sm">
                +18% <span className="text-gray-400 ml-1">vs last period</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-[#1E1E1E] border-none shadow-lg">
          <div className="pb-2">
            <div className="text-lg font-medium">Active Users</div>
            <div className="text-gray-400">Students & faculty</div>
          </div>
          <div>
            <div className="flex justify-between items-end">
              <div className="text-3xl font-bold">1,284</div>
              <div className="flex items-center text-green-400 text-sm">
                +12% <span className="text-gray-400 ml-1">vs last period</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-[#1E1E1E] border-none shadow-lg">
          <div className="pb-2">
            <div className="text-lg font-medium">SDG Coverage</div>
            <div className="text-gray-400">Goals with projects</div>
          </div>
          <div>
            <div className="flex justify-between items-end">
              <div className="text-3xl font-bold">14/17</div>
              <div className="flex items-center text-green-400 text-sm">
                +2 <span className="text-gray-400 ml-1">vs last period</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-[#1E1E1E] border-none shadow-lg">
          <div className="flex flex-row items-center justify-between">
            <div>
              <div>Project Submissions</div>
              <div className="text-gray-400">Monthly trend</div>
            </div>
            <Button variant="outline" size="sm" className="border-gray-800 bg-[#2C2C2C]">
              <RefreshCw size={14} className="mr-2" />
              Refresh
            </Button>
          </div>
          <div>
            <div className="flex items-center justify-center h-64 bg-[#2C2C2C] rounded-lg">
              <LineChart size={32} className="text-gray-500" />
              <span className="ml-2 text-gray-500">Chart Placeholder</span>
            </div>
          </div>
        </Card>
        <Card className="bg-[#1E1E1E] border-none shadow-lg">
          <div className="flex flex-row items-center justify-between">
            <div>
              <div>Project Categories</div>
              <div className="text-gray-400">Distribution by type</div>
            </div>
            <Button variant="outline" size="sm" className="border-gray-800 bg-[#2C2C2C]">
              <RefreshCw size={14} className="mr-2" />
              Refresh
            </Button>
          </div>
          <div>
            <div className="flex items-center justify-center h-64 bg-[#2C2C2C] rounded-lg">
              <PieChart size={32} className="text-gray-500" />
              <span className="ml-2 text-gray-500">Chart Placeholder</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-[#1E1E1E] border-none shadow-lg">
        <div className="flex flex-row items-center justify-between">
          <div>
            <div>SDG Contribution</div>
            <div className="text-gray-400">Projects per Sustainable Development Goal</div>
          </div>
          <Button variant="outline" size="sm" className="border-gray-800 bg-[#2C2C2C]">
            <RefreshCw size={14} className="mr-2" />
            Refresh
          </Button>
        </div>
        <div>
          <div className="flex items-center justify-center h-80 bg-[#2C2C2C] rounded-lg">
            <BarChart2 size={32} className="text-gray-500" />
            <span className="ml-2 text-gray-500">Chart Placeholder</span>
          </div>
        </div>
      </Card>
    </div>
  );
}