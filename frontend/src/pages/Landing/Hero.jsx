import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Hero() {
const salesData = [
  { month: "Jan", sales: 72, value: "₹7.2L" },
  { month: "Feb", sales: 86, value: "₹8.6L" },
  { month: "Mar", sales: 78, value: "₹7.8L" },
  { month: "Apr", sales: 64, value: "₹6.4L" },
  { month: "May", sales: 58, value: "₹5.8L" },
  { month: "Jun", sales: 49, value: "₹4.9L" },
];
  return (
    <section className="min-h-[620px] bg-gradient-to-br from-[#DDF4F1] via-[#EAF7F5] to-[#C7EAE5] px-[6%] py-20 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:pr-4"
        >
          <p className="mb-5 inline-block rounded-md border border-[#9ACDC8] px-3 py-2 text-xs font-bold tracking-wide text-[#0D9488]">
            AI-POWERED BUSINESS INTELLIGENCE
          </p>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#172124] sm:text-5xl lg:text-[3.7rem]">
            Understand what’s changing.
            <br />
            Decide what to do next.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#52656A] sm:text-lg">
            ORYN turns your business data into clear insights — helping you
            spot important problems, understand likely contributors, and take
            the right next step.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl bg-[#0D9488] px-7 py-3.5 font-semibold text-white shadow-lg shadow-teal-900/15 transition-all duration-300 hover:bg-[#0B7F75] hover:shadow-xl"
            >
              Get Started →
            </motion.button>

            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl border border-[#9ACDC8] bg-white/50 px-7 py-3.5 font-semibold text-[#0D9488] backdrop-blur-sm transition-all duration-300 hover:border-[#0D9488] hover:bg-white"
            >
              Explore ORYN
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT DASHBOARD */}
        <div className="flex w-full justify-end">
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="w-full max-w-[560px]"
          >
            <Card
  className="w-full overflow-hidden rounded-xl border border-[#A8D6D1] shadow-xl"
  style={{
    backgroundColor: "rgba(232, 246, 244, 0.78)",
    backdropFilter: "blur(12px)",
  }}
>
              <Card.Body className="bg-transparent p-3 sm:p-4">

                {/* HEADER */}
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-[10px] font-bold text-[#172124]">
                      ORYN AI ANALYSIS
                    </p>

                    <h2 className="text-base font-bold text-[#172124]">
                      Business Overview
                    </h2>
                  </div>

                  <div className="flex items-center gap-1">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="h-2 w-2 rounded-full bg-[#0D9488]"
                    />

                    <span className="text-[9px] font-bold text-[#0D9488]">
                      LIVE
                    </span>
                  </div>
                </div>

                {/* KPI CARDS */}
                <div className="mb-3 grid grid-cols-3 gap-2">

                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-md border border-[#D7E0DF] bg-[#FAFCFC] px-3 py-2"
                  >
                    <p className="text-[9px] font-medium text-gray-500">
                      Revenue
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#172124]">
                      ₹8.4L
                    </p>

                    <p className="text-[9px] font-semibold text-green-600">
                      +8.2%
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-md border border-[#D7E0DF] bg-[#FAFCFC] px-3 py-2"
                  >
                    <p className="text-[9px] font-medium text-gray-500">
                      Customers
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#172124]">
                      1,284
                    </p>

                    <p className="text-[9px] font-semibold text-red-500">
                      -5.6%
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-md border border-[#D7E0DF] bg-[#FAFCFC] px-3 py-2"
                  >
                    <p className="text-[9px] font-medium text-gray-500">
                      Problems
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#172124]">
                      4
                    </p>

                    <p className="text-[9px] font-semibold text-orange-500">
                      2 critical
                    </p>
                  </motion.div>

                </div>

                {/* GRAPH + PROBLEMS */}
                <div className="grid grid-cols-[1.6fr_1fr] gap-2">

                  {/* GRAPH */}
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-md border border-[#D7E0DF] bg-white p-3"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-[11px] font-bold text-[#172124]">
                        Sales Trend
                      </p>

                      <span className="text-[8px] text-gray-400">
                        Last 6 months
                      </span>
                    </div>

                    <div className="h-28">
                     <div className="flex h-28 items-end justify-between gap-2 px-2">

 {salesData.map((item, index) => (
  <div
    key={item.month}
    className="group relative flex h-full flex-1 items-end justify-center"
  >
    <motion.div
  initial={{ height: 0 }}
  animate={{
    height: [
      `${item.sales - 8}%`,
      `${item.sales}%`,
      `${item.sales - 4}%`,
      `${item.sales}%`,
    ],
  }}
  transition={{
    duration: 2.5,
    delay: index * 0.15,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  }}
      whileHover={{
        scaleX: 1.08,
        backgroundColor: "#0B7F75",
      }}
      className="relative w-full max-w-[38px] cursor-pointer rounded-t-md bg-[#0D9488]"
    >
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#172124] px-2.5 py-1.5 text-[9px] font-semibold text-white shadow-lg"
      >
        {item.value}
      </motion.div>
    </motion.div>

    <span className="absolute -bottom-5 text-[8px] text-gray-500">
      {item.month}
    </span>
  </div>
))}

</div>
                    </div>
                  </motion.div>

                  {/* PROBLEMS */}
                  <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-md border border-[#D7E0DF] bg-white p-3"
                  >
                    <p className="mb-3 text-[11px] font-bold text-[#172124]">
                      Problems Detected
                    </p>

                    <div className="space-y-3">

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="border-b border-gray-100 pb-2"
                      >
                        <p className="text-[9px] text-gray-600">
                          Sales decline
                        </p>

                        <div className="mt-1 h-1 rounded-full bg-red-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }}
                            transition={{ duration: 1 }}
                            className="h-1 rounded-full bg-red-400"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="border-b border-gray-100 pb-2"
                      >
                        <p className="text-[9px] text-gray-600">
                          Customer churn
                        </p>

                        <div className="mt-1 h-1 rounded-full bg-orange-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            transition={{ duration: 1 }}
                            className="h-1 rounded-full bg-orange-400"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                      >
                        <p className="text-[9px] text-gray-600">
                          Inventory risk
                        </p>

                        <div className="mt-1 h-1 rounded-full bg-yellow-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "45%" }}
                            transition={{ duration: 1 }}
                            className="h-1 rounded-full bg-yellow-400"
                          />
                        </div>
                      </motion.div>

                    </div>
                  </motion.div>

                </div>

              </Card.Body>
            </Card>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

export default Hero;