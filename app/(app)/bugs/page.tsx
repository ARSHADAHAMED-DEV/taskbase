import { createClient } from "@/lib/supabase/server";
import PageHead from "@/components/page-head";
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
    <>
      <PageHead kicker="Lightweight issue log — click a status to advance it" title="Bugs" />
      <div className="scroll">
        <BugsList bugs={bugs ?? []} />
      </div>
    </>
  );
}
