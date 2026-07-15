"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateTaskStatus, createTask } from "./actions";

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
  const router = useRouter();
  const [items, setItems] = useState(tasks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [addingCol, setAddingCol] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("med");
  const [newTag, setNewTag] = useState("");
  const [, startUpdate] = useTransition();

  // Keep local state in sync with fresh server data after router.refresh()
  useEffect(() => {
    setItems(tasks);
  }, [tasks]);

  function onDrop(status: string) {
    if (!dragId) return;
    const id = dragId;
    setDragId(null);
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    startUpdate(async () => {
      await updateTaskStatus(id, status);
    });
  }

  function resetForm() {
    setAddingCol(null);
    setNewTitle("");
    setNewPriority("med");
    setNewTag("");
  }

  function handleAddTask(status: string) {
    const title = newTitle.trim();
    if (!title) return;
    const priority = newPriority;
    const tag = newTag.trim() || null;
    resetForm();
    startUpdate(async () => {
      await createTask(title, status, priority, tag);
      router.refresh();
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

          {addingCol === col.key ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTask(col.key);
              }}
              className="mt-2 space-y-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-600 dark:bg-slate-800"
            >
              <input
                autoFocus
                type="text"
                placeholder="Task title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-lime-400 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              />
              <div className="flex gap-2">
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-lime-400 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                >
                  <option value="low">low</option>
                  <option value="med">med</option>
                  <option value="high">high</option>
                </select>
                <input
                  type="text"
                  placeholder="tag (optional)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-lime-400 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="rounded-md bg-lime-400 px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-lime-300 disabled:opacity-60"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setAddingCol(col.key)}
              className="mt-2 w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-lime-400 hover:text-lime-600 dark:border-slate-600 dark:text-slate-400 dark:hover:border-lime-400 dark:hover:text-lime-400"
            >
              + Add task
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
