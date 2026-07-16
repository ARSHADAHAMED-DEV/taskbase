"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
import PageHead from "@/components/page-head";
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

const COLS = [
  { key: "backlog", label: "Backlog", color: "#a1a1aa" },
  { key: "doing", label: "In Progress", color: "#f97316" },
  { key: "review", label: "Review", color: "#8b5cf6" },
  { key: "done", label: "Done", color: "#0ea5e9" },
];

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const pt = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const a0 = (from / 100) * 2 * Math.PI - Math.PI / 2;
  const a1 = (to / 100) * 2 * Math.PI - Math.PI / 2;
  const [x0, y0] = pt(a0);
  const [x1, y1] = pt(a1);
  return `M${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${
    to - from > 50 ? 1 : 0
  } 1 ${x1.toFixed(2)},${y1.toFixed(2)}`;
}

function Donut({ segs }: { segs: { k: string; v: number; c: string }[] }) {
  const total = segs.reduce((s, x) => s + x.v, 0) || 1;
  let acc = 0;
  return (
    <div className="donut">
      <svg viewBox="0 0 180 180" width="164" height="164">
        <circle cx="90" cy="90" r="66" fill="none" stroke="var(--sunk)" strokeWidth="22" />
        {segs.map((s, i) => {
          if (!s.v) return null;
          const from = (acc / total) * 100;
          acc += s.v;
          const to = (acc / total) * 100;
          if (to - from >= 99.9)
            return (
              <circle key={i} cx="90" cy="90" r="66" fill="none" stroke={s.c} strokeWidth="22" />
            );
          return (
            <path
              key={i}
              d={arcPath(90, 90, 66, from + 0.7, to - 0.7)}
              fill="none"
              stroke={s.c}
              strokeWidth="22"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="legend">
        {segs.map((s, i) => (
          <span key={i}>
            <i style={{ background: s.c }} />
            {s.k}: <b>{s.v}</b>
          </span>
        ))}
      </div>
    </div>
  );
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
      if (created) setChecklists((prev) => [...prev, created as Checklist]);
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
      prev.map((c) => (c.id === checklistId ? { ...c, items: updatedItems } : c))
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
    setChecklists((prev) =>
      prev.map((c) => (c.id === checklistId ? { ...c, items: updatedItems } : c))
    );
    startTransition(async () => {
      await deleteChecklistItem(checklistId, updatedItems);
    });
  }

  const vel = [3, 5, 2, 6, 4];
  const maxV = Math.max(...vel);
  const grads = [
    "linear-gradient(180deg,#8b5cf6,#a855f7)",
    "linear-gradient(180deg,#f43f5e,#ef4444)",
    "linear-gradient(180deg,#0ea5e9,#38bdf8)",
    "linear-gradient(180deg,#f59e0b,#fbbf24)",
    "linear-gradient(180deg,#10b981,#34d399)",
  ];
  const segs = COLS.map((c) => ({
    k: c.label,
    v: tasks.filter((t) => t.status === c.key).length,
    c: c.color,
  }));

  return (
    <>
      <PageHead kicker={dateStr || "—"} title="Dashboard" />
      <div className="scroll">
        <div className="dash">
          <div className="stack">
            <div className="g3">
              <div className="tile t-sky">
                <small>Tasks completed</small>
                <b>
                  {tasksCompleted} / {totalTasks}
                </b>
                <span>{tasksInProgress} in progress</span>
              </div>
              <div className="tile t-mint">
                <small>Open bugs</small>
                <b>{openBugs}</b>
                <span>{highSevBugs} high severity</span>
              </div>
              <div className="tile t-lilac">
                <small>Knowledge base</small>
                <b>{docsCount}</b>
                <span>
                  {commandsCount} commands · {runbooksCount} runbooks
                </span>
              </div>
            </div>

            <div className="g2">
              <div className="panel">
                <div className="ptitle">
                  <h3>Board split</h3>
                  <Link href="/tasks" className="iconbtn">
                    <Icon name="arrow" size={13} />
                  </Link>
                </div>
                <Donut segs={segs} />
              </div>

              <div className="panel">
                <div className="ptitle">
                  <h3>Sprint velocity</h3>
                  <span className="pill">Last 5 days</span>
                </div>
                <div className="vbars">
                  {vel.map((v, i) => (
                    <div key={i} className="c">
                      <div className="well">
                        <div
                          className="b"
                          style={{ height: (v / maxV) * 100 + "%", background: grads[i] }}
                          title={v + " tasks"}
                        />
                      </div>
                      <small>D{i + 1}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="ptitle">
                <h3>Jump back in</h3>
              </div>
              <div className="g2">
                {[
                  ["/tasks", "Tasks board", `${tasksInProgress} in progress`],
                  ["/runbooks", "Runbooks", `${runbooksCount} saved`],
                  ["/commands", "Commands", `${commandsCount} snippets`],
                  ["/docs", "Docs", `${docsCount} documents`],
                ].map(([href, a, b]) => (
                  <Link
                    key={href}
                    href={href}
                    className="row"
                    style={{ marginBottom: 0, boxShadow: "none", background: "var(--sunk)" }}
                  >
                    <span>
                      <span style={{ display: "block", fontSize: 13, fontWeight: 700 }}>{a}</span>
                      <span className="dim" style={{ fontSize: 11.5 }}>
                        {b}
                      </span>
                    </span>
                    <Icon name="chevron" size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="stack">
            <div className="focus">
              <small>Sprint focus</small>
              <p>Ship billing + tasks board by Day 10</p>
              <Link href="/tasks" className="btn">
                Open board
              </Link>
            </div>

            <form onSubmit={handleCreateChecklist} className="panel">
              <div className="ptitle">
                <h3>New checklist</h3>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  className="inp"
                  style={{ flex: 1 }}
                  placeholder="e.g., Release checklist"
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                />
                <button
                  type="submit"
                  className="iconbtn"
                  disabled={pending || !newChecklistTitle.trim()}
                >
                  <Icon name="plus" size={14} />
                </button>
              </div>
            </form>

            {checklists.map((checklist) => {
              const done = checklist.items.filter((i) => i.done).length;
              return (
                <div key={checklist.id} className="panel">
                  <div className="ptitle">
                    <h3>{checklist.title}</h3>
                    <button
                      className="iconbtn"
                      onClick={() => handleDeleteChecklist(checklist.id)}
                      title="Delete checklist"
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  </div>

                  {checklist.items.map((item, i) => (
                    <div key={i} className="check" style={{ paddingRight: 4 }}>
                      <span
                        className={"tick " + (item.done ? "on" : "")}
                        onClick={() => handleCheckItem(checklist.id, i)}
                      >
                        <Icon name="check" size={11} />
                      </span>
                      <span
                        className="t"
                        style={{
                          flex: 1,
                          color: item.done ? "var(--ink-4)" : "var(--ink-2)",
                          textDecoration: item.done ? "line-through" : "none",
                        }}
                      >
                        {item.text}
                      </span>
                      <button
                        onClick={() => handleDeleteItem(checklist.id, i)}
                        className="dim"
                        title="Delete item"
                        style={{ fontSize: 13 }}
                      >
                        <Icon name="x" size={13} />
                      </button>
                    </div>
                  ))}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddItem(checklist.id);
                    }}
                    style={{ display: "flex", gap: 8, marginTop: 10 }}
                  >
                    <input
                      className="inp"
                      style={{ flex: 1 }}
                      placeholder="Add item…"
                      value={newItemText[checklist.id] || ""}
                      onChange={(e) =>
                        setNewItemText({ ...newItemText, [checklist.id]: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="iconbtn"
                      disabled={!newItemText[checklist.id]?.trim()}
                    >
                      <Icon name="plus" size={14} />
                    </button>
                  </form>

                  {checklist.items.length > 0 && (
                    <div className="rail-bg" style={{ marginTop: 14 }}>
                      <i
                        style={{
                          width: (done / checklist.items.length) * 100 + "%",
                          background: "linear-gradient(90deg,#8b5cf6,#0ea5e9)",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {checklists.length === 0 && (
              <div className="panel">
                <p className="dim" style={{ fontSize: 13, textAlign: "center", padding: "8px 0" }}>
                  No checklists yet. Create one to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
