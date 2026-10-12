
import { useState } from "react";
import { Link } from "react-router-dom";

import { UserPlus } from "lucide-react";
import { GiKnockedOutStars } from "react-icons/gi";
import { motion } from "framer-motion";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import EventIdcard from "./EventIdcard";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please check again.");
      return;
    }

    if (!acceptedTerms) {
      setMessage("Please accept the Terms of Service to continue.");
      return;
    }

    setMessage(
      "Signup UI is ready. Account creation will work once the backend is connected."
    );
  }

  function handleGoogleSignup() {
    setMessage(
      "Google sign-up will be enabled after OAuth and backend setup."
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F8F5] px-4 py-5 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#C8F1DE]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#D9EDE4]/60 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight !text-black"
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

        <p className="hidden text-sm text-gray-500 sm:block">
          Smarter business decisions start here.
        </p>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-90px)] max-w-7xl items-center gap-8 py-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-8">
        {/* Brand section */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D5EAE0] bg-white/80 px-4 py-2 text-xs font-medium text-[#347A62] shadow-sm sm:text-sm">
            <GiKnockedOutStars size={16} />
            AI-powered business intelligence
          </div>

          <h1 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-[#19382F] sm:text-4xl lg:text-5xl">
            Make smarter moves
            <span className="block text-[#55AE90]">
              with ORYN.
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
            Create your account to identify business challenges,
            discover insights, and explore data-driven solutions.
          </p>

          <div className="mt-1 w-full max-w-lg">
            <EventIdcard />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 sm:gap-3 sm:text-sm lg:justify-start">
            <span className="h-2 w-2 rounded-full bg-[#59B99A]" />
            Intelligent insights
            <span className="text-gray-300">•</span>
            Actionable recommendations
          </div>
        </motion.section>

        {/* Signup form */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="rounded-[28px] border border-white bg-white/95 p-6 shadow-[0_24px_80px_-30px_rgba(25,56,47,0.22)] sm:p-9">
            <div className="mb-6">
              <p className="text-sm font-medium text-[#58A98C]">
                Get started
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight !text-black sm:text-3xl">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Join ORYN and start making informed decisions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-[#FAFCFB] py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#67B99B] focus:ring-4 focus:ring-[#67B99B]/15"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="signup-email"
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
                    id="signup-email"
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

              {/* Password */}
              <div>
                <label
                  htmlFor="signup-password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-[#FAFCFB] py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#67B99B] focus:ring-4 focus:ring-[#67B99B]/15"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-[#FAFCFB] py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#67B99B] focus:ring-4 focus:ring-[#67B99B]/15"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-5 text-gray-600">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#55AE90]"
                />
                <span>
                  I agree to ORYN&apos;s{" "}
                  <span className="font-medium text-[#378568]">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-[#378568]">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>

             <motion.button
  type="submit"
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.98 }}
  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#285C49] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#285C49]/15 transition hover:bg-[#214C3C] focus:outline-none focus:ring-4 focus:ring-[#58B99A]/25"
>
  <UserPlus size={17} />
  Create Account
  <ArrowRight size={17} />
</motion.button>
            </form>

            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100"
            >
              <svg
                viewBox="0 0 48 48"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                  transform="translate(0 4)"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.06 46.98 31.84 46.98 24.55Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                />
              </svg>
              Continue with Google
            </button>

            {message && (
              <p
                role="status"
                className="mt-4 rounded-xl border border-[#D5EAE0] bg-[#F2FAF5] px-3 py-3 text-xs leading-5 text-[#285C49]"
              >
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#378568] transition hover:text-[#245D49]"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-gray-400">
            Your business insights start with a smarter decision.
          </p>
        </motion.section>
      </div>
    </main>
  );
}
