"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/lib/theme-context";
import { signout } from "@/app/login/actions";
import Icon, { type IconProps } from "@/components/icon";
import CommandPalette from "@/components/command-palette";

const NAV: { href: string; label: string; icon: IconProps["name"] }[] = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/tasks", label: "Tasks", icon: "tasks" },
  { href: "/docs", label: "Docs", icon: "docs" },
  { href: "/runbooks", label: "Runbooks", icon: "runbooks" },
  { href: "/commands", label: "Commands", icon: "commands" },
  { href: "/roadmap", label: "Roadmap", icon: "roadmap" },
  { href: "/bugs", label: "Bugs", icon: "bugs" },
  { href: "/changelog", label: "Changelog", icon: "changelog" },
  { href: "/resources", label: "Resources", icon: "resources" },
  { href: "/prompts", label: "Prompts", icon: "prompts" },
];

export default function AppShell({
  userEmail,
  children,
}: {
  userEmail: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const handle = (userEmail || "taskbase").split("@")[0];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="app">
      <div className="topbar">
        <div className="who">
          <span
            className="iconbtn"
            style={{
              width: 34,
              height: 34,
              background: "var(--lime)",
              color: "#0d1b2a",
              borderColor: "transparent",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {handle[0]?.toUpperCase() ?? "T"}
          </span>
          <div>
            <div className="name">{handle}</div>
            <div className="sub">Command center</div>
          </div>
        </div>
        <div className="mailpill">
          <Icon name="mail" size={14} />
          {userEmail || "taskbase"}
        </div>
      </div>

      <div className="shell">
        <div className="shell-head">
          <div className="logo">
            <span className="mk">✦</span>
            <b>taskbase</b>
          </div>
          <button className="searchpill" onClick={() => setPaletteOpen(true)}>
            <Icon name="search" size={14} />
            Search or jump…
            <kbd>⌘K</kbd>
          </button>
        </div>

        <div className="body">
          <nav className="rail">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rbtn ${isActive(item.href) ? "on" : ""}`}
              >
                <Icon name={item.icon} size={16} />
                <span className="tip">{item.label}</span>
              </Link>
            ))}
            <div className="rule" />
            <button className="rbtn">
              <Icon name="bell" size={16} />
              <span className="dot" />
              <span className="tip">Notifications</span>
            </button>
            <button className="rbtn" onClick={toggleTheme}>
              <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
              <span className="tip">
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
            </button>
            <form action={signout}>
              <button type="submit" className="rbtn">
                <Icon name="logout" size={16} />
                <span className="tip">Sign out</span>
              </button>
            </form>
          </nav>

          <div className="content">{children}</div>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
