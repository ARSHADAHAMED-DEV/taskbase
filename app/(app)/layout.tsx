"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import CommandPalette from "@/components/command-palette";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-200">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onCommandPaletteOpen={() => setPaletteOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950">
          {children}
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
