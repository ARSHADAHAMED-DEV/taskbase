import { createClient } from "@/lib/supabase/server";
import RunbooksList from "./list";

type Step = {
  text: string;
  done: boolean;
};

type Runbook = {
  id: string;
  title: string;
  slug: string;
  steps: Step[];
};

export default async function RunbooksPage() {
  const supabase = await createClient();
  const { data: runbooks } = await supabase
    .from("runbooks")
    .select("id, title, slug, steps")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Runbooks
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Turn an SOP into a checklist you tick through
        </p>
      </div>

      <RunbooksList runbooks={(runbooks ?? []) as Runbook[]} />
    </div>
  );
}
