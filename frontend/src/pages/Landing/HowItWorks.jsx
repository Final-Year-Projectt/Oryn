
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  Database,
  ChartNoAxesCombined,
  ScanSearch,
  ListChecks,
  ArrowRight,
  FileSpreadsheet,
  Activity,
  CircleAlert,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Business Data",
    description: "Bring your business data into one place.",
    detail: "CSV & Excel",
    Icon: Database,
    DetailIcon: FileSpreadsheet,
  },
  {
    number: "02",
    title: "Analysis",
    description: "Validate data and discover meaningful signals.",
    detail: "Find patterns",
    Icon: ChartNoAxesCombined,
    DetailIcon: Activity,
  },
  {
    number: "03",
    title: "Problems",
    description: "Explore detected issues and their evidence.",
    detail: "Review findings",
    Icon: ScanSearch,
    DetailIcon: CircleAlert,
  },
  {
    number: "04",
    title: "Recommendations",
    description: "Compare practical actions and decide what comes next.",
    detail: "Plan next steps",
    Icon: ListChecks,
    DetailIcon: ArrowRight,
  },
];

function HowItWorks() {
  return (
    <section
      id="workflow"
      className="bg-[#EAF7F5] px-[6%] py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold tracking-[0.16em] text-[#0D9488]">
            HOW ORYN WORKS
          </p>

          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-[#172124] sm:text-4xl lg:text-5xl">
            From business data
            <span className="text-[#0D9488]"> to better decisions.</span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#52656A] sm:text-lg">
            Follow the evidence, understand potential contributors, and
            discover which business problems deserve attention first.
          </p>
        </motion.div>

        <div className="relative mt-12 grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.Icon;
            const DetailIcon = step.DetailIcon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.12,
                }}
                className="relative flex w-full min-w-0"
              >
                <Card
                  as={motion.div}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                 className="group flex h-full w-full flex-1 flex-col !rounded-2xl !border !border-[#D7E7E5] !bg-[#F5FBFA] p-5 shadow-sm transition-shadow duration-300 hover:!border-[#8ACCC5] hover:shadow-xl hover:shadow-[#0D9488]/10 sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDF4F1] text-[#0D9488] transition-colors duration-300 group-hover:bg-[#0D9488] group-hover:text-white">
                      <Icon size={23} strokeWidth={1.8} />
                    </div>

                    <span className="text-sm font-semibold tracking-wider text-[#8AA7A5]">
                      {step.number}
                    </span>
                  </div>

                  <Card.Title className="mt-7 !text-lg !font-semibold !text-[#172124] max-[360px]:!text-base sm:!whitespace-nowrap">
                    {step.title}
                  </Card.Title>

                  <Card.Text className="mt-3 !text-sm !leading-6 !text-[#52656A]">
                    {step.description}
                  </Card.Text>

                  <div className="mt-7 flex items-center gap-2 border-t border-[#D7E7E5] pt-4">
                    <DetailIcon size={15} className="text-[#0D9488]" />
                    <span className="text-xs font-medium text-[#0D9488]">
                      {step.detail}
                    </span>
                  </div>
                </Card>

                {index < steps.length - 1 && (
                  <motion.div
                    aria-hidden="true"
                    animate={{ opacity: [0.45, 1, 0.45] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="pointer-events-none absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 text-[#0D9488] lg:block"
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="mt-10 text-sm leading-6 text-[#52656A]">
          <span className="font-semibold text-[#0D9488]">The goal:</span>{" "}
          turn business signals into informed, evidence-based next steps.
        </p>
      </div>
    </section>
  );
}

export default HowItWorks;
