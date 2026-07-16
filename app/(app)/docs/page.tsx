import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Icon from "@/components/icon";
import PageHead from "@/components/page-head";
import { createDocAction } from "./actions";

export default async function DocsPage() {
  const supabase = await createClient();
  const { data: docs } = await supabase
    .from("docs")
    .select("id, title, slug, category, status, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <>
      <PageHead
        kicker="ADRs, dev logs and runbooks in markdown"
        title="Docs"
        right={
          <form action={createDocAction}>
            <button className="btn" type="submit">
              <Icon name="plus" size={13} />
              New doc
            </button>
          </form>
        }
      />
      <div className="scroll">
        {(docs ?? []).map((d) => (
          <Link key={d.id} href={`/docs/${d.slug}`} className="row">
            <h5>{d.title}</h5>
            <span className="dim" style={{ fontSize: 11.5 }}>
              {d.category} · {d.status}
            </span>
          </Link>
        ))}
        {(!docs || docs.length === 0) && (
          <p className="dim" style={{ textAlign: "center", fontSize: 13, padding: "40px 0" }}>
            No docs yet. Hit “New doc” to create your first one.
          </p>
        )}
      </div>
    </>
  );
}
