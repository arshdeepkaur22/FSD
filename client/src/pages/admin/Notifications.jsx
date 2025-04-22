import React, { useState } from "react";
import { Search, Filter, Bell, Send, Edit, Trash2, MoreHorizontal, AlertTriangle, Info } from 'lucide-react';
import Button from "../../components/admin/Button";
import Card from "../../components/admin/Card";

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("history");

  // Sample notification data
  const notifications = [
    {
      id: 1,
      title: "Project Submission Deadline",
      message: "Reminder: The deadline for submitting projects for the Spring Showcase is May 15th, 2023.",
      type: "announcement",
      date: "2023-05-01",
      sentTo: "All Users",
      status: "sent",
    },
    {
      id: 2,
      title: "Platform Maintenance",
      message:
        "The platform will be undergoing maintenance on Saturday, May 6th from 2AM to 5AM UTC. Some features may be unavailable during this time.",
      type: "alert",
      date: "2023-05-03",
      sentTo: "All Users",
      status: "sent",
    },
    {
      id: 3,
      title: "New SDG Category Added",
      message:
        "We have added a new category for SDG 14: Life Below Water. Projects related to ocean conservation and marine ecosystems can now be tagged with this category.",
      type: "update",
      date: "2023-05-05",
      sentTo: "All Users",
      status: "sent",
    },
    {
      id: 4,
      title: "Faculty Evaluation Period",
      message:
        "Faculty members are reminded that the project evaluation period begins on May 10th and ends on May 20th.",
      type: "announcement",
      date: "2023-05-08",
      sentTo: "Faculty",
      status: "sent",
    },
    {
      id: 5,
      title: "Student Workshop: SDG Integration",
      message:
        "Join us for a virtual workshop on how to effectively integrate SDGs into your projects. The workshop will be held on May 12th at 3PM UTC.",
      type: "announcement",
      date: "2023-05-10",
      sentTo: "Students",
      status: "scheduled",
      scheduledDate: "2023-05-11",
    },
  ];

  // Filter notifications based on search term and type filter
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notification.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "announcement":
        return <Bell size={16} className="text-blue-400" />;
      case "alert":
        return <AlertTriangle size={16} className="text-amber-400" />;
      case "update":
        return <Info size={16} className="text-green-400" />;
      default:
        return <Bell size={16} />;
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "announcement":
        return "bg-blue-500/20 text-blue-400";
      case "alert":
        return "bg-amber-500/20 text-amber-400";
      case "update":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === "sent" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications & Alerts</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Send size={16} className="mr-2" />
          Send New Notification
        </Button>
      </div>

      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === "history" ? "default" : "outline"}
          className={activeTab === "history" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-800 bg-[#2C2C2C]"}
          onClick={() => setActiveTab("history")}
        >
          Notification History
        </Button>
        <Button
          variant={activeTab === "compose" ? "default" : "outline"}
          className={activeTab === "compose" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-800 bg-[#2C2C2C]"}
          onClick={() => setActiveTab("compose")}
        >
          Compose Notification
        </Button>
      </div>

      {activeTab === "history" ? (
        <Card className="bg-[#1E1E1E] border-none shadow-lg">
          <div>
            <div>Notification History</div>
            <div className="text-gray-400">
              View and manage platform-wide notifications and alerts
            </div>
          </div>
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  placeholder="Search notifications..."
                  className="pl-10 bg-[#2C2C2C] border-none rounded-md p-2 w-full text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-gray-500" />
                <select
                  className="bg-[#2C2C2C] border-none rounded-md p-2 text-sm text-white"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="announcement">Announcements</option>
                  <option value="alert">Alerts</option>
                  <option value="update">Updates</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="p-4 rounded-lg bg-[#2C2C2C] hover:bg-[#3C3C3C] transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg ${getTypeBadgeClass(notification.type)} mr-3`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                        <div className="flex flex-wrap items-center mt-3 gap-2">
                          <span className="text-xs text-gray-500">Sent to: {notification.sentTo}</span>
                          <span className="text-xs text-gray-500">Date: {notification.date}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(notification.status)}`}
                          >
                            {notification.status === "sent" ? "Sent" : "Scheduled"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="h-8 w-8 p-0 bg-transparent hover:bg-gray-800 rounded-md">
                        <MoreHorizontal className="h-4 w-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredNotifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No notifications found matching your search criteria.
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="bg-[#1E1E1E] border-none shadow-lg">
          <div>
            <div>Compose Notification</div>
            <div className="text-gray-400">
              Create and send a new notification to platform users
            </div>
          </div>
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Notification Title</label>
                <input
                  placeholder="Enter notification title"
                  className="bg-[#2C2C2C] border-none rounded-md p-2 w-full text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  placeholder="Enter notification message"
                  className="bg-[#2C2C2C] border-none rounded-md p-2 w-full text-white min-h-[120px]"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Notification Type</label>
                  <select className="w-full bg-[#2C2C2C] border-none rounded-md p-2 text-white">
                    <option value="announcement">Announcement</option>
                    <option value="alert">Alert</option>
                    <option value="update">Update</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Recipients</label>
                  <select className="w-full bg-[#2C2C2C] border-none rounded-md p-2 text-white">
                    <option value="all">All Users</option>
                    <option value="students">Students Only</option>
                    <option value="faculty">Faculty Only</option>
                    <option value="viewers">Viewers Only</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Send Now or Schedule</label>
                  <select className="w-full bg-[#2C2C2C] border-none rounded-md p-2 text-white">
                    <option value="now">Send Immediately</option>
                    <option value="schedule">Schedule for Later</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Schedule Date (if applicable)</label>
                  <input type="date" className="bg-[#2C2C2C] border-none rounded-md p-2 w-full text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" className="border-gray-800 bg-[#2C2C2C]">
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send size={16} className="mr-2" />
              Send Notification
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}