import { Bell, Menu, Search, ChevronDown, UserRound } from "lucide-react";

export default function DashboardNavbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E2ECE6] bg-white/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[#19382F] hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={23} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-[#19382F] sm:text-xl">
            Dashboard
          </h1>
          <p className="hidden text-xs text-gray-400 sm:block">
            Your business intelligence workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-[#F8FAF9] px-3 py-2.5 md:flex">
          <Search size={17} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search ORYN..."
            className="w-36 bg-transparent text-sm outline-none lg:w-52"
          />
        </div>

        <button
          className="relative rounded-xl p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell size={21} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#0D9488]" />
        </button>

        <div className="flex items-center gap-2 border-l border-gray-200 pl-3 sm:pl-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDF7EA] text-[#145C46]">
            <UserRound size={20} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#19382F]">ORYN User</p>
            <p className="text-xs text-gray-400">Workspace</p>
          </div>

          <ChevronDown size={15} className="hidden text-gray-400 sm:block" />
        </div>
      </div>
    </header>
  );
}