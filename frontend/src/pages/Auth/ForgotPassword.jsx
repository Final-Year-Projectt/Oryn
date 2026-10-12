
import { useState } from "react";
import { Link } from "react-router-dom";
import { GiKnockedOutStars } from "react-icons/gi";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F8F5] px-4 py-8">
      {/* Soft background accents */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#C8F1DE]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#D9EDE4]/60 blur-3xl" />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* ORYN branding */}
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight !text-black"
        >
          <GiKnockedOutStars
            size={30}
            color="#0D9488"
            className="shrink-0"
          />
          <span>
            ORYN<span className="text-[#58B99A]">.</span>
          </span>
        </Link>

        <div className="rounded-[28px] border border-white bg-white/95 p-7 shadow-[0_24px_80px_-30px_rgba(25,56,47,0.22)] sm:p-9">
          {/* Mail icon */}
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F5EC]">
            <Mail size={26} className="text-[#287354]" />
          </div>

          {!submitted ? (
            <>
              <p className="text-sm font-medium text-[#58A98C]">
                Account recovery
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight !text-black sm:text-3xl">
                Forgot password?
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                No worries. Enter the email address associated with your
                ORYN account and we&apos;ll help you reset your password.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="recovery-email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="recovery-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="w-full rounded-2xl border border-gray-200 bg-[#FAFCFB] py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#67B99B] focus:ring-4 focus:ring-[#67B99B]/15"
                    />
                  </div>
                </div>

               <motion.button
  type="submit"
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.98 }}
  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#285C49] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#285C49]/15 transition hover:bg-[#214C3C] focus:outline-none focus:ring-4 focus:ring-[#58B99A]/25"
>
  <Mail size={17} />
  Send Reset Link
  <ArrowRight size={17} />
</motion.button>
              </form>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-[#58A98C]">
                Request received
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight !text-black sm:text-3xl">
                Check your email
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                The confirmation screen is ready for{" "}
                <span className="font-medium text-gray-700">{email}</span>.
                Actual password-reset emails will work after backend
                integration.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 w-full rounded-2xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Try another email
              </button>
            </>
          )}

          <div className="mt-7 border-t border-gray-100 pt-5">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-[#378568] transition hover:text-[#245D49]"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Smarter business decisions start here.
        </p>
      </motion.section>
    </main>
  );
}
