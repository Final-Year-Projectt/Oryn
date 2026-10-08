import { motion } from "framer-motion";
import { Card } from "react-bootstrap";

function Capabilities() {
  return (
    <section
      id="features"
      className="bg-white px-[6%] py-20"
    >
      <div className="mx-auto max-w-7xl">

        <p className="text-xs font-bold tracking-wider text-[#0D9488]">
          CORE CAPABILITIES
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#172124] sm:text-4xl">
          From business data to clear action.
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-7 text-[#52656A]">
  Discover what is changing in your business, understand what may be
  contributing to it, and find where action matters most.
</p>

<div className="mt-10 grid gap-5 md:grid-cols-2">

  {/* First card */}
  <Card
  as={motion.div}

  whileHover={{ y: -6 }}
  transition={{ duration: 0.25 }}
  className="group rounded-2xl border border-[#D7E7E5] bg-[#F5FBFA] p-6 transition-shadow duration-300 hover:border-[#8ACCC5] hover:shadow-xl hover:shadow-[#0D9488]/10"
>
  <div className="mb-6 flex items-center justify-between">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF4F1] text-[#0D9488]">
      <span className="text-xl">⌁</span>
    </div>

    <span className="text-sm font-medium text-[#0D9488] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
      Explore →
    </span>
  </div>

  <h3 className="text-lg font-semibold text-[#172124]">
    Problem Detection
  </h3>

  <p className="mt-3 text-sm leading-6 text-[#52656A]">
    Identify important business problems and unusual signals hidden in
    your data.
  </p>

  <div className="mt-6 flex h-10 items-end gap-1.5">
    {[35, 55, 42, 72, 58, 82].map((height, index) => (
      <motion.div
        key={index}
        animate={{
          height: [`${height - 12}%`, `${height}%`, `${height - 5}%`],
        }}
        transition={{
          duration: 2,
          delay: index * 0.12,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        className="w-2 rounded-t-sm bg-[#0D9488]/70"
      />
    ))}
  </div>
</Card>

  {/* Second card */}
  <Card
  as={motion.div}
  whileHover={{ y: -6 }}
  transition={{ duration: 0.25 }}
  className="group rounded-2xl border border-[#D7E7E5] bg-[#F5FBFA] p-6 transition-shadow duration-300 hover:border-[#8ACCC5] hover:shadow-xl hover:shadow-[#0D9488]/10"
>
  <div className="mb-6 flex items-center justify-between">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF4F1] text-[#0D9488]">
      <span className="text-xl">◈</span>
    </div>

    <span className="text-sm font-medium text-[#0D9488] opacity-0 transition-all duration-300 group-hover:opacity-100">
      Explore →
    </span>
  </div>

  <h3 className="text-lg font-semibold text-[#172124]">
    Contributor Analysis
  </h3>

  <p className="mt-3 text-sm leading-6 text-[#52656A]">
    Explore probable contributors and the business metrics connected with
    each problem.
  </p>

  <div className="relative mt-6 h-10">
    <motion.div
      animate={{ x: [0, 8, 0] }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute left-2 top-3 h-3 w-3 rounded-full bg-[#0D9488]"
    />

    <motion.div
      animate={{ x: [0, -5, 0] }}
      transition={{
        duration: 2.2,
        repeat: Infinity,
        delay: 0.3,
        ease: "easeInOut",
      }}
      className="absolute left-24 top-1 h-2.5 w-2.5 rounded-full bg-[#5DBDB4]"
    />

    <motion.div
      animate={{ x: [0, 6, 0] }}
      transition={{
        duration: 2.4,
        repeat: Infinity,
        delay: 0.5,
        ease: "easeInOut",
      }}
      className="absolute left-40 top-6 h-2.5 w-2.5 rounded-full bg-[#7CCBC4]"
    />

    <div className="absolute left-5 top-4 h-px w-20 bg-[#9BD8D2]" />
    <div className="absolute left-26 top-4 h-px w-14 bg-[#9BD8D2]" />
  </div>
</Card>

  {/* Third card */}
  <Card
  as={motion.div}
  whileHover={{ y: -6 }}
  transition={{ duration: 0.25 }}
  className="group rounded-2xl border border-[#D7E7E5] !bg-[#F5FBFA] p-6 transition-shadow duration-300 hover:border-[#8ACCC5] hover:shadow-xl hover:shadow-[#0D9488]/10"
>
  <div className="mb-6 flex items-center justify-between">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF4F1] text-[#0D9488]">
      ✓
    </div>

    <span className="text-sm font-medium text-[#0D9488] opacity-0 transition-all duration-300 group-hover:opacity-100">
      Explore →
    </span>
  </div>

  <Card.Title className="text-lg font-semibold text-[#172124]">
    Recommendations
  </Card.Title>

  <Card.Text className="mt-3 text-sm leading-6 text-[#52656A]">
    Turn identified problems into practical actions with clear priorities.
  </Card.Text>

  <div className="mt-6 flex items-center gap-2">
    <span className="h-2 w-2 rounded-full bg-red-400" />
    <span className="h-2 w-2 rounded-full bg-orange-400" />
    <span className="h-2 w-2 rounded-full bg-yellow-400" />

    <motion.span
      animate={{ x: [0, 6, 0] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="ml-2 text-xs font-medium text-[#0D9488]"
    >
      Prioritize next action →
    </motion.span>
  </div>
</Card>
{/* Fourth card */}

 <Card
  as={motion.div}
  whileHover={{ y: -6 }}
  transition={{ duration: 0.25 }}
  className="group rounded-2xl border border-[#D7E7E5] bg-[#F5FBFA] p-6 transition-shadow duration-300 hover:border-[#8ACCC5] hover:shadow-xl hover:shadow-[#0D9488]/10"
>
  <div className="mb-6 flex items-center justify-between">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF4F1] text-[#0D9488]">
      ✦
    </div>

    <span className="text-sm font-medium text-[#0D9488] opacity-0 transition-all duration-300 group-hover:opacity-100">
      Understand →
    </span>
  </div>

  <h3 className="text-lg font-semibold text-[#172124]">
    AI Explanation
  </h3>

  <p className="mt-3 text-sm leading-6 text-[#52656A]">
    Understand why an insight matters through clear, human-readable
    explanations.
  </p>

  <div className="mt-6 space-y-2">
    <motion.div
      animate={{ width: ["45%", "75%", "55%"] }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="h-1.5 rounded-full bg-[#0D9488]/60"
    />

    <motion.div
      animate={{ width: ["70%", "45%", "80%"] }}
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="h-1.5 rounded-full bg-[#7CCBC4]/60"
    />

    <motion.div
      animate={{ width: ["55%", "80%", "40%"] }}
      transition={{
        duration: 2.3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="h-1.5 rounded-full bg-[#9BD8D2]/70"
    />
  </div>
</Card>

</div>

      </div>
    </section>
  );
}

export default Capabilities;