
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";
import AIAssistant from "./AIAssistant";


export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleDesktopSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  
return (
  <div className="min-h-screen bg-[#F3F7F4]">
    <Sidebar
      isOpen={sidebarOpen}
      isCollapsed={sidebarCollapsed}
      onClose={() => setSidebarOpen(false)}
    />

    <div
      className={`min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
      }`}
    >
      <DashboardNavbar
        onMenuClick={() => setSidebarOpen(true)}
        onDesktopToggle={toggleDesktopSidebar}
      />

      <Outlet />
    </div>

    {/* Floating AI chat on every dashboard page */}
    <AIAssistant />
  </div>
);

}
