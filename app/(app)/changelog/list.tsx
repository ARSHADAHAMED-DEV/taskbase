"use client";

import { useState, useTransition } from "react";
import { createChangelogEntry } from "./actions";

type ChangelogEntry = {
  id: string;
  version: string;
  label: string;
  notes: string[];
};

export default function ChangelogList({ entries: initialEntries }: { entries: ChangelogEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [version, setVersion] = useState("");
  const [label, setLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      fd.set("version", version);
      fd.set("label", label);
      fd.set("notes", notes);
      await createChangelogEntry(fd);
      setVersion("");
      setLabel("");
      setNotes("");
    });
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Version
              </label>
              <input
                type="text"
                placeholder="v0.5"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Label
              </label>
              <input
                type="text"
                placeholder="Release label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Notes (one per line)
            </label>
            <textarea
              placeholder="Feature: New dashboard&#10;Fix: Memory leak&#10;Perf: 20% faster queries"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white mt-1 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={pending || !version.trim() || !label.trim() || !notes.trim()}
            className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-lime-300 disabled:opacity-60"
          >
            {pending ? "Adding…" : "+ New entry"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-full px-3 py-1 text-xs font-semibold bg-lime-100 text-lime-800 dark:bg-lime-400/15 dark:text-lime-300">
                {entry.version}
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {entry.label}
              </span>
            </div>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {Array.isArray(entry.notes) &&
                entry.notes.map((note, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-lime-500">•</span>
                    {note}
                  </li>
                ))}
            </ul>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
            No changelog entries yet.
          </p>
        )}
      </div>
    </div>
  );
}
