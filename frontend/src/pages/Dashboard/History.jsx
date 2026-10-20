
import { useState } from "react";
import {
  History as HistoryIcon,
  Search,
  CalendarDays,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";

const sampleHistory = [
  {
    id: "AN-1004",
    name: "Sales Performance Analysis",
    date: "20 Oct 2026",
    time: "10:30 AM",
    problems: 4,
    status: "Completed",
  },
  {
    id: "AN-1003",
    name: "Inventory Cost Analysis",
    date: "19 Oct 2026",
    time: "03:15 PM",
    problems: 6,
    status: "Completed",
  },
  {
    id: "AN-1002",
    name: "Customer Retention Analysis",
    date: "18 Oct 2026",
    time: "11:45 AM",
    problems: 3,
    status: "Completed",
  },
  {
    id: "AN-1001",
    name: "Marketing Dataset Review",
    date: "17 Oct 2026",
    time: "09:20 AM",
    problems: 0,
    status: "Pending",
  },
];

export default function History() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredHistory = sampleHistory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statusStyles = {
    Completed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-700",
  };

  return (
    <div className="min-h-screen bg-[#F3F7F4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0D9488]">
          Workspace / Records
        </p>

        <div className="mt-2">
          <h1 className="text-2xl font-bold text-[#19382F] sm:text-3xl">
            Analysis History
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Review previous analysis runs and their results.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Analyses",
              value: sampleHistory.length,
              icon: HistoryIcon,
            },
            {
              label: "Completed",
              value: sampleHistory.filter(
                (item) => item.status === "Completed"
              ).length,
              icon: CheckCircle2,
            },
            {
              label: "Pending",
              value: sampleHistory.filter(
                (item) => item.status === "Pending"
              ).length,
              icon: Clock,
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
                {String(value).padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-7 rounded-2xl border border-[#E2ECE6] bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search analysis history..."
                className="w-full rounded-xl border border-[#D8E5DC] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#16866B]"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-xl border border-[#D8E5DC] bg-white px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#16866B]"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="mt-5 space-y-3">
            {filteredHistory.map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-[#E2ECE6] p-4 transition hover:border-[#B8D9C8] sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-[#E1F5EB] p-3 text-[#16866B]">
                    <FileSpreadsheet size={22} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#19382F]">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-xs text-gray-400">
                      Analysis ID: {item.id}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {item.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        {item.problems} problems
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[item.status]}`}
                  >
                    {item.status}
                  </span>

                  <button
                    type="button"
                    disabled
                    title="Analysis details will be available after backend integration"
                    className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-[#D8E5DC] px-3 py-2 text-sm text-gray-400"
                  >
                    <Eye size={16} />
                    Details
                  </button>
                </div>
              </article>
            ))}

            {filteredHistory.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-500">
                No analysis history found.
              </div>
            )}
          </div>

          <p className="mt-5 text-xs text-gray-400">
            Preview mode — these are illustrative records, not saved analysis history.
          </p>
        </section>
      </div>
    </div>
  );
}
