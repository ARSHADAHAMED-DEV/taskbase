"use client";

import { useState, useTransition } from "react";
import Icon from "@/components/icon";
import { createCommand, deleteCommand, updateCommand } from "./actions";

type Command = {
  id: string;
  label: string;
  cmd: string;
  tag: string;
};

export default function CommandsList({ commands: initialCommands }: { commands: Command[] }) {
  const [commands, setCommands] = useState(initialCommands);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [cmd, setCmd] = useState("");
  const [tag, setTag] = useState("");
  const [pending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      fd.set("label", label);
      fd.set("cmd", cmd);
      fd.set("tag", tag || "custom");
      await createCommand(fd);
      setLabel("");
      setCmd("");
      setTag("");
    });
  }

  const list = commands.filter((c) =>
    (c.label + c.cmd + c.tag).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="stack">
      <form onSubmit={handleCreate} className="panel">
        <div className="ptitle">
          <h3>New command</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input className="inp" placeholder="Label…" value={label} onChange={(e) => setLabel(e.target.value)} />
          <input
            className="inp mono"
            placeholder="Command…"
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <input
              className="inp"
              style={{ flex: 1 }}
              placeholder="Tag (optional)…"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
            <button className="btn" type="submit" disabled={pending || !label.trim() || !cmd.trim()}>
              <Icon name="plus" size={13} />
              {pending ? "Adding…" : "New command"}
            </button>
          </div>
        </div>
      </form>

      <input
        className="inp"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter…"
      />

      <div>
        {list.map((c) => (
          <CommandCard
            key={c.id}
            command={c}
            onDelete={() => setCommands((prev) => prev.filter((x) => x.id !== c.id))}
            onUpdate={(updated) =>
              setCommands((prev) => prev.map((x) => (x.id === c.id ? updated : x)))
            }
          />
        ))}
        {!list.length && (
          <p className="dim" style={{ textAlign: "center", fontSize: 13, padding: "32px 0" }}>
            No commands match “{q}”.
          </p>
        )}
      </div>
    </div>
  );
}

function CommandCard({
  command,
  onDelete,
  onUpdate,
}: {
  command: Command;
  onDelete: () => void;
  onUpdate: (updated: Command) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(command.label);
  const [editCmd, setEditCmd] = useState(command.cmd);
  const [editTag, setEditTag] = useState(command.tag);
  const [isSaving, setIsSaving] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(command.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  }

  async function handleSave() {
    if (!editLabel.trim() || !editCmd.trim()) return;
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.set("id", command.id);
      fd.set("label", editLabel);
      fd.set("cmd", editCmd);
      fd.set("tag", editTag || "custom");
      await updateCommand(fd);
      onUpdate({ ...command, label: editLabel, cmd: editCmd, tag: editTag });
      setIsEditing(false);
    } catch (e) {
      console.error("Error updating command:", e);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this command?")) return;
    const fd = new FormData();
    fd.set("id", command.id);
    await deleteCommand(fd);
    onDelete();
  }

  if (isEditing) {
    return (
      <div className="panel" style={{ marginBottom: 9 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input className="inp" value={editLabel} onChange={(e) => setEditLabel(e.target.value)} />
          <input className="inp mono" value={editCmd} onChange={(e) => setEditCmd(e.target.value)} />
          <input className="inp" value={editTag} onChange={(e) => setEditTag(e.target.value)} />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={handleSave} disabled={isSaving || !editLabel.trim() || !editCmd.trim()}>
              {isSaving ? "Saving…" : "Save"}
            </button>
            <button
              className="btn ghost"
              onClick={() => {
                setIsEditing(false);
                setEditLabel(command.label);
                setEditCmd(command.cmd);
                setEditTag(command.tag);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div style={{ minWidth: 0 }}>
        <h5>
          {command.label}
          <span className="pill">#{command.tag}</span>
        </h5>
        <p className="cmdline">
          <em>$</em> {command.cmd}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button className="btn ghost" onClick={copy}>
          <Icon name={copied ? "check" : "copy"} size={13} />
          {copied ? "Copied" : "Copy"}
        </button>
        <button className="iconbtn" onClick={() => setIsEditing(true)} title="Edit">
          <Icon name="commands" size={13} />
        </button>
        <button className="iconbtn" onClick={handleDelete} title="Delete">
          <Icon name="trash" size={13} />
        </button>
      </div>
    </div>
  );
}
