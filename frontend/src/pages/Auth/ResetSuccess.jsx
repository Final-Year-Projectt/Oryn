import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GiKnockedOutStars } from "react-icons/gi";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { LogIn, } from "lucide-react";

export default function ResetSuccess() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F0F8F4] px-4 py-10">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#B8E8D4]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#A7F3D0]/30 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight text-black"
        >
          <GiKnockedOutStars
            size={30}
            color="#0D9488"
            className="shrink-0"
          />
          <span>
            ORYN<span className="text-[#0D9488]">.</span>
          </span>
        </Link>

        {/* Success card */}
        <div className="rounded-3xl border border-white/80 bg-white/90 p-7 text-center shadow-[0_20px_60px_rgba(25,56,47,0.10)] sm:p-10">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 12,
              delay: 0.15,
            }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#DDF7EA]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0D9488] text-white shadow-lg shadow-teal-900/20">
              <CheckCircle2 size={38} strokeWidth={2.2} />
            </div>
          </motion.div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#0D9488]">
            Success
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-[#19382F] sm:text-3xl">
            Password reset successful!
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
            Your password has been updated successfully.
            You can now sign in to your ORYN account using
            your new password.
          </p>

          {/* Login button */}
          <Link
  to="/login"
  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#285C49] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#285C49]/15 transition hover:bg-[#214C3C] focus:outline-none focus:ring-4 focus:ring-[#58B99A]/25"
>
  <LogIn size={17} />
  Go to Login
  <ArrowRight size={17} />
</Link>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Home button */}
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 px-5 py-3.5 font-medium text-gray-600 transition hover:border-[#0D9488] hover:bg-[#F0F8F4] hover:text-[#145C46]"
          >
            <Home size={19} />
            Back to home
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Secure access. Smarter insights. Better decisions.
        </p>
      </motion.div>
    </div>
  );
}