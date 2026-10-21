import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, Button } from "react-bootstrap";
import {
  UserRound,
  Mail,
  BriefcaseBusiness,
  Building2,
  ShieldCheck,
  BellRing,
  Settings2,
  ArrowRight,
  Save,
  RotateCcw,
  CheckCircle2,
  LockKeyhole,
  BadgeCheck,
  Activity,
} from "lucide-react";

const STORAGE_KEY = "oryn-profile";

const defaultProfile = {
  fullName: "ORYN User",
  email: "demo@oryn.com",
  jobTitle: "Business Analyst",
  businessName: "My Business",
  industry: "Retail",
  role: "Workspace Admin",
};

function readStoredProfile() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

function getInitials(name = "ORYN User") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "OU";
}

function Field({ label, icon: Icon, value, onChange, readOnly = false, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <span className={`flex min-h-12 items-center gap-3 rounded-xl border px-3.5 transition focus-within:border-[#0D9488] focus-within:ring-4 focus-within:ring-teal-600/10 ${readOnly ? "border-slate-200 bg-slate-50" : "border-[#D8E5DC] bg-white"}`}>
        <Icon size={17} className="shrink-0 text-slate-400" />
        <input
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          className="w-full min-w-0 bg-transparent py-3 text-sm text-slate-800 outline-none read-only:cursor-not-allowed"
        />
        {readOnly && <LockKeyhole size={15} className="shrink-0 text-slate-400" />}
      </span>
      {hint && <span className="mt-1.5 block text-xs leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(readStoredProfile);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");

  const initials = useMemo(() => getInitials(profile.fullName), [profile.fullName]);

  useEffect(() => {
    const syncProfile = () => setProfile(readStoredProfile());
    window.addEventListener("oryn-profile-updated", syncProfile);
    return () => window.removeEventListener("oryn-profile-updated", syncProfile);
  }, []);

  const updateField = (field, value) => {
    setProfile((previous) => ({ ...previous, [field]: value }));
    setSaved(false);
    setNotice("");
  };

  const handleSave = (event) => {
    event.preventDefault();
    const cleanProfile = {
      ...profile,
      fullName: profile.fullName.trim() || defaultProfile.fullName,
      jobTitle: profile.jobTitle.trim(),
      businessName: profile.businessName.trim(),
      industry: profile.industry.trim(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanProfile));
      setProfile(cleanProfile);
      setSaved(true);
      setNotice("Profile saved in this browser for the prototype.");
      window.dispatchEvent(new CustomEvent("oryn-profile-updated", { detail: cleanProfile }));
    } catch {
      setSaved(false);
      setNotice("Your browser could not save the profile locally. Please check storage permissions.");
    }
  };

  const handleReset = () => {
    setProfile(defaultProfile);
    setSaved(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
      window.dispatchEvent(new CustomEvent("oryn-profile-updated", { detail: defaultProfile }));
      setNotice("Profile reset to the demo defaults.");
    } catch {
      setNotice("Profile reset on this page, but the browser could not persist the change.");
    }
  };

  return (
    <div className="min-h-full bg-[#F3F8F6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Workspace / Account</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#19382F] sm:text-3xl">My Profile</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Manage your account details and review your workspace access.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Demo account
          </span>
        </motion.div>

        {notice && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} role="status" className={`mb-5 flex items-start gap-2 rounded-xl border p-3.5 text-sm ${saved ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-teal-100 bg-white text-slate-700"}`}>
            {saved && <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
            {notice}
          </motion.div>
        )}

        <div className="grid items-start gap-5 lg:grid-cols-[310px_minmax(0,1fr)]">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="space-y-5">
            <Card className="overflow-hidden rounded-3xl border border-[#DFEBE5] shadow-sm">
              <div className="h-24 bg-gradient-to-r from-[#DDF5EF] via-[#EAF8F5] to-[#CDEBE4]" />
              <Card.Body className="px-5 pb-6 pt-0">
                <div className="-mt-11 flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-[#0D9488] text-2xl font-bold text-white shadow-md">
                  {initials}
                </div>
                <h2 className="mt-4 break-words text-xl font-bold text-slate-900">{profile.fullName || "ORYN User"}</h2>
                <p className="mt-1 break-all text-sm text-slate-500">{profile.email}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">
                  <BadgeCheck size={15} /> {profile.role}
                </span>
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Workspace</p>
                  <div className="mt-4 flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF8F5] text-teal-700"><Building2 size={19} /></span>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-slate-800">{profile.businessName || "Business not set"}</p>
                      <p className="mt-1 text-xs text-slate-500">{profile.industry || "Industry not set"}</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="rounded-2xl border border-teal-100 bg-gradient-to-br from-[#E7F8F3] to-white shadow-sm">
              <Card.Body className="p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm"><ShieldCheck size={20} /></span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Account security</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-600">This prototype uses demo authentication. Passwords and roles are not managed from this profile screen.</p>
                    <Button type="button" variant="link" onClick={() => navigate("/dashboard/settings")} className="mt-2 inline-flex items-center gap-1 p-0 text-sm font-bold text-teal-800 no-underline hover:text-teal-600">
                      Open settings <ArrowRight size={15} />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>

          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <Card className="rounded-3xl border border-[#DFEBE5] shadow-sm">
                <Card.Body className="p-5 sm:p-7">
                  <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2"><UserRound size={19} className="text-teal-700" /><h2 className="text-lg font-bold text-slate-900">Personal information</h2></div>
                      <p className="mt-1.5 text-sm text-slate-500">Keep your account details current.</p>
                    </div>
                    <span className="w-fit rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">Email is read-only in demo</span>
                  </div>

                  <form onSubmit={handleSave} className="mt-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Full name" icon={UserRound} value={profile.fullName} onChange={(value) => updateField("fullName", value)} />
                      <Field label="Email address" icon={Mail} value={profile.email} readOnly hint="Change email will require authenticated account settings." />
                      <Field label="Job title" icon={BriefcaseBusiness} value={profile.jobTitle} onChange={(value) => updateField("jobTitle", value)} />
                      <Field label="Business name" icon={Building2} value={profile.businessName} onChange={(value) => updateField("businessName", value)} />
                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">Industry</span>
                        <select value={profile.industry} onChange={(event) => updateField("industry", event.target.value)} className="min-h-12 w-full rounded-xl border border-[#D8E5DC] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0D9488] focus:ring-4 focus:ring-teal-600/10">
                          <option>Retail</option><option>E-commerce</option><option>Manufacturing</option><option>Healthcare</option><option>Education</option><option>Financial services</option><option>Other</option>
                        </select>
                      </label>
                    </div>
                    <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                      <Button type="button" variant="outline-secondary" onClick={handleReset} className="inline-flex items-center gap-2 rounded-xl border-slate-300 px-4 py-2.5 text-sm font-semibold">
                        <RotateCcw size={16} /> Reset defaults
                      </Button>
                      <Button type="submit" className="inline-flex items-center gap-2 rounded-xl border-0 bg-[#0D9488] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B7F75] focus-visible:ring-4 focus-visible:ring-teal-600/20">
                        <Save size={16} /> Save profile
                      </Button>
                    </div>
                  </form>
                </Card.Body>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="grid gap-5 sm:grid-cols-2">
              <Card className="rounded-2xl border border-[#DFEBE5] shadow-sm">
                <Card.Body className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Activity size={20} /></div>
                  <h3 className="mt-4 font-bold text-slate-900">Workspace activity</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Review previous uploads, analyses, and decision records in your activity history.</p>
                  <Button type="button" variant="link" onClick={() => navigate("/dashboard/history")} className="mt-3 inline-flex items-center gap-1 p-0 text-sm font-bold text-teal-800 no-underline hover:text-teal-600">View history <ArrowRight size={15} /></Button>
                </Card.Body>
              </Card>
              <Card className="rounded-2xl border border-[#DFEBE5] shadow-sm">
                <Card.Body className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><BellRing size={20} /></div>
                  <h3 className="mt-4 font-bold text-slate-900">Notification preferences</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Choose which analysis updates and recommendation alerts you want to see.</p>
                  <Button type="button" variant="link" onClick={() => navigate("/dashboard/settings")} className="mt-3 inline-flex items-center gap-1 p-0 text-sm font-bold text-teal-800 no-underline hover:text-teal-600">Manage settings <ArrowRight size={15} /></Button>
                </Card.Body>
              </Card>
            </motion.div>

            <p className="flex items-start gap-2 text-xs leading-5 text-slate-400"><ShieldCheck size={15} className="mt-0.5 shrink-0" /> Prototype notice: profile edits are saved to this browser only. Production account changes must be verified and persisted by the backend.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
