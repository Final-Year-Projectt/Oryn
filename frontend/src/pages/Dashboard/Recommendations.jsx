
import { useState } from "react";
import {
  Lightbulb,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Target,
} from "lucide-react";

const sampleRecommendations = [
  {
    id: 1,
    title: "Rebalance slow-moving inventory",
    category: "Operations",
    priority: "Critical",
    impact: "High",
    effort: "Medium",
    description:
      "Identify slow-moving products and adjust purchasing levels to reduce inventory holding costs.",
    steps: [
      "Identify products with low sales velocity.",
      "Review current stock and reorder quantities.",
      "Create a revised inventory allocation plan.",
    ],
  },
  {
    id: 2,
    title: "Launch a customer retention campaign",
    category: "Customer Retention",
    priority: "High",
    impact: "High",
    effort: "Medium",
    description:
      "Target inactive customers with personalized offers and relevant follow-up campaigns.",
    steps: [
      "Segment customers based on purchase history.",
      "Design targeted retention offers.",
      "Measure repeat purchases after the campaign.",
    ],
  },
  {
    id: 3,
    title: "Optimize marketing channel budgets",
    category: "Marketing",
    priority: "Medium",
    impact: "Medium",
    effort: "Low",
    description:
      "Review campaign performance and prioritize channels that deliver better returns.",
    steps: [
      "Compare ROI across marketing channels.",
      "Identify underperforming campaigns.",
      "Reallocate budgets based on performance.",
    ],
  },
];

const priorityStyles = {
  Critical: "bg-red-50 text-red-700",
  High: "bg-orange-50 text-orange-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-emerald-50 text-emerald-700",
};

export default function Recommendations() {
  const [search, setSearch] = useState("");
  const [completed, setCompleted] = useState([]);

  const filteredRecommendations = sampleRecommendations.filter((item) =>
    (item.title + " " + item.category)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const toggleCompleted = (id) => {
    setCompleted((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F7F4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0D9488]">
          Workspace / Solutions
        </p>

        <div className="mt-2">
          <h1 className="text-2xl font-bold text-[#19382F] sm:text-3xl">
            Recommendations
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Explore suggested actions to improve business performance.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Recommendations",
              value: sampleRecommendations.length,
              icon: Lightbulb,
            },
            {
              label: "High Impact",
              value: sampleRecommendations.filter(
                (item) => item.impact === "High"
              ).length,
              icon: Target,
            },
            {
              label: "Completed Actions",
              value: completed.length,
              icon: CheckCircle2,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{label}</p>
                <div className="rounded-xl bg-[#E1F5EB] p-3 text-[#16866B]">
                  <Icon size={21} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-[#19382F]">
                {value.toString().padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-[#E2ECE6] bg-white p-4 shadow-sm sm:p-6">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search recommendations..."
              className="w-full rounded-xl border border-[#D8E5DC] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#16866B]"
            />
          </div>

          <div className="mt-6 space-y-5">
            {filteredRecommendations.map((item) => {
              const isCompleted = completed.includes(item.id);

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#E2ECE6] p-5 transition hover:border-[#B8D9C8] sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-[#E1F5EB] p-3 text-[#16866B]">
                        <Lightbulb size={23} />
                      </div>

                      <div>
                        <h2
                          className={
                            "font-semibold " +
                            (isCompleted
                              ? "text-gray-400 line-through"
                              : "text-[#19382F]")
                          }
                        >
                          {item.title}
                        </h2>
                        <p className="mt-1 text-xs text-gray-400">
                          {item.category}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[item.priority]}`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-[#F3F7F4] p-3">
                      <p className="text-xs text-gray-400">Expected Impact</p>
                      <p className="mt-1 text-sm font-semibold text-[#19382F]">
                        {item.impact}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F3F7F4] p-3">
                      <p className="text-xs text-gray-400">Implementation</p>
                      <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#19382F]">
                        <Clock size={14} />
                        {item.effort} effort
                      </p>
                    </div>

                    <div className="col-span-2 rounded-xl bg-[#F3F7F4] p-3 sm:col-span-1">
                      <p className="text-xs text-gray-400">Action Status</p>
                      <p className="mt-1 text-sm font-semibold text-[#19382F]">
                        {isCompleted ? "Completed" : "Pending"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-sm font-semibold text-[#19382F]">
                      Suggested Steps
                    </h3>
                    <ol className="mt-3 space-y-3">
                      {item.steps.map((step, index) => (
                        <li key={step} className="flex gap-3 text-sm text-gray-500">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E1F5EB] text-xs font-semibold text-[#145C46]">
                            {index + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-[#F0F4F1] pt-4">
                    <button
                      type="button"
                      onClick={() => toggleCompleted(item.id)}
                      className={
                        "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition " +
                        (isCompleted
                          ? "border border-[#D8E5DC] text-gray-600 hover:bg-gray-50"
                          : "bg-[#285C49] text-white hover:bg-[#1E4939]")
                      }
                    >
                      <CheckCircle2 size={17} />
                      {isCompleted ? "Mark Pending" : "Mark Completed"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          "Detailed AI recommendations will be available after backend integration."
                        )
                      }
                      className="flex items-center gap-2 rounded-xl border border-[#D8E5DC] px-4 py-2.5 text-sm font-semibold text-[#285C49] transition hover:bg-[#F3F7F4]"
                    >
                      Details
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </article>
              );
            })}

            {filteredRecommendations.length === 0 && (
              <p className="py-10 text-center text-sm text-gray-500">
                No recommendations found.
              </p>
            )}
          </div>

          <p className="mt-5 text-xs text-gray-400">
            Preview mode — recommendations are illustrative sample data, not live AI output.
          </p>
        </div>
      </div>
    </div>
  );
}
