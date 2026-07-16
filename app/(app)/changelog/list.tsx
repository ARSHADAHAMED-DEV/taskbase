"use client";

import { useState, useTransition } from "react";
import Icon from "@/components/icon";
import { createChangelogEntry } from "./actions";

type ChangelogEntry = {
  id: string;
  version: string;
  label: string;
  notes: string[];
};

export default function ChangelogList({ entries: initialEntries }: { entries: ChangelogEntry[] }) {
  const [entries] = useState(initialEntries);
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
    <div className="stack">
      <form onSubmit={handleCreate} className="panel">
        <div className="ptitle">
          <h3>New entry</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input className="inp" style={{ flex: 1 }} placeholder="v0.5" value={version} onChange={(e) => setVersion(e.target.value)} />
            <input className="inp" style={{ flex: 2 }} placeholder="Release label" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <textarea
            className="inp"
            style={{ borderRadius: "var(--r-sm)", minHeight: 90, resize: "vertical" }}
            placeholder={"One note per line…"}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button className="btn" type="submit" disabled={pending || !version.trim() || !label.trim() || !notes.trim()} style={{ alignSelf: "flex-start" }}>
            <Icon name="plus" size={13} />
            {pending ? "Adding…" : "New entry"}
          </button>
        </div>
      </form>

      <div className="panel">
        {entries.length === 0 ? (
          <p className="dim" style={{ textAlign: "center", fontSize: 13, padding: "24px 0" }}>
            No changelog entries yet.
          </p>
        ) : (
          <div className="tl">
            {entries.map((entry) => (
              <div key={entry.id} className="tl-item">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="pill dark">{entry.version}</span>
                  <span className="dim" style={{ fontSize: 11.5, fontWeight: 600 }}>
                    {entry.label}
                  </span>
                </div>
                <div className="bullets">
                  {Array.isArray(entry.notes) &&
                    entry.notes.map((note, i) => (
                      <div key={i}>
                        <i>›</i>
                        {note}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
