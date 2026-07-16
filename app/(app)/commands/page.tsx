import { createClient } from "@/lib/supabase/server";
import PageHead from "@/components/page-head";
import CommandsList from "./list";

export default async function CommandsPage() {
  const supabase = await createClient();
  const { data: commands } = await supabase
    .from("commands")
    .select("id, label, cmd, tag")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHead kicker="Reusable CLI snippets, one click to copy" title="Commands" />
      <div className="scroll">
        <CommandsList commands={commands ?? []} />
      </div>
    </>
  );
}
