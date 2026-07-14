"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/icon";

interface DashboardProps {
  docs: { id: string; title: string }[];
  tasks: { id: string; title: string; status: string }[];
  bugs: { id: string; title: string; severity: string; status: string }[];
}

export default function Dashboard({ docs, tasks, bugs }: DashboardProps) {
  const sprintDay = Math.min(30, Math.max(1, 5));
  const daysLeft = 30 - sprintDay;
  const tasksCompleted = tasks.filter((t) => t.status === "done").length;
  const openBugs = bugs.filter((b) => b.status !== "Fixed").length;
  const highSevBugs = bugs.filter((b) => b.severity === "High" && b.status !== "Fixed")
    .length;

  const [standup, setStandup] = useState([
    { text: "Finish tasks board drag-drop", done: false },
    { text: "Wire Stripe webhook handler", done: false },
    { text: "Review Gemini's schema notes", done: true },
  ]);

  const [ship, setShip] = useState([
    { text: "Migrations run on staging", done: true },
    { text: "Env vars set in Vercel", done: true },
    { text: "CI is green", done: false },
    { text: "Smoke-test checkout", done: false },
  ]);

  const toggleChecklist = (arr: typeof standup, setArr: any, i: number) => {
    setArr(arr.map((x, j) => (j === i ? { ...x, done: !x.done } : x)));
  };

  const velocity = [3, 5, 2, 6, 4];
  const maxVelocity = Math.max(...velocity);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatTile
              tone="violet"
              label="Sprint progress"
              value={`Day ${sprintDay}`}
              sub={`${daysLeft} days left`}
            />
            <StatTile
              tone="sky"
              label="Tasks completed"
              value={`${tasksCompleted} / ${tasks.length}`}
              sub="+2 today"
            />
            <StatTile
              tone="emerald"
              label="Open bugs"
              value={openBugs.toString()}
              sub={`${highSevBugs} high severity`}
            />
          </div>

          <div className="rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Sprint velocity
              </h2>
              <span className="rounded-full px-3 py-1 text-xs font-semibold bg-lime-100 text-lime-800 dark:bg-lime-400/15 dark:text-lime-300">
                Last 5 days
              </span>
            </div>
            <div className="flex h-40 items-end gap-4">
              {velocity.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center" style={{ height: "120px" }}>
                    <div
                      className="w-8 rounded-t-lg bg-lime-400"
                      style={{ height: `${(v / maxVelocity) * 100}%` }}
                      title={`${v} tasks`}
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    D{sprintDay - 4 + i}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Jump back in
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                ["tasks", "Tasks board", "3 in progress"],
                ["runbooks", "Runbooks", "3 saved"],
                ["commands", "Commands", "6 snippets"],
                ["docs", "Docs", "3 documents"],
              ].map(([icon, name, desc]) => (
                <Link
                  key={icon}
                  href={`/${icon === "tasks" ? "tasks" : icon === "docs" ? "docs" : icon === "runbooks" ? "runbooks" : "commands"}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-lime-300 hover:bg-lime-50/50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                >
                  <span>
                    <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{desc}</span>
                  </span>
                  <Icon name="chevron" className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-slate-900 p-5 text-white dark:bg-lime-400 dark:text-slate-900">
            <p className="text-xs font-semibold opacity-70">Sprint focus</p>
            <p className="mt-2 text-lg font-extrabold leading-snug">
              Ship billing + tasks board by Day 10
            </p>
            <Link
              href="/tasks"
              className="mt-4 block rounded-lg bg-lime-400 px-4 py-2 text-center text-sm font-semibold text-slate-900 dark:bg-slate-900 dark:text-white"
            >
              Open board
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm">
            <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              Today's standup
            </h2>
            <div className="space-y-2">
              {standup.map((s, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer items-center gap-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={s.done}
                    onChange={() => toggleChecklist(standup, setStandup, i)}
                    className="h-4 w-4 accent-lime-500"
                  />
                  <span
                    className={
                      s.done
                        ? "text-slate-400 line-through"
                        : "text-slate-700 dark:text-slate-300"
                    }
                  >
                    {s.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm">
            <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              Ship checklist
            </h2>
            <div className="space-y-2">
              {ship.map((s, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer items-center gap-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={s.done}
                    onChange={() => toggleChecklist(ship, setShip, i)}
                    className="h-4 w-4 accent-lime-500"
                  />
                  <span
                    className={
                      s.done
                        ? "text-slate-400 line-through"
                        : "text-slate-700 dark:text-slate-300"
                    }
                  >
                    {s.text}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-lime-400 transition-all"
                style={{
                  width: `${(ship.filter((s) => s.done).length / ship.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  tone,
  label,
  value,
  sub,
}: {
  tone: "violet" | "sky" | "emerald";
  label: string;
  value: string;
  sub: string;
}) {
  const tones = {
    violet: "bg-violet-100 dark:bg-violet-500/10",
    sky: "bg-sky-100 dark:bg-sky-500/10",
    emerald: "bg-emerald-100 dark:bg-emerald-500/10",
  };

  return (
    <div className={`rounded-2xl p-5 ${tones[tone]}`}>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>
    </div>
  );
}
