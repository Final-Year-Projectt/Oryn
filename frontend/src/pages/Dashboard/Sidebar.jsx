
import { NavLink, useNavigate } from "react-router-dom";
import { GiKnockedOutStars } from "react-icons/gi";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  UploadCloud,
  Database,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Bot,
  History,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Upload Data", icon: UploadCloud, path: "/dashboard/upload" },
  { name: "Validation", icon: ShieldCheck, path: "/dashboard/validation" },
  { name: "Datasets", icon: Database, path: "/dashboard/datasets" },
  { name: "Problems", icon: AlertTriangle, path: "/dashboard/problems" },
  { name: "Recommendations", icon: Lightbulb, path: "/dashboard/recommendations" },
  { name: "AI Assistant", icon: Bot, path: "/dashboard/assistant" },
  { name: "History", icon: History, path: "/dashboard/history" },
  { name: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    navigate("/login", { replace: true });
  };

  const sidebarClass =
    "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#E2ECE6] bg-white transition-transform duration-300 lg:translate-x-0 " +
    (isOpen ? "translate-x-0" : "-translate-x-full");

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClass}>
        <div className="flex h-20 items-center justify-between border-b border-[#E2ECE6] px-6">
          <div className="flex items-center gap-2">
            <GiKnockedOutStars size={30} color="#0D9488" />
            <span className="text-2xl font-bold text-[#19382F]">
              ORYN<span className="text-[#0D9488]">.</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Workspace
          </p>

          {menuItems.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              end={path === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition " +
                (isActive
                  ? "bg-[#E1F5EB] text-[#145C46]"
                  : "text-gray-500 hover:bg-[#F2F8F4] hover:text-[#145C46]")
              }
            >
              <Icon size={19} />
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#E2ECE6] p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />
            Log Out
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            ORYN • Prototype v0.1
          </p>
        </div>
      </aside>
    </>
  );
}
