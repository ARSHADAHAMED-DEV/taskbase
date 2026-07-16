"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
import {
  createChecklist,
  updateChecklistItems,
  deleteChecklist,
  addChecklistItem,
  deleteChecklistItem,
} from "./checklists/actions";

interface Checklist {
  id: string;
  title: string;
  items: Array<{ text: string; done: boolean }>;
}

interface DashboardProps {
  tasks: { id: string; title: string; status: string }[];
  tasksCompleted: number;
  tasksInProgress: number;
  openBugs: number;
  highSevBugs: number;
  commandsCount: number;
  runbooksCount: number;
  docsCount: number;
  checklists: Checklist[];
}

export default function Dashboard({
  tasks,
  tasksCompleted,
  tasksInProgress,
  openBugs,
  highSevBugs,
  commandsCount,
  runbooksCount,
  docsCount,
  checklists: initialChecklists,
}: DashboardProps) {
  const sprintDay = Math.min(30, Math.max(1, 5));
  const daysLeft = 30 - sprintDay;
  const totalTasks = tasks.length;

  const [checklists, setChecklists] = useState(initialChecklists);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newItemText, setNewItemText] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    );
  }, []);

  function handleCheckItem(checklistId: string, itemIndex: number) {
    const updatedChecklists = checklists.map((c) =>
      c.id === checklistId
        ? {
            ...c,
            items: c.items.map((item, i) =>
              i === itemIndex ? { ...item, done: !item.done } : item
            ),
          }
        : c
    );
    setChecklists(updatedChecklists);

    const checklist = updatedChecklists.find((c) => c.id === checklistId);
    if (!checklist) return;

    startTransition(async () => {
      await updateChecklistItems(checklistId, checklist.items);
    });
  }

  function handleCreateChecklist(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newChecklistTitle.trim()) return;

    setNewChecklistTitle("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("title", newChecklistTitle);
      const created = await createChecklist(fd);
      if (created) {
        setChecklists((prev) => [...prev, created as Checklist]);
      }
    });
  }

  function handleDeleteChecklist(checklistId: string) {
    setChecklists((prev) => prev.filter((c) => c.id !== checklistId));
    startTransition(async () => {
      await deleteChecklist(checklistId);
    });
  }

  function handleAddItem(checklistId: string) {
    const text = newItemText[checklistId]?.trim();
    if (!text) return;

    const checklist = checklists.find((c) => c.id === checklistId);
    if (!checklist) return;

    const updatedItems = [...checklist.items, { text, done: false }];

    setChecklists((prev) =>
      prev.map((c) =>
        c.id === checklistId ? { ...c, items: updatedItems } : c
      )
    );

    setNewItemText((prev) => ({ ...prev, [checklistId]: "" }));

    startTransition(async () => {
      await addChecklistItem(checklistId, updatedItems);
    });
  }

  function handleDeleteItem(checklistId: string, itemIndex: number) {
    const checklist = checklists.find((c) => c.id === checklistId);
    if (!checklist) return;

    const updatedItems = checklist.items.filter((_, i) => i !== itemIndex);
    const updatedChecklists = checklists.map((c) =>
      c.id === checklistId ? { ...c, items: updatedItems } : c
    );
    setChecklists(updatedChecklists);

    startTransition(async () => {
      await deleteChecklistItem(checklistId, updatedItems);
    });
  }

  const velocity = [3, 5, 2, 6, 4];
  const maxVelocity = Math.max(...velocity);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {dateStr || "—"}
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
              value={`${tasksCompleted} / ${totalTasks}`}
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
                ["tasks", "Tasks board", `${tasksInProgress} in progress`],
                ["runbooks", "Runbooks", `${runbooksCount} saved`],
                ["commands", "Commands", `${commandsCount} snippet${commandsCount !== 1 ? "s" : ""}`],
                ["docs", "Docs", `${docsCount} document${docsCount !== 1 ? "s" : ""}`],
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

          <form
            onSubmit={handleCreateChecklist}
            className="rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm"
          >
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              New checklist
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="e.g., Release checklist"
                value={newChecklistTitle}
                onChange={(e) => setNewChecklistTitle(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              <button
                type="submit"
                disabled={pending || !newChecklistTitle.trim()}
                className="rounded-lg bg-lime-400 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-lime-300 disabled:opacity-60"
              >
                +
              </button>
            </div>
          </form>

          {checklists.map((checklist) => (
            <div
              key={checklist.id}
              className="rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {checklist.title}
                </h2>
                <button
                  onClick={() => handleDeleteChecklist(checklist.id)}
                  className="text-slate-400 hover:text-rose-500 transition"
                  title="Delete checklist"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                {checklist.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center gap-3 text-sm group"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleCheckItem(checklist.id, i)}
                      className="h-4 w-4 accent-lime-500"
                    />
                    <span
                      className={
                        item.done
                          ? "flex-1 text-slate-400 line-through"
                          : "flex-1 text-slate-700 dark:text-slate-300"
                      }
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() => handleDeleteItem(checklist.id, i)}
                      className="text-slate-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
                      title="Delete item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddItem(checklist.id);
                }}
                className="mt-3 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Add item..."
                  value={newItemText[checklist.id] || ""}
                  onChange={(e) =>
                    setNewItemText({ ...newItemText, [checklist.id]: e.target.value })
                  }
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!newItemText[checklist.id]?.trim()}
                  className="rounded-lg bg-lime-400 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-lime-300 disabled:opacity-60"
                >
                  +
                </button>
              </form>
              {checklist.items.length > 0 && (
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full bg-lime-400 transition-all"
                    style={{
                      width: `${(checklist.items.filter((i) => i.done).length / checklist.items.length) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          ))}

          {checklists.length === 0 && (
            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No checklists yet. Create one to get started.
              </p>
            </div>
          )}
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
