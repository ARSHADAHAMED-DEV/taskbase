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
    <div className="space-y-4">
      <form
        onSubmit={handleCreate}
        className="rounded-2xl bg-white p-4 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm"
      >
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Label..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <input
            type="text"
            placeholder="Command..."
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <input
            type="text"
            placeholder="Tag (optional)..."
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <button
            type="submit"
            disabled={pending || !label.trim() || !cmd.trim()}
            className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-lime-300 disabled:opacity-60"
          >
            {pending ? "Adding…" : "+ New command"}
          </button>
        </div>
      </form>

      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter…"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        {list.map((c) => (
          <CommandCard
            key={c.id}
            command={c}
            onDelete={() => setCommands((prev) => prev.filter((cmd) => cmd.id !== c.id))}
            onUpdate={(updated) =>
              setCommands((prev) =>
                prev.map((cmd) => (cmd.id === c.id ? updated : cmd))
              )
            }
          />
        ))}
        {!list.length && (
          <p className="px-2 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No commands match "{q}".
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
  const [isDeleting, setIsDeleting] = useState(false);
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
    setIsDeleting(true);
    try {
      const fd = new FormData();
      fd.set("id", command.id);
      await deleteCommand(fd);
      onDelete();
    } catch (e) {
      console.error("Error deleting command:", e);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isEditing) {
    return (
      <div className="rounded-2xl bg-white p-4 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm">
        <div className="space-y-3">
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <input
            type="text"
            value={editCmd}
            onChange={(e) => setEditCmd(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <input
            type="text"
            value={editTag}
            onChange={(e) => setEditTag(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving || !editLabel.trim() || !editCmd.trim()}
              className="rounded-lg bg-lime-400 px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-lime-300 disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditLabel(command.label);
                setEditCmd(command.cmd);
                setEditTag(command.tag);
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {command.label}{" "}
          <span className="rounded-full px-2 py-1 text-[11px] font-semibold inline-block ml-2 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            #{command.tag}
          </span>
        </p>
        <p className="font-mono mt-1 truncate text-xs text-lime-700 dark:text-lime-300">
          $ {command.cmd}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <Icon name="copy" className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          title="Edit"
        >
          <Icon name="commands" className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-rose-500 hover:bg-rose-50 dark:border-slate-700 dark:hover:bg-slate-800 disabled:opacity-60"
          title="Delete"
        >
          <Icon name="x" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
