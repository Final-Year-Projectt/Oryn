
import { useState } from "react";
import {
  Settings as SettingsIcon,
  UserRound,
  Bell,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "Demo User",
    email: "demo@oryn.com",
    company: "My Business",
  });

  const [notifications, setNotifications] = useState({
    analysis: true,
    recommendations: true,
    updates: false,
  });

  const [saved, setSaved] = useState(false);

  const updateProfile = (field, value) => {
    setProfile((previous) => ({ ...previous, [field]: value }));
    setSaved(false);
  };

  const toggleNotification = (field) => {
    setNotifications((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setSaved(true);
  };

  const handleReset = () => {
    setProfile({
      name: "Demo User",
      email: "demo@oryn.com",
      company: "My Business",
    });
    setNotifications({
      analysis: true,
      recommendations: true,
      updates: false,
    });
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-[#F3F7F4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0D9488]">
          Workspace / Preferences
        </p>

        <div className="mt-2">
          <h1 className="text-2xl font-bold text-[#19382F] sm:text-3xl">
            Settings
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your demo profile and notification preferences.
          </p>
        </div>

        {saved && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#C9E6D7] bg-[#EAF7EF] p-4 text-sm text-[#285C49]">
            <CheckCircle2 size={19} />
            Settings saved for this page session.
          </div>
        )}

        <form onSubmit={handleSave} className="mt-7 space-y-6">
          <section className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-3 border-b border-[#E2ECE6] pb-5">
              <div className="rounded-xl bg-[#E1F5EB] p-3 text-[#16866B]">
                <UserRound size={22} />
              </div>
              <div>
                <h2 className="font-semibold text-[#19382F]">
                  Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and edit your demo profile.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-600">
                  Full Name
                </span>
                <input
                  value={profile.name}
                  onChange={(event) =>
                    updateProfile("name", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[#D8E5DC] px-4 py-3 text-sm outline-none focus:border-[#16866B]"
                  placeholder="Enter your name"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-600">
                  Email Address
                </span>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-[#D8E5DC] bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-gray-600">
                  Business Name
                </span>
                <input
                  value={profile.company}
                  onChange={(event) =>
                    updateProfile("company", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[#D8E5DC] px-4 py-3 text-sm outline-none focus:border-[#16866B]"
                  placeholder="Enter your business name"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-3 border-b border-[#E2ECE6] pb-5">
              <div className="rounded-xl bg-[#E1F5EB] p-3 text-[#16866B]">
                <Bell size={22} />
              </div>
              <div>
                <h2 className="font-semibold text-[#19382F]">
                  Notification Preferences
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Choose which updates you want to receive.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              {[
                {
                  key: "analysis",
                  title: "Analysis Updates",
                  description: "Notifications about completed business analyses.",
                },
                {
                  key: "recommendations",
                  title: "New Recommendations",
                  description: "Updates when new solutions become available.",
                },
                {
                  key: "updates",
                  title: "Product Updates",
                  description: "Announcements about new ORYN features.",
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex cursor-pointer items-center justify-between gap-4"
                >
                  <span>
                    <span className="block text-sm font-medium text-[#19382F]">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-gray-500">
                      {item.description}
                    </span>
                  </span>

                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={() => toggleNotification(item.key)}
                    className="h-5 w-5 shrink-0 accent-[#16866B]"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#E1F5EB] p-3 text-[#16866B]">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="font-semibold text-[#19382F]">
                  Security & Access
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  You are currently using ORYN prototype authentication.
                  Profile changes and preferences are not saved to a backend.
                </p>
                <span className="mt-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Demo Authentication
                </span>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 rounded-xl border border-[#D8E5DC] bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#285C49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E4939]"
            >
              <Save size={17} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
