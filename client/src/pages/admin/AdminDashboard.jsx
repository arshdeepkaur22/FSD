import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import DashboardHome from "../../components/admin/DashboardHome";
import UserManagement from "./UserManagement";
import ProjectModeration from "./ProjectModeration";
import ContentOrganization from "./ContentOrganisation";
import Leaderboard from "./LeaderBoard";
import Notifications from "./Notifications";
import Reports from "./Reports";
import SdgTracking from "./SDGTracking";
import "../../assets/styles/admin.css";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardHome />;
      case "users":
        return <UserManagement />;
      case "projects":
        return <ProjectModeration />;
      case "content":
        return <ContentOrganization />;
      case "leaderboard":
        return <Leaderboard />;
      case "notifications":
        return <Notifications />;
      case "reports":
        return <Reports />;
      case "sdg":
        return <SdgTracking />;
      default:
        return <DashboardHome />;
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 overflow-auto">
        <div className="p-6">{renderPage()}</div>
      </div>
    </div>
  );
}