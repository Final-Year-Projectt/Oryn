import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, Button, Badge } from "react-bootstrap";
import { GiKnockedOutStars } from "react-icons/gi";
import {
  UserRound,
  Building2,
  Bell,
  BrainCircuit,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  Camera,
  Trash2,
  Mail,
  BriefcaseBusiness,
  LockKeyhole,
  Download,
  Database,
  ChevronRight,
  CircleHelp,
  Sparkles,
  SlidersHorizontal,
  FileJson,
  Clock3,
  Eye,
  AlertTriangle,
} from "lucide-react";

const defaultProfile = {
  name: "Aarav Sharma",
  email: "aarav@novaretail.in",
  jobTitle: "Business Analyst",
  role: "Workspace Admin",
};

const defaultBusiness = {
  name: "Nova Retail Co.",
  industry: "Retail",
  companySize: "51–200",
};

const defaultNotifications = {
  criticalAlerts: true,
  analysisCompletion: true,
  recommendationUpdates: false,
};

const defaultAI = {
  explanationDetail: "Balanced",
  recommendationStyle: "Practical & prioritized",
  alwaysShowEvidence: true,
};

const defaultPrivacy = {
  retention: "12 months",
};

const settingsSections = [
  { id: "profile", label: "Profile", icon: UserRound, description: "Your account details" },
  { id: "business", label: "Business", icon: Building2, description: "Workspace information" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Alerts and updates" },
  { id: "ai-preferences", label: "AI Preferences", icon: BrainCircuit, description: "How ORYN presents insights" },
  { id: "data-privacy", label: "Data & Privacy", icon: ShieldCheck, description: "Data handling preferences" },
];

function SectionTitle({ icon: Icon, title, description, iconTone = "teal" }) {
  const tone = iconTone === "amber"
    ? "bg-amber-50 text-amber-700"
    : "bg-[#E6F6F2] text-[#0D8278]";

  return (
    <div className="flex items-start gap-3 border-b border-[#E5EEE9] pb-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon size={21} />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-bold text-[#19382F] sm:text-lg">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", readOnly = false, hint }) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`mt-2 min-h-11 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:border-[#10998D] focus:ring-4 focus:ring-teal-600/10 ${readOnly ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500" : "border-[#D8E5DC] bg-white text-slate-800 hover:border-[#B7D8CE]"}`}
      />
      {hint && <span className="mt-1.5 block text-xs leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

function SelectField({ label, value, onChange, options, hint }) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="mt-2 min-h-11 w-full rounded-xl border border-[#D8E5DC] bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition hover:border-[#B7D8CE] focus:border-[#10998D] focus:ring-4 focus:ring-teal-600/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {hint && <span className="mt-1.5 block text-xs leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

function PreferenceToggle({ title, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-2 py-3 transition hover:bg-[#F7FBF9]">
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-800">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
      </span>
      <span className="relative inline-flex shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-[#10998D] peer-focus-visible:outline-none peer-focus-visible:ring-4 peer-focus-visible:ring-teal-600/20" />
        <span className="pointer-events-none absolute left-1 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

function SettingsCard({ id, children, className = "" }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.35 }}
      className={`scroll-mt-28 ${className}`}
    >
      <Card className="!overflow-hidden !rounded-2xl !border !border-[#DFEAE4] !bg-white !shadow-sm">
        <Card.Body className="!p-5 sm:!p-6">{children}</Card.Body>
      </Card>
    </motion.section>
  );
}

export default function Settings() {
  const [profile, setProfile] = useState(defaultProfile);
  const [business, setBusiness] = useState(defaultBusiness);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [aiPreferences, setAIPreferences] = useState(defaultAI);
  const [privacy, setPrivacy] = useState(defaultPrivacy);
  const [avatar, setAvatar] = useState("");
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState("");
  const [lastExport, setLastExport] = useState("Never");
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef(null);

  const markChanged = () => {
    setSaved(false);
    setNotice("");
  };

  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
    markChanged();
  };

  const updateBusiness = (field, value) => {
    setBusiness((current) => ({ ...current, [field]: value }));
    markChanged();
  };

  const updateNotification = (field, value) => {
    setNotifications((current) => ({ ...current, [field]: value }));
    markChanged();
  };

  const updateAI = (field, value) => {
    setAIPreferences((current) => ({ ...current, [field]: value }));
    markChanged();
  };

  const updatePrivacy = (field, value) => {
    setPrivacy((current) => ({ ...current, [field]: value }));
    markChanged();
  };

  const handleSectionClick = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Choose an image file to update your preview photo.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setNotice("The preview image must be smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(typeof reader.result === "string" ? reader.result : "");
      markChanged();
      setNotice("Photo preview updated locally. Save settings to confirm this demo state.");
    };
    reader.onerror = () => setNotice("Could not read that image. Please try another file.");
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleReset = () => {
    setProfile(defaultProfile);
    setBusiness(defaultBusiness);
    setNotifications(defaultNotifications);
    setAIPreferences(defaultAI);
    setPrivacy(defaultPrivacy);
    setAvatar("");
    setSaved(false);
    setLastSaved("");
    setNotice("Demo settings have been reset to their defaults.");
  };

  const handleSave = (event) => {
    event.preventDefault();
    setSaved(true);
    setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setNotice("Changes applied to this page session. They are not saved to a server.");
  };

  const handleExport = () => {
    const summary = {
      exportedAt: new Date().toISOString(),
      profile: { ...profile, email: profile.email },
      business,
      notifications,
      aiPreferences,
      privacy,
      security: {
        authentication: "Prototype authentication",
        modelTraining: "Excluded in this UI preview; server enforcement not connected",
      },
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "oryn-settings-summary.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    const time = new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
    setLastExport(time);
    setNotice("Settings summary exported as a JSON file from this browser session.");
  };

  return (
    <div className="min-h-full bg-[#F2F6F4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Page heading */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D8278]">Workspace / Preferences</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#19382F] sm:text-3xl">Settings</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your profile, business workspace, notifications, AI behavior, and data preferences.
            </p>
          </div>

          <motion.span
            whileHover={{ rotateX: 5, rotateY: -5, y: -2, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            style={{ transformStyle: "preserve-3d" }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-white px-3.5 py-2 text-xs font-bold text-amber-800 shadow-sm shadow-amber-900/5"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-amber-700 shadow-sm">
              <Sparkles size={13} />
            </span>
            Prototype settings
          </motion.span>
        </div>

        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className={`mb-5 flex items-start gap-2.5 rounded-xl border p-3.5 text-sm ${saved ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-teal-100 bg-white text-slate-600"}`}
          >
            {saved ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <CircleHelp size={18} className="mt-0.5 shrink-0 text-teal-700" />}
            <span>{notice}</span>
          </motion.div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid items-start gap-5 lg:grid-cols-[235px_minmax(0,1fr)] xl:grid-cols-[255px_minmax(0,1fr)]">
            {/* Settings section navigation */}
            <aside className="lg:sticky lg:top-24">
              <Card className="!rounded-2xl !border !border-[#DFEAE4] !bg-white !shadow-sm">
                <Card.Body className="!p-4">
                  <div className="mb-3 flex items-center gap-2 px-2">
                    <SlidersHorizontal size={17} className="text-teal-700" />
                    <h2 className="text-sm font-bold text-slate-900">Settings sections</h2>
                  </div>
                  <nav aria-label="Settings sections" className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
                    {settingsSections.map((section) => {
                      const Icon = section.icon;
                      const active = activeSection === section.id;
                      return (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => handleSectionClick(section.id)}
                          aria-current={active ? "location" : undefined}
                          className={`group flex min-w-0 items-center gap-2.5 rounded-xl px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/15 ${active ? "bg-[#E9F7F3] text-[#0C746B]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                        >
                          <Icon size={17} className={active ? "shrink-0 text-teal-700" : "shrink-0 text-slate-400 group-hover:text-teal-700"} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">{section.label}</span>
                            <span className={`mt-0.5 hidden text-[11px] leading-4 xl:block ${active ? "text-teal-700/75" : "text-slate-400"}`}>{section.description}</span>
                          </span>
                          <ChevronRight size={15} className={`hidden shrink-0 lg:block ${active ? "text-teal-700" : "text-slate-300"}`} />
                        </button>
                      );
                    })}
                  </nav>

                  <div className="mt-4 rounded-xl border border-teal-100 bg-[#F4FBF8] p-3.5">
                    <div className="flex items-start gap-2">
                      <GiKnockedOutStars size={21} className="mt-0.5 shrink-0 text-teal-700" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">ORYN workspace</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">Settings below are a frontend prototype until connected to the account API.</p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </aside>

            {/* Main settings content */}
            <div className="min-w-0 space-y-4 sm:space-y-5">
              {/* Profile */}
              <SettingsCard id="profile">
                <SectionTitle icon={UserRound} title="Profile" description="Update the personal details shown in your ORYN workspace." />

                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex items-center gap-4 sm:w-[220px] sm:shrink-0 sm:flex-col sm:items-start">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-[#DDF5EF] to-[#F3FBF8] text-teal-800 shadow-sm">
                      {avatar ? (
                        <img src={avatar} alt="Profile preview" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold">{profile.name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "OR"}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">Profile photo</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">JPG, PNG or WebP · max 5 MB</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoChange} className="hidden" />
                        <Button type="button" variant="outline-secondary" onClick={() => fileInputRef.current?.click()} className="!inline-flex !items-center !gap-1.5 !rounded-lg !border-[#CFE2D9] !bg-white !px-3 !py-2 !text-xs !font-semibold !text-[#176F66] hover:!bg-teal-50">
                          <Camera size={14} /> Change
                        </Button>
                        <Button type="button" variant="outline-secondary" onClick={() => { setAvatar(""); markChanged(); }} className="!inline-flex !items-center !gap-1.5 !rounded-lg !border-slate-200 !bg-white !px-3 !py-2 !text-xs !font-semibold !text-slate-600 hover:!bg-slate-50">
                          <Trash2 size={14} /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
                    <Field label="Full name" value={profile.name} onChange={(event) => updateProfile("name", event.target.value)} placeholder="Enter full name" />
                    <Field label="Email address" value={profile.email} onChange={() => {}} type="email" readOnly hint="Account email is read-only in this prototype." />
                    <Field label="Job title" value={profile.jobTitle} onChange={(event) => updateProfile("jobTitle", event.target.value)} placeholder="e.g. Business Analyst" />
                    <Field label="Access role" value={profile.role} onChange={() => {}} readOnly hint="Roles must be enforced by the authentication backend." />
                  </div>
                </div>
              </SettingsCard>

              {/* Notifications + AI preferences */}
              <div className="grid items-start gap-4 xl:grid-cols-2">
                <SettingsCard id="notifications">
                  <SectionTitle icon={Bell} title="Notifications" description="Choose the workspace updates you want to see." />
                  <div className="mt-3 divide-y divide-[#EEF3F0]">
                    <PreferenceToggle title="Critical problem alerts" description="Flag newly detected high-severity issues." checked={notifications.criticalAlerts} onChange={(event) => updateNotification("criticalAlerts", event.target.checked)} />
                    <PreferenceToggle title="Analysis completion" description="Know when an analysis run finishes." checked={notifications.analysisCompletion} onChange={(event) => updateNotification("analysisCompletion", event.target.checked)} />
                    <PreferenceToggle title="Recommendation updates" description="Get notified when suggested actions change." checked={notifications.recommendationUpdates} onChange={(event) => updateNotification("recommendationUpdates", event.target.checked)} />
                  </div>
                </SettingsCard>

                <SettingsCard id="ai-preferences">
                  <SectionTitle icon={BrainCircuit} title="AI Preferences" description="Set how ORYN should present analysis guidance." />
                  <div className="mt-5 space-y-4">
                    <SelectField
                      label="Explanation detail"
                      value={aiPreferences.explanationDetail}
                      onChange={(event) => updateAI("explanationDetail", event.target.value)}
                      options={["Concise", "Balanced", "Detailed"]}
                      hint="Choose how much explanation a response should include."
                    />
                    <SelectField
                      label="Recommendation style"
                      value={aiPreferences.recommendationStyle}
                      onChange={(event) => updateAI("recommendationStyle", event.target.value)}
                      options={["Practical & prioritized", "Evidence-first", "Creative alternatives"]}
                    />
                    <div className="rounded-xl border border-teal-100 bg-[#F4FBF8] p-3.5">
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={aiPreferences.alwaysShowEvidence}
                          onChange={(event) => updateAI("alwaysShowEvidence", event.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#10998D]"
                        />
                        <span>
                          <span className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Eye size={15} className="text-teal-700" /> Always show evidence</span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">Prefer explanations that show the metrics or signals behind a finding.</span>
                        </span>
                      </label>
                    </div>
                  </div>
                </SettingsCard>
              </div>

              {/* Business */}
              <SettingsCard id="business">
                <SectionTitle icon={Building2} title="Business" description="Workspace details used to organize business analysis." />
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <Field label="Business name" value={business.name} onChange={(event) => updateBusiness("name", event.target.value)} placeholder="Business name" />
                  <SelectField label="Industry" value={business.industry} onChange={(event) => updateBusiness("industry", event.target.value)} options={["Retail", "Manufacturing", "Healthcare", "Technology", "Financial services", "Education", "Other"]} />
                  <SelectField label="Company size" value={business.companySize} onChange={(event) => updateBusiness("companySize", event.target.value)} options={["1–10", "11–50", "51–200", "201–500", "501–1,000", "1,000+"]} />
                </div>
              </SettingsCard>

              {/* Data & Privacy */}
              <SettingsCard id="data-privacy">
                <SectionTitle icon={ShieldCheck} title="Data & Privacy" description="Review the privacy-related preferences shown in this prototype." iconTone="teal" />

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-[#FBFDFC] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Database size={19} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">Data retention</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">Select a preferred retention period for future backend configuration.</p>
                        <div className="mt-3 max-w-xs">
                          <SelectField label="Preferred period" value={privacy.retention} onChange={(event) => updatePrivacy("retention", event.target.value)} options={["3 months", "6 months", "12 months", "24 months"]} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-[#FBFDFC] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><LockKeyhole size={19} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">Model training</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge bg="success" className="!rounded-full !bg-emerald-100 !px-2.5 !py-1 !text-xs !font-bold !text-emerald-800">Excluded in preview</Badge>
                          <span className="text-xs text-slate-500">UI label only</span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-500">This label does not enforce a data-processing policy. Server-side controls and privacy terms must be implemented before production use.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><FileJson size={19} /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Settings summary export</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Last export: <span className="font-semibold text-slate-700">{lastExport}</span></p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Downloads the current preferences in this browser as a JSON file.</p>
                    </div>
                  </div>
                  <Button type="button" variant="outline-secondary" onClick={handleExport} className="!inline-flex !shrink-0 !items-center !justify-center !gap-2 !rounded-xl !border-[#CFE2D9] !bg-white !px-4 !py-2.5 !text-sm !font-semibold !text-[#176F66] hover:!bg-teal-50">
                    <Download size={16} /> Export summary
                  </Button>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                  <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-700" />
                  <p className="text-xs leading-5 text-amber-900">
                    <strong>Security note:</strong> these profile and privacy choices currently live only in frontend state. They do not change account permissions, delete stored data, configure model training, or persist after refresh.
                  </p>
                </div>
              </SettingsCard>

              {/* Save actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#DCE8E2] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs leading-5 text-slate-500">
                  <Clock3 size={15} className="shrink-0" />
                  {saved ? `Saved in this session at ${lastSaved}.` : "Changes are applied locally when saved; backend persistence is not connected."}
                </div>
                <div className="flex flex-wrap justify-end gap-3">
                  <Button type="button" variant="outline-secondary" onClick={handleReset} className="!inline-flex !items-center !justify-center !gap-2 !rounded-xl !border-[#CFE0D7] !bg-white !px-4 !py-2.5 !text-sm !font-semibold !text-slate-700 transition hover:!bg-slate-50">
                    <RotateCcw size={16} /> Reset defaults
                  </Button>
                  <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="!inline-flex !min-h-11 !items-center !justify-center !gap-2 !rounded-xl !border-[#0D9488] !bg-[#0D9488] !px-5 !py-2.5 !text-sm !font-bold !text-white !shadow-md !shadow-teal-900/10 transition hover:!border-[#0B7F75] hover:!bg-[#0B7F75] focus-visible:!outline-none focus-visible:!ring-4 focus-visible:!ring-teal-600/20">
                      {saved ? <CheckCircle2 size={17} /> : <Save size={17} />}
                      {saved ? "Saved" : "Save changes"}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
