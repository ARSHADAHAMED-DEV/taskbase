"use client";

import { useState } from "react";
import Icon from "@/components/icon";

const RUNBOOKS = [
  {
    id: 1,
    title: "Deploy to production",
    steps: [
      "Merge to main, CI green",
      "Run pending migrations",
      "Set env vars in Vercel",
      "Promote build to production",
      "Smoke-test signup + checkout",
    ],
  },
  {
    id: 2,
    title: "Test Stripe subscription states",
    steps: [
      "Start `stripe listen`",
      "Trigger subscription.created",
      "Verify row flips to active",
      "Repeat for past_due + canceled",
      "Revert test data",
    ],
  },
  {
    id: 3,
    title: "Rotate Supabase service key",
    steps: [
      "Generate new key in dashboard",
      "Update Vercel + local .env",
      "Redeploy",
      "Invalidate the old key",
    ],
  },
];

export default function RunbooksPage() {
  const [sel, setSel] = useState(RUNBOOKS[0].id);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const r = RUNBOOKS.find((x) => x.id === sel)!;
  const key = (i: number) => `${sel}:${i}`;
  const doneCount = r.steps.filter((_, i) => checks[key(i)]).length;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Runbooks
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Turn an SOP into a checklist you tick through
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
        <div className="rounded-2xl bg-white p-2 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm h-fit">
          {RUNBOOKS.map((x) => (
            <button
              key={x.id}
              onClick={() => setSel(x.id)}
              className={`block w-full truncate rounded-lg px-3 py-2 text-left text-sm ${
                x.id === sel
                  ? "bg-lime-100 font-semibold text-lime-800 dark:bg-slate-800 dark:text-lime-300"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"
              }`}
            >
              {x.title}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {r.title}
            </h2>
            <span className="rounded-full px-3 py-1 text-xs font-semibold bg-lime-100 text-lime-800 dark:bg-lime-400/15 dark:text-lime-300">
              {doneCount}/{r.steps.length} done
            </span>
          </div>
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-lime-400 transition-all"
              style={{ width: `${(doneCount / r.steps.length) * 100}%` }}
            />
          </div>
          <div className="space-y-2">
            {r.steps.map((s, i) => (
              <label
                key={i}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800"
              >
                <input
                  type="checkbox"
                  checked={!!checks[key(i)]}
                  onChange={() =>
                    setChecks({ ...checks, [key(i)]: !checks[key(i)] })
                  }
                  className="h-4 w-4 accent-lime-500"
                />
                <span
                  className={`text-sm ${
                    checks[key(i)]
                      ? "text-slate-400 line-through"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {i + 1}. {s}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
