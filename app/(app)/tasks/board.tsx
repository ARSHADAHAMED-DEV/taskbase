"use client";

import { useState, useTransition } from "react";
import { updateTaskStatus } from "./actions";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  tag: string | null;
  position: number;
};
type Column = { key: string; label: string };

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  med: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  high: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200",
};

export default function TaskBoard({
  columns,
  tasks,
}: {
  columns: readonly Column[];
  tasks: Task[];
}) {
  const [items, setItems] = useState(tasks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [, startUpdate] = useTransition();

  function onDrop(status: string) {
    if (!dragId) return;
    const id = dragId;
    setDragId(null);
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    startUpdate(async () => {
      await updateTaskStatus(id, status);
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {columns.map((col) => (
        <div
          key={col.key}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(col.key)}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {col.label}
          </h2>
          <div className="space-y-2">
            {items
              .filter((t) => t.status === col.key)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => setDragId(task.id)}
                  className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing dark:border-slate-600 dark:bg-slate-800"
                >
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    {task.title}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.med
                      }`}
                    >
                      {task.priority}
                    </span>
                    {task.tag && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        #{task.tag}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
