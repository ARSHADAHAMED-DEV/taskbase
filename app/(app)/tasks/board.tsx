"use client";

import { useState, useTransition } from "react";
import Icon from "@/components/icon";
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

const PRI_LABEL: Record<string, string> = { low: "Low", med: "Med", high: "High" };
const PRI_CLASS: Record<string, string> = { low: "p-low", med: "p-med", high: "p-high" };

export default function TaskBoard({
  columns,
  tasks,
}: {
  columns: readonly Column[];
  tasks: Task[];
}) {
  const [items, setItems] = useState(tasks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [addingCol, setAddingCol] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [, startUpdate] = useTransition();

  function onDrop(status: string) {
    if (!dragId) {
      setOver(null);
      return;
    }
    const id = dragId;
    setDragId(null);
    setOver(null);
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    startUpdate(async () => {
      await updateTaskStatus(id, status);
    });
  }

  function handleAddTask(status: string, title: string) {
    const trimmed = title.trim();
    setAddingCol(null);
    setNewTitle("");
    if (!trimmed) return;
    startUpdate(async () => {
      const created = await createTask(trimmed, status, "med", null);
      if (created) setItems((prev) => [...prev, created as Task]);
    });
  }

  return (
    <div className="board">
      {columns.map((col) => {
        const list = items.filter((t) => t.status === col.key);
        return (
          <section
            key={col.key}
            className={"col " + (over === col.key && dragId ? "over" : "")}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(col.key);
            }}
            onDragLeave={() => setOver((c) => (c === col.key ? null : c))}
            onDrop={() => onDrop(col.key)}
          >
            <div className="col-head">
              <div className="l">
                <h4>{col.label}</h4>
                <span className="count">{list.length}</span>
              </div>
              <button className="iconbtn" onClick={() => setAddingCol(col.key)}>
                <Icon name="plus" size={13} />
              </button>
            </div>
            <div className="col-body">
              {addingCol === col.key && (
                <div className="tcard p-med" style={{ cursor: "default" }}>
                  <textarea
                    autoFocus
                    rows={2}
                    placeholder="Task title, then Enter"
                    style={{
                      width: "100%",
                      border: 0,
                      background: "transparent",
                      resize: "none",
                      outline: "none",
                      fontFamily: "var(--display)",
                      fontWeight: 500,
                      fontSize: 13,
                      color: "var(--ink)",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddTask(col.key, (e.target as HTMLTextAreaElement).value);
                      }
                      if (e.key === "Escape") {
                        setAddingCol(null);
                        setNewTitle("");
                      }
                    }}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={(e) => handleAddTask(col.key, e.target.value)}
                    value={newTitle}
                  />
                </div>
              )}
              {list.map((task) => (
                <article
                  key={task.id}
                  draggable
                  className={
                    "tcard " +
                    (PRI_CLASS[task.priority] ?? "p-med") +
                    (dragId === task.id ? " drag" : "")
                  }
                  onDragStart={() => setDragId(task.id)}
                  onDragEnd={() => {
                    setDragId(null);
                    setOver(null);
                  }}
                >
                  <div className="top">
                    <span className="glyph">#{(task.tag ?? "new").slice(0, 3)}</span>
                    <button
                      className={"tick " + (task.status === "done" ? "on" : "")}
                      onClick={() => {
                        const next = task.status === "done" ? "doing" : "done";
                        setItems((prev) =>
                          prev.map((x) => (x.id === task.id ? { ...x, status: next } : x))
                        );
                        startUpdate(async () => {
                          await updateTaskStatus(task.id, next);
                        });
                      }}
                    >
                      <Icon name="check" size={11} />
                    </button>
                  </div>
                  <h5>{task.title}</h5>
                  <div className="meta">
                    {task.tag && <span className="tag">#{task.tag}</span>}
                    <span className="tag">{PRI_LABEL[task.priority] ?? "Med"}</span>
                  </div>
                </article>
              ))}
              {!list.length && addingCol !== col.key && (
                <button className="emptycol" onClick={() => setAddingCol(col.key)}>
                  Add the first task
                </button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
