import { useMemo, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  FileSpreadsheet,
  Filter,
  Lightbulb,
  ListChecks,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";

const initialRecommendations = [
  {
    id: 1,
    title: "Rebalance slow-moving inventory",
    category: "Operations",
    relatedProblem: "Inventory holding cost rising",
    severity: "Critical",
    impact: "High",
    effort: "Medium",
    priority: "Urgent",
    confidence: 91,
    status: "Proposed",
    potentialValueLakhs: 12,
    timeToValue: "4–6 weeks",
    description:
      "Transfer excess units from West and North warehouses to higher-demand East locations, beginning with the 128 slowest-moving SKUs.",
    expectedOutcome: "Reduce holding cost by an estimated 8–12%",
    rationale:
      "Demand appears healthier in East locations while a share of excess units sits in low-velocity warehouses. Confirm the latest demand forecast and available receiving capacity before transfers are approved.",
    resources: [
      "Inventory manager · 8–12 hours",
      "Warehouse transfer capacity",
      "Updated demand forecast",
    ],
    steps: [
      "Confirm target SKUs and available units",
      "Validate receiving warehouse capacity",
      "Create phased transfer orders",
      "Monitor sell-through weekly",
    ],
    risk: "Medium",
    createdAt: "Today",
  },
  {
    id: 2,
    title: "Pause replenishment for 128 SKUs",
    category: "Inventory",
    relatedProblem: "Inventory holding cost rising",
    severity: "Critical",
    impact: "High",
    effort: "Low",
    priority: "High",
    confidence: 89,
    status: "Proposed",
    potentialValueLakhs: 8,
    timeToValue: "2–3 weeks",
    description:
      "Temporarily review replenishment for 128 slow-moving SKUs before placing the next purchase orders.",
    expectedOutcome: "Reduce avoidable overstock and purchasing pressure",
    rationale:
      "Recent stock levels may be ahead of demand for selected SKUs. Check lead times and stockout risk before pausing replenishment.",
    resources: [
      "Procurement lead · 4–6 hours",
      "SKU-level demand forecast",
      "Supplier lead-time report",
    ],
    steps: [
      "Review the flagged SKU list",
      "Check open purchase orders and lead times",
      "Approve temporary replenishment holds",
      "Reassess quantities after the next sales cycle",
    ],
    risk: "Low",
    createdAt: "Today",
  },
  {
    id: 3,
    title: "Run targeted regional markdown",
    category: "Sales",
    relatedProblem: "Regional margin variance",
    severity: "Medium",
    impact: "Medium",
    effort: "Medium",
    priority: "High",
    confidence: 84,
    status: "Review",
    potentialValueLakhs: 5,
    timeToValue: "2–4 weeks",
    description:
      "Test a limited markdown in selected regions for products with excess stock and lower-than-planned sell-through.",
    expectedOutcome: "Improve sell-through while monitoring gross margin",
    rationale:
      "Regional performance appears uneven. A controlled test helps measure demand response without discounting the full assortment.",
    resources: [
      "Regional sales manager",
      "Pricing and margin report",
      "Campaign monitoring support",
    ],
    steps: [
      "Select eligible products and regions",
      "Set a minimum margin guardrail",
      "Run the markdown as a controlled test",
      "Compare sell-through and gross margin",
    ],
    risk: "Medium",
    createdAt: "Yesterday",
  },
  {
    id: 4,
    title: "Update category demand forecast",
    category: "Planning",
    relatedProblem: "Forecast accuracy needs review",
    severity: "Medium",
    impact: "High",
    effort: "High",
    priority: "Medium",
    confidence: 81,
    status: "Saved",
    potentialValueLakhs: 3,
    timeToValue: "3–5 weeks",
    description:
      "Refresh category-level demand assumptions with recent sales, seasonality, and inventory signals.",
    expectedOutcome: "Improve planning consistency and replenishment decisions",
    rationale:
      "Forecast assumptions can become less useful when demand patterns shift. Compare forecast errors by category before updating the model.",
    resources: [
      "Demand planner",
      "Historical sales and stock data",
      "Category manager review",
    ],
    steps: [
      "Collect recent sales and stock signals",
      "Measure forecast error by category",
      "Update assumptions and document changes",
      "Review forecast performance next cycle",
    ],
    risk: "Medium",
    createdAt: "Sep 29",
  },
  {
    id: 5,
    title: "Launch a focused customer retention test",
    category: "Customer",
    relatedProblem: "Repeat purchase rate declining",
    severity: "High",
    impact: "High",
    effort: "Medium",
    priority: "High",
    confidence: 86,
    status: "Accepted",
    potentialValueLakhs: 1.8,
    timeToValue: "3–4 weeks",
    description:
      "Test a personalized follow-up campaign with customers whose purchase frequency has recently decreased.",
    expectedOutcome: "Encourage repeat purchases in a measurable test group",
    rationale:
      "A focused test can help determine whether timely, relevant follow-up improves repeat purchasing compared with a similar control group.",
    resources: [
      "CRM campaign owner",
      "Customer purchase history",
      "Offer budget approval",
    ],
    steps: [
      "Define eligible customer segments",
      "Prepare a treatment and control group",
      "Launch the campaign with clear guardrails",
      "Compare repeat purchase rates",
    ],
    risk: "Medium",
    createdAt: "Sep 28",
  },
  {
    id: 6,
    title: "Reallocate underperforming marketing spend",
    category: "Marketing",
    relatedProblem: "Campaign ROI below target",
    severity: "High",
    impact: "High",
    effort: "Low",
    priority: "Medium",
    confidence: 88,
    status: "Accepted",
    potentialValueLakhs: 1.2,
    timeToValue: "2 weeks",
    description:
      "Review campaign-level returns and run a controlled budget shift toward channels with stronger results.",
    expectedOutcome: "Improve marketing efficiency without increasing total spend",
    rationale:
      "Channel performance appears uneven. Confirm attribution windows and conversion quality before reallocating budget.",
    resources: [
      "Marketing analyst",
      "Campaign cost and conversion report",
      "Channel owner review",
    ],
    steps: [
      "Validate conversion tracking and attribution",
      "Identify campaigns below the agreed threshold",
      "Shift a limited portion of the budget",
      "Review results before scaling the change",
    ],
    risk: "Low",
    createdAt: "Sep 27",
  },
  {
    id: 7,
    title: "Review supplier delivery buffers",
    category: "Supply Chain",
    relatedProblem: "Supplier delays increasing",
    severity: "Medium",
    impact: "Medium",
    effort: "Medium",
    priority: "Medium",
    confidence: 79,
    status: "Proposed",
    potentialValueLakhs: 0.8,
    timeToValue: "2–6 weeks",
    description:
      "Compare supplier lead-time variation and adjust safety buffers for critical items where evidence supports it.",
    expectedOutcome: "Reduce avoidable disruption for high-priority items",
    rationale:
      "Supplier delays can create operational pressure, but wider buffers also tie up working capital. Focus on the suppliers and items with the greatest variability.",
    resources: [
      "Supplier performance report",
      "Procurement and operations review",
      "Critical-item list",
    ],
    steps: [
      "Measure lead-time variation by supplier",
      "Identify items with the highest service risk",
      "Agree revised buffers with operations",
      "Track delivery performance monthly",
    ],
    risk: "Medium",
    createdAt: "Sep 26",
  },
  {
    id: 8,
    title: "Standardize expense review thresholds",
    category: "Finance",
    relatedProblem: "Operating expenses fluctuating",
    severity: "Low",
    impact: "Low",
    effort: "Low",
    priority: "Low",
    confidence: 76,
    status: "Review",
    potentialValueLakhs: 0.2,
    timeToValue: "1–2 weeks",
    description:
      "Define consistent review thresholds for expense categories with recurring unexplained variation.",
    expectedOutcome: "Make unusual expense movement easier to investigate",
    rationale:
      "A consistent review threshold helps teams distinguish expected variation from items that need more context.",
    resources: [
      "Finance owner",
      "Expense category definitions",
      "Recent monthly expense data",
    ],
    steps: [
      "Agree thresholds with finance owners",
      "Map expense categories to review owners",
      "Document escalation rules",
      "Review exceptions at month end",
    ],
    risk: "Low",
    createdAt: "Sep 25",
  },
];

const impactClasses = {
  High: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  Low: "border-slate-200 bg-slate-50 text-slate-600",
};

const priorityClasses = {
  Urgent: "border-rose-200 bg-rose-50 text-rose-700",
  High: "border-orange-200 bg-orange-50 text-orange-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  Low: "border-slate-200 bg-slate-50 text-slate-600",
};

const statusClasses = {
  Proposed: "bg-slate-100 text-slate-700",
  Review: "bg-amber-50 text-amber-800",
  Saved: "bg-sky-50 text-sky-700",
  Accepted: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-rose-50 text-rose-700",
};

const selectClass =
  "w-full rounded-xl border border-[#D8E5E1] bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-[#10998D] focus:ring-4 focus:ring-teal-600/10";

const mainButtonClass =
  "!inline-flex !items-center !justify-center !gap-2 !rounded-xl !border-0 !bg-[#10998D] !px-4 !py-2.5 !text-sm !font-semibold !text-white !shadow-sm transition hover:!bg-[#0D8278] hover:!shadow-md focus-visible:!outline-none focus-visible:!ring-4 focus-visible:!ring-teal-600/20";

const secondaryButtonClass =
  "!inline-flex !items-center !justify-center !gap-2 !rounded-xl !border !border-[#C8DED9] !bg-white !px-4 !py-2.5 !text-sm !font-semibold !text-[#176B63] transition hover:!border-teal-500 hover:!bg-[#F1FAF8] focus-visible:!outline-none focus-visible:!ring-4 focus-visible:!ring-teal-600/15";

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusClasses[status] || statusClasses.Proposed
      }`}
    >
      {status}
    </span>
  );
}

function MetricCard({ label, value, detail, icon: Icon, accent = "teal" }) {
  const accentStyles = {
    teal: "bg-teal-50 text-teal-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-sky-50 text-sky-700",
  };

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}>
      <Card className="!h-full !rounded-2xl !border !border-[#DFEAE6] !bg-white !shadow-sm transition-shadow hover:!shadow-md">
        <Card.Body className="flex items-start justify-between gap-3 !p-5">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-[#19382F] sm:text-3xl">
              {value}
            </p>
            {detail && <p className="mt-1.5 text-xs text-slate-500">{detail}</p>}
          </div>
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentStyles[accent]}`}>
            <Icon size={21} />
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}

function RecommendationDetail({ recommendation, onBack, onStatusChange }) {
  const [feedback, setFeedback] = useState("");

  const updateStatus = (status) => {
    onStatusChange(recommendation.id, status);
    const actionMessage = {
      Accepted: "Recommendation accepted in this demo session.",
      Saved: "Recommendation saved in this demo session.",
      Rejected: "Recommendation rejected in this demo session.",
    };
    setFeedback(actionMessage[status]);
  };

  const matrixCell = (label, active) => (
    <div
      key={label}
      className={`flex min-h-16 items-center justify-center rounded-lg border p-2 text-center text-xs font-semibold ${
        active
          ? "border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-900/15"
          : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      {label}
    </div>
  );

  return (
    <motion.div
      key="recommendation-detail"
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.22 }}
      className="space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="light" onClick={onBack} className={secondaryButtonClass}>
          <ArrowLeft size={16} /> Back to recommendations
        </Button>
        <StatusBadge status={recommendation.status} />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Recommendation detail · Rank #{recommendation.rank}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#19382F] sm:text-3xl">
          {recommendation.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <span>{recommendation.impact} impact</span>
          <span className="hidden text-slate-300 sm:inline">•</span>
          <span>{recommendation.effort} effort</span>
          <span className="hidden text-slate-300 sm:inline">•</span>
          <span>{recommendation.priority} priority</span>
          <span className="hidden text-slate-300 sm:inline">•</span>
          <span>{recommendation.confidence}% confidence</span>
        </div>
      </div>

      {feedback && (
        <div role="status" className="flex items-start gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          {feedback} This change is local to this page and is not yet persisted to a backend.
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="!rounded-2xl !border !border-[#DFEAE6] !bg-white !shadow-sm">
          <Card.Body className="!p-5 sm:!p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Lightbulb size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-teal-700">Recommended action</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{recommendation.title}</h2>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">{recommendation.description}</p>
            <div className="mt-5 rounded-xl border border-teal-100 bg-[#F0FAF8] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-teal-800">Expected outcome</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-800">{recommendation.expectedOutcome}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2"><Clock3 size={15} className="text-teal-700" /> Time to value: {recommendation.timeToValue}</span>
                <span className="inline-flex items-center gap-2"><TrendingUp size={15} className="text-teal-700" /> Potential value: ₹{recommendation.potentialValueLakhs}L</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="!rounded-2xl !border !border-[#DFEAE6] !bg-white !shadow-sm">
          <Card.Body className="!p-5 sm:!p-6">
            <div className="flex items-center gap-2">
              <Target size={19} className="text-teal-700" />
              <h2 className="font-bold text-slate-900">Related problem</h2>
            </div>
            <p className="mt-4 font-semibold text-slate-800">{recommendation.relatedProblem}</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Severity: <span className="font-semibold text-slate-800">{recommendation.severity}</span></p>
              <p>Confidence: <span className="font-semibold text-slate-800">{recommendation.confidence}%</span></p>
              <p>Business area: <span className="font-semibold text-slate-800">{recommendation.category}</span></p>
            </div>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Recommendation signals</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${impactClasses[recommendation.impact]}`}>{recommendation.impact} impact</span>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityClasses[recommendation.priority]}`}>{recommendation.priority} priority</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="!rounded-2xl !border !border-[#DFEAE6] !bg-white !shadow-sm">
          <Card.Body className="!p-5">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={19} className="text-teal-700" />
              <h2 className="font-bold text-slate-900">Rationale & resources</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{recommendation.rationale}</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">Required resources</p>
            <ul className="mt-3 space-y-3">
              {recommendation.resources.map((resource) => (
                <li key={resource} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600">
                  <Check size={16} className="mt-1 shrink-0 text-teal-700" /> {resource}
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>

        <Card className="!rounded-2xl !border !border-[#DFEAE6] !bg-white !shadow-sm">
          <Card.Body className="!p-5">
            <div className="flex items-center gap-2">
              <ListChecks size={19} className="text-teal-700" />
              <h2 className="font-bold text-slate-900">Implementation steps</h2>
            </div>
            <ol className="mt-4 space-y-4">
              {recommendation.steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E6F6F2] text-xs font-bold text-teal-800">{index + 1}</span>
                  <span className="pt-0.5 text-sm leading-6 text-slate-600">{step}</span>
                </li>
              ))}
            </ol>
          </Card.Body>
        </Card>

        <Card className="!rounded-2xl !border !border-[#DFEAE6] !bg-white !shadow-sm">
          <Card.Body className="!p-5">
            <div className="flex items-center gap-2">
              <ShieldAlert size={19} className="text-teal-700" />
              <h2 className="font-bold text-slate-900">Risk / impact matrix</h2>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Illustrative risk review. Confirm against the actual business context.</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {matrixCell("Low", recommendation.risk === "Low")}
              {matrixCell("Medium", recommendation.risk === "Medium")}
              {matrixCell("High", recommendation.risk === "High")}
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-500">Estimated implementation risk</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{recommendation.risk}</p>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">Decision changes are demo-only and will not be recorded in History until backend integration is added.</p>
        <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
          <Button type="button" variant="light" onClick={() => updateStatus("Rejected")} className="!inline-flex !items-center !gap-2 !rounded-xl !border !border-rose-200 !bg-white !px-4 !py-2.5 !text-sm !font-semibold !text-rose-700 hover:!bg-rose-50">
            <X size={16} /> Reject
          </Button>
          <Button type="button" variant="light" onClick={() => updateStatus("Saved")} className={secondaryButtonClass}>
            <Bookmark size={16} /> Save
          </Button>
          <Button type="button" variant="primary" onClick={() => updateStatus("Accepted")} className={mainButtonClass}>
            <CheckCircle2 size={16} /> Accept recommendation
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [search, setSearch] = useState("");
  const [impactFilter, setImpactFilter] = useState("All");
  const [effortFilter, setEffortFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("rank");
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const rankedRecommendations = useMemo(
    () =>
      recommendations.map((item, index) => ({
        ...item,
        rank: index + 1,
      })),
    [recommendations],
  );

  const filteredRecommendations = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = rankedRecommendations.filter((item) => {
      const matchesSearch = [
        item.title,
        item.category,
        item.relatedProblem,
        item.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      return (
        matchesSearch &&
        (impactFilter === "All" || item.impact === impactFilter) &&
        (effortFilter === "All" || item.effort === effortFilter) &&
        (statusFilter === "All" || item.status === statusFilter)
      );
    });

    if (sortBy === "impact") {
      const order = { High: 3, Medium: 2, Low: 1 };
      filtered.sort((a, b) => order[b.impact] - order[a.impact]);
    } else if (sortBy === "confidence") {
      filtered.sort((a, b) => b.confidence - a.confidence);
    } else if (sortBy === "value") {
      filtered.sort((a, b) => b.potentialValueLakhs - a.potentialValueLakhs);
    } else {
      filtered.sort((a, b) => a.id - b.id);
    }

    return filtered;
  }, [rankedRecommendations, search, impactFilter, effortFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredRecommendations.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRecommendations = filteredRecommendations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const selectedRecommendation = recommendations.find((item) => item.id === selectedId);

  const metrics = useMemo(() => {
    const accepted = recommendations.filter((item) => item.status === "Accepted").length;
    const highImpact = recommendations.filter((item) => item.impact === "High").length;
    const potentialValue = recommendations
      .filter((item) => item.status !== "Rejected")
      .reduce((total, item) => total + item.potentialValueLakhs, 0);

    return {
      total: recommendations.length,
      highImpact,
      accepted,
      potentialValue,
    };
  }, [recommendations]);

  const updateRecommendationStatus = (id, status) => {
    setRecommendations((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const exportCsv = () => {
    const headers = [
      "Rank",
      "Recommended Action",
      "Related Problem",
      "Impact",
      "Effort",
      "Priority",
      "Confidence",
      "Status",
      "Potential Value (Lakhs)",
    ];
    const rows = filteredRecommendations.map((item, index) => [
      index + 1,
      item.title,
      item.relatedProblem,
      item.impact,
      item.effort,
      item.priority,
      `${item.confidence}%`,
      item.status,
      item.potentialValueLakhs,
    ]);
    const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "oryn-recommendations.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setImpactFilter("All");
    setEffortFilter("All");
    setStatusFilter("All");
    setSortBy("rank");
    setPage(1);
  };

  return (
    <div className="min-h-full bg-[#F3F7F6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <AnimatePresence mode="wait">
          {selectedRecommendation ? (
            <RecommendationDetail
              key="detail"
              recommendation={selectedRecommendation}
              onBack={() => setSelectedId(null)}
              onStatusChange={updateRecommendationStatus}
            />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Page heading */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                    Workspace / Solutions
                  </p>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#19382F] sm:text-3xl">
                    Recommendations
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    Review ranked actions and decide which opportunities to pursue first.
                  </p>
                </div>
                <Button type="button" variant="primary" onClick={exportCsv} className={mainButtonClass}>
                  <Download size={17} /> Export list
                </Button>
              </div>

              {/* Summary metrics */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
              >
                <MetricCard label="Total recommendations" value={String(metrics.total).padStart(2, "0")} detail="Across current sample list" icon={Lightbulb} accent="teal" />
                <MetricCard label="High impact" value={String(metrics.highImpact).padStart(2, "0")} detail="Potentially meaningful outcomes" icon={Target} accent="green" />
                <MetricCard label="Accepted" value={String(metrics.accepted).padStart(2, "0")} detail="Accepted in this demo session" icon={CheckCircle2} accent="blue" />
                <MetricCard label="Potential value" value={`₹${Number.isInteger(metrics.potentialValue) ? metrics.potentialValue : metrics.potentialValue.toFixed(1)}L`} detail="Illustrative value estimate" icon={TrendingUp} accent="amber" />
              </motion.div>

              {/* Filters */}
              <Card className="!rounded-2xl !border !border-[#DFEAE6] !bg-white !shadow-sm">
                <Card.Body className="!p-4 sm:!p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Filter size={17} className="text-teal-700" /> Find the right recommendation
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <div className="relative xl:col-span-2">
                      <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="search"
                        value={search}
                        onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                        placeholder="Search actions or related problems..."
                        aria-label="Search recommendations"
                        className={`${selectClass} pl-10`}
                      />
                    </div>

                    <select aria-label="Filter by impact" value={impactFilter} onChange={(event) => { setImpactFilter(event.target.value); setPage(1); }} className={selectClass}>
                      <option value="All">Impact: All</option>
                      <option value="High">Impact: High</option>
                      <option value="Medium">Impact: Medium</option>
                      <option value="Low">Impact: Low</option>
                    </select>

                    <select aria-label="Filter by effort" value={effortFilter} onChange={(event) => { setEffortFilter(event.target.value); setPage(1); }} className={selectClass}>
                      <option value="All">Effort: All</option>
                      <option value="Low">Effort: Low</option>
                      <option value="Medium">Effort: Medium</option>
                      <option value="High">Effort: High</option>
                    </select>

                    <select aria-label="Filter by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className={selectClass}>
                      <option value="All">Status: All</option>
                      <option value="Proposed">Proposed</option>
                      <option value="Review">Review</option>
                      <option value="Saved">Saved</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">Showing {filteredRecommendations.length} matching recommendations</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <label htmlFor="recommendation-sort" className="text-xs font-medium text-slate-500">Sort by</label>
                      <select id="recommendation-sort" value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-teal-600">
                        <option value="rank">Recommended rank</option>
                        <option value="impact">Highest impact</option>
                        <option value="confidence">Confidence</option>
                        <option value="value">Potential value</option>
                      </select>
                      <Button type="button" variant="light" onClick={resetFilters} className="!rounded-lg !border !border-slate-200 !bg-white !px-3 !py-2 !text-xs !font-semibold !text-slate-600 hover:!bg-slate-50">
                        Reset filters
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Recommendation ranking table */}
              <Card className="!overflow-hidden !rounded-2xl !border !border-[#DFEAE6] !bg-white !shadow-sm">
                <Card.Body className="!p-0">
                  <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Recommendation ranking</h2>
                      <p className="mt-1 text-xs text-slate-500">Prioritized by impact, effort, urgency, and confidence.</p>
                    </div>
                    <span className="w-fit rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
                      {filteredRecommendations.length} results
                    </span>
                  </div>

                  {paginatedRecommendations.length > 0 ? (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[950px] border-collapse text-left">
                          <thead className="bg-[#F8FBFA]">
                            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                              <th scope="col" className="px-5 py-3.5">Rank</th>
                              <th scope="col" className="px-5 py-3.5">Recommended action</th>
                              <th scope="col" className="px-4 py-3.5">Impact</th>
                              <th scope="col" className="px-4 py-3.5">Effort</th>
                              <th scope="col" className="px-4 py-3.5">Priority</th>
                              <th scope="col" className="px-4 py-3.5">Confidence</th>
                              <th scope="col" className="px-4 py-3.5">Status</th>
                              <th scope="col" className="px-5 py-3.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedRecommendations.map((item, index) => (
                              <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.035 }}
                                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-[#F7FCFA]"
                              >
                                <td className="px-5 py-4 align-middle">
                                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">{String(item.rank).padStart(2, "0")}</span>
                                </td>
                                <td className="max-w-[320px] px-5 py-4">
                                  <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Lightbulb size={18} /></div>
                                    <div className="min-w-0">
                                      <p className="font-semibold leading-5 text-slate-800">{item.title}</p>
                                      <p className="mt-1 text-xs text-slate-500">{item.category}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${impactClasses[item.impact]}`}>{item.impact}</span></td>
                                <td className="px-4 py-4 text-sm text-slate-600">{item.effort}</td>
                                <td className="px-4 py-4"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityClasses[item.priority]}`}>{item.priority}</span></td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className="w-9 text-sm font-semibold text-slate-700">{item.confidence}%</span>
                                    <div className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-slate-100 sm:block"><div className="h-full rounded-full bg-teal-500" style={{ width: `${item.confidence}%` }} /></div>
                                  </div>
                                </td>
                                <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                                <td className="px-5 py-4 text-right">
                                  <Button type="button" variant="light" onClick={() => setSelectedId(item.id)} className="!inline-flex !items-center !gap-1.5 !rounded-lg !border !border-teal-100 !bg-white !px-3 !py-2 !text-xs !font-semibold !text-teal-800 hover:!border-teal-300 hover:!bg-teal-50">
                                    Details <ArrowUpRight size={14} />
                                  </Button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <p className="text-xs text-slate-500">Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredRecommendations.length)} of {filteredRecommendations.length} recommendations</p>
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="light" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="!rounded-lg !border !border-slate-200 !bg-white !px-3 !py-2 !text-xs !font-semibold !text-slate-600 disabled:!opacity-40">Previous</Button>
                          <span className="min-w-16 text-center text-xs font-semibold text-slate-600">Page {currentPage} / {totalPages}</span>
                          <Button type="button" variant="light" disabled={currentPage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="!rounded-lg !border !border-slate-200 !bg-white !px-3 !py-2 !text-xs !font-semibold !text-slate-600 disabled:!opacity-40">Next</Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><Search size={22} /></div>
                      <h3 className="mt-4 font-bold text-slate-900">No recommendations found</h3>
                      <p className="mt-2 text-sm text-slate-500">Try changing your search or filters.</p>
                      <Button type="button" variant="light" onClick={resetFilters} className={`${secondaryButtonClass} mt-4`}>Reset filters</Button>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Ranking note */}
              <Card className="!rounded-2xl !border !border-teal-100 !bg-[#F7FCFA] !shadow-none">
                <Card.Body className="flex items-start gap-3 !p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm"><Sparkles size={20} /></div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">About recommendation ranking</h2>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">Recommendations are illustrative sample data for this frontend preview. In the connected product, ranking should be based on the implemented analysis, business goals, expected impact, effort, urgency, and confidence.</p>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
