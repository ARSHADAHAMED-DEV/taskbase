import { createClient } from "@/lib/supabase/server";
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
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Changelog
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Dated release notes across the sprint
        </p>
      </div>

      <ChangelogList entries={entries ?? []} />
    </div>
  );
}
