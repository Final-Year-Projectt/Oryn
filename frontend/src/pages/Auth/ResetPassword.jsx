
import { useState } from "react";
import { Link } from "react-router-dom";
import { GiKnockedOutStars } from "react-icons/gi";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    setMessage(
      "Password form validated. Actual password reset will work after backend integration."
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F8F5] px-4 py-8">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#C8F1DE]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#D9EDE4]/60 blur-3xl" />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight !text-black"
        >
          <GiKnockedOutStars size={30} color="#0D9488" />
          <span>
            ORYN<span className="text-[#58B99A]">.</span>
          </span>
        </Link>

        <div className="rounded-[28px] border border-white bg-white/95 p-7 shadow-[0_24px_80px_-30px_rgba(25,56,47,0.22)] sm:p-9">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F5EC]">
            <LockKeyhole size={26} className="text-[#287354]" />
          </div>

          <p className="text-sm font-medium text-[#58A98C]">
            Secure your account
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight !text-black sm:text-3xl">
            Reset password
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Create a new password for your ORYN account. Choose at least
            8 characters.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                New password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter new password"
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

            <div>
              <label
                htmlFor="confirm-new-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm new password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="confirm-new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
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

            {message && (
              <p
                role="status"
                className="rounded-xl border border-[#D5EAE0] bg-[#F2FAF5] px-3 py-3 text-xs leading-5 text-[#285C49]"
              >
                {message}
              </p>
            )}

            <motion.button
  type="submit"
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.98 }}
  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#285C49] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#285C49]/15 transition hover:bg-[#214C3C] focus:outline-none focus:ring-4 focus:ring-[#58B99A]/25"
>
  <LockKeyhole size={17} />
  Update Password
  <ArrowRight size={17} />
</motion.button>
          </form>

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
          Your security matters to ORYN.
        </p>
      </motion.section>
    </main>
  );
}
