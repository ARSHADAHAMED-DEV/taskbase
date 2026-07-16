"use client";

import Icon from "@/components/icon";
import PageHead from "@/components/page-head";

const RESOURCES = [
  { id: 1, name: "Supabase", desc: "Database, Auth, RLS", url: "https://supabase.com/dashboard" },
  { id: 2, name: "Stripe", desc: "Billing + webhooks", url: "https://dashboard.stripe.com" },
  { id: 3, name: "Vercel", desc: "Hosting + deploys", url: "https://vercel.com/dashboard" },
  { id: 4, name: "GitHub", desc: "Source + CI", url: "https://github.com" },
  { id: 5, name: "Linear", desc: "Issue tracking", url: "https://linear.app" },
  { id: 6, name: "Figma", desc: "Design files", url: "https://figma.com" },
];

const TONES = ["t-peach", "t-sky", "t-mint", "t-lilac", "t-rose", "t-sky"];

export default function ResourcesPage() {
  return (
    <>
      <PageHead kicker="One-click into the tools this project runs on" title="Resources" />
      <div className="scroll">
        <div className="g3">
          {RESOURCES.map((r, i) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className={"tile " + TONES[i % 6]}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
            >
              <div>
                <b style={{ fontSize: 19, marginTop: 0 }}>{r.name}</b>
                <span>{r.desc}</span>
              </div>
              <span className="iconbtn" style={{ borderColor: "transparent" }}>
                <Icon name="arrow" size={13} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
