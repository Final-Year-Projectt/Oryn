
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3F7F4]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <DashboardNavbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <Outlet />
      </div>
    </div>
  );
}
