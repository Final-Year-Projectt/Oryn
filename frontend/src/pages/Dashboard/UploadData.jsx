import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  UploadCloud,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ALLOWED_EXTENSIONS = [".csv", ".xlsx", ".xls"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const cardMotion = {
  whileHover: {
    y: -3,
    boxShadow: "0 14px 32px rgba(25, 56, 47, 0.08)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  whileTap: {
    scale: 0.99,
    transition: { duration: 0.12 },
  },
};

export default function UploadData() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile) => {
    setError("");
    setNotice("");

    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    const isValidType = ALLOWED_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!isValidType) {
      setFile(null);
      setError("Unsupported file type. Please select a CSV, XLSX, or XLS file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("This file is larger than 10 MB. Please choose a smaller file.");
      return;
    }

    if (selectedFile.size === 0) {
      setFile(null);
      setError("The selected file is empty. Please choose another file.");
      return;
    }

    setFile(selectedFile);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const clearSelection = () => {
    setFile(null);
    setError("");
    setNotice("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleContinue = () => {
    if (!file) return;
    setError("");
    setNotice(
      "Your file is selected and ready. Uploading and data validation will be available after backend integration."
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F7F4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-7">
        <motion.button
          type="button"
          onClick={() => navigate("/dashboard")}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-lg text-sm font-medium text-gray-500 transition-colors hover:text-[#145C46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16866B] focus-visible:ring-offset-2"
        >
          <ArrowLeft size={17} />
          Back to Overview
        </motion.button>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0D9488]">
            Workspace / Data Management
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#19382F] sm:text-3xl">
            Upload Business Data
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Add a business dataset to prepare it for validation and analysis.
          </p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
          {...cardMotion}
          className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm transition-colors sm:p-8"
        >
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-xl bg-[#E1F5EB] p-3 text-[#16866B]">
              <FileCheck2 size={22} />
            </div>
            <div>
              <h2 className="font-semibold text-[#19382F]">Select your dataset</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Upload a spreadsheet or CSV file. Your file will be checked for
                supported format and size before proceeding.
              </p>
            </div>
          </div>

          <motion.div
            role="button"
            tabIndex={0}
            aria-label="Choose or drop a CSV or Excel dataset"
            onClick={openFilePicker}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openFilePicker();
              }
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsDragging(false);
              }
            }}
            onDrop={handleDrop}
            animate={{
              backgroundColor: isDragging ? "#EAF7EF" : "#F8FCF9",
              borderColor: isDragging ? "#16866B" : "#B8D9C8",
              scale: isDragging ? 1.005 : 1,
            }}
            whileHover={{
              borderColor: "#16866B",
              backgroundColor: "#F0F9F3",
              transition: { duration: 0.18 },
            }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.18 }}
            className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-10 text-center outline-none focus-visible:ring-2 focus-visible:ring-[#16866B] focus-visible:ring-offset-2 sm:py-12"
          >
            <motion.div
              animate={{ y: isDragging ? -4 : 0, scale: isDragging ? 1.06 : 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className="mb-4 rounded-2xl bg-[#E1F5EB] p-4 text-[#16866B] transition-colors group-hover:bg-[#D5F0E2]"
            >
              <UploadCloud size={32} />
            </motion.div>
            <p className="font-semibold text-[#19382F]">
              {isDragging ? "Drop your dataset here" : "Click to browse your files"}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Or drag and drop your dataset here
            </p>
            <span className="mt-4 rounded-lg bg-[#E1F5EB] px-4 py-2 text-sm font-semibold text-[#145C46] transition-colors group-hover:bg-[#D5F0E2]">
              Choose File
            </span>
            <p className="mt-4 text-xs text-gray-400">
              CSV, XLSX or XLS · Maximum file size 10 MB
            </p>
          </motion.div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(event) => {
              handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                transition={{ duration: 0.2 }}
                role="alert"
                className="mt-4 flex items-start gap-2 overflow-hidden rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {notice && (
              <motion.div
                key="notice"
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                transition={{ duration: 0.2 }}
                role="status"
                className="mt-4 flex items-start gap-2 overflow-hidden rounded-xl border border-[#C9E6D7] bg-[#EAF7EF] p-3 text-sm text-[#285C49]"
              >
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <span>{notice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {file && (
              <motion.div
                key={`${file.name}-${file.size}-${file.lastModified}`}
                initial={{ opacity: 0, y: 10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.985 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                {...cardMotion}
                className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-[#C9E6D7] bg-[#F5FBF7] p-4 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <motion.div
                    initial={{ rotate: -8, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    className="shrink-0 rounded-xl bg-[#E1F5EB] p-3 text-[#16866B]"
                  >
                    <FileSpreadsheet size={23} />
                  </motion.div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#19382F]">
                      {file.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatSize(file.size)} · Ready to continue
                    </p>
                  </div>
                  <CheckCircle2 size={19} className="shrink-0 text-[#16866B]" />
                </div>

                <motion.button
                  type="button"
                  onClick={clearSelection}
                  whileHover={{ y: -1, borderColor: "#FCA5A5", color: "#B91C1C" }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16866B]"
                >
                  <X size={16} />
                  Remove
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            {...cardMotion}
            className="mt-6 rounded-xl border border-[#E8EFEA] bg-[#F7FAF8] p-4 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white p-2 text-[#16866B] shadow-sm">
                <ShieldCheck size={19} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#19382F]">
                  Before you continue
                </h3>
                <ul className="mt-2 space-y-2 text-sm leading-5 text-gray-500">
                  <li>Ensure your dataset includes clear column headers.</li>
                  <li>Remove unnecessary rows and duplicate records where possible.</li>
                  <li>Avoid uploading confidential or personally identifiable information.</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <motion.button
              type="button"
              onClick={clearSelection}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl border border-[#D8E5DC] px-5 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16866B] focus-visible:ring-offset-2"
            >
              Clear
            </motion.button>

            <motion.button
              type="button"
              disabled={!file}
              onClick={handleContinue}
              whileHover={file ? { y: -2, boxShadow: "0 8px 18px rgba(40, 92, 73, 0.18)" } : undefined}
              whileTap={file ? { scale: 0.98 } : undefined}
              className="rounded-xl bg-[#285C49] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E4939] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16866B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue to Validation
            </motion.button>
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-gray-400">
            Preview mode: file selection and client-side checks work now. Actual
            upload and validation will be connected to the backend later.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
