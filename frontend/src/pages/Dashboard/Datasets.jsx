
import { Database, FileSpreadsheet, Clock, Search } from "lucide-react";
import { useState } from "react";

const sampleDatasets = [
  {
    name: "Sales Report Q3.csv",
    type: "CSV",
    size: "2.4 MB",
    status: "Processed",
    date: "20 Oct 2026",
  },
  {
    name: "Inventory Data.xlsx",
    type: "Excel",
    size: "1.8 MB",
    status: "Pending",
    date: "19 Oct 2026",
  },
  {
    name: "Customer Analytics.csv",
    type: "CSV",
    size: "940 KB",
    status: "Processed",
    date: "18 Oct 2026",
  },
];

export default function Datasets() {
  const [search, setSearch] = useState("");

  const filteredDatasets = sampleDatasets.filter((dataset) =>
    dataset.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F3F7F4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0D9488]">
          Workspace / Data Management
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#19382F] sm:text-3xl">
              Datasets
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              View and manage your uploaded business datasets.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#D8E5DC] bg-white px-4 py-3 text-sm text-gray-600">
            <Database size={18} className="text-[#16866B]" />
            {sampleDatasets.length} Sample Datasets
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-[#E2ECE6] bg-white p-4 shadow-sm sm:p-6">
          <div className="relative mb-6 max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search datasets..."
              className="w-full rounded-xl border border-[#D8E5DC] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#16866B]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2ECE6] text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-4 py-4 font-semibold">Dataset</th>
                  <th className="px-4 py-4 font-semibold">Size</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Uploaded</th>
                </tr>
              </thead>

              <tbody>
                {filteredDatasets.map((dataset) => (
                  <tr
                    key={dataset.name}
                    className="border-b border-[#F0F4F1] last:border-0 hover:bg-[#F8FCF9]"
                  >
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#E1F5EB] p-2 text-[#16866B]">
                          <FileSpreadsheet size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-[#19382F]">
                            {dataset.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {dataset.type} file
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-5 text-gray-500">
                      {dataset.size}
                    </td>

                    <td className="px-4 py-5">
                      <span
                        className={
                          "rounded-full px-3 py-1 text-xs font-medium " +
                          (dataset.status === "Processed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700")
                        }
                      >
                        {dataset.status}
                      </span>
                    </td>

                    <td className="px-4 py-5 text-gray-500">
                      <span className="flex items-center gap-2">
                        <Clock size={15} />
                        {dataset.date}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredDatasets.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      No datasets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Preview mode — these are sample records, not actual uploaded data.
          </p>
        </div>
      </div>
    </div>
  );
}
