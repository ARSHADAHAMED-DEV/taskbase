"use client";

const LANES = [
  { id: "now", label: "Now" },
  { id: "next", label: "Next" },
  { id: "later", label: "Later" },
];

const ROADMAP_ITEMS = [
  { id: 1, title: "Multi-tenant auth + RLS", lane: "now" },
  { id: 2, title: "Tasks board", lane: "now" },
  { id: 3, title: "Stripe billing", lane: "now" },
  { id: 4, title: "Team invites + roles", lane: "next" },
  { id: 5, title: "Activity feed", lane: "next" },
  { id: 6, title: "Public API + webhooks", lane: "later" },
  { id: 7, title: "Mobile app", lane: "later" },
];

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Roadmap
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Now / Next / Later — what the sprint is aiming at
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {LANES.map((lane) => (
          <div
            key={lane.id}
            className="rounded-2xl bg-slate-100/70 p-3 dark:bg-slate-900/40"
          >
            <p className="mb-3 px-1 text-sm font-bold text-slate-700 dark:text-slate-200">
              {lane.label}
            </p>
            <div className="space-y-2">
              {ROADMAP_ITEMS.filter((r) => r.lane === lane.id).map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl bg-white p-3 text-sm font-medium text-slate-800 dark:bg-slate-900 dark:text-slate-200 border border-slate-200/70 dark:border-slate-800 shadow-sm"
                >
                  {r.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
