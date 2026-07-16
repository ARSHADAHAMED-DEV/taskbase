export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{ background: "var(--sunk)", borderRadius: "var(--r-md)" }}
    />
  );
}
