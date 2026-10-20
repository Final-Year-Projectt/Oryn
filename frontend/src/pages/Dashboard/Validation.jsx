import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Database,
  FileSpreadsheet,
  Filter,
  Info,
  LoaderCircle,
  PencilLine,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const previewDataset = {
  name: "sales_q3.csv",
  rows: 24680,
  qualityScore: 84,
  validRows: 23914,
  missingValues: 412,
  duplicates: 354,
};

const initialChecks = [
  { label: "Schema check", value: 100, detail: "All expected columns detected", color: "#16866B" },
  { label: "Missing values", value: 88, detail: "Some required values need review", color: "#D69A36" },
  { label: "Duplicate scan", value: 100, detail: "Duplicate scan completed", color: "#16866B" },
  { label: "Type consistency", value: 92, detail: "A few values use unexpected formats", color: "#16866B" },
];

const initialMappings = [
  { id: 1, source: "order_date", type: "Date", field: "Order Date", status: "Mapped" },
  { id: 2, source: "customer_id", type: "Text", field: "Customer ID", status: "Mapped" },
  { id: 3, source: "net_sales", type: "Number", field: "Revenue", status: "Mapped" },
  { id: 4, source: "region_code", type: "Text", field: "Region", status: "Review" },
];

const initialIssues = [
  {
    id: 1,
    title: "Duplicate customer records",
    column: "customer_id",
    description: "Repeated customer records may affect customer-level reporting.",
    severity: "High",
    count: 354,
    category: "Duplicates",
  },
  {
    id: 2,
    title: "Missing region codes",
    column: "region_code",
    description: "Some records do not include a region code.",
    severity: "Medium",
    count: 286,
    category: "Missing values",
  },
  {
    id: 3,
    title: "Date format mismatch",
    column: "order_date",
    description: "A subset of dates does not follow the expected format.",
    severity: "Low",
    count: 126,
    category: "Format consistency",
  },
  {
    id: 4,
    title: "Net sales outliers",
    column: "net_sales",
    description: "Some sales values are outside the typical range and should be reviewed.",
    severity: "Review",
    count: 18,
    category: "Outliers",
  },
];

const fieldOptions = [
  "Order Date",
  "Customer ID",
  "Revenue",
  "Region",
  "Product ID",
  "Quantity",
  "Unmapped",
];

const severityStyles = {
  High: "border-rose-200 bg-rose-50 text-rose-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-sky-200 bg-sky-50 text-sky-700",
  Review: "border-violet-200 bg-violet-50 text-violet-700",
};

const severityDot = {
  High: "bg-rose-500",
  Medium: "bg-amber-500",
  Low: "bg-sky-500",
  Review: "bg-violet-500",
};

function InteractiveCard({ children, className = "", delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      whileHover={{ y: -3, boxShadow: "0 14px 32px rgba(25, 56, 47, 0.075)" }}
      whileTap={{ scale: 0.997 }}
      className={`rounded-2xl border border-[#E0E9E3] bg-white shadow-[0_2px_6px_rgba(25,56,47,0.025)] transition-colors hover:border-[#B9D8C7] ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#0D9488]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-base font-bold tracking-tight text-[#19382F] sm:text-lg">{title}</h2>
        {description && <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default function Validation() {
  const navigate = useNavigate();
  const [checks, setChecks] = useState(initialChecks);
  const [mappings, setMappings] = useState(initialMappings);
  const [isEditingMappings, setIsEditingMappings] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [lastValidated, setLastValidated] = useState("Preview data · not live");
  const [notice, setNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All issues");
  const [expandedIssue, setExpandedIssue] = useState(null);

  const filteredIssues = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return initialIssues.filter((issue) => {
      const matchesSeverity = severityFilter === "All issues" || issue.severity === severityFilter;
      const matchesSearch =
        !query ||
        issue.title.toLowerCase().includes(query) ||
        issue.column.toLowerCase().includes(query) ||
        issue.category.toLowerCase().includes(query);
      return matchesSeverity && matchesSearch;
    });
  }, [searchQuery, severityFilter]);

  const mappingReviewCount = mappings.filter((mapping) => mapping.status === "Review").length;

  const handleRevalidate = () => {
    if (isRevalidating) return;
    setIsRevalidating(true);
    setNotice("");
    setChecks((current) => current.map((check) => ({ ...check, value: Math.max(0, check.value - 8) })));

    window.setTimeout(() => {
      setChecks(initialChecks);
      setIsRevalidating(false);
      setLastValidated("Just refreshed · preview only");
      setNotice("Preview refreshed. These validation results are sample data, not a live dataset check.");
    }, 850);
  };

  const handleMappingChange = (id, field) => {
    setMappings((current) =>
      current.map((mapping) =>
        mapping.id === id
          ? { ...mapping, field, status: field === "Unmapped" ? "Review" : "Mapped" }
          : mapping,
      ),
    );
  };

  const handleSaveMappings = () => {
    setIsEditingMappings(false);
    setNotice("Mapping changes saved in this local preview only. They have not been sent to a backend.");
  };

  const metrics = [
    {
      label: "Quality score",
      value: `${previewDataset.qualityScore}%`,
      detail: "Overall dataset health",
      icon: ShieldCheck,
      tone: "green",
      trend: "Needs review",
    },
    {
      label: "Valid rows",
      value: previewDataset.validRows.toLocaleString("en-US"),
      detail: `of ${previewDataset.rows.toLocaleString("en-US")} total rows`,
      icon: CheckCircle2,
      tone: "teal",
      trend: "96.9% of rows",
    },
    {
      label: "Missing values",
      value: previewDataset.missingValues.toLocaleString("en-US"),
      detail: "Cells requiring attention",
      icon: AlertCircle,
      tone: "amber",
      trend: "Needs attention",
    },
    {
      label: "Duplicates",
      value: previewDataset.duplicates.toLocaleString("en-US"),
      detail: "Potential duplicate records",
      icon: Copy,
      tone: "rose",
      trend: "Review records",
    },
  ];

  return (
    <main className="min-h-full bg-[#F3F7F4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0D9488]">
              <span>Workspace</span>
              <span className="text-[#9BB9AA]">/</span>
              <span>Data management</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#173B30] sm:text-3xl">Data Validation</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Check data quality, review mapping, and identify issues before running business analysis.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-[#DFE9E2] bg-white px-3.5 py-2.5 text-xs font-medium text-slate-500 shadow-sm">
              <Clock3 size={15} className="text-[#16866B]" />
              {lastValidated}
            </div>
            <motion.button
              type="button"
              onClick={handleRevalidate}
              disabled={isRevalidating}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#245943] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#194833] disabled:cursor-wait disabled:opacity-75"
            >
              {isRevalidating ? <LoaderCircle size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {isRevalidating ? "Checking preview…" : "Revalidate preview"}
            </motion.button>
          </div>
        </header>

        {/* Preview notice */}
        <div className="flex items-start gap-3 rounded-xl border border-[#CDE6D7] bg-[#EAF7EF] px-4 py-3.5 text-sm text-[#285C49]">
          <Info size={18} className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold">Preview mode</p>
            <p className="mt-0.5 leading-5 text-[#4C7563]">
              This page uses illustrative sample results based on a sales dataset. Live validation will run once the backend API is connected.
            </p>
          </div>
          <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full border border-[#C9E6D7] bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[#285C49] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16866B]" /> Demo data
          </span>
        </div>

        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              className="flex items-start justify-between gap-3 overflow-hidden rounded-xl border border-[#D2E7D9] bg-white px-4 py-3 text-sm text-[#285C49]"
              role="status"
            >
              <span className="flex items-start gap-2"><CheckCircle2 size={17} className="mt-0.5 shrink-0" />{notice}</span>
              <button type="button" aria-label="Dismiss message" onClick={() => setNotice("")} className="rounded-md p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={16} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dataset context */}
        <InteractiveCard className="p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="rounded-xl bg-[#E1F5EB] p-3 text-[#16866B]">
                <FileSpreadsheet size={24} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-base font-bold text-[#19382F]">{previewDataset.name}</h2>
                  <span className="rounded-full border border-[#D6E6DC] bg-[#F4FAF6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#39755D]">Sample dataset</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{previewDataset.rows.toLocaleString("en-US")} rows · CSV file · Quarterly sales data</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Needs review
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F7F4] px-3 py-1.5 text-xs font-medium text-slate-500">
                <Activity size={14} /> Validation preview
              </span>
            </div>
          </div>
        </InteractiveCard>

        {/* KPI cards */}
        <section aria-label="Validation metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const iconTone = {
              green: "bg-[#E2F5EA] text-[#16866B]",
              teal: "bg-teal-50 text-teal-700",
              amber: "bg-amber-50 text-amber-700",
              rose: "bg-rose-50 text-rose-700",
            }[metric.tone];
            return (
              <InteractiveCard key={metric.label} delay={index * 0.06} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                    <motion.p
                      initial={{ opacity: 0, y: 7 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + index * 0.06, duration: 0.35 }}
                      className="mt-2 text-3xl font-bold tracking-tight text-[#19382F]"
                    >
                      {metric.value}
                    </motion.p>
                  </div>
                  <div className={`rounded-xl p-3 ${iconTone}`}><Icon size={20} /></div>
                </div>
                <p className="mt-2 text-xs text-slate-500">{metric.detail}</p>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  {metric.tone === "amber" || metric.tone === "rose" ? <ArrowUpRight size={14} className={metric.tone === "amber" ? "text-amber-600" : "text-rose-600"} /> : <ArrowDownRight size={14} className="text-[#16866B]" />}
                  {metric.trend}
                </div>
              </InteractiveCard>
            );
          })}
        </section>

        {/* Validation progress */}
        <InteractiveCard className="p-5 sm:p-6">
          <SectionHeading
            title="Validation progress"
            description="A snapshot of key data quality checks for the sample dataset."
            action={<span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F2F8F4] px-3 py-2 text-xs font-semibold text-[#39755D]"><Activity size={14} /> 4 checks</span>}
          />
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {checks.map((check, index) => (
              <div key={check.label} className="min-w-0">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#29483B]">{check.label}</span>
                  <motion.span key={check.value} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold tabular-nums text-[#19382F]">{check.value}%</motion.span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#EAF1EC]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${check.value}%` }}
                    transition={{ duration: 0.6, delay: 0.08 * index, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: check.color }}
                  />
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">{check.detail}</p>
              </div>
            ))}
          </div>
        </InteractiveCard>

        {/* Mapping + issues */}
        <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
          <InteractiveCard className="overflow-hidden">
            <div className="flex flex-col justify-between gap-3 border-b border-[#E8EFEA] p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#19382F]">Column mapping</h2>
                  <span className="rounded-full bg-[#F1F7F3] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#39755D]">Schema</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">Review how source columns align with business fields.</p>
              </div>
              {!isEditingMappings ? (
                <motion.button type="button" onClick={() => { setIsEditingMappings(true); setNotice(""); }} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D8E5DC] bg-white px-3 py-2 text-xs font-semibold text-[#285C49] transition hover:bg-[#F5FAF6]">
                  <PencilLine size={14} /> Edit mapping
                </motion.button>
              ) : (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { setMappings(initialMappings); setIsEditingMappings(false); }} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100">Cancel</button>
                  <motion.button type="button" onClick={handleSaveMappings} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-1.5 rounded-lg bg-[#245943] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#194833]"><Check size={14} /> Save preview</motion.button>
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8FBF9] text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    <th className="px-5 py-3.5 sm:px-6">Source column</th>
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5">Mapped field</th>
                    <th className="px-5 py-3.5 sm:px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF2EE]">
                  {mappings.map((mapping) => (
                    <tr key={mapping.id} className="transition-colors hover:bg-[#FBFDFC]">
                      <td className="px-5 py-4 font-mono text-xs font-medium text-[#315747] sm:px-6">{mapping.source}</td>
                      <td className="px-4 py-4 text-sm text-slate-500">{mapping.type}</td>
                      <td className="px-4 py-4">
                        {isEditingMappings ? (
                          <div className="relative min-w-[145px]">
                            <select value={mapping.field} onChange={(event) => handleMappingChange(mapping.id, event.target.value)} className="w-full appearance-none rounded-lg border border-[#D8E5DC] bg-white py-2 pl-2.5 pr-7 text-xs font-medium text-[#29483B] outline-none focus:border-[#16866B] focus:ring-2 focus:ring-[#16866B]/10">
                              {fieldOptions.map((field) => <option key={field} value={field}>{field}</option>)}
                            </select>
                            <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          </div>
                        ) : (
                          <span className={`text-sm ${mapping.status === "Review" ? "font-semibold text-amber-700" : "text-slate-600"}`}>{mapping.field}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 sm:px-6">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${mapping.status === "Review" ? "bg-amber-50 text-amber-700" : "bg-[#EAF7EF] text-[#39755D]"}`}>
                          {mapping.status === "Review" ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                          {mapping.status === "Review" ? "Review needed" : "Mapped"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-2 border-t border-[#E8EFEA] bg-[#FBFDFC] px-5 py-3.5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span className="text-slate-500">{mappings.length - mappingReviewCount} of {mappings.length} columns mapped</span>
              {mappingReviewCount > 0 ? <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700"><AlertTriangle size={13} /> {mappingReviewCount} column needs review</span> : <span className="inline-flex items-center gap-1.5 font-semibold text-[#16866B]"><CheckCircle2 size={13} /> All columns mapped</span>}
            </div>
          </InteractiveCard>

          <InteractiveCard className="overflow-hidden">
            <div className="border-b border-[#E8EFEA] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#19382F]">Data quality issues</h2>
                  <p className="mt-1 text-sm text-slate-500">Prioritized findings to review.</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F3F7F4] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-600"><AlertTriangle size={13} /> {initialIssues.length} types</span>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <label className="relative min-w-0 flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search issues or columns" className="w-full rounded-lg border border-[#DCE7E0] bg-[#FBFDFC] py-2.5 pl-9 pr-3 text-xs text-[#29483B] outline-none transition placeholder:text-slate-400 focus:border-[#16866B] focus:ring-2 focus:ring-[#16866B]/10" />
                </label>
                <label className="relative">
                  <Filter size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)} aria-label="Filter issues by severity" className="w-full appearance-none rounded-lg border border-[#DCE7E0] bg-white py-2.5 pl-8 pr-8 text-xs font-medium text-slate-600 outline-none focus:border-[#16866B] sm:w-auto">
                    {["All issues", "High", "Medium", "Low", "Review"].map((severity) => <option key={severity} value={severity}>{severity}</option>)}
                  </select>
                  <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </label>
              </div>
            </div>

            <div className="divide-y divide-[#EDF2EE]">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredIssues.map((issue, index) => (
                  <motion.div key={issue.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, delay: index * 0.025 }} className="p-4 sm:p-5">
                    <button type="button" onClick={() => setExpandedIssue((current) => current === issue.id ? null : issue.id)} aria-expanded={expandedIssue === issue.id} className="flex w-full items-start gap-3 text-left">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityDot[issue.severity]}`} />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-[#29483B]">{issue.title}</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${severityStyles[issue.severity]}`}>{issue.severity}</span>
                        </span>
                        <span className="mt-1.5 block text-xs text-slate-500">{issue.column} <span className="px-1 text-slate-300">·</span> {issue.count.toLocaleString("en-US")} affected rows</span>
                      </span>
                      <ChevronDown size={16} className={`mt-1 shrink-0 text-slate-400 transition-transform ${expandedIssue === issue.id ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {expandedIssue === issue.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="ml-5 mt-3 border-l-2 border-[#D5E7DC] pl-3 text-xs leading-5 text-slate-500">{issue.description} <span className="font-semibold text-slate-600">Category:</span> {issue.category}.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredIssues.length === 0 && (
                <div className="px-5 py-10 text-center">
                  <Search size={22} className="mx-auto text-slate-300" />
                  <p className="mt-2 text-sm font-semibold text-[#29483B]">No issues found</p>
                  <p className="mt-1 text-xs text-slate-500">Try a different search term or severity filter.</p>
                </div>
              )}
            </div>
            <div className="flex items-start gap-2 border-t border-[#E8EFEA] bg-[#FBFDFC] px-5 py-3.5 text-[11px] leading-5 text-slate-500">
              <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />
              Issue counts are illustrative examples and may overlap; they are not guaranteed to sum to the total rows.
            </div>
          </InteractiveCard>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#DDE9E1] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#F1F7F3] p-2.5 text-[#39755D]"><Sparkles size={19} /></div>
            <div>
              <p className="text-sm font-bold text-[#19382F]">Ready for the next step?</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Review the flagged items, then open the Problems workspace. Analysis results are still preview-only.</p>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <motion.button type="button" onClick={handleRevalidate} disabled={isRevalidating} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D7E4DB] bg-white px-4 py-2.5 text-sm font-semibold text-[#285C49] transition hover:bg-[#F6FAF7] disabled:opacity-60">
              <RefreshCw size={15} className={isRevalidating ? "animate-spin" : ""} /> Revalidate
            </motion.button>
            <motion.button type="button" onClick={() => navigate("/dashboard/problems")} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#245943] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#194833]">
              Continue to Problems <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
}

