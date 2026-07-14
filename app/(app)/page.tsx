import { createClient } from "@/lib/supabase/server";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { data: docs },
    { data: tasks },
    { data: bugs },
  ] = await Promise.all([
    supabase.from("docs").select("id, title").limit(3),
    supabase.from("tasks").select("id, title, status").limit(10),
    supabase.from("bugs").select("id, title, severity, status").limit(10),
  ]);

  return (
    <Dashboard
      docs={docs ?? []}
      tasks={tasks ?? []}
      bugs={bugs ?? []}
    />
  );
}
