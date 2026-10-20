
import { useState } from "react";
import {
  AlertTriangle,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const sampleProblems = [
  {
    id: 1,
    title: "Inventory holding cost rising",
    category: "Operations",
    severity: "Critical",
    impact: "High",
    trend: "up",
    description:
      "Inventory costs are increasing and may be affecting operational efficiency.",
  },
  {
    id: 2,
    title: "Repeat purchase rate declining",
    category: "Customer Retention",
    severity: "High",
    impact: "High",
    trend: "down",
    description:
      "Fewer customers are returning to make additional purchases.",
  },
  {
    id: 3,
    title: "Campaign ROI below target",
    category: "Marketing",
    severity: "Medium",
    impact: "Medium",
    trend: "down",
    description:
      "Marketing campaigns may not be generating the expected return.",
  },
  {
    id: 4,
    title: "Operating expenses fluctuating",
    category: "Finance",
    severity: "Low",
    impact: "Low",
    trend: "stable",
    description:
      "Operating expenses show inconsistent patterns across reporting periods.",
  },
];

const severityStyles = {
  Critical: "bg-red-50 text-red-700 border-red-200",
  High: "bg-orange-50 text-orange-700 border-orange-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function Problems() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");

  const filteredProblems = sampleProblems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.category.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity =
      severity === "All" || problem.severity === severity;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-[#F3F7F4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0D9488]">
          Workspace / Analysis
        </p>

        <div className="mt-2">
          <h1 className="text-2xl font-bold text-[#19382F] sm:text-3xl">
            Detected Problems
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Explore business issues identified during analysis.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Problems", value: 4, color: "text-[#19382F]" },
            { label: "Critical", value: 1, color: "text-red-600" },
            { label: "High Priority", value: 1, color: "text-orange-600" },
            { label: "Medium / Low", value: 2, color: "text-amber-600" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`mt-3 text-3xl font-bold ${item.color}`}>
                {item.value.toString().padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-[#E2ECE6] bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search problems or categories..."
                className="w-full rounded-xl border border-[#D8E5DC] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#16866B]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
                className="w-full rounded-xl border border-[#D8E5DC] bg-white px-3 py-3 text-sm text-gray-600 outline-none focus:border-[#16866B] sm:w-auto"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {filteredProblems.map((problem) => {
              const TrendIcon =
                problem.trend === "up"
                  ? TrendingUp
                  : problem.trend === "down"
                    ? TrendingDown
                    : Minus;

              return (
                <article
                  key={problem.id}
                  className="rounded-xl border border-[#E2ECE6] p-4 transition hover:border-[#B8D9C8] sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                        <AlertTriangle size={21} />
                      </div>

                      <div>
                        <h2 className="font-semibold text-[#19382F]">
                          {problem.title}
                        </h2>
                        <p className="mt-1 text-xs text-gray-400">
                          {problem.category}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-gray-500">
                          {problem.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${severityStyles[problem.severity]}`}
                    >
                      {problem.severity}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-[#F0F4F1] pt-4 text-xs text-gray-500">
                    <TrendIcon
                      size={16}
                      className={
                        problem.trend === "up"
                          ? "text-red-500"
                          : problem.trend === "down"
                            ? "text-emerald-600"
                            : "text-gray-400"
                      }
                    />
                    <span>Impact: {problem.impact}</span>
                    <span className="ml-auto">Demo record</span>
                  </div>
                </article>
              );
            })}

            {filteredProblems.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-500">
                No problems match your search or selected severity.
              </div>
            )}
          </div>

          <p className="mt-5 text-xs text-gray-400">
            Preview mode — these are sample business problems, not live AI results.
          </p>
        </div>
      </div>
    </div>
  );
}
