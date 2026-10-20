import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GiKnockedOutStars } from "react-icons/gi";
import Button from "react-bootstrap/Button";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Database,
  FileCheck2,
  Lightbulb,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  Upload,
  Workflow,
  Boxes,
  Gauge,
  MessageCircle,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const challenges = [
  {
    icon: Database,
    number: "01",
    title: "Scattered business data",
    description:
      "Important information lives in spreadsheets and reports. ORYN is designed to bring analysis into a clearer, more structured workflow.",
  },
  {
    icon: Search,
    number: "02",
    title: "Problems hiding in plain sight",
    description:
      "Unusual patterns, data-quality issues, and performance changes can be easy to miss when reviewing records manually.",
  },
  {
    icon: BrainCircuit,
    number: "03",
    title: "Numbers without context",
    description:
      "Metrics tell only part of the story. Teams also need context to investigate what may be contributing to a change.",
  },
  {
    icon: Lightbulb,
    number: "04",
    title: "Unclear next steps",
    description:
      "After finding a potential issue, users need practical options to evaluate—not just another chart to interpret.",
  },
];

const workflow = [
  {
    number: "01",
    icon: Upload,
    title: "Bring your data",
    label: "UPLOAD",
    description:
      "Start with a supported CSV or Excel business dataset containing the information you want to understand.",
  },
  {
    number: "02",
    icon: FileCheck2,
    title: "Check data quality",
    label: "VALIDATE",
    description:
      "Review missing values, duplicates, inconsistent formats, and other issues that may affect the analysis.",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "Analyze patterns",
    label: "ANALYZE",
    description:
      "Use the implemented analytics and AI/ML components to explore trends, anomalies, and possible business problems.",
  },
  {
    number: "04",
    icon: Target,
    title: "Understand findings",
    label: "IDENTIFY",
    description:
      "Review relevant metrics and context so you can decide which findings need closer attention.",
  },
  {
    number: "05",
    icon: Lightbulb,
    title: "Explore next steps",
    label: "RECOMMEND",
    description:
      "Evaluate suggested actions related to the findings and choose what makes sense for your business.",
  },
];

const features = [
  {
    icon: FileCheck2,
    title: "Data validation",
    description:
      "Make missing, duplicated, or inconsistent data easier to identify before analysis.",
  },
  {
    icon: BarChart3,
    title: "Business analytics",
    description:
      "Explore important metrics, summaries, and visual patterns in business data.",
  },
  {
    icon: CircleAlert,
    title: "Problem identification",
    description:
      "Surface potential performance gaps and unusual patterns for further investigation.",
  },
  {
    icon: BrainCircuit,
    title: "AI/ML-assisted insights",
    description:
      "Use the project’s AI/ML pipeline to support analysis and highlight meaningful findings.",
  },
  {
    icon: Lightbulb,
    title: "Solution recommendations",
    description:
      "Connect findings with possible actions that users can review and evaluate.",
  },
  {
    icon: Gauge,
    title: "KPI awareness",
    description:
      "Review relevant key performance indicators and understand how business performance changes.",
  },
];

const scenarios = {
  sales: {
    label: "Sales performance",
    title: "Sales are trending down.",
    description:
      "Compare revenue across months, product categories, and regions to find where the change is concentrated.",
    question: "Which products, regions, or periods need a closer look?",
    actions: [
      "Compare recent months against previous periods",
      "Review category and regional performance",
      "Investigate related order and customer data",
    ],
    icon: TrendingDown,
    bars: [88, 95, 76, 69, 56, 43],
    colors: ["#0D9488", "#0D9488", "#0D9488", "#53B9AC", "#E8A44B", "#E46E78"],
  },
  inventory: {
    label: "Inventory risk",
    title: "Stock may not match demand.",
    description:
      "Review available stock alongside sales and order patterns to identify products that may need attention.",
    question: "Which products could face a shortage or excess stock?",
    actions: [
      "Compare stock levels with recent sales",
      "Find products with unusual inventory movement",
      "Review replenishment patterns before acting",
    ],
    icon: Boxes,
    bars: [35, 53, 43, 78, 62, 91],
    colors: ["#0D9488", "#0D9488", "#53B9AC", "#0D9488", "#E8A44B", "#E46E78"],
  },
  customers: {
    label: "Customer activity",
    title: "Customer engagement may be changing.",
    description:
      "Explore customer activity over time and compare segments to find where engagement may be weakening.",
    question: "Which customer groups need further investigation?",
    actions: [
      "Compare activity across customer segments",
      "Review repeat orders and customer trends",
      "Investigate changes by region or period",
    ],
    icon: MessageCircle,
    bars: [83, 79, 72, 66, 58, 47],
    colors: ["#0D9488", "#0D9488", "#0D9488", "#53B9AC", "#E8A44B", "#E46E78"],
  },
};

const faqs = [
  {
    question: "What is ORYN?",
    answer:
      "ORYN is an AI-based business problem identification and solution recommendation system. It is designed to help users validate business data, review analysis, identify potential problems, and explore suggested next steps.",
  },
  {
    question: "What kind of data can I use?",
    answer:
      "ORYN helps businesses explore structured datasets such as sales records, customer information, inventory details, and operational performance metrics. Users can review data quality, investigate potential business problems, and explore recommendations based on the analysis supported by the system.",
},
  {
    question: "Does ORYN make business decisions for me?",
    answer:
      "No. ORYN is intended to support your decision-making with findings and recommendations. Important results should be checked against your business context and the quality of the available data.",
  },
  {
    question: "Are the charts and results on this page live?",
    answer:
      "No. The dashboard preview and interactive business example on this page are illustrative UI examples, not live analysis results or a connection to your uploaded dataset.",
  },
];

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 !rounded-xl !border !border-transparent !bg-[#10998D] !px-5 !py-3 !text-sm !font-bold !text-white !shadow-md !shadow-teal-900/10 transition duration-200 hover:-translate-y-0.5 hover:!bg-[#0D8278] hover:!shadow-lg focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-teal-700 active:translate-y-0 sm:!px-6 sm:!py-3.5";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 !rounded-xl !border !border-teal-200 !bg-white/80 !px-5 !py-3 !text-sm !font-bold !text-teal-800 !shadow-sm transition duration-200 hover:-translate-y-0.5 hover:!border-teal-400 hover:!bg-white focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-teal-700 sm:!px-6 sm:!py-3.5";

const finalPrimaryButtonClass =
  "inline-flex items-center justify-center gap-2 !rounded-xl !border !border-white !bg-white !px-6 !py-3.5 !text-sm !font-bold !text-teal-800 !shadow-sm transition duration-200 hover:-translate-y-0.5 hover:!bg-teal-50 focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-white";

const finalSecondaryButtonClass =
  "inline-flex items-center justify-center gap-2 !rounded-xl !border !border-white/35 !bg-white/5 !px-6 !py-3.5 !text-sm !font-bold !text-white transition duration-200 hover:-translate-y-0.5 hover:!bg-white/15 focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-white";

function Logo({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="ORYN home"
      className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900"
    >
      <GiKnockedOutStars size={31} color="#0D9488" />
      <span>
        ORYN<span className="text-teal-700">.</span>
      </span>
    </button>
  );
}

function SectionHeading({ eyebrow, title, description, center = true }) {
  return (
    <div className={`${center ? "mx-auto text-center" : "text-left"} mb-12 max-w-3xl`}>
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-teal-700">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function ExploreOryn() {
  const navigate = useNavigate();
  const [activeScenario, setActiveScenario] = useState("sales");
  const [openFaq, setOpenFaq] = useState(0);
  const scenario = scenarios[activeScenario];
  const ScenarioIcon = scenario.icon;

  const goTo = (path) => navigate(path);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-teal-900/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 lg:px-10">
          <Logo onClick={() => goTo("/")} />

          <Button
            type="button"
            variant="primary"
            onClick={() => goTo("/signup")}
            className={primaryButtonClass}
          >
            Get started <ArrowUpRight size={16} />
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#E5F7F4] via-[#F6FBFA] to-[#D4F0EA]">
        <div className="pointer-events-none absolute -right-24 -top-28 -z-10 h-[28rem] w-[28rem] rounded-full bg-teal-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 -z-10 h-[30rem] w-[30rem] rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.02fr] lg:gap-16 lg:px-10 lg:py-24">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10">
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-teal-800 shadow-sm shadow-teal-900/5 sm:text-sm">
              <Sparkles size={16} /> AI-powered business intelligence
            </motion.div>

            <motion.h1 variants={fadeUp} className="max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.8rem]">
              Understand what’s changing. <span className="text-[#39A992]">Decide what to do next.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              ORYN helps connect business data with potential problems, useful insights, and recommendations—so you can investigate the signals that matter.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Button
                as="a"
                href="#oryn-workflow"
                variant="outline-primary"
                className={secondaryButtonClass}
              >
                See how it works <ArrowDown size={17} />
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-teal-700" /> Structured data review</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-teal-700" /> Insight-led workflow</span>
            </motion.div>
          </motion.div>

          {/* Dashboard preview: intentionally illustrative */}
          <motion.div initial={{ opacity: 0, y: 22, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.65, delay: 0.15 }} className="relative mx-auto w-full max-w-2xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-teal-300/30 blur-2xl" />
            <div className="relative rounded-[1.6rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_70px_-28px_rgba(13,148,136,0.35)] backdrop-blur sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><GiKnockedOutStars size={28} /></div>
                  <div><p className="text-xs font-semibold uppercase tracking-widest text-teal-700">ORYN AI analysis</p><h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Business overview</h2></div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />Sample preview</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
                <div className="rounded-xl border border-slate-100 bg-[#FAFCFC] p-3 sm:p-4"><p className="text-[11px] font-medium text-slate-500 sm:text-xs">Revenue</p><p className="mt-2 text-base font-bold text-slate-900 sm:text-xl">₹8.4L</p><p className="mt-2 text-[10px] font-bold text-emerald-600 sm:text-xs">+8.2%</p></div>
                <div className="rounded-xl border border-slate-100 bg-[#FAFCFC] p-3 sm:p-4"><p className="text-[11px] font-medium text-slate-500 sm:text-xs">Customers</p><p className="mt-2 text-base font-bold text-slate-900 sm:text-xl">1,284</p><p className="mt-2 text-[10px] font-bold text-rose-500 sm:text-xs">-5.6%</p></div>
                <div className="rounded-xl border border-slate-100 bg-[#FAFCFC] p-3 sm:p-4"><p className="text-[11px] font-medium text-slate-500 sm:text-xs">Findings</p><p className="mt-2 text-base font-bold text-slate-900 sm:text-xl">04</p><p className="mt-2 text-[10px] font-bold text-amber-600 sm:text-xs">2 to review</p></div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-xl border border-slate-100 bg-white p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold text-slate-800">Sales trend</p><p className="mt-1 text-[10px] text-slate-500">Illustrative · last 6 periods</p></div><LineChart size={18} className="text-teal-700" /></div>
                  <div className="mt-5 flex h-28 items-end gap-2 sm:h-32">
                    {[74, 91, 83, 68, 60, 48].map((height, index) => <motion.div key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.5, delay: 0.25 + index * 0.07 }} className={`flex-1 rounded-t-md ${index > 3 ? "bg-amber-400" : "bg-teal-600"}`} />)}
                  </div>
                  <div className="mt-2 flex justify-between text-[9px] font-medium text-slate-400 sm:text-[10px]"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-4 sm:p-5">
                  <div className="flex items-center justify-between"><p className="text-xs font-bold text-slate-800">Potential issues</p><CircleAlert size={17} className="text-amber-500" /></div>
                  <div className="mt-5 space-y-4">
                    {[{ label: "Sales decline", color: "bg-rose-400", width: "84%" }, { label: "Customer activity", color: "bg-amber-400", width: "64%" }, { label: "Stock movement", color: "bg-teal-500", width: "45%" }].map((item) => <div key={item.label}><div className="mb-2 flex justify-between"><span className="text-[10px] font-medium text-slate-600">{item.label}</span><span className="text-[10px] text-slate-400">Review</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }} /></div></div>)}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[10px] leading-5 text-slate-400">Illustrative interface only. Figures and findings are examples, not live business analysis.</p>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-teal-100/80 bg-white/65 p-4 sm:grid-cols-4 sm:p-5">
            {[{ icon: Upload, title: "Upload", caption: "Bring in data" }, { icon: ShieldCheck, title: "Validate", caption: "Check quality" }, { icon: Workflow, title: "Analyze", caption: "Review patterns" }, { icon: Lightbulb, title: "Recommend", caption: "Explore next steps" }].map((item) => { const Icon = item.icon; return <div key={item.title} className="flex items-center gap-3 px-1 py-2 sm:px-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Icon size={19} /></div><div><p className="text-sm font-bold text-slate-800">{item.title}</p><p className="mt-0.5 text-xs text-slate-500">{item.caption}</p></div></div>; })}
          </div>
        </div>
      </section>

      {/* PRODUCT STORY */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-teal-700">Why ORYN exists</p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">Business data should tell a clearer story.</h2>
            <p className="mt-5 leading-8 text-slate-600">A spreadsheet can contain thousands of values, but the real question is what those values mean. ORYN is designed to help organize the path from raw information to potential findings and decisions.</p>
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-teal-100 bg-[#F0FAF8] p-4"><div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm"><Sparkles size={19} /></div><p className="text-sm leading-6 text-slate-700"><strong className="text-slate-900">The goal:</strong> turn data review into a guided process—without pretending that every finding automatically explains its cause.</p></div>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="grid gap-4 sm:grid-cols-2">
            {challenges.map((item) => { const Icon = item.icon; return <motion.article key={item.number} variants={fadeUp} whileHover={{ y: -5 }} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-200 hover:shadow-lg hover:shadow-teal-900/5"><div className="flex items-center justify-between"><span className="text-xs font-extrabold tracking-widest text-teal-700">{item.number}</span><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF8F5] text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white"><Icon size={22} /></div></div><h3 className="mt-5 text-lg font-bold text-slate-900">{item.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p></motion.article>; })}
          </motion.div>
        </div>
      </section>

      {/* WORKFLOW */}
<section
  id="oryn-workflow"
  className="scroll-mt-24 bg-[#F0FAF8] px-5 py-20 sm:px-8 sm:py-24 lg:px-10"
>
  <div className="mx-auto max-w-7xl">
    <SectionHeading
      eyebrow="The ORYN workflow"
      title="From raw data to meaningful decisions."
      description="Follow five clear stages that help you prepare business data, investigate potential problems, and evaluate possible solutions."
    />

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {workflow.map((step, index) => {
        const Icon = step.icon;

        return (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -6 }}
            className="h-full"
          >
            <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 sm:p-7">
              {/* Step number and icon */}
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F6F2] text-sm font-bold text-teal-800">
                  {step.number}
                </span>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-100 bg-white text-teal-700 shadow-sm">
                  <Icon size={23} strokeWidth={1.8} />
                </div>
              </div>

              {/* Step label */}
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                {step.label}
              </p>

              {/* Title */}
              <h3 className="mt-3 min-h-[3.5rem] text-xl font-bold leading-snug tracking-tight text-slate-900">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {step.description}
              </p>

              {/* Bottom indicator */}
              <div className="mt-7 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-teal-800">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                Stage {index + 1} of 5
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Workflow footer */}
    <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-teal-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Workflow size={24} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Every stage has a purpose.
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Start with reliable data, investigate potential problems, and
            review recommendations before deciding on your next action.
          </p>
        </div>
      </div>

     
    </div>
  </div>
</section>


      {/* FEATURES */}
      <section id="features" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="What ORYN brings together" title="Useful capabilities, connected in one workflow." description="Explore the main areas ORYN is being designed around—from preparing data to reviewing findings and possible actions." />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => { const Icon = feature.icon; return <motion.article key={feature.title} variants={fadeUp} whileHover={{ y: -5 }} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 sm:p-7"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition group-hover:bg-[#10998D] group-hover:text-white"><Icon size={24} /></div><h3 className="mt-5 text-lg font-bold text-slate-900">{feature.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p><div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">Designed to support <ArrowRight size={15} /></div></motion.article>; })}
          </motion.div>
        </div>
      </section>

      {/* INTERACTIVE EXAMPLE */}
      <section id="example" className="scroll-mt-24 bg-gradient-to-br from-[#E5F7F4] via-[#F4FBF9] to-[#E8F7F4] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Make it tangible" title="Explore an example business situation." description="Choose a scenario to see the kinds of questions a structured data review could help you investigate. These examples are illustrative, not live findings." />

          <div className="grid overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-[0_25px_80px_-35px_rgba(13,148,136,0.25)] lg:grid-cols-[0.72fr_1.28fr]">
            <div className="border-b border-slate-100 bg-white p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Choose a scenario</p>
              <div className="space-y-2">
                {Object.entries(scenarios).map(([key, item]) => { const Icon = item.icon; const selected = key === activeScenario; return <button key={key} type="button" onClick={() => setActiveScenario(key)} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${selected ? "border-teal-200 bg-[#EDF9F6] shadow-sm" : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"}`} aria-pressed={selected}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"}`}><Icon size={20} /></span><span className="min-w-0 flex-1"><span className={`block text-sm font-bold ${selected ? "text-teal-900" : "text-slate-800"}`}>{item.label}</span><span className="mt-1 block text-xs text-slate-500">Illustrative example</span></span>{selected && <Check size={17} className="text-teal-700" />}</button>; })}
              </div>
              <div className="mt-5 rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-slate-700"><ShieldCheck size={17} className="text-teal-700" /><span className="text-xs font-bold">Human review matters</span></div><p className="mt-2 text-xs leading-5 text-slate-500">A pattern is a starting point for investigation—not proof of a cause.</p></div>
            </div>

            <motion.div key={activeScenario} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="p-5 sm:p-8 lg:p-9">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800"><Sparkles size={14} /> {scenario.label}</span><h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{scenario.title}</h3><p className="mt-3 max-w-2xl leading-7 text-slate-600">{scenario.description}</p></div><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF8F5] text-teal-700"><ScenarioIcon size={24} /></div></div>
              <div className="mt-7 grid gap-5 md:grid-cols-[1fr_0.95fr]">
                <div className="rounded-2xl border border-slate-100 bg-[#FAFCFC] p-5"><div className="flex items-center justify-between gap-2"><div><p className="text-xs font-semibold text-slate-500">Illustrative trend</p><p className="mt-1 text-sm font-bold text-slate-800">Last 6 periods</p></div><span className="rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-slate-500">EXAMPLE</span></div><div className="mt-6 flex h-32 items-end gap-2">{scenario.bars.map((height, index) => <motion.div key={`${activeScenario}-${index}`} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.4, delay: index * 0.05 }} className="flex-1 rounded-t-md" style={{ backgroundColor: scenario.colors[index] }} />)}</div><div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400"><span>Period 1</span><span>Period 2</span><span>Period 3</span><span>Period 4</span><span>Period 5</span><span>Period 6</span></div></div>
                <div className="rounded-2xl border border-teal-100 bg-[#F0FAF8] p-5"><p className="text-xs font-extrabold uppercase tracking-[0.15em] text-teal-800">Question to investigate</p><p className="mt-3 text-lg font-bold leading-7 text-slate-900">{scenario.question}</p><div className="mt-5 space-y-3">{scenario.actions.map((action) => <div key={action} className="flex items-start gap-2.5"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-teal-700" /><p className="text-sm leading-6 text-slate-600">{action}</p></div>)}</div></div>
              </div>
              <p className="mt-5 text-xs leading-5 text-slate-400">This interactive example changes the illustrative scenario only. It does not analyze uploaded data or produce a real prediction.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-teal-700">Built for clarity</p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">Move from reviewing data to asking better questions.</h2>
            <p className="mt-5 leading-8 text-slate-600">ORYN aims to make analysis easier to follow by presenting a more structured path from data quality to findings and possible actions. It supports human judgment rather than replacing it.</p>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="grid gap-3 sm:grid-cols-2">
            {["Understand business data more clearly", "Review potential problems earlier", "Reduce repetitive manual inspection", "Prioritize findings with relevant metrics", "Evaluate practical next steps", "Support data-informed decisions"].map((benefit) => <motion.div key={benefit} variants={fadeUp} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Check size={16} /></span><span className="text-sm font-semibold leading-6 text-slate-700">{benefit}</span></motion.div>)}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F4FAF9] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-teal-700">A few helpful answers</p><h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">Questions about ORYN?</h2><p className="mt-4 leading-7 text-slate-600">A quick guide to what ORYN is designed to do and how to understand this preview page.</p><div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-teal-100 bg-white px-4 py-3 text-sm font-semibold text-teal-800"><MessageCircle size={17} /> Clear insights, with context</div></div>
          <div className="space-y-3">{faqs.map((faq, index) => { const expanded = openFaq === index; return <div key={faq.question} className={`overflow-hidden rounded-2xl border bg-white transition ${expanded ? "border-teal-200 shadow-sm shadow-teal-900/5" : "border-slate-200"}`}><button type="button" onClick={() => setOpenFaq(expanded ? -1 : index)} aria-expanded={expanded} className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"><span className="font-bold text-slate-900">{faq.question}</span><ChevronDown size={19} className={`shrink-0 text-teal-700 transition-transform ${expanded ? "rotate-180" : ""}`} /></button>{expanded && <div className="px-5 pb-5 sm:px-6 sm:pb-6"><p className="border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600">{faq.answer}</p></div>}</div>; })}</div>
        </div>
      </section>

      {/* RESPONSIBLE USE */}
      <section className="px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-5xl items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><ShieldCheck size={23} /></div><div><h3 className="font-bold text-slate-900">Thoughtful, transparent analysis</h3><p className="mt-2 text-sm leading-7 text-slate-600">Results depend on the quality and scope of the dataset and the analysis methods implemented. Review findings in context and verify important conclusions before making business decisions.</p></div></div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-20 pt-4 sm:px-8 sm:pb-24 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-[#087F73] via-[#10998D] to-[#19A798] px-6 py-12 text-center shadow-xl shadow-teal-900/10 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" /><div className="pointer-events-none absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-emerald-200/15 blur-3xl" />
          <div className="relative mx-auto max-w-3xl"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white"> <GiKnockedOutStars size={34} color="#FFFFFF" /></div><p className="mt-5 text-xs font-extrabold uppercase tracking-[0.22em] text-teal-50">Your next step starts here</p><h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">Make your business data more meaningful.</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-teal-50">Explore ORYN’s guided approach to data quality, potential business problems, and recommendations.</p><div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="light"
                onClick={() => goTo("/signup")}
                className={finalPrimaryButtonClass}
              >
                Get started <ArrowUpRight size={17} />
              </Button>
              <Button
                type="button"
                variant="outline-light"
                onClick={() => goTo("/")}
                className={finalSecondaryButtonClass}
              >
                Back to home <ArrowRight size={17} />
              </Button>
            </div></div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><Logo onClick={() => goTo("/")} /><p className="mt-2 text-xs text-slate-500">Smarter business decisions start here.</p></div><div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500"><a href="#features" className="transition hover:text-teal-700">Capabilities</a><a href="#oryn-workflow" className="transition hover:text-teal-700">How it works</a><a href="#example" className="transition hover:text-teal-700">Use cases</a><button type="button" onClick={() => goTo("/login")} className="transition hover:text-teal-700">Login</button></div><p className="text-xs text-slate-400">© {new Date().getFullYear()} ORYN. All rights reserved.</p></div>
      </footer>
    </main>
  );
}

export default ExploreOryn;
