import { createClient } from "@/lib/supabase/server";
import PageHead from "@/components/page-head";
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
    <>
      <PageHead kicker="Turn an SOP into a checklist you tick through" title="Runbooks" />
      <div className="scroll">
        <RunbooksList runbooks={(runbooks ?? []) as Runbook[]} />
      </div>
    </>
  );
}
