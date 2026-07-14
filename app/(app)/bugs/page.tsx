import { createClient } from "@/lib/supabase/server";
import BugsList from "./list";

type Bug = {
  id: string;
  title: string;
  severity: string;
  status: string;
  created_at: string;
};

export default async function BugsPage() {
  const supabase = await createClient();
  const { data: bugs } = await supabase
    .from("bugs")
    .select("id, title, severity, status, created_at")
    .order("created_at", { ascending: false }) as {
    data: Bug[] | null;
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Bugs
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Lightweight issue log — click a status to advance it
        </p>
      </div>
      <BugsList bugs={bugs ?? []} />
    </div>
  );
}
