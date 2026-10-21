import { useMemo, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  ArrowDownToLine,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Database,
  FileCheck2,
  FileSpreadsheet,
  FilterX,
  History as HistoryIcon,
  Search,
  Sparkles,
  Upload,
  XCircle,
} from "lucide-react";

const sampleHistory = [
  {
    id: "EV-1048",
    dateLabel: "Today, 10:42 AM",
    relativeDays: 0,
    type: "Upload",
    activity: "Q3 Sales Transactions uploaded",
    user: "Aarav S.",
    status: "Completed",
    detail: "Q3 Sales Transactions.csv was added to the workspace.",
  },
  {
    id: "EV-1047",
    dateLabel: "Today, 10:45 AM",
    relativeDays: 0,
    type: "Validation",
    activity: "sales_q3.csv validation finished",
    user: "System",
    status: "Needs review",
    detail: "Validation found items that should be reviewed before analysis.",
  },
  {
    id: "EV-1046",
    dateLabel: "Today, 11:02 AM",
    relativeDays: 0,
    type: "Analysis",
    activity: "Business analysis completed",
    user: "ORYN AI",
    status: "Completed",
    detail: "The sample analysis run completed. The result shown here is illustrative.",
  },
  {
    id: "EV-1045",
    dateLabel: "Today, 11:03 AM",
    relativeDays: 0,
    type: "Problem",
    activity: "Inventory holding cost rising identified",
    user: "ORYN AI",
    status: "Critical",
    detail: "A sample problem record was added for inventory holding cost.",
  },
  {
    id: "EV-1044",
    dateLabel: "Today, 11:05 AM",
    relativeDays: 0,
    type: "Recommendation",
    activity: "Rebalance slow-moving inventory created",
    user: "ORYN AI",
    status: "Proposed",
    detail: "A sample recommendation was created to investigate slow-moving inventory.",
  },
  {
    id: "EV-1043",
    dateLabel: "Yesterday, 4:20 PM",
    relativeDays: 1,
    type: "Status change",
    activity: "Customer retention issue moved to Investigating",
    user: "Priya M.",
    status: "Updated",
    detail: "The sample customer retention issue status changed to Investigating.",
  },
  {
    id: "EV-1042",
    dateLabel: "Yesterday, 1:16 PM",
    relativeDays: 1,
    type: "Upload",
    activity: "Customer Master uploaded",
    user: "Aarav S.",
    status: "Completed",
    detail: "Customer Master.csv was added to the workspace.",
  },
  {
    id: "EV-1041",
    dateLabel: "Sep 28, 3:26 PM",
    relativeDays: 23,
    type: "Validation",
    activity: "Inventory Snapshot requires review",
    user: "System",
    status: "Needs review",
    detail: "Some inventory fields need review before being used for analysis.",
  },
  {
    id: "EV-1040",
    dateLabel: "Sep 26, 2:05 PM",
    relativeDays: 25,
    type: "Analysis",
    activity: "Marketing performance analysis completed",
    user: "ORYN AI",
    status: "Completed",
    detail: "A sample marketing analysis was marked as completed.",
  },
  {
    id: "EV-1039",
    dateLabel: "Sep 24, 9:42 AM",
    relativeDays: 27,
    type: "Status change",
    activity: "Campaign ROI issue moved to Monitoring",
    user: "Priya M.",
    status: "Updated",
    detail: "The sample campaign issue was moved to Monitoring.",
  },
];

const summaryMetrics = [
  { label: "Total events", value: "148", icon: Activity, accent: "teal" },
  { label: "Uploads", value: "18", icon: Upload, accent: "blue" },
  { label: "Analyses", value: "24", icon: FileCheck2, accent: "violet" },
  { label: "Status changes", value: "41", icon: HistoryIcon, accent: "amber" },
];

const metricAccentStyles = {
  teal: "bg-teal-50 text-teal-700",
  blue: "bg-sky-50 text-sky-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
};

const statusStyles = {
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Needs review": "border-amber-200 bg-amber-50 text-amber-800",
  Critical: "border-rose-200 bg-rose-50 text-rose-700",
  Proposed: "border-sky-200 bg-sky-50 text-sky-700",
  Updated: "border-slate-200 bg-slate-100 text-slate-700",
};

const typeIcons = {
  Upload,
  Validation: FileCheck2,
  Analysis: Sparkles,
  Problem: AlertCircle,
  Recommendation: FileSpreadsheet,
  "Status change": HistoryIcon,
};

function FilterSelect({ label, value, onChange, options, ariaLabel }) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{ariaLabel || label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-[#D7E5DF] bg-white px-3.5 pr-10 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </label>
  );
}

export default function History() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("30");
  const [eventType, setEventType] = useState("All");
  const [actor, setActor] = useState("Everyone");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [exportNotice, setExportNotice] = useState("");

  const filteredHistory = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return sampleHistory.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        [item.id, item.activity, item.type, item.user, item.status, item.detail]
          .some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesDate =
        dateRange === "all" || item.relativeDays <= Number(dateRange);
      const matchesType = eventType === "All" || item.type === eventType;
      const matchesActor = actor === "Everyone" || item.user === actor;

      return matchesSearch && matchesDate && matchesType && matchesActor;
    });
  }, [search, dateRange, eventType, actor]);

  const hasFilters = Boolean(search) || dateRange !== "30" || eventType !== "All" || actor !== "Everyone";

  const resetFilters = () => {
    setSearch("");
    setDateRange("30");
    setEventType("All");
    setActor("Everyone");
    setExportNotice("");
  };

  const exportHistory = () => {
    const headers = ["Event ID", "Date & time", "Type", "Activity", "User", "Status"];
    const rows = filteredHistory.map((item) => [
      item.id,
      item.dateLabel,
      item.type,
      item.activity,
      item.user,
      item.status,
    ]);
    const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "oryn-activity-history.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExportNotice(`${filteredHistory.length} visible event${filteredHistory.length === 1 ? "" : "s"} exported as CSV.`);
  };

  return (
    <div className="min-h-full bg-[#F1F7F5] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
              Workspace / Records
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal-100 bg-white text-teal-700 shadow-sm">
                <HistoryIcon size={23} />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#19382F] sm:text-3xl">
                  History
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Review uploads, analyses, problems, recommendations, and status changes.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={exportHistory}
            disabled={filteredHistory.length === 0}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border-0 bg-[#0D9488] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0B7F75] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/20 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <ArrowDownToLine size={17} /> Export history
          </Button>
        </div>

        {/* Filters first, matching the supplied Figma structure */}
        <Card className="mt-6 rounded-2xl border border-[#DDEAE4] bg-white shadow-sm">
          <Card.Body className="p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr_1fr_auto]">
              <label className="relative block min-w-0">
                <span className="sr-only">Search activity history</span>
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search activity"
                  className="h-11 w-full rounded-xl border border-[#D7E5DF] bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-teal-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                />
              </label>

              <FilterSelect
                label="Date: Last 30 days"
                ariaLabel="Filter by date range"
                value={dateRange}
                onChange={setDateRange}
                options={[
                  { value: "7", label: "Date: Last 7 days" },
                  { value: "30", label: "Date: Last 30 days" },
                  { value: "90", label: "Date: Last 90 days" },
                  { value: "all", label: "Date: All time" },
                ]}
              />

              <FilterSelect
                label="Type: All"
                ariaLabel="Filter by event type"
                value={eventType}
                onChange={setEventType}
                options={[
                  { value: "All", label: "Type: All" },
                  { value: "Upload", label: "Type: Upload" },
                  { value: "Validation", label: "Type: Validation" },
                  { value: "Analysis", label: "Type: Analysis" },
                  { value: "Problem", label: "Type: Problem" },
                  { value: "Recommendation", label: "Type: Recommendation" },
                  { value: "Status change", label: "Type: Status change" },
                ]}
              />

              <FilterSelect
                label="User: Everyone"
                ariaLabel="Filter by user"
                value={actor}
                onChange={setActor}
                options={[
                  { value: "Everyone", label: "User: Everyone" },
                  { value: "Aarav S.", label: "User: Aarav S." },
                  { value: "System", label: "User: System" },
                  { value: "ORYN AI", label: "User: ORYN AI" },
                  { value: "Priya M.", label: "User: Priya M." },
                ]}
              />

              <Button
                type="button"
                variant="light"
                onClick={resetFilters}
                disabled={!hasFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FilterX size={16} /> Reset
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Overview metrics */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {summaryMetrics.map(({ label, value, icon: Icon, accent }) => (
            <motion.div
              key={label}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -3 }}
            >
              <Card className="h-full rounded-2xl border border-[#DDEAE4] bg-white shadow-sm transition-shadow hover:shadow-md hover:shadow-teal-900/5">
                <Card.Body className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-[#19382F]">
                      {value}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Last 30 days · sample data</p>
                  </div>
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${metricAccentStyles[accent]}`}>
                    <Icon size={22} />
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Activity timeline */}
        <Card className="mt-5 overflow-hidden rounded-2xl border border-[#DDEAE4] bg-white shadow-sm">
          <Card.Body className="p-0">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#19382F]">Activity timeline</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Showing {filteredHistory.length} of {sampleHistory.length} example events
                </p>
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
                <Activity size={14} /> Live filters
              </div>
            </div>

            {filteredHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#F8FBFA] text-[11px] font-bold uppercase tracking-[0.09em] text-slate-500">
                      <th scope="col" className="px-5 py-3.5 sm:px-6">Date &amp; time</th>
                      <th scope="col" className="px-4 py-3.5">Type</th>
                      <th scope="col" className="px-4 py-3.5">Activity</th>
                      <th scope="col" className="px-4 py-3.5">User</th>
                      <th scope="col" className="px-5 py-3.5 sm:px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((item, index) => {
                      const TypeIcon = typeIcons[item.type] || Activity;
                      return (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.025 }}
                          onClick={() => setSelectedEvent(item)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedEvent(item);
                            }
                          }}
                          tabIndex={0}
                          aria-label={`View details for ${item.activity}`}
                          className="cursor-pointer border-b border-slate-100 text-sm transition last:border-0 hover:bg-[#F5FBF8] focus:bg-teal-50/60 focus:outline-none"
                        >
                          <td className="whitespace-nowrap px-5 py-4 text-slate-500 sm:px-6">
                            <span className="inline-flex items-center gap-2">
                              <Clock3 size={14} className="text-slate-400" />
                              {item.dateLabel}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-2 text-slate-600">
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                                <TypeIcon size={16} />
                              </span>
                              {item.type}
                            </span>
                          </td>
                          <td className="max-w-[420px] px-4 py-4">
                            <p className="font-semibold text-slate-800">{item.activity}</p>
                            <p className="mt-1 text-xs text-slate-400">Event ID: {item.id}</p>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-slate-600">{item.user}</td>
                          <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status] || "border-slate-200 bg-slate-50 text-slate-600"}`}>
                              {item.status === "Completed" ? <CheckCircle2 size={13} /> : item.status === "Critical" ? <XCircle size={13} /> : item.status === "Needs review" ? <AlertCircle size={13} /> : <Clock3 size={13} />}
                              {item.status}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Search size={24} />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">No activity found</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Try another search or adjust the filters to find the event you're looking for.
                </p>
                <Button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-xl border-0 bg-[#0D9488] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B7F75]"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-teal-100 bg-[#F7FCFA] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            <Sparkles size={14} className="mr-1.5 inline text-teal-700" />
            Preview mode — activity records and summary metrics are illustrative, not saved backend history.
          </p>
          {exportNotice && <p role="status" className="text-xs font-semibold text-teal-800">{exportNotice}</p>}
        </div>
      </div>

      {/* Event detail dialog */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedEvent(null);
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-detail-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-lg rounded-2xl border border-teal-100 bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <HistoryIcon size={22} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Activity detail</p>
                  <h2 id="history-detail-title" className="mt-1 text-lg font-bold text-slate-900">{selectedEvent.activity}</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close activity details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/30"
              >
                <XCircle size={19} />
              </button>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">{selectedEvent.detail}</p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ["Event ID", selectedEvent.id],
                ["Date & time", selectedEvent.dateLabel],
                ["Event type", selectedEvent.type],
                ["User", selectedEvent.user],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-[#F6FAF8] p-3.5">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[selectedEvent.status] || "border-slate-200 bg-slate-50 text-slate-600"}`}>
                {selectedEvent.status}
              </span>
              <Button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="rounded-xl border-0 bg-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0B7F75]"
              >
                Close
              </Button>
            </div>
          </motion.section>
        </div>
      )}
    </div>
  );
}
