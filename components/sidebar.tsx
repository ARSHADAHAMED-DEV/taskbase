"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./icon";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "dashboard" as const },
  { href: "/tasks", label: "Tasks", icon: "tasks" as const },
  { href: "/docs", label: "Docs", icon: "docs" as const },
  { href: "/runbooks", label: "Runbooks", icon: "runbooks" as const },
  { href: "/commands", label: "Commands", icon: "commands" as const },
  { href: "/bugs", label: "Bugs", icon: "bugs" as const },
  { href: "/changelog", label: "Changelog", icon: "changelog" as const },
  { href: "/prompts", label: "Prompts", icon: "prompts" as const },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 p-5 text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-lime-400 text-slate-900 font-bold">
          ✦
        </span>
        taskbase
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            (item.href === "/" && pathname === "/") ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-lime-300 text-slate-900"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-2xl bg-slate-100 p-3 dark:bg-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-lime-400 font-bold text-slate-900">
            T
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
              taskbase
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Command center</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
