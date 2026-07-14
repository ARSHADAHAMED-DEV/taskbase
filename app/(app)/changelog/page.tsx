"use client";

const CHANGELOG_ITEMS = [
  {
    id: 1,
    date: "Day 5",
    version: "v0.4",
    notes: ["Kanban board shipped", "Command palette added"],
  },
  {
    id: 2,
    date: "Day 3",
    version: "v0.3",
    notes: ["Supabase Auth wired up", "RLS policies for tenants"],
  },
  {
    id: 3,
    date: "Day 1",
    version: "v0.1",
    notes: ["Repo scaffolded", "First schema migration"],
  },
];

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Changelog
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Dated release notes across the sprint
        </p>
      </div>

      <div className="space-y-4">
        {CHANGELOG_ITEMS.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-full px-3 py-1 text-xs font-semibold bg-lime-100 text-lime-800 dark:bg-lime-400/15 dark:text-lime-300">
                {c.version}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {c.date}
              </span>
            </div>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {c.notes.map((n, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-lime-500">•</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
