"use client";

import { useState, useTransition } from "react";
import { createBug, updateBugStatus } from "./actions";

type Bug = {
  id: string;
  title: string;
  severity: string;
  status: string;
  created_at: string;
};

const SEVERITY_STYLES: Record<string, string> = {
  Low: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  Med: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  High: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200",
};

const STATUS_STYLES: Record<string, string> = {
  Open: "text-slate-600 dark:text-slate-300",
  "In progress": "text-amber-600 dark:text-amber-300",
  Fixed: "text-emerald-600 dark:text-emerald-300",
};

export default function BugsList({ bugs: initialBugs }: { bugs: Bug[] }) {
  const [bugs, setBugs] = useState(initialBugs);
  const [title, setTitle] = useState("");
  const [pending, startTransition] = useTransition();
  const [statusPending, setStatusPending] = useState<string | null>(null);

  function handleCreateBug(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      fd.set("title", title);
      await createBug(fd);
      setTitle("");
    });
  }

  function handleStatusClick(bugId: string, currentStatus: string) {
    setStatusPending(bugId);
    startTransition(async () => {
      await updateBugStatus(bugId, currentStatus);
      const statuses = ["Open", "In progress", "Fixed"];
      const idx = statuses.indexOf(currentStatus);
      const nextStatus = statuses[(idx + 1) % statuses.length];
      setBugs((prev) =>
        prev.map((b) => (b.id === bugId ? { ...b, status: nextStatus } : b))
      );
      setStatusPending(null);
    });
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleCreateBug}
        className="flex gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
      >
        <input
          type="text"
          placeholder="Bug title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-white"
        />
        <button
          type="submit"
          disabled={pending || !title.trim()}
          className="rounded-lg bg-lime-400 px-4 py-1.5 text-sm font-semibold text-slate-900 transition hover:bg-lime-300 disabled:opacity-60"
        >
          {pending ? "Adding…" : "+ New bug"}
        </button>
      </form>

      <div className="space-y-2">
        {bugs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700">
            No bugs yet.
          </p>
        ) : (
          bugs.map((bug) => (
            <div
              key={bug.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-white truncate">
                  {bug.title}
                </p>
              </div>
              <div className="ml-3 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                    SEVERITY_STYLES[bug.severity] ?? SEVERITY_STYLES.Med
                  }`}
                >
                  {bug.severity}
                </span>
                <button
                  onClick={() => handleStatusClick(bug.id, bug.status)}
                  disabled={statusPending === bug.id}
                  className={`rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium transition dark:border-slate-600 ${
                    STATUS_STYLES[bug.status] ?? ""
                  } hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-60`}
                >
                  {statusPending === bug.id ? "…" : bug.status}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
