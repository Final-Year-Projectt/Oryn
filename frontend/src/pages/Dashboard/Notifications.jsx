import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge } from "react-bootstrap";
import {
  BellRing,
  CheckCheck,
  CheckCircle2,
  CircleAlert,
  Database,
  FileCheck2,
  Lightbulb,
  Search,
  Settings2,
  Trash2,
  Clock3,
  ArrowRight,
  FilterX,
  Inbox,
} from "lucide-react";

const STORAGE_KEY = "oryn-notifications";

const initialNotifications = [
  {
    id: "ntf-1001",
    type: "problem",
    title: "Critical inventory issue needs review",
    message: "Inventory holding cost is marked as a critical example finding. Review the related problem details.",
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
    message: "The demo activity shows a completed analysis. Open the dashboard to review the illustrative summary.",
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
    message: "A sample inventory dataset has been flagged for review before proceeding with analysis.",
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
    message: "Review the suggested inventory rebalancing action and its implementation considerations.",
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
    message: "Your demo workspace includes a recent CSV upload entry in the sample activity.",
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
    message: "Explore your data, review potential business problems, and evaluate recommendations in one workflow.",
    time: "20 Oct · 09:00 AM",
    dateGroup: "Earlier",
    read: true,
    severity: "Info",
    actionLabel: "Open assistant",
    route: "/dashboard/assistant",
  },
];

const typeConfig = {
  problem: { label: "Problem", icon: CircleAlert, style: "bg-rose-50 text-rose-700", iconStyle: "bg-rose-50 text-rose-700" },
  analysis: { label: "Analysis", icon: FileCheck2, style: "bg-sky-50 text-sky-700", iconStyle: "bg-sky-50 text-sky-700" },
  dataset: { label: "Dataset", icon: Database, style: "bg-teal-50 text-teal-800", iconStyle: "bg-teal-50 text-teal-800" },
  recommendation: { label: "Recommendation", icon: Lightbulb, style: "bg-amber-50 text-amber-800", iconStyle: "bg-amber-50 text-amber-800" },
  system: { label: "System", icon: BellRing, style: "bg-slate-100 text-slate-700", iconStyle: "bg-slate-100 text-slate-700" },
};

function readNotifications() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialNotifications;
  } catch {
    return initialNotifications;
  }
}

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(readNotifications);
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const unreadCount = notifications.filter((item) => !item.read).length;
  const todayCount = notifications.filter((item) => item.dateGroup === "Today").length;

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notifications.filter((item) => {
      const matchesText = !query || `${item.title} ${item.message} ${item.type}`.toLowerCase().includes(query);
      const matchesRead = filter === "All" || (filter === "Unread" && !item.read) || (filter === "Read" && item.read);
      const matchesType = typeFilter === "All types" || item.type === typeFilter.toLowerCase();
      return matchesText && matchesRead && matchesType;
    });
  }, [notifications, filter, typeFilter, search]);

  const updateNotifications = (updater, confirmation = "") => {
    const next = typeof updater === "function" ? updater(notifications) : updater;
    setNotifications(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // UI remains usable for the current session if browser storage is unavailable.
    }
    const unread = next.filter((item) => !item.read).length;
    window.dispatchEvent(new CustomEvent("oryn-notifications-updated", { detail: { unreadCount: unread } }));
    setNotice(confirmation);
  };

  const markOneRead = (id) => {
    updateNotifications((previous) => previous.map((item) => item.id === id ? { ...item, read: true } : item), "Notification marked as read.");
  };

  const markAllRead = () => {
    if (unreadCount === 0) return setNotice("You're all caught up.");
    updateNotifications((previous) => previous.map((item) => ({ ...item, read: true })), "All notifications marked as read.");
  };

  const dismissOne = (id) => {
    updateNotifications((previous) => previous.filter((item) => item.id !== id), "Notification dismissed.");
  };

  const clearFilters = () => {
    setSearch("");
    setFilter("All");
    setTypeFilter("All types");
    setNotice("");
  };

  return (
    <div className="min-h-full bg-[#F3F8F6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Workspace / Updates</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#19382F] sm:text-3xl">Notifications</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Keep up with uploads, analyses, business problems, and recommendations.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline-secondary" onClick={markAllRead} disabled={unreadCount === 0} className="inline-flex items-center gap-2 rounded-xl border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
              <CheckCheck size={16} /> Mark all read
            </Button>
            <Button type="button" onClick={() => navigate("/dashboard/settings")} className="inline-flex items-center gap-2 rounded-xl border-0 bg-[#0D9488] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0B7F75]">
              <Settings2 size={16} /> Preferences
            </Button>
          </div>
        </motion.div>

        {notice && <div role="status" className="mb-5 rounded-xl border border-teal-100 bg-white px-4 py-3 text-sm text-teal-800">{notice}</div>}

        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total notifications", value: notifications.length, icon: BellRing, detail: "In this demo inbox" },
            { label: "Unread", value: unreadCount, icon: CircleAlert, detail: unreadCount ? "Need your attention" : "You're all caught up" },
            { label: "Today", value: todayCount, icon: Clock3, detail: "Recent workspace activity" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} whileHover={{ y: -3 }}>
                <Card className="h-full rounded-2xl border border-[#DFEBE5] shadow-sm">
                  <Card.Body className="flex items-start justify-between gap-3 p-5">
                    <div><p className="text-sm font-medium text-slate-500">{item.label}</p><p className="mt-2 text-3xl font-bold tracking-tight text-[#19382F]">{String(item.value).padStart(2, "0")}</p><p className="mt-1 text-xs text-slate-400">{item.detail}</p></div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F6F1] text-teal-700"><Icon size={21} /></span>
                  </Card.Body>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card className="overflow-hidden rounded-3xl border border-[#DFEBE5] shadow-sm">
          <Card.Body className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your activity inbox</h2>
                <p className="mt-1 text-sm text-slate-500">{filteredNotifications.length} notification{filteredNotifications.length === 1 ? "" : "s"} shown</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:min-w-[230px]">
                  <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notifications..." aria-label="Search notifications" className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-600/10" />
                </div>
                <select aria-label="Filter by type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-600/10">
                  <option>All types</option><option value="problem">Problems</option><option value="analysis">Analyses</option><option value="dataset">Datasets</option><option value="recommendation">Recommendations</option><option value="system">System</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 py-4">
              {["All", "Unread", "Read"].map((item) => (
                <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/15 ${filter === item ? "bg-[#0D9488] text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"}`}>
                  {item}{item === "Unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
                </button>
              ))}
              {(search || filter !== "All" || typeFilter !== "All types") && <button type="button" onClick={clearFilters} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-teal-800"><FilterX size={15} /> Clear filters</button>}
            </div>

            <div className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((item, index) => {
                  const config = typeConfig[item.type] || typeConfig.system;
                  const Icon = config.icon;
                  return (
                    <motion.article key={item.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18, delay: Math.min(index * 0.025, 0.15) }} className={`group flex flex-col gap-4 py-5 first:pt-2 sm:flex-row sm:items-start ${!item.read ? "" : ""}`}>
                      <span className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${config.iconStyle}`}>
                        <Icon size={21} />
                        {!item.read && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-teal-500" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`text-sm sm:text-base ${item.read ? "font-semibold text-slate-700" : "font-bold text-slate-900"}`}>{item.title}</h3>
                          {!item.read && <Badge bg="" className="rounded-full bg-teal-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-800">New</Badge>}
                          {item.severity === "Critical" && <Badge bg="" className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700">Critical</Badge>}
                        </div>
                        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">{item.message}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
                          <span>{item.time}</span><span aria-hidden="true">·</span><span className={`rounded-full px-2.5 py-1 font-semibold ${config.style}`}>{config.label}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button type="button" onClick={() => { if (!item.read) markOneRead(item.id); navigate(item.route); }} className="inline-flex items-center gap-1.5 rounded-lg border-0 bg-[#0D9488] px-3 py-2 text-xs font-bold text-white hover:bg-[#0B7F75]">
                            {item.actionLabel} <ArrowRight size={14} />
                          </Button>
                          {!item.read && <Button type="button" variant="outline-secondary" onClick={() => markOneRead(item.id)} className="rounded-lg border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">Mark as read</Button>}
                          <Button type="button" variant="link" aria-label={`Dismiss ${item.title}`} title="Dismiss notification" onClick={() => dismissOne(item.id)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-slate-400 no-underline transition hover:bg-rose-50 hover:text-rose-700"><Trash2 size={14} /> Dismiss</Button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>

            {filteredNotifications.length === 0 && (
              <div className="flex flex-col items-center px-4 py-14 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><Inbox size={27} /></span>
                <h3 className="mt-4 font-bold text-slate-900">No notifications found</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Try changing your filters, or clear them to see all activity in this demo inbox.</p>
                <Button type="button" variant="outline-secondary" onClick={clearFilters} className="mt-4 rounded-xl border-slate-300 px-4 py-2 text-sm font-semibold"><FilterX size={15} className="mr-2 inline" /> Clear filters</Button>
              </div>
            )}

            <div className="mt-3 flex items-start gap-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-teal-700" />
              <p>Demo inbox: notifications are illustrative and read/dismiss changes are stored in this browser only. Real alerts require backend events.</p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
