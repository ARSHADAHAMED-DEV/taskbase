"use client";

import { useState, useTransition } from "react";
import { createRunbook, updateRunbookSteps } from "./actions";

type Step = {
  text: string;
  done: boolean;
};

type Runbook = {
  id: string;
  title: string;
  slug: string;
  steps: Step[];
};

export default function RunbooksList({ runbooks: initialRunbooks }: { runbooks: Runbook[] }) {
  const [runbooks, setRunbooks] = useState(initialRunbooks);
  const [selectedId, setSelectedId] = useState(runbooks[0]?.id || null);
  const [title, setTitle] = useState("");
  const [pending, startTransition] = useTransition();

  const selected = runbooks.find((r) => r.id === selectedId);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      fd.set("title", title);
      await createRunbook(fd);
      setTitle("");
    });
  }

  async function handleCheckStep(stepIndex: number) {
    if (!selected) return;
    const updated = selected.steps.map((step, i) =>
      i === stepIndex ? { ...step, done: !step.done } : step
    );
    startTransition(async () => {
      await updateRunbookSteps(selected.id, updated);
      setRunbooks((prev) =>
        prev.map((r) =>
          r.id === selected.id ? { ...r, steps: updated } : r
        )
      );
    });
  }

  const doneCount = selected?.steps.filter((s) => s.done).length ?? 0;
  const totalCount = selected?.steps.length ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
      <div className="rounded-2xl bg-white p-2 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm h-fit">
        <form onSubmit={handleCreate} className="mb-3 p-2">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="New runbook title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <button
              type="submit"
              disabled={pending || !title.trim()}
              className="w-full rounded-lg bg-lime-400 px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-lime-300 disabled:opacity-60"
            >
              {pending ? "Adding…" : "+ New"}
            </button>
          </div>
        </form>

        {runbooks.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedId(r.id)}
            className={`block w-full truncate rounded-lg px-3 py-2 text-left text-sm ${
              r.id === selectedId
                ? "bg-lime-100 font-semibold text-lime-800 dark:bg-slate-800 dark:text-lime-300"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"
            }`}
          >
            {r.title}
          </button>
        ))}
      </div>

      {selected && (
        <div className="rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {selected.title}
            </h2>
            <span className="rounded-full px-3 py-1 text-xs font-semibold bg-lime-100 text-lime-800 dark:bg-lime-400/15 dark:text-lime-300">
              {doneCount}/{totalCount} done
            </span>
          </div>
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-lime-400 transition-all"
              style={{
                width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="space-y-2">
            {selected.steps.map((step, i) => (
              <label
                key={i}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800"
              >
                <input
                  type="checkbox"
                  checked={step.done}
                  onChange={() => handleCheckStep(i)}
                  className="h-4 w-4 accent-lime-500"
                />
                <span
                  className={`text-sm ${
                    step.done
                      ? "text-slate-400 line-through"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {i + 1}. {step.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
