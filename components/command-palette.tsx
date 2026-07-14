"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./icon";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const COMMANDS = [
  { category: "Navigate", label: "Dashboard", href: "/" },
  { category: "Navigate", label: "Tasks", href: "/tasks" },
  { category: "Navigate", label: "Docs", href: "/docs" },
  { category: "Navigate", label: "Runbooks", href: "/runbooks" },
  { category: "Navigate", label: "Commands", href: "/commands" },
  { category: "Navigate", label: "Roadmap", href: "/roadmap" },
  { category: "Navigate", label: "Bugs", href: "/bugs" },
  { category: "Navigate", label: "Changelog", href: "/changelog" },
  { category: "Navigate", label: "Resources", href: "/resources" },
  { category: "Navigate", label: "Prompts", href: "/prompts" },
];

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const items = COMMANDS.filter((cmd) =>
    (cmd.label + cmd.category).toLowerCase().includes(q.toLowerCase())
  );

  function handleSelect(href: string) {
    router.push(href);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-800">
          <Icon name="search" className="h-4 w-4 text-slate-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && items[0]) {
                handleSelect(items[0].href);
              }
              if (e.key === "Escape") onClose();
            }}
            placeholder="Search or jump…"
            className="w-full bg-transparent py-3 text-sm outline-none dark:text-slate-200"
          />
          <kbd className="rounded border border-slate-200 px-1.5 text-[10px] text-slate-400 dark:border-slate-700">
            esc
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelect(item.href)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="text-slate-700 dark:text-slate-200">{item.label}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {item.category}
              </span>
            </button>
          ))}
          {!items.length && (
            <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Nothing found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
