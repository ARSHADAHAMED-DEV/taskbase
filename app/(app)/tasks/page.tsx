import { createClient } from "@/lib/supabase/server";
import PageHead from "@/components/page-head";
import TaskBoard from "./board";

const COLUMNS = [
  { key: "backlog", label: "Backlog" },
  { key: "doing", label: "Doing" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
] as const;

// Server Component: a live, RLS-scoped SELECT that only ever returns
// the current user's tasks.
export default async function TasksPage() {
  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, status, priority, tag, position")
    .order("position", { ascending: true });

  return (
    <>
      <PageHead kicker="Drag cards between columns to update status" title="Tasks" />
      <div className="scroll">
        <TaskBoard columns={COLUMNS} tasks={tasks ?? []} />
      </div>
    </>
  );
}
