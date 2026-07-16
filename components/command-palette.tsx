"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./icon";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const COMMANDS = [
  { category: "Go to", label: "Dashboard", href: "/" },
  { category: "Go to", label: "Tasks", href: "/tasks" },
  { category: "Go to", label: "Docs", href: "/docs" },
  { category: "Go to", label: "Runbooks", href: "/runbooks" },
  { category: "Go to", label: "Commands", href: "/commands" },
  { category: "Go to", label: "Roadmap", href: "/roadmap" },
  { category: "Go to", label: "Bugs", href: "/bugs" },
  { category: "Go to", label: "Changelog", href: "/changelog" },
  { category: "Go to", label: "Resources", href: "/resources" },
  { category: "Go to", label: "Prompts", href: "/prompts" },
];

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const items = COMMANDS.filter((cmd) =>
    (cmd.label + cmd.category).toLowerCase().includes(q.toLowerCase())
  );

  function handleSelect(href: string) {
    router.push(href);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="scrim" onClick={onClose}>
      <div className="palette fade" onClick={(e) => e.stopPropagation()}>
        <div className="p-in">
          <Icon name="search" size={16} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && items[active]) {
                handleSelect(items[active].href);
              }
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, items.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              }
            }}
            placeholder="Search, jump to a section…"
          />
          <kbd>ESC</kbd>
        </div>

        <div className="p-list">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelect(item.href)}
              onMouseEnter={() => setActive(i)}
              className="p-item"
              style={i === active ? { background: "var(--sunk)" } : undefined}
            >
              <span className="t">{item.label}</span>
              <span className="k">{item.category}</span>
            </button>
          ))}
          {!items.length && (
            <p className="dim" style={{ padding: 32, textAlign: "center", fontSize: 13 }}>
              Nothing found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
