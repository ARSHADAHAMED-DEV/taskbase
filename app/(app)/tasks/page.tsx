import { createClient } from "@/lib/supabase/server";
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
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Tasks
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Drag cards between columns to update status
        </p>
      </div>
      <TaskBoard columns={COLUMNS} tasks={tasks ?? []} />
    </div>
  );
}
