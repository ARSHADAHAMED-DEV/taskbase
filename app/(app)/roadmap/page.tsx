"use client";

import PageHead from "@/components/page-head";

const LANES = [
  { id: "now", label: "Now", tone: "t-peach" },
  { id: "next", label: "Next", tone: "t-sky" },
  { id: "later", label: "Later", tone: "t-mint" },
];

const ROADMAP_ITEMS = [
  { id: 1, title: "Multi-tenant auth + RLS", lane: "now" },
  { id: 2, title: "Tasks board", lane: "now" },
  { id: 3, title: "Stripe billing", lane: "now" },
  { id: 4, title: "Team invites + roles", lane: "next" },
  { id: 5, title: "Activity feed", lane: "next" },
  { id: 6, title: "Public API + webhooks", lane: "later" },
  { id: 7, title: "Mobile app", lane: "later" },
];

export default function RoadmapPage() {
  return (
    <>
      <PageHead kicker="Now / Next / Later — what the sprint is aiming at" title="Roadmap" />
      <div className="scroll">
        <div className="g3">
          {LANES.map((lane) => {
            const list = ROADMAP_ITEMS.filter((r) => r.lane === lane.id);
            return (
              <section key={lane.id} className="col">
                <div className="col-head">
                  <div className="l">
                    <h4>{lane.label}</h4>
                    <span className="count">{list.length}</span>
                  </div>
                </div>
                <div className="col-body">
                  {list.map((r) => (
                    <article key={r.id} className={"tcard " + lane.tone} style={{ cursor: "default" }}>
                      <h5>{r.title}</h5>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
