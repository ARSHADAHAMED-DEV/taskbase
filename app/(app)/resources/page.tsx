"use client";

import Icon from "@/components/icon";

const RESOURCES = [
  {
    id: 1,
    name: "Supabase",
    desc: "Database, Auth, RLS",
    url: "https://supabase.com/dashboard",
  },
  {
    id: 2,
    name: "Stripe",
    desc: "Billing + webhooks",
    url: "https://dashboard.stripe.com",
  },
  {
    id: 3,
    name: "Vercel",
    desc: "Hosting + deploys",
    url: "https://vercel.com/dashboard",
  },
  {
    id: 4,
    name: "GitHub",
    desc: "Source + CI",
    url: "https://github.com",
  },
  {
    id: 5,
    name: "Linear",
    desc: "Issue tracking",
    url: "https://linear.app",
  },
  {
    id: 6,
    name: "Figma",
    desc: "Design files",
    url: "https://figma.com",
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Resources
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          One-click into the tools this project runs on
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RESOURCES.map((r) => (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm transition hover:border-lime-300"
          >
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {r.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {r.desc}
              </p>
            </div>
            <Icon
              name="resources"
              className="h-5 w-5 text-slate-300 transition group-hover:text-lime-500"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
