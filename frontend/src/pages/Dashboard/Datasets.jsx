import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDownUp,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  ClipboardCheck,
  Database,
  Eye,
  FileJson,
  FileSpreadsheet,
  FileText,
  FilterX,
  HardDrive,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";

const initialDatasets = [
  {
    id: "ds-001",
    name: "Q3 Sales Transactions.csv",
    source: "CSV upload",
    type: "CSV",
    size: "2.4 MB",
    records: 24680,
    status: "Ready",
    updated: "Today, 10:42",
    updatedAt: "2026-10-20T10:42:00",
    columns: 14,
  },
  {
    id: "ds-002",
    name: "Customer Master.csv",
    source: "CRM export",
    type: "CSV",
    size: "1.1 MB",
    records: 8412,
    status: "Ready",
    updated: "Yesterday, 15:18",
    updatedAt: "2026-10-19T15:18:00",
    columns: 11,
  },
  {
    id: "ds-003",
    name: "Inventory Snapshot.xlsx",
    source: "Excel upload",
    type: "Excel",
    size: "1.8 MB",
    records: 3284,
    status: "Needs review",
    updated: "Sep 28, 09:41",
    updatedAt: "2026-09-28T09:41:00",
    columns: 9,
  },
  {
    id: "ds-004",
    name: "Marketing Spend.csv",
    source: "CSV upload",
    type: "CSV",
    size: "640 KB",
    records: 1860,
    status: "Ready",
    updated: "Sep 26, 12:10",
    updatedAt: "2026-09-26T12:10:00",
    columns: 8,
  },
  {
    id: "ds-005",
    name: "Support Tickets.json",
    source: "JSON upload",
    type: "JSON",
    size: "4.2 MB",
    records: 14206,
    status: "Processing",
    updated: "Sep 24, 16:22",
    updatedAt: "2026-09-24T16:22:00",
    columns: 12,
  },
  {
    id: "ds-006",
    name: "Regional Revenue.csv",
    source: "CSV upload",
    type: "CSV",
    size: "8.6 MB",
    records: 135000,
    status: "Ready",
    updated: "Sep 23, 14:05",
    updatedAt: "2026-09-23T14:05:00",
    columns: 16,
  },
  {
    id: "ds-007",
    name: "Customer Orders.xlsx",
    source: "Excel upload",
    type: "Excel",
    size: "18.2 MB",
    records: 420000,
    status: "Ready",
    updated: "Sep 22, 11:40",
    updatedAt: "2026-09-22T11:40:00",
    columns: 19,
  },
  {
    id: "ds-008",
    name: "Product Catalog.csv",
    source: "CSV upload",
    type: "CSV",
    size: "5.7 MB",
    records: 289450,
    status: "Ready",
    updated: "Sep 21, 10:17",
    updatedAt: "2026-09-21T10:17:00",
    columns: 13,
  },
  {
    id: "ds-009",
    name: "Returns Analysis.xlsx",
    source: "Excel upload",
    type: "Excel",
    size: "6.1 MB",
    records: 165220,
    status: "Ready",
    updated: "Sep 19, 17:35",
    updatedAt: "2026-09-19T17:35:00",
    columns: 10,
  },
  {
    id: "ds-010",
    name: "Store Performance.csv",
    source: "CSV upload",
    type: "CSV",
    size: "9.3 MB",
    records: 280000,
    status: "Ready",
    updated: "Sep 18, 13:04",
    updatedAt: "2026-09-18T13:04:00",
    columns: 15,
  },
  {
    id: "ds-011",
    name: "Web Traffic.json",
    source: "JSON upload",
    type: "JSON",
    size: "7.9 MB",
    records: 288000,
    status: "Ready",
    updated: "Sep 17, 16:10",
    updatedAt: "2026-09-17T16:10:00",
    columns: 17,
  },
  {
    id: "ds-012",
    name: "Supplier Records.csv",
    source: "CSV upload",
    type: "CSV",
    size: "3.3 MB",
    records: 220000,
    status: "Needs review",
    updated: "Sep 16, 09:12",
    updatedAt: "2026-09-16T09:12:00",
    columns: 12,
  },
];

const PAGE_SIZE = 6;
const numberFormatter = new Intl.NumberFormat("en-IN");

function formatCompactNumber(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2).replace(/0$/, "").replace(/\.0$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return numberFormatter.format(value);
}

function getFileIcon(type) {
  if (type === "Excel") return FileSpreadsheet;
  if (type === "JSON") return FileJson;
  return FileText;
}

function StatusBadge({ status }) {
  const styles = {
    Ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
    "Needs review": "border-amber-200 bg-amber-50 text-amber-800",
    Processing: "border-sky-200 bg-sky-50 text-sky-700",
    Failed: "border-rose-200 bg-rose-50 text-rose-700",
  };

  const Icon = status === "Ready" ? CheckCircle2 : status === "Processing" ? CircleDashed : AlertTriangle;

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.Processing}`}>
      <Icon size={13} strokeWidth={2.2} />
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, detail, tone = "teal" }) {
  const tones = {
    teal: "bg-teal-50 text-teal-700 ring-teal-100",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}>
          <Icon size={19} />
        </div>
        <span className="mt-1 text-xs font-medium text-slate-400">Overview</span>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{value}</p>
      <p className="mt-1.5 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

export default function Datasets() {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState(initialDatasets);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All sources");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sortBy, setSortBy] = useState("updated");
  const [page, setPage] = useState(1);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [datasetToRemove, setDatasetToRemove] = useState(null);
  const [menuFor, setMenuFor] = useState(null);
  const [notice, setNotice] = useState("");

  const totalRecords = useMemo(
    () => datasets.reduce((sum, dataset) => sum + dataset.records, 0),
    [datasets]
  );
  const readyCount = datasets.filter((dataset) => dataset.status === "Ready").length;
  const attentionCount = datasets.filter((dataset) => dataset.status === "Needs review" || dataset.status === "Failed").length;

  const filteredDatasets = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = datasets.filter((dataset) => {
      const matchesSearch =
        !query ||
        dataset.name.toLowerCase().includes(query) ||
        dataset.source.toLowerCase().includes(query) ||
        dataset.type.toLowerCase().includes(query);
      const matchesSource = sourceFilter === "All sources" || dataset.source === sourceFilter;
      const matchesStatus = statusFilter === "All statuses" || dataset.status === statusFilter;
      return matchesSearch && matchesSource && matchesStatus;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "records-desc") return b.records - a.records;
      if (sortBy === "records-asc") return a.records - b.records;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [datasets, search, sourceFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredDatasets.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleDatasets = filteredDatasets.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const firstItem = filteredDatasets.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(safePage * PAGE_SIZE, filteredDatasets.length);
  const activeFilters = search.trim() !== "" || sourceFilter !== "All sources" || statusFilter !== "All statuses";

  const clearFilters = () => {
    setSearch("");
    setSourceFilter("All sources");
    setStatusFilter("All statuses");
    setSortBy("updated");
    setPage(1);
  };

  const openValidation = (dataset) => {
    setSelectedDataset(null);
    setMenuFor(null);
    navigate("/dashboard/validation", { state: { dataset } });
  };

  const removeDataset = () => {
    if (!datasetToRemove) return;
    setDatasets((current) => current.filter((dataset) => dataset.id !== datasetToRemove.id));
    setNotice(`${datasetToRemove.name} was removed from this demo list.`);
    setDatasetToRemove(null);
    setSelectedDataset(null);
    setMenuFor(null);
    setPage(1);
  };

  const dismissNotice = () => setNotice("");

  return (
    <div className="min-h-full bg-[#F4F8F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page heading */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              <Database size={15} /> Data management
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">Datasets</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dataset inventory</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage your business data sources and check which datasets are ready for analysis.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/upload")}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#0D9488] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-[#0B7F75] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/20 sm:self-auto"
          >
            <Plus size={18} /> Add dataset
          </button>
        </section>

        {notice && (
          <div role="status" className="flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <span className="flex items-start gap-2"><CheckCircle2 size={17} className="mt-0.5 shrink-0" />{notice}</span>
            <button type="button" onClick={dismissNotice} aria-label="Dismiss notification" className="rounded-md p-1 hover:bg-emerald-100"><X size={16} /></button>
          </div>
        )}

        {/* Summary cards */}
        <section aria-label="Dataset summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Database} label="Total datasets" value={datasets.length.toString().padStart(2, "0")} detail="In your current workspace" tone="teal" />
          <StatCard icon={HardDrive} label="Total records" value={formatCompactNumber(totalRecords)} detail={`${numberFormatter.format(totalRecords)} records across datasets`} tone="blue" />
          <StatCard icon={CheckCircle2} label="Ready for analysis" value={readyCount.toString().padStart(2, "0")} detail="Data is ready to review or analyze" tone="green" />
          <StatCard icon={AlertTriangle} label="Needs attention" value={attentionCount.toString().padStart(2, "0")} detail="Review data quality before analysis" tone="amber" />
        </section>

        {/* Search and filters */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Find a dataset</h2>
              <p className="mt-1 text-sm text-slate-500">Search by file name or narrow results by source and status.</p>
            </div>
            {activeFilters && (
              <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-teal-700 hover:text-teal-900 sm:self-auto">
                <FilterX size={16} /> Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <label className="relative block">
              <span className="sr-only">Search datasets</span>
              <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                placeholder="Search datasets..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">Filter by source</span>
              <select
                value={sourceFilter}
                onChange={(event) => { setSourceFilter(event.target.value); setPage(1); }}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              >
                <option>All sources</option>
                <option>CSV upload</option>
                <option>Excel upload</option>
                <option>CRM export</option>
                <option>JSON upload</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </label>

            <label className="relative block">
              <span className="sr-only">Filter by status</span>
              <select
                value={statusFilter}
                onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              >
                <option>All statuses</option>
                <option>Ready</option>
                <option>Needs review</option>
                <option>Processing</option>
                <option>Failed</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </label>

            <label className="relative block">
              <span className="sr-only">Sort datasets</span>
              <ArrowDownUp size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={sortBy}
                onChange={(event) => { setSortBy(event.target.value); setPage(1); }}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              >
                <option value="updated">Sort: Last updated</option>
                <option value="name">Sort: Name (A–Z)</option>
                <option value="records-desc">Sort: Most records</option>
                <option value="records-asc">Sort: Fewest records</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </label>
          </div>
        </section>

        {/* Dataset table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">All datasets <span className="ml-1 font-medium text-slate-400">· {firstItem}–{lastItem} of {filteredDatasets.length}</span></h2>
              <p className="mt-1 text-xs text-slate-500">Dataset metadata shown below is sample data for frontend preview.</p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 sm:self-auto">
              <CalendarDays size={14} /> Updated dataset inventory
            </div>
          </div>

          {/* Desktop/tablet table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  <th scope="col" className="px-6 py-4">Dataset name</th>
                  <th scope="col" className="px-4 py-4">Source</th>
                  <th scope="col" className="px-4 py-4 text-right">Records</th>
                  <th scope="col" className="px-4 py-4">Status</th>
                  <th scope="col" className="px-4 py-4">Last updated</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleDatasets.map((dataset) => {
                  const FileIcon = getFileIcon(dataset.type);
                  return (
                    <tr key={dataset.id} className="group transition-colors hover:bg-[#F7FBFA]">
                      <td className="px-6 py-4">
                        <div className="flex min-w-[235px] items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-700">
                            <FileIcon size={19} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">{dataset.name}</p>
                            <p className="mt-1 text-xs text-slate-400">{dataset.type} · {dataset.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">{dataset.source}</td>
                      <td className="px-4 py-4 text-right text-sm font-semibold tabular-nums text-slate-700">{numberFormatter.format(dataset.records)}</td>
                      <td className="px-4 py-4"><StatusBadge status={dataset.status} /></td>
                      <td className="px-4 py-4 text-sm text-slate-500">{dataset.updated}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button type="button" onClick={() => setSelectedDataset(dataset)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30">
                            <Eye size={15} /> View
                          </button>
                          <div className="relative">
                            <button type="button" aria-label={`More actions for ${dataset.name}`} aria-expanded={menuFor === dataset.id} onClick={() => setMenuFor(menuFor === dataset.id ? null : dataset.id)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30">
                              <MoreHorizontal size={19} />
                            </button>
                            {menuFor === dataset.id && (
                              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
                                <button type="button" onClick={() => openValidation(dataset)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-teal-50 hover:text-teal-800">
                                  <ClipboardCheck size={16} /> Review validation
                                </button>
                                <button type="button" onClick={() => { setDatasetToRemove(dataset); setMenuFor(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50">
                                  <X size={16} /> Remove from demo
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile dataset cards */}
          <div className="space-y-3 p-3 md:hidden">
            {visibleDatasets.map((dataset) => {
              const FileIcon = getFileIcon(dataset.type);
              return (
                <article key={dataset.id} className="rounded-xl border border-slate-200 p-4 transition hover:border-teal-200 hover:bg-[#FBFDFC]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><FileIcon size={19} /></div>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-sm font-bold text-slate-800">{dataset.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">{dataset.source} · {dataset.size}</p>
                      <div className="mt-3"><StatusBadge status={dataset.status} /></div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                    <div><p className="text-xs text-slate-400">Records</p><p className="mt-1 text-sm font-semibold text-slate-700">{numberFormatter.format(dataset.records)}</p></div>
                    <div><p className="text-xs text-slate-400">Last updated</p><p className="mt-1 text-sm font-medium text-slate-700">{dataset.updated}</p></div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => setSelectedDataset(dataset)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"><Eye size={16} /> View details</button>
                    <button type="button" onClick={() => openValidation(dataset)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0B7F75]"><ClipboardCheck size={16} /> Review</button>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredDatasets.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"><Search size={23} /></div>
              <h3 className="mt-4 text-base font-bold text-slate-900">No datasets found</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Try a different search term or clear the filters to see all available datasets.</p>
              <button type="button" onClick={clearFilters} className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"><FilterX size={16} /> Clear filters</button>
            </div>
          )}

          {/* Pagination */}
          {filteredDatasets.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-slate-500">Showing <span className="font-semibold text-slate-700">{firstItem}–{lastItem}</span> of <span className="font-semibold text-slate-700">{filteredDatasets.length}</span> datasets</p>
              <div className="flex items-center gap-1 self-start sm:self-auto">
                <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage === 1} aria-label="Previous page" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={17} /></button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} aria-current={safePage === pageNumber ? "page" : undefined} className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${safePage === pageNumber ? "bg-[#0D9488] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}>{pageNumber}</button>
                ))}
                <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage === totalPages} aria-label="Next page" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={17} /></button>
              </div>
            </div>
          )}
        </section>

        <p className="flex items-start gap-2 px-1 text-xs leading-5 text-slate-400">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" /> Demo mode: these records are sample frontend data. Upload, removal, validation and dataset statistics are not yet persisted by a backend API.
        </p>
      </div>

      {/* Dataset details modal */}
      {selectedDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedDataset(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="dataset-modal-title" className="w-full max-w-lg rounded-2xl border border-white/70 bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">{(() => { const FileIcon = getFileIcon(selectedDataset.type); return <FileIcon size={22} />; })()}</div>
                <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-widest text-teal-700">Dataset details</p><h2 id="dataset-modal-title" className="mt-1 break-words text-lg font-bold text-slate-900">{selectedDataset.name}</h2><p className="mt-1 text-sm text-slate-500">{selectedDataset.source}</p></div>
              </div>
              <button type="button" onClick={() => setSelectedDataset(null)} aria-label="Close dataset details" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><X size={19} /></button>
            </div>

            <div className="mt-6"><StatusBadge status={selectedDataset.status} /></div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Records", value: numberFormatter.format(selectedDataset.records), icon: Database },
                { label: "Columns", value: numberFormatter.format(selectedDataset.columns), icon: FileSpreadsheet },
                { label: "File size", value: selectedDataset.size, icon: HardDrive },
                { label: "File format", value: selectedDataset.type, icon: FileText },
              ].map((item) => {
                const Icon = item.icon;
                return <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"><div className="flex items-center gap-2 text-slate-500"><Icon size={15} /><span className="text-xs">{item.label}</span></div><p className="mt-2 text-base font-bold text-slate-900">{item.value}</p></div>;
              })}
            </div>
            <div className="mt-4 rounded-xl bg-[#F0FAF8] p-4"><p className="text-xs font-semibold text-teal-800">Last updated</p><p className="mt-1 text-sm text-slate-700">{selectedDataset.updated}</p></div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setSelectedDataset(null)} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Close</button>
              <button type="button" onClick={() => openValidation(selectedDataset)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0D9488] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B7F75]"><ClipboardCheck size={16} /> Open validation <ArrowRight size={16} /></button>
            </div>
          </section>
        </div>
      )}

      {/* Confirm removal dialog: demo-list-only action */}
      {datasetToRemove && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
          <section role="dialog" aria-modal="true" aria-labelledby="remove-modal-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><X size={21} /></div>
            <h2 id="remove-modal-title" className="mt-4 text-lg font-bold text-slate-900">Remove this dataset from the demo?</h2>
            <p className="mt-2 break-words text-sm leading-6 text-slate-600">“{datasetToRemove.name}” will be removed from this page's sample list. No backend file or stored dataset will be deleted.</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setDatasetToRemove(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={removeDataset} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700">Remove from demo</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
