import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createDocAction } from "./actions";

export default async function DocsPage() {
  const supabase = await createClient();
  const { data: docs } = await supabase
    .from("docs")
    .select("id, title, slug, category, status, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Docs
          </h1>
          <Link
            href="/tasks"
            className="text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Tasks →
          </Link>
        </div>
        <form action={createDocAction}>
          <button className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-lime-300">
            + New doc
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {(docs ?? []).map((d) => (
          <Link
            key={d.id}
            href={`/docs/${d.slug}`}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-lime-300"
          >
            <span className="font-semibold text-slate-800">{d.title}</span>
            <span className="text-xs text-slate-400">
              {d.category} · {d.status}
            </span>
          </Link>
        ))}
        {(!docs || docs.length === 0) && (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
            No docs yet. Hit "New doc" to create your first one.
          </p>
        )}
      </div>
    </div>
  );
}