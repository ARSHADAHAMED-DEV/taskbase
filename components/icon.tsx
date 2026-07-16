const ICONS = {
  dashboard: ["M3 3h8v8H3z", "M13 3h8v5h-8z", "M13 12h8v9h-8z", "M3 13h8v8H3z"],
  tasks: ["M4 5h4v14H4z", "M10 5h4v10h-4z", "M16 5h4v6h-4z"],
  docs: ["M6 2h9l5 5v15H6z", "M15 2v5h5", "M9 13h7", "M9 17h5"],
  runbooks: [
    "M8 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1",
    "M9 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9z",
    "M8 12l2 2 4-4",
  ],
  commands: ["M4 5h16v14H4z", "M8 9l3 3-3 3", "M13 15h4"],
  roadmap: ["M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z", "M9 4v14", "M15 6v14"],
  bugs: [
    "M8 7a4 4 0 0 1 8 0",
    "M6 11h12v3a6 6 0 0 1-12 0z",
    "M3 13h3",
    "M18 13h3",
    "M4 8l2 2",
    "M20 8l-2 2",
    "M12 20v1",
  ],
  changelog: ["M12 8v5l3 2", "M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"],
  resources: [
    "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1",
    "M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
  ],
  prompts: ["M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"],
  search: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "M20 20l-3.5-3.5"],
  plus: ["M12 5v14", "M5 12h14"],
  copy: ["M9 9h11v11H9z", "M5 15V4h11"],
  logout: ["M15 4h4v16h-4", "M11 12H3", "M6 8l-4 4 4 4"],
  bell: ["M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6", "M10 21a2 2 0 0 0 4 0"],
  chevron: ["M9 6l6 6-6 6"],
  arrow: ["M7 17L17 7", "M9 7h8v8"],
  check: ["M20 6L9 17l-5-5"],
  mail: ["M3 5h18v14H3z", "M3 7l9 6 9-6"],
  sun: [
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    "M12 3v2",
    "M12 19v2",
    "M5 5l1 1",
    "M18 18l1 1",
    "M3 12h2",
    "M19 12h2",
    "M5 19l1-1",
    "M18 6l1-1",
  ],
  moon: ["M20 14a8 8 0 1 1-9-11 6 6 0 0 0 9 11z"],
  warn: [
    "M10.3 3.9L2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
    "M12 9v4",
    "M12 17h.01",
  ],
  load: ["M21 12a9 9 0 1 1-6.2-8.6"],
  x: ["M18 6L6 18", "M6 6l12 12"],
  trash: ["M4 7h16", "M9 7V4h6v3", "M6 7l1 13h10l1-13"],
  menu: ["M3 6h18", "M3 12h18", "M3 18h18"],
};

export interface IconProps {
  name: keyof typeof ICONS;
  className?: string;
  size?: number;
}

export default function Icon({ name, className = "h-5 w-5", size }: IconProps) {
  const paths = ICONS[name];
  if (!paths) return null;

  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
