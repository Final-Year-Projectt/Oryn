import { NavLink, useNavigate } from "react-router-dom";
import { GiKnockedOutStars } from "react-icons/gi";
import { useAuth } from "../../context/AuthContext";
import { LogOut, X } from "lucide-react";
import { menuItems } from "./dashboardNavigation";

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed = false,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate("/login", { replace: true });
  };

  const closeMobileSidebar = () => onClose?.();

  
const sidebarClass =
  `fixed inset-y-0 left-0 z-50 flex w-64 flex-col
   border-r border-[#E2ECE6] bg-white
   transition-all duration-300
   ${isCollapsed ? "lg:w-20" : "lg:w-64"}
   lg:translate-x-0
   ${isOpen ? "translate-x-0" : "-translate-x-full"}`;


  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-slate-950/40 lg:hidden"
          onClick={closeMobileSidebar}
          aria-label="Close navigation overlay"
        />
      )}

      <aside className={sidebarClass} aria-label="Main sidebar">
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#E2ECE6] px-6">
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard");
              closeMobileSidebar();
            }}
            className="inline-flex items-center gap-2 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
            aria-label="ORYN dashboard home"
          >
            <GiKnockedOutStars size={30} color="#0D9488" />
            <span
  className={`text-2xl font-bold text-[#19382F] ${
    isCollapsed ? "lg:hidden" : ""
  }`}
>
  ORYN<span className="text-[#0D9488]">.</span>
</span>
          </button>

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-[#F2F8F4] hover:text-[#145C46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] lg:hidden"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav
  className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto px-3 py-6"
  aria-label="Workspace navigation"
>
          <p
  className={`mb-4 px-4 text-xs font-semibold uppercase tracking-widest text-gray-400 ${
    isCollapsed ? "lg:hidden" : ""
  }`}
>
  Workspace
</p>

          {menuItems
  .filter(({ name }) => name !== "AI Assistant")
  .map(({ name, icon: Icon, path }) => (
            <NavLink
  key={path}
  to={path}
  title={isCollapsed ? name : undefined}
  aria-label={name}
  end={path === "/dashboard"}
  onClick={closeMobileSidebar}
              
className={({ isActive }) =>
  "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium no-underline transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0D9488] " +
  (isCollapsed ? "lg:justify-center lg:px-0 " : "") +
  (isActive
    ? "bg-[#E1F5EB] text-[#145C46] shadow-sm shadow-emerald-950/[0.03]"
    : "text-gray-500 hover:bg-[#F2F8F4] hover:text-[#145C46]")
}

            >
              <Icon size={19} className="shrink-0" />
              <span className={`min-w-0 flex-1 ${isCollapsed ? "lg:hidden" : ""}`}>
  {name}
</span>
             {name === "Notifications" && (
  <span
    className={`h-2 w-2 shrink-0 rounded-full bg-[#0D9488] ${
      isCollapsed ? "lg:absolute lg:right-3 lg:top-3" : ""
    }`}
    aria-label="Notification updates available"
  />
)}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto shrink-0 border-t border-[#E2ECE6] bg-white p-4">
         <button
  type="button"
  onClick={handleLogout}
  title={isCollapsed ? "Log Out" : undefined}
  aria-label="Log Out"
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 ${
    isCollapsed ? "lg:justify-center lg:px-0" : ""
  }`}
>
  <LogOut size={19} className="shrink-0" />

  <span className={isCollapsed ? "lg:hidden" : ""}>
      Sign Out
  </span>
</button>

           <p
  className={`mt-3 text-center text-xs text-gray-400 ${
    isCollapsed ? "lg:hidden" : ""
  }`}
>
  ORYN • Prototype v0.1
</p>
        </div>
      </aside>
    </>
  );
}
