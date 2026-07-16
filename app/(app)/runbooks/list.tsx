"use client";

import { useState, useTransition } from "react";
import Icon from "@/components/icon";
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

  function handleCheckStep(stepIndex: number) {
    if (!selected) return;
    const updated = selected.steps.map((step, i) =>
      i === stepIndex ? { ...step, done: !step.done } : step
    );
    setRunbooks((prev) =>
      prev.map((r) => (r.id === selected.id ? { ...r, steps: updated } : r))
    );
    startTransition(async () => {
      await updateRunbookSteps(selected.id, updated);
    });
  }

  const doneCount = selected?.steps.filter((s) => s.done).length ?? 0;
  const totalCount = selected?.steps.length ?? 0;

  return (
    <div className="split">
      <div className="side">
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 8, padding: 6 }}>
          <input
            className="inp"
            placeholder="New runbook…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="btn" type="submit" disabled={pending || !title.trim()}>
            <Icon name="plus" size={13} />
            {pending ? "Adding…" : "New"}
          </button>
        </form>
        {runbooks.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedId(r.id)}
            className={r.id === selectedId ? "on" : ""}
          >
            {r.title}
          </button>
        ))}
      </div>

      {selected && (
        <div className="panel">
          <div className="ptitle">
            <h3>{selected.title}</h3>
            <span className="pill dark">
              {doneCount}/{totalCount} done
            </span>
          </div>
          <div className="rail-bg" style={{ marginBottom: 16 }}>
            <i
              style={{
                width: (totalCount > 0 ? (doneCount / totalCount) * 100 : 0) + "%",
                background: "linear-gradient(90deg,#0ea5e9,#8b5cf6)",
              }}
            />
          </div>
          {selected.steps.map((step, i) => (
            <label key={i} className="step">
              <input type="checkbox" checked={step.done} onChange={() => handleCheckStep(i)} />
              <span className={"tick " + (step.done ? "on" : "")}>
                <Icon name="check" size={11} />
              </span>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <span className="t">{step.text}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
