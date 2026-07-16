import { createClient } from "@/lib/supabase/server";
import PageHead from "@/components/page-head";
import ChangelogList from "./list";

type ChangelogEntry = {
  id: string;
  version: string;
  label: string;
  notes: string[];
};

export default async function ChangelogPage() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("changelog")
    .select("id, version, label, notes")
    .order("created_at", { ascending: false }) as {
    data: ChangelogEntry[] | null;
  };

  return (
    <>
      <PageHead kicker="Dated release notes across the sprint" title="Changelog" />
      <div className="scroll">
        <ChangelogList entries={entries ?? []} />
      </div>
    </>
  );
}
