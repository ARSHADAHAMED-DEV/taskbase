"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/app/lib/theme-context";
import { signout } from "@/app/login/actions";
import Icon from "./icon";

interface HeaderProps {
  userEmail: string | null;
  onCommandPaletteOpen: () => void;
}

export default function Header({ userEmail, onCommandPaletteOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickAway = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, [menuOpen]);

  const initial = userEmail?.[0]?.toUpperCase() ?? "T";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200/70 bg-slate-100/80 px-5 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <button
        onClick={onCommandPaletteOpen}
        className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900 sm:max-w-xs"
      >
        <Icon name="search" className="h-4 w-4" />
        <span>Search or jump...</span>
        <kbd className="ml-auto hidden rounded border border-slate-200 px-1.5 text-[10px] dark:border-slate-700 sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-white dark:border-slate-700 dark:hover:bg-slate-900"
          title="Toggle theme"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} className="h-4 w-4" />
        </button>

        <button className="rounded-lg border border-slate-200 p-2 text-slate-500 dark:border-slate-700">
          <Icon name="bell" className="h-4 w-4" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-9 w-9 place-items-center rounded-full bg-lime-400 font-bold text-slate-900"
          >
            {initial}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              {userEmail && (
                <div className="truncate border-b border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  {userEmail}
                </div>
              )}
              <form action={signout}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Icon name="logout" className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
