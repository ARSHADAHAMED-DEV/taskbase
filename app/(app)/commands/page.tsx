import { createClient } from "@/lib/supabase/server";
import CommandsList from "./list";

export default async function CommandsPage() {
  const supabase = await createClient();
  const { data: commands } = await supabase
    .from("commands")
    .select("id, label, cmd, tag")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Commands
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Reusable CLI snippets, one click to copy
        </p>
      </div>

      <CommandsList commands={commands ?? []} />
    </div>
  );
}
