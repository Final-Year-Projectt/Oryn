import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Eye,
  Search,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Minus,
  X,
} from "lucide-react";

// Illustrative frontend records. Replace with API data during backend integration.
const sampleProblems = [
  {
    id: 1,
    title: "Inventory holding cost rising",
    category: "Operations",
    severity: "Critical",
    confidence: 92,
    detected: "Today",
    sortDate: "2026-10-21T10:30:00",
    status: "Open",
    impact: "High",
    trend: "up",
    description:
      "Increasing inventory holding costs may be affecting operational efficiency. Review stock turnover, storage costs, and purchasing patterns to investigate possible contributors.",
  },
  {
    id: 2,
    title: "Repeat purchase rate declining",
    category: "Customer",
    severity: "High",
    confidence: 87,
    detected: "Yesterday",
    sortDate: "2026-10-20T09:00:00",
    status: "Investigating",
    impact: "High",
    trend: "down",
    description:
      "A decline in repeat purchases may indicate a customer retention concern. Compare cohorts and repeat-order behaviour before drawing conclusions.",
  },
  {
    id: 3,
    title: "Campaign ROI below target",
    category: "Marketing",
    severity: "High",
    confidence: 85,
    detected: "Sep 29",
    sortDate: "2026-09-29T12:00:00",
    status: "Open",
    impact: "Medium",
    trend: "down",
    description:
      "Marketing campaigns may be generating lower returns than expected. Compare campaign spend with the attributed revenue and conversion performance.",
  },
  {
    id: 4,
    title: "Supplier delays increasing",
    category: "Supply Chain",
    severity: "Medium",
    confidence: 81,
    detected: "Sep 28",
    sortDate: "2026-09-28T12:00:00",
    status: "Open",
    impact: "Medium",
    trend: "up",
    description:
      "Supplier delays may affect fulfilment and stock availability. Review delivery times and compare suppliers to identify recurring patterns.",
  },
  {
    id: 5,
    title: "Regional margin variance",
    category: "Finance",
    severity: "Medium",
    confidence: 78,
    detected: "Sep 27",
    sortDate: "2026-09-27T12:00:00",
    status: "Open",
    impact: "Medium",
    trend: "stable",
    description:
      "Differences in regional margins may need further financial investigation. Compare pricing, fulfilment costs, and product mix across regions.",
  },
  {
    id: 6,
    title: "Sales forecast variance",
    category: "Sales",
    severity: "Critical",
    confidence: 90,
    detected: "Today",
    sortDate: "2026-10-21T08:45:00",
    status: "Open",
    impact: "High",
    trend: "down",
    description:
      "Recent sales figures differ from the expected forecast. Review the forecast assumptions and recent changes in demand before updating plans.",
  },
  {
    id: 7,
    title: "Support ticket backlog",
    category: "Operations",
    severity: "Low",
    confidence: 72,
    detected: "Sep 24",
    sortDate: "2026-09-24T12:00:00",
    status: "Resolved",
    impact: "Low",
    trend: "down",
    description:
      "The support queue had accumulated unresolved tickets. This example record is marked resolved for the prototype.",
  },
  {
    id: 8,
    title: "Stockout risk detected",
    category: "Supply Chain",
    severity: "Critical",
    confidence: 88,
    detected: "Sep 26",
    sortDate: "2026-09-26T12:00:00",
    status: "Open",
    impact: "High",
    trend: "up",
    description:
      "Some products may be at risk of running out of stock. Compare on-hand inventory with recent sales and replenishment lead times.",
  },
  {
    id: 9,
    title: "Conversion rate declining",
    category: "Marketing",
    severity: "High",
    confidence: 84,
    detected: "Sep 25",
    sortDate: "2026-09-25T12:00:00",
    status: "Open",
    impact: "Medium",
    trend: "down",
    description:
      "A decline in conversions may indicate a change in campaign quality or customer journey performance. Review the available funnel metrics.",
  },
  {
    id: 10,
    title: "Refund rate increasing",
    category: "Customer",
    severity: "High",
    confidence: 80,
    detected: "Sep 23",
    sortDate: "2026-09-23T12:00:00",
    status: "Investigating",
    impact: "Medium",
    trend: "up",
    description:
      "Refunds have increased in this sample scenario. Investigate product quality, fulfilment, and refund reasons to understand the pattern.",
  },
  {
    id: 11,
    title: "Shipping cost fluctuation",
    category: "Finance",
    severity: "Medium",
    confidence: 76,
    detected: "Sep 22",
    sortDate: "2026-09-22T12:00:00",
    status: "Monitoring",
    impact: "Medium",
    trend: "stable",
    description:
      "Shipping costs vary across reporting periods. Monitor the trend and compare costs by destination and order type.",
  },
  {
    id: 12,
    title: "Order volume volatility",
    category: "Sales",
    severity: "High",
    confidence: 74,
    detected: "Sep 21",
    sortDate: "2026-09-21T12:00:00",
    status: "Open",
    impact: "Medium",
    trend: "down",
    description:
      "Order volumes vary more than expected. Compare day-of-week, promotional, and regional patterns to determine what needs investigation.",
  },
];

const severityStyles = {
  Critical: "border-rose-200 bg-rose-50 text-rose-700",
  High: "border-orange-200 bg-orange-50 text-orange-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const statusStyles = {
  Open: "bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-200",
  Investigating: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  Monitoring: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  Resolved: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
};

const PAGE_SIZE = 6;

function KpiCard({ label, value, helper, icon: Icon, tone = "teal" }) {
  const tones = {
    teal: "bg-teal-50 text-teal-700",
    rose: "bg-rose-50 text-rose-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="rounded-2xl border border-[#DFEAE5] bg-white p-4 shadow-sm shadow-slate-900/[0.02] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1.5 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-[#D8E5DF] bg-white px-3.5 pr-9 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </label>
  );
}

export default function Problems() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedIds, setSelectedIds] = useState([1]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeProblem, setActiveProblem] = useState(null);
  const [showAnalyzeDialog, setShowAnalyzeDialog] = useState(false);

  const openProblems = sampleProblems.filter((problem) => problem.status === "Open");
  const criticalProblems = openProblems.filter((problem) => problem.severity === "Critical");
  const averageConfidence = openProblems.length
    ? Math.round(openProblems.reduce((total, problem) => total + problem.confidence, 0) / openProblems.length)
    : 0;

  const businessAreas = useMemo(
    () => [...new Set(sampleProblems.map((problem) => problem.category))].sort(),
    [],
  );

  const filteredProblems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = sampleProblems.filter((problem) => {
      const matchesSearch =
        !query ||
        [problem.title, problem.category, problem.description, problem.status]
          .some((value) => value.toLowerCase().includes(query));
      const matchesSeverity = severityFilter === "All" || problem.severity === severityFilter;
      const matchesStatus = statusFilter === "All" || problem.status === statusFilter;
      const matchesArea = areaFilter === "All" || problem.category === areaFilter;

      return matchesSearch && matchesSeverity && matchesStatus && matchesArea;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "confidence") return b.confidence - a.confidence;
      return new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime();
    });
  }, [search, severityFilter, statusFilter, areaFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleProblems = filteredProblems.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const selectedVisibleCount = visibleProblems.filter((problem) => selectedIds.includes(problem.id)).length;
  const allVisibleSelected = visibleProblems.length > 0 && selectedVisibleCount === visibleProblems.length;
  const selectedProblems = sampleProblems.filter((problem) => selectedIds.includes(problem.id));
  const startItem = filteredProblems.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(safePage * PAGE_SIZE, filteredProblems.length);
  const hasFilters = Boolean(search || severityFilter !== "All" || statusFilter !== "All" || areaFilter !== "All");

  const resetPage = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const toggleProblem = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    );
  };

  const toggleVisibleProblems = () => {
    if (allVisibleSelected) {
      const visibleIds = new Set(visibleProblems.map((problem) => problem.id));
      setSelectedIds((previous) => previous.filter((id) => !visibleIds.has(id)));
    } else {
      setSelectedIds((previous) => [...new Set([...previous, ...visibleProblems.map((problem) => problem.id)])]);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSeverityFilter("All");
    setStatusFilter("All");
    setAreaFilter("All");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const TrendIcon = ({ trend }) => {
    if (trend === "up") return <TrendingUp size={16} className="text-rose-600" />;
    if (trend === "down") return <TrendingDown size={16} className="text-emerald-600" />;
    return <Minus size={16} className="text-slate-400" />;
  };

  return (
    <div className="min-h-full bg-[#F3F7F5] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Workspace <span className="mx-1.5 text-slate-300">/</span> Analysis
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Detected business problems
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Review, filter, and select issues that may need deeper analysis.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/upload")}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#0D9488] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-[#0B7F75] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/20 sm:self-center"
          >
            <Sparkles size={17} />
            Run new analysis
          </button>
        </div>

        {/* Summary KPIs */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Open problems"
            value={String(openProblems.length).padStart(2, "0")}
            helper="Currently marked open"
            icon={AlertCircle}
            tone="teal"
          />
          <KpiCard
            label="Critical"
            value={String(criticalProblems.length).padStart(2, "0")}
            helper="Open problems needing attention"
            icon={AlertTriangle}
            tone="rose"
          />
          <KpiCard
            label="Average confidence"
            value={`${averageConfidence}%`}
            helper="Across open sample problems"
            icon={Target}
            tone="amber"
          />
          <KpiCard
            label="Resolved (all time)"
            value="11"
            helper="Illustrative historical total"
            icon={CheckCircle2}
            tone="green"
          />
        </div>

        {/* Search and filters */}
        <section className="mt-6 rounded-2xl border border-[#DFEAE5] bg-white p-4 shadow-sm shadow-slate-900/[0.02] sm:p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Problem inventory</h2>
              <p className="mt-1 text-sm text-slate-500">
                Search and narrow the list to the issues you need.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              Sample data · Preview mode
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.35fr)_minmax(150px,0.8fr)_minmax(150px,0.8fr)_minmax(160px,0.9fr)_minmax(170px,0.9fr)]">
            <label className="relative block min-w-0">
              <span className="sr-only">Search problems</span>
              <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => resetPage(setSearch, event.target.value)}
                placeholder="Search problems"
                className="h-11 w-full rounded-xl border border-[#D8E5DF] bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-teal-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
              />
            </label>

            <SelectFilter
              label="Severity"
              value={severityFilter}
              onChange={(value) => resetPage(setSeverityFilter, value)}
              options={[
                { value: "All", label: "Severity: All" },
                { value: "Critical", label: "Severity: Critical" },
                { value: "High", label: "Severity: High" },
                { value: "Medium", label: "Severity: Medium" },
                { value: "Low", label: "Severity: Low" },
              ]}
            />

            <SelectFilter
              label="Status"
              value={statusFilter}
              onChange={(value) => resetPage(setStatusFilter, value)}
              options={[
                { value: "All", label: "Status: All" },
                { value: "Open", label: "Status: Open" },
                { value: "Investigating", label: "Status: Investigating" },
                { value: "Monitoring", label: "Status: Monitoring" },
                { value: "Resolved", label: "Status: Resolved" },
              ]}
            />

            <SelectFilter
              label="Business area"
              value={areaFilter}
              onChange={(value) => resetPage(setAreaFilter, value)}
              options={[
                { value: "All", label: "Business area: All" },
                ...businessAreas.map((area) => ({ value: area, label: area })),
              ]}
            />

            <SelectFilter
              label="Sort by"
              value={sortBy}
              onChange={(value) => resetPage(setSortBy, value)}
              options={[
                { value: "newest", label: "Sort: Recently detected" },
                { value: "confidence", label: "Sort: Confidence" },
                { value: "name", label: "Sort: Name A–Z" },
              ]}
            />
          </div>

          {hasFilters && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-500">
                Showing results that match all selected filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 hover:text-teal-900"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Problem table */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-[#DFEAE5] bg-white shadow-sm shadow-slate-900/[0.02]">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Problem list <span className="font-medium text-slate-400">· {selectedIds.length} selected</span>
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {filteredProblems.length} {filteredProblems.length === 1 ? "problem" : "problems"} match your current view.
              </p>
            </div>
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => setShowAnalyzeDialog(true)}
              className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl bg-[#0D9488] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B7F75] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/20 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 sm:self-center"
            >
              Analyze selected <ArrowRight size={16} />
            </button>
          </div>

          {filteredProblems.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] border-collapse text-left">
                  <thead className="bg-[#F8FBFA]">
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      <th className="w-12 px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={allVisibleSelected}
                          onChange={toggleVisibleProblems}
                          aria-label="Select all visible problems"
                          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-teal-700 focus:ring-teal-600"
                        />
                      </th>
                      <th className="px-3 py-3.5">Problem title</th>
                      <th className="px-3 py-3.5">Business area</th>
                      <th className="px-3 py-3.5">Severity</th>
                      <th className="px-3 py-3.5">Confidence</th>
                      <th className="px-3 py-3.5">Detected</th>
                      <th className="px-3 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Details</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {visibleProblems.map((problem) => {
                      const selected = selectedIds.includes(problem.id);

                      return (
                        <tr
                          key={problem.id}
                          className={`transition-colors hover:bg-[#F8FCFA] ${selected ? "bg-[#F0FAF8]/70" : "bg-white"}`}
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleProblem(problem.id)}
                              aria-label={`Select ${problem.title}`}
                              className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-teal-700 focus:ring-teal-600"
                            />
                          </td>
                          <td className="max-w-[300px] px-3 py-4">
                            <button
                              type="button"
                              onClick={() => setActiveProblem(problem)}
                              className="text-left text-sm font-semibold text-slate-800 decoration-teal-400 underline-offset-4 transition hover:text-teal-800 hover:underline"
                            >
                              {problem.title}
                            </button>
                            <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                              {problem.description}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                            {problem.category}
                          </td>
                          <td className="px-3 py-4">
                            <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${severityStyles[problem.severity]}`}>
                              {problem.severity}
                            </span>
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex min-w-[92px] items-center gap-2">
                              <span className="w-9 text-sm font-semibold tabular-nums text-slate-700">
                                {problem.confidence}%
                              </span>
                              <span className="h-1.5 w-10 overflow-hidden rounded-full bg-slate-100">
                                <span
                                  className="block h-full rounded-full bg-teal-600"
                                  style={{ width: `${problem.confidence}%` }}
                                />
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                            {problem.detected}
                          </td>
                          <td className="px-3 py-4">
                            <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[problem.status]}`}>
                              {problem.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => setActiveProblem(problem)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-teal-800 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/30"
                            >
                              <Eye size={15} /> View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-500">
                  Showing <span className="font-semibold text-slate-700">{startItem}–{endItem}</span> of <span className="font-semibold text-slate-700">{filteredProblems.length}</span> problems
                </p>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span className="px-2 text-sm font-medium text-slate-600">
                    {safePage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Search size={25} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No problems found</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Try another search phrase or clear your filters to see all sample problems.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-[#0D9488] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B7F75]"
              >
                Clear filters
              </button>
            </div>
          )}

          <p className="border-t border-slate-100 bg-[#FCFDFC] px-4 py-3 text-xs leading-5 text-slate-400 sm:px-5">
            Preview mode — these are illustrative sample records, not live AI detection results. Confidence values are demo values.
          </p>
        </section>

        {/* Selected problem analysis preview dialog */}
        <AnimatePresence>
          {showAnalyzeDialog && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setShowAnalyzeDialog(false);
              }}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="analyze-dialog-title"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <Sparkles size={22} />
                    </span>
                    <div>
                      <h2 id="analyze-dialog-title" className="text-lg font-bold text-slate-900">
                        Analyze selected problems
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedProblems.length} {selectedProblems.length === 1 ? "problem is" : "problems are"} selected.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAnalyzeDialog(false)}
                    aria-label="Close dialog"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X size={19} />
                  </button>
                </div>

                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-2.5">
                    <CircleHelp size={18} className="mt-0.5 shrink-0 text-amber-700" />
                    <p className="text-sm leading-6 text-amber-900">
                      This frontend preview does not run the AI analysis yet. The selected records are shown below so you can verify your selection; the backend analysis action needs to be connected separately.
                    </p>
                  </div>
                </div>

                <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
                  {selectedProblems.map((problem) => (
                    <div key={problem.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2.5">
                      <span className="min-w-0 truncate text-sm font-medium text-slate-700">
                        {problem.title}
                      </span>
                      <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold ${severityStyles[problem.severity]}`}>
                        {problem.severity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAnalyzeDialog(false)}
                    className="rounded-xl bg-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B7F75] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/20"
                  >
                    Got it
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Problem details dialog */}
        <AnimatePresence>
          {activeProblem && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setActiveProblem(null);
              }}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="problem-details-title"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                      <AlertTriangle size={22} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                        Problem details
                      </p>
                      <h2 id="problem-details-title" className="mt-1 text-xl font-bold text-slate-900">
                        {activeProblem.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">{activeProblem.category}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveProblem(null)}
                    aria-label="Close problem details"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X size={19} />
                  </button>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-600">
                  {activeProblem.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Severity</p>
                    <span className={`mt-2 inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${severityStyles[activeProblem.severity]}`}>
                      {activeProblem.severity}
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Confidence</p>
                    <p className="mt-2 text-base font-bold text-slate-900">{activeProblem.confidence}%</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Status</p>
                    <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[activeProblem.status]}`}>
                      {activeProblem.status}
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Impact</p>
                    <p className="mt-2 text-base font-bold text-slate-900">{activeProblem.impact}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                  <TrendIcon trend={activeProblem.trend} />
                  <span>Detected: {activeProblem.detected}</span>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveProblem(null)}
                    className="rounded-xl bg-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B7F75] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/20"
                  >
                    Close details
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
