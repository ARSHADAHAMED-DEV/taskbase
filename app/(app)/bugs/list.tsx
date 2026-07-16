"use client";

import { useState, useTransition } from "react";
import Icon from "@/components/icon";
import { createBug, updateBugStatus } from "./actions";

type Bug = {
  id: string;
  title: string;
  severity: string;
  status: string;
  created_at: string;
};

const SEV_CLASS: Record<string, string> = {
  Low: "pill",
  Med: "pill amber",
  High: "pill rose",
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
    const statuses = ["Open", "In progress", "Fixed"];
    const idx = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(idx + 1) % statuses.length];
    setBugs((prev) => prev.map((b) => (b.id === bugId ? { ...b, status: nextStatus } : b)));
    startTransition(async () => {
      await updateBugStatus(bugId, currentStatus);
      setStatusPending(null);
    });
  }

  return (
    <div className="stack">
      <form onSubmit={handleCreateBug} className="panel" style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          className="inp"
          style={{ flex: 1 }}
          placeholder="Bug title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn" type="submit" disabled={pending || !title.trim()}>
          <Icon name="plus" size={13} />
          {pending ? "Adding…" : "New bug"}
        </button>
      </form>

      <div className="panel">
        {bugs.length === 0 ? (
          <p className="dim" style={{ textAlign: "center", fontSize: 13, padding: "24px 0" }}>
            No bugs yet.
          </p>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bugs.map((bug) => (
                <tr key={bug.id}>
                  <td>{bug.title}</td>
                  <td>
                    <span className={SEV_CLASS[bug.severity] ?? "pill amber"}>{bug.severity}</span>
                  </td>
                  <td>
                    <button
                      className={
                        "pill " +
                        (bug.status === "Fixed" ? "mint" : bug.status === "In progress" ? "dark" : "")
                      }
                      onClick={() => handleStatusClick(bug.id, bug.status)}
                      disabled={statusPending === bug.id}
                    >
                      {statusPending === bug.id ? "…" : bug.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
