import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { menuItems } from "./dashboardNavigation";
import { AnimatePresence, motion } from "framer-motion";
// import { Menu } from "lucide-react";
import {
  Bell,
  Menu,
  Search,
  ChevronDown,
  UserRound,
  CheckCheck,
  Check,
  ArrowRight,
  BellRing,
  CircleAlert,
  Database,
  FileCheck2,
  Lightbulb,
  X,
  Clock3,
  Inbox,
} from "lucide-react";



const STORAGE_KEY = "oryn-notifications";

// Headings and quick-search destinations are derived from the same route list
// used by Sidebar.jsx. Add a page once in dashboardNavigation.js and it appears
// in both the sidebar and navbar search.
const pageInfo = Object.fromEntries(
  menuItems.map((item) => [
    item.path,
    { title: item.title, subtitle: item.subtitle },
  ]),
);

const searchPages = menuItems
  .filter((item) => item.name !== "AI Assistant")
  .map((item) => ({
    title: item.title,
    description: item.description,
    path: item.path,
    keywords: `${item.keywords || ""} ${item.name} ${item.title}`,
  }));

// Keep the default preview records aligned with the full Notifications page.
const previewNotifications = [
  {
    id: "ntf-1001",
    type: "problem",
    title: "Critical inventory issue needs review",
    message: "Review the sample inventory holding-cost finding.",
    time: "Today · 10:42 AM",
    dateGroup: "Today",
    read: false,
    severity: "Critical",
    actionLabel: "View problems",
    route: "/dashboard/problems",
  },
  {
    id: "ntf-1002",
    type: "analysis",
    title: "Business analysis completed",
    message: "Open the dashboard to review the illustrative summary.",
    time: "Today · 10:30 AM",
    dateGroup: "Today",
    read: false,
    severity: "Info",
    actionLabel: "Open dashboard",
    route: "/dashboard",
  },
  {
    id: "ntf-1003",
    type: "dataset",
    title: "Dataset validation needs attention",
    message: "A sample inventory dataset needs review.",
    time: "Today · 09:58 AM",
    dateGroup: "Today",
    read: false,
    severity: "Warning",
    actionLabel: "Review dataset",
    route: "/dashboard/validation",
  },
  {
    id: "ntf-1004",
    type: "recommendation",
    title: "A new recommendation is available",
    message: "Review the sample inventory rebalancing recommendation.",
    time: "Yesterday · 04:15 PM",
    dateGroup: "Yesterday",
    read: true,
    severity: "Info",
    actionLabel: "View recommendations",
    route: "/dashboard/recommendations",
  },
  {
    id: "ntf-1005",
    type: "dataset",
    title: "Dataset uploaded successfully",
    message: "A recent CSV upload is included in the demo activity.",
    time: "Yesterday · 02:20 PM",
    dateGroup: "Yesterday",
    read: true,
    severity: "Success",
    actionLabel: "View datasets",
    route: "/dashboard/datasets",
  },
  {
    id: "ntf-1006",
    type: "system",
    title: "Welcome to the ORYN workspace",
    message: "Explore your data, problems, and recommendations.",
    time: "20 Oct · 09:00 AM",
    dateGroup: "Earlier",
    read: true,
    severity: "Info",
    actionLabel: "Open assistant",
    route: "/dashboard/assistant",
  },
];

const notificationType = {
  problem: { icon: CircleAlert, iconClass: "bg-rose-50 text-rose-700", label: "Problem" },
  analysis: { icon: FileCheck2, iconClass: "bg-sky-50 text-sky-700", label: "Analysis" },
  dataset: { icon: Database, iconClass: "bg-teal-50 text-teal-800", label: "Dataset" },
  recommendation: { icon: Lightbulb, iconClass: "bg-amber-50 text-amber-800", label: "Recommendation" },
  system: { icon: BellRing, iconClass: "bg-slate-100 text-slate-700", label: "System" },
};


function SearchResultList({ results, query, activeIndex, onSelect, onHover, idSuffix }) {
  return (
    <div
      id={`oryn-search-results-${idSuffix}`}
      role="listbox"
      aria-label={query.trim() ? "Search results" : "Quick navigation"}
      className="overflow-y-auto p-2"
    >
      <p className="px-2.5 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {query.trim() ? "Search results" : "Quick navigation"}
      </p>
      {results.length > 0 ? (
        results.map((item, index) => (
          <button
            key={item.path}
            type="button"
            role="option"
            aria-selected={activeIndex === index}
            onMouseEnter={() => onHover?.(index)}
            onClick={() => onSelect(item)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0D9488] ${
              activeIndex === index
                ? "bg-[#EAF7F3]"
                : "hover:bg-[#F5FAF8]"
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-white text-teal-700">
              <Search size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-800">
                {item.title}
              </span>
              <span className="mt-0.5 block truncate text-xs text-slate-500">
                {item.description}
              </span>
            </span>
            <ArrowRight size={15} className="shrink-0 text-slate-300" />
          </button>
        ))
      ) : (
        <div className="px-4 py-7 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
            <Search size={18} />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-700">No matching pages</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Try “datasets”, “upload”, “history”, or “settings”.
          </p>
        </div>
      )}
      <div className="mt-1 flex items-center justify-between border-t border-slate-100 px-3 py-2 text-[10px] text-slate-400">
        <span>Navigate anywhere in ORYN</span>
        <span className="text-right">↑ ↓ navigate · Enter open · Esc close</span>
      </div>
    </div>
  );
}

function readProfileName() {
  try {
    const profile = JSON.parse(localStorage.getItem("oryn-profile") || "null");
    return profile?.fullName || "ORYN User";
  } catch {
    return "ORYN User";
  }
}

function readNotifications() {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return Array.isArray(items) ? items : previewNotifications;
  } catch {
    return previewNotifications;
  }
}

function notifyCountChange(items) {
  const unreadCount = items.filter((item) => !item.read).length;
  window.dispatchEvent(
    new CustomEvent("oryn-notifications-updated", { detail: { unreadCount } }),
  );
}

export default function DashboardNavbar({  onMenuClick,
  onDesktopToggle, }) {
  
  const location = useLocation();
  const navigate = useNavigate();
  const notificationAreaRef = useRef(null);
  const [profileName, setProfileName] = useState(readProfileName);
  const [notifications, setNotifications] = useState(readNotifications);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);
  const searchAreaRef = useRef(null);
  const desktopSearchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const currentPath = location.pathname.replace(/\/+$/, "") || "/dashboard";
  const currentPage = pageInfo[currentPath] || {
    title: "Dashboard",
    subtitle: "Your business intelligence workspace",
  };
  const unreadCount = notifications.filter((item) => !item.read).length;
  const recentNotifications = notifications.slice(0, 4);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const searchResults = searchPages
    .filter((item) => {
      if (!normalizedSearchQuery) return true;
      const searchableText = `${item.title} ${item.description} ${item.path} ${item.keywords}`.toLowerCase();
      return searchableText.includes(normalizedSearchQuery);
    })
    .slice(0, normalizedSearchQuery ? 7 : 6);

  const goToSearchResult = (item) => {
    navigate(item.path);
    setSearchQuery("");
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setActiveSearchIndex(0);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setSearchOpen(false);
      setMobileSearchOpen(false);
      event.currentTarget.blur();
      return;
    }

    if (!searchOpen && !mobileSearchOpen) return;
    if (event.key === "ArrowDown" && searchResults.length) {
      event.preventDefault();
      setActiveSearchIndex((index) => (index + 1) % searchResults.length);
    } else if (event.key === "ArrowUp" && searchResults.length) {
      event.preventDefault();
      setActiveSearchIndex((index) => (index - 1 + searchResults.length) % searchResults.length);
    } else if (event.key === "Enter" && normalizedSearchQuery && searchResults[activeSearchIndex]) {
      event.preventDefault();
      goToSearchResult(searchResults[activeSearchIndex]);
    }
  };

  const persistNotifications = (nextItems, toastMessage = "") => {
    setNotifications(nextItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    } catch {
      // Continue with in-memory state if browser storage is unavailable.
    }
    notifyCountChange(nextItems);
    if (toastMessage) setToast(toastMessage);
  };

  const markOneRead = (id) => {
    const item = notifications.find((notification) => notification.id === id);
    if (!item || item.read) return;
    persistNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
      "Notification marked as read.",
    );
  };

  const markAllRead = () => {
    if (!unreadCount) {
      setToast("You're all caught up.");
      return;
    }
    persistNotifications(
      notifications.map((notification) => ({ ...notification, read: true })),
      "All notifications marked as read.",
    );
  };

  const openNotification = (item) => {
    if (!item.read) markOneRead(item.id);
    setPopoverOpen(false);
    navigate(item.route || "/dashboard/notifications");
  };

  useEffect(() => {
    const syncProfile = () => setProfileName(readProfileName());
    const syncNotifications = () => setNotifications(readNotifications());

    window.addEventListener("storage", syncProfile);
    window.addEventListener("oryn-profile-updated", syncProfile);
    window.addEventListener("storage", syncNotifications);
    window.addEventListener("oryn-notifications-updated", syncNotifications);

    // Pages/services can dispatch this event when a new notification arrives.
    const handleNewNotification = (event) => {
      const incoming = event.detail;
      if (!incoming?.id || !incoming?.title) return;
      const current = readNotifications();
      const next = [incoming, ...current.filter((item) => item.id !== incoming.id)];
      setNotifications(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Keep the new notification in memory for this session.
      }
      notifyCountChange(next);
      setToast(`New notification: ${incoming.title}`);
    };
    window.addEventListener("oryn-notification-created", handleNewNotification);

    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("oryn-profile-updated", syncProfile);
      window.removeEventListener("storage", syncNotifications);
      window.removeEventListener("oryn-notifications-updated", syncNotifications);
      window.removeEventListener("oryn-notification-created", handleNewNotification);
    };
  }, []);

  useEffect(() => {
    setActiveSearchIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!popoverOpen) return undefined;
    const handleOutsideClick = (event) => {
      if (!notificationAreaRef.current?.contains(event.target)) {
        setPopoverOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setPopoverOpen(false);
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [popoverOpen]);

  useEffect(() => {
    if (!searchOpen && !mobileSearchOpen) return undefined;
    const handleOutsideSearchClick = (event) => {
      if (!searchAreaRef.current?.contains(event.target)) {
        setSearchOpen(false);
        setMobileSearchOpen(false);
      }
    };
    const handleSearchEscape = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsideSearchClick);
    document.addEventListener("keydown", handleSearchEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideSearchClick);
      document.removeEventListener("keydown", handleSearchEscape);
    };
  }, [searchOpen, mobileSearchOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-[#E2ECE6] bg-white/95 px-3 backdrop-blur-md sm:px-6">
       
<div className="flex min-w-0 items-center gap-2 sm:gap-3">

  {/* Desktop hamburger */}
  <button
    type="button"
    onClick={onDesktopToggle}
    className="hidden lg:inline-flex items-center justify-center rounded-lg p-2 text-[#19382F] transition hover:bg-[#EAF7F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
    aria-label="Collapse or expand sidebar"
    title="Collapse or expand sidebar"
  >
    <Menu size={23} />
  </button>

  {/* Mobile hamburger */}
  <button
    type="button"
    onClick={onMenuClick}
    className="inline-flex lg:hidden items-center justify-center rounded-lg p-2 text-[#19382F] transition hover:bg-[#EAF7F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
    aria-label="Open menu"
  >
    <Menu size={23} />
  </button>

  {/* Existing page title and subtitle */}
  <div className="min-w-0">
    <h1 className="truncate text-lg font-bold text-[#19382F] sm:text-xl">
      {currentPage.title}
    </h1>
    <p className="hidden truncate text-xs text-gray-400 sm:block">
      {currentPage.subtitle}
    </p>
  </div>

</div>


        <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">
          {/* Global quick search: navigate directly to ORYN pages and tools */}
          <div className="relative" ref={searchAreaRef}>
            <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-[#F8FAF9] px-3 py-2.5 transition focus-within:border-[#0D9488] focus-within:ring-4 focus-within:ring-[#0D9488]/10 md:flex">
              <Search size={17} className="shrink-0 text-gray-400" />
              <input
                ref={desktopSearchInputRef}
                type="search"
                role="combobox"
                aria-label="Search ORYN pages and tools"
                aria-expanded={searchOpen}
                aria-controls="oryn-search-results-desktop"
                aria-autocomplete="list"
                value={searchQuery}
                onFocus={() => { setSearchOpen(true); setMobileSearchOpen(false); }}
                onChange={(event) => { setSearchQuery(event.target.value); setActiveSearchIndex(0); setSearchOpen(true); }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search ORYN..."
                className="w-36 bg-transparent text-sm text-slate-700 outline-none placeholder:text-gray-400 lg:w-48"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setActiveSearchIndex(0); desktopSearchInputRef.current?.focus(); }}
                  className="rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen((open) => !open);
                setSearchOpen(false);
                setTimeout(() => mobileSearchInputRef.current?.focus(), 0);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-[#EAF7F3] hover:text-[#0D9488] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] md:hidden"
              aria-label="Search ORYN"
              aria-expanded={mobileSearchOpen}
            >
              <Search size={20} />
            </button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 7, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 7, scale: 0.99 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-0 top-[calc(100%+0.7rem)] z-50 hidden w-[min(25rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#DFEBE5] bg-white shadow-[0_20px_55px_-22px_rgba(19,64,53,0.28)] md:block"
                >
                  <SearchResultList
                    results={searchResults}
                    query={searchQuery}
                    activeIndex={activeSearchIndex}
                    onSelect={goToSearchResult}
                    onHover={setActiveSearchIndex}
                    idSuffix="desktop"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {mobileSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.14 }}
                  className="fixed left-3 right-3 top-[4.5rem] z-[60] overflow-hidden rounded-2xl border border-[#DFEBE5] bg-white shadow-[0_20px_55px_-22px_rgba(19,64,53,0.3)] md:hidden"
                >
                  <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-3">
                    <Search size={18} className="shrink-0 text-teal-700" />
                    <input
                      ref={mobileSearchInputRef}
                      type="search"
                      role="combobox"
                      aria-label="Search ORYN pages and tools"
                      aria-expanded={mobileSearchOpen}
                      aria-controls="oryn-search-results-mobile"
                      aria-autocomplete="list"
                      value={searchQuery}
                      onFocus={() => setMobileSearchOpen(true)}
                      onChange={(event) => { setSearchQuery(event.target.value); setActiveSearchIndex(0); setMobileSearchOpen(true); }}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Search pages and tools..."
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); }}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                      aria-label="Close search"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <SearchResultList
                    results={searchResults}
                    query={searchQuery}
                    activeIndex={activeSearchIndex}
                    onSelect={goToSearchResult}
                    onHover={setActiveSearchIndex}
                    idSuffix="mobile"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bell + responsive notification popover */}
          <div className="relative" ref={notificationAreaRef}>
            <button
              type="button"
              onClick={() => setPopoverOpen((open) => !open)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${popoverOpen ? "bg-[#E5F6F1] text-[#0D9488]" : "text-gray-600 hover:bg-[#EAF7F3] hover:text-[#0D9488]"}`}
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
              aria-expanded={popoverOpen}
              aria-controls="oryn-notification-popover"
              title="Show recent notifications"
            >
              <Bell size={21} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#0D9488] px-1 text-[9px] font-bold leading-none text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {popoverOpen && (
                <motion.section
                  id="oryn-notification-popover"
                  role="dialog"
                  aria-label="Recent notifications"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(22rem,calc(100vw-1.25rem))] overflow-hidden rounded-2xl border border-[#DFEBE5] bg-white shadow-[0_20px_60px_-20px_rgba(19,64,53,0.28)]"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}` : "You're all caught up"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPopoverOpen(false)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Close notifications"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="max-h-[min(65vh,24rem)] overflow-y-auto">
                    {recentNotifications.length > 0 ? (
                      recentNotifications.map((item) => {
                        const config = notificationType[item.type] || notificationType.system;
                        const Icon = config.icon;
                        return (
                          <div key={item.id} className={`border-b border-slate-100 px-4 py-3 transition hover:bg-[#F7FBF9] ${!item.read ? "bg-[#F5FBF9]/70" : ""}`}>
                            <button
                              type="button"
                              onClick={() => openNotification(item)}
                              className="flex w-full items-start gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0D9488]"
                            >
                              <span className={`relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.iconClass}`}>
                                <Icon size={17} />
                                {!item.read && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#0D9488]" />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className={`block text-xs leading-5 ${item.read ? "font-semibold text-slate-700" : "font-bold text-slate-900"}`}>{item.title}</span>
                                <span className="mt-1 block line-clamp-2 text-[11px] leading-4 text-slate-500">{item.message}</span>
                                <span className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400"><Clock3 size={11} /> {item.time}</span>
                              </span>
                              <ArrowRight size={14} className="mt-1 shrink-0 text-slate-300" />
                            </button>
                            <div className="mt-2 flex items-center justify-between pl-12">
                              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${config.iconClass}`}>{config.label}</span>
                              {!item.read && (
                                <button
                                  type="button"
                                  onClick={() => markOneRead(item.id)}
                                  className="rounded-md px-2 py-1 text-[10px] font-semibold text-teal-700 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/30"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center px-5 py-8 text-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Inbox size={21} /></span>
                        <p className="mt-3 text-sm font-semibold text-slate-800">No notifications yet</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">Workspace updates will appear here.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 bg-[#FBFDFC] p-3">
                    <button
                      type="button"
                      onClick={markAllRead}
                      disabled={unreadCount === 0}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-teal-50 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <CheckCheck size={14} /> Mark all read
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPopoverOpen(false); navigate("/dashboard/notifications"); }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D9488] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0B7F75] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                    >
                      View all <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/profile")}
            className="flex items-center gap-2 rounded-xl border-l border-gray-200 pl-2.5 text-left transition hover:bg-[#F7FBF9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 sm:pl-4"
            aria-label="Open profile"
            title="Open profile"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDF7EA] text-[#145C46]"><UserRound size={20} /></span>
            <span className="hidden max-w-32 sm:block">
              <span className="block truncate text-sm font-semibold text-[#19382F]">{profileName}</span>
              <span className="block text-xs text-gray-400">Workspace</span>
            </span>
            <ChevronDown size={15} className="hidden text-gray-400 sm:block" />
          </button>
        </div>
      </header>

      {/* Small toast feedback for notification actions or app-wide notification events */}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-4 right-4 z-[100] flex w-[min(22rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border border-teal-100 bg-white p-4 shadow-[0_16px_45px_-18px_rgba(19,64,53,0.35)]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Check size={18} /></span>
            <p className="flex-1 pt-1 text-sm font-medium leading-5 text-slate-700">{toast}</p>
            <button type="button" onClick={() => setToast("")} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Dismiss message"><X size={15} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
