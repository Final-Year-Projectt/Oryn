import { useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  AlertTriangle,
  ShieldAlert,
  Lightbulb,
  ArrowUpRight,
  Sparkles,
  Activity,
  CheckCircle2,
} from "lucide-react";


function AnimatedTrendChart({ data }) {
  const chartHeight = 220;
  const maxValue = 32;
  const chartWidth = 600;
  const leftPadding = 38;
  const rightPadding = 12;
  const topPadding = 12;
  const bottomPadding = 28;

  const plotWidth = chartWidth - leftPadding - rightPadding;
  const plotHeight = chartHeight - topPadding - bottomPadding;
  const barSpace = plotWidth / data.length;
  const barWidth = Math.min(38, barSpace * 0.48);

  const [activeBar, setActiveBar] = useState(null);

  return (
    <div className="w-full">
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full overflow-visible"
          role="img"
          aria-label="Animated monthly problem trend chart"
        >
          {[0, 8, 16, 24, 32].map((tick) => {
            const y =
              topPadding + plotHeight - (tick / maxValue) * plotHeight;

            return (
              <g key={tick}>
                <line
                  x1={leftPadding}
                  y1={y}
                  x2={chartWidth - rightPadding}
                  y2={y}
                  stroke="#EAF0EC"
                  strokeDasharray="3 4"
                />
                <text
                  x={leftPadding - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#89958F"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {data.map((item, index) => {
            const x =
              leftPadding + barSpace * index + (barSpace - barWidth) / 2;
            const barHeight = (item.issues / maxValue) * plotHeight;
            const y = topPadding + plotHeight - barHeight;

            return (
              <g key={item.month}>
                <motion.rect
                  x={x}
                  width={barWidth}
                  rx={5}
                  fill={activeBar === index ? "#0B7F75" : "#16866B"}
                  initial={{ y: topPadding + plotHeight, height: 0 }}
                  animate={{
                    y: [
                      y + barHeight * 0.08,
                      y,
                      y + barHeight * 0.04,
                      y,
                    ],
                    height: [
                      barHeight * 0.92,
                      barHeight,
                      barHeight * 0.96,
                      barHeight,
                    ],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: index * 0.12,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                  onHoverStart={() => setActiveBar(index)}
                  onHoverEnd={() => setActiveBar(null)}
                  onTapStart={() => setActiveBar(index)}
                  style={{ cursor: "pointer" }}
                />

                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 7}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#89958F"
                >
                  {item.month}
                </text>

                {activeBar === index && (
                  <g>
                    <rect
                      x={Math.max(
                        leftPadding,
                        Math.min(
                          x + barWidth / 2 - 38,
                          chartWidth - rightPadding - 76
                        )
                      )}
                      y={Math.max(0, y - 31)}
                      width={76}
                      height={24}
                      rx={5}
                      fill="#19382F"
                    />
                    <text
                      x={Math.max(
                        leftPadding,
                        Math.min(
                          x + barWidth / 2 - 38,
                          chartWidth - rightPadding - 76
                        )
                      ) + 38}
                      y={Math.max(0, y - 31) + 16}
                      textAnchor="middle"
                      fontSize="11"
                      fill="white"
                    >
                      {item.issues} issues
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}



function getDonutPoint(angle, radius, center = 100) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

function getDonutSegmentPath(startAngle, endAngle, innerRadius = 52, outerRadius = 78) {
  const outerStart = getDonutPoint(startAngle, outerRadius);
  const outerEnd = getDonutPoint(endAngle, outerRadius);
  const innerEnd = getDonutPoint(endAngle, innerRadius);
  const innerStart = getDonutPoint(startAngle, innerRadius);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

function AnimatedSeverityChart({ data }) {
  const [activeSlice, setActiveSlice] = useState(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const gapAngle = 3.5;
  const usableAngle = 360 - gapAngle * data.length;
  let currentAngle = 0;

  const segments = data.map((item, index) => {
    const segmentAngle = (item.value / total) * usableAngle;
    const startAngle = currentAngle;
    const endAngle = startAngle + segmentAngle;
    currentAngle = endAngle + gapAngle;

    return {
      ...item,
      index,
      path: getDonutSegmentPath(startAngle, endAngle),
    };
  });

  const selectedItem = activeSlice === null ? null : data[activeSlice];

  return (
    <div className="relative mx-auto mt-4 h-56 w-full max-w-[240px]">
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label={`Severity distribution: ${data.map((item) => `${item.name} ${item.value}`).join(", ")}`}
      >
        <circle cx="100" cy="100" r="64" fill="none" stroke="#F0F5F2" strokeWidth="26" />

        {segments.map((item) => (
          <motion.path
            key={item.name}
            d={item.path}
            fill={item.color}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{
              opacity: [0.88, 1, 0.92, 1],
              scale: [0.98, 1, 0.99, 1],
            }}
            transition={{
              opacity: {
                duration: 2.8,
                delay: item.index * 0.18,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              },
              scale: {
                duration: 2.8,
                delay: item.index * 0.18,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              },
            }}
            whileHover={{ scale: 1.06, opacity: 1 }}
            style={{ transformOrigin: "50% 50%", transformBox: "view-box", cursor: "pointer" }}
            onHoverStart={() => setActiveSlice(item.index)}
            onHoverEnd={() => setActiveSlice(null)}
            onTapStart={() => setActiveSlice(item.index)}
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={selectedItem ? selectedItem.name : "total"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-[#19382F]"
        >
          {selectedItem ? selectedItem.value : String(total).padStart(2, "0")}
        </motion.span>
        <motion.span
          key={selectedItem ? `${selectedItem.name}-label` : "issues-label"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-400"
        >
          {selectedItem ? selectedItem.name : "Issues"}
        </motion.span>
      </div>
    </div>
  );
}



const stats = [
  {
    label: "Total Datasets",
    value: "12",
    icon: Database,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    label: "Detected Problems",
    value: "08",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Critical Issues",
    value: "03",
    icon: ShieldAlert,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    label: "Recommendations",
    value: "14",
    icon: Lightbulb,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const trends = [
  { month: "May", issues: 12 },
  { month: "Jun", issues: 19 },
  { month: "Jul", issues: 14 },
  { month: "Aug", issues: 25 },
  { month: "Sep", issues: 18 },
  { month: "Oct", issues: 29 },
];

const severityData = [
  { name: "Critical", value: 3, color: "#DC6B6B" },
  { name: "High", value: 2, color: "#E8B65D" },
  { name: "Medium", value: 2, color: "#65B99A" },
  { name: "Low", value: 1, color: "#8DB8D8" },
];

const problems = [
  { title: "Inventory holding cost rising", severity: "Critical" },
  { title: "Repeat purchase rate declining", severity: "High" },
  { title: "Campaign ROI below target", severity: "Medium" },
];

const recommendations = [
  "Rebalance slow-moving stock",
  "Launch a retention cohort test",
  "Refine channel budget mix",
];

const cardHover = {
  y: -6,
  scale: 1.015,
  boxShadow: "0px 16px 30px rgba(25, 56, 47, 0.12)",
  borderColor: "#B8DCCB",
};

const cardTap = {
  scale: 0.985,
  y: -1,
};

const cardTransition = {
  type: "spring",
  stiffness: 320,
  damping: 22,
};

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-6 lg:p-8">
          {/* Welcome */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0D9488]">
                Workspace / Overview
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-[#19382F] sm:text-3xl">
                Business Overview
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Monitor performance, identify problems, and discover insights.
              </p>
            </div>

            <button
              type="button"
              disabled
              title="Analysis will be available after backend integration"
              className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#285C49]/60 px-5 py-3 text-sm font-semibold text-white"
            >
              <Sparkles size={18} />
              Run Analysis
              <ArrowUpRight size={17} />
            </button>
          </div>

          {/* Demo notice */}
          <motion.div
            whileHover={{ y: -3, boxShadow: "0px 10px 22px rgba(25, 56, 47, 0.08)" }}
            whileTap={{ scale: 0.99 }}
            transition={cardTransition}
            className="rounded-xl border border-[#C9E6D7] bg-[#EAF7EF] px-4 py-3 text-sm text-[#285C49]"
          >
            Preview mode — dashboard metrics are sample data, not live business results.
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, color, bg }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...cardTransition, delay: index * 0.08 }}
                whileHover={cardHover}
                whileTap={cardTap}
                className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm will-change-transform"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${bg} ${color}`}>
                    <Icon size={22} />
                  </div>
                  <Activity size={17} className="text-gray-300" />
                </div>

                <h3 className="text-3xl font-bold text-[#19382F]">{value}</h3>
                <p className="mt-2 text-sm text-gray-500">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Analysis overview */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
           
<motion.section
  whileHover={cardHover}
  whileTap={cardTap}
  transition={cardTransition}
  className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm sm:p-6 xl:col-span-3 will-change-transform"
>
  <h3 className="font-semibold text-[#19382F]">Problem Trends</h3>
  <p className="mt-1 text-xs text-gray-400">
    Detected issues over the last 6 months
  </p>

  <div className="mt-6 h-64 w-full">
    <AnimatedTrendChart data={trends} />
  </div>
</motion.section>

           
<motion.section
  whileHover={cardHover}
  whileTap={cardTap}
  transition={cardTransition}
  className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm sm:p-6 xl:col-span-2 will-change-transform"
>
  <h3 className="font-semibold text-[#19382F]">
    Severity Distribution
  </h3>

  <p className="mt-1 text-xs text-gray-400">
    Problem priority breakdown
  </p>

  <AnimatedSeverityChart data={severityData} />

  <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
    {severityData.map((item) => (
      <span key={item.name} className="flex items-center gap-1.5">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: item.color }}
        />
        {item.name}
      </span>
    ))}
  </div>
</motion.section>

          </div>

          {/* Bottom cards */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <motion.section
              whileHover={cardHover}
              whileTap={cardTap}
              transition={cardTransition}
              className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm will-change-transform"
            >
              <h3 className="mb-5 font-semibold text-[#19382F]">
                Recent Problems
              </h3>

              <div className="space-y-4">
                {problems.map((problem) => (
                  <motion.div
                    key={problem.title}
                    whileHover={{ x: 4, backgroundColor: "#F7FBF8" }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-start gap-3 rounded-lg p-2 -mx-2"
                  >
                    <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-[#19382F]">
                        {problem.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {problem.severity} priority
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              whileHover={cardHover}
              whileTap={cardTap}
              transition={cardTransition}
              className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm will-change-transform"
            >
              <h3 className="mb-5 font-semibold text-[#19382F]">
                Recommended Actions
              </h3>

              <div className="space-y-4">
                {recommendations.map((item, index) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 4, backgroundColor: "#F7FBF8" }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-start gap-3 rounded-lg p-2 -mx-2"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E1F5EB] text-xs font-bold text-[#145C46]">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm text-gray-600">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              whileHover={cardHover}
              whileTap={cardTap}
              transition={cardTransition}
              className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm will-change-transform"
            >
              <h3 className="mb-5 font-semibold text-[#19382F]">
                Data Health Summary
              </h3>

              {[
                ["Completeness", 89],
                ["Freshness", 76],
                ["Consistency", 93],
              ].map(([label, value]) => (
                <div key={label} className="mb-5 last:mb-0">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-[#19382F]">
                      {value}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#EAF2ED]">
                    <div
                      className="h-full rounded-full bg-[#16866B]"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-6 flex items-center gap-2 text-xs text-[#16866B]">
                <CheckCircle2 size={16} />
                Sample quality indicators
              </div>
            </motion.section>
          </div>
        </main>
  );
}