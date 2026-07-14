import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DocEditor from "./editor";

// /docs/system-architecture-adr  ->  loads exactly that doc.
// Refreshing or bookmarking this URL now works, because state lives in
// the URL + database, not in a React variable.
export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: doc } = await supabase
    .from("docs")
    .select("id, title, slug, category, status, body, updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (!doc) notFound();

  return <DocEditor doc={doc} />;
}
