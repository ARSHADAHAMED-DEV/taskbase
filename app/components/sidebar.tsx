"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/lib/theme-context";
import ThemeToggle from "./theme-toggle";

const NAV_ITEMS = [
  { href: "/docs", label: "Docs" },
  { href: "/tasks", label: "Tasks" },
  { href: "/bugs", label: "Bugs" },
  { href: "/runbooks", label: "Runbooks" },
  { href: "/commands", label: "Commands" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/changelog", label: "Changelog" },
  { href: "/resources", label: "Resources" },
  { href: "/prompts", label: "Prompts" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <aside className="w-56 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-8 flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-lime-400 text-sm font-bold text-slate-900">
          ✦
        </div>
        <span className="font-bold text-slate-900 dark:text-white">taskbase</span>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-lime-400 text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <ThemeToggle />
      </div>
    </aside>
  );
}
