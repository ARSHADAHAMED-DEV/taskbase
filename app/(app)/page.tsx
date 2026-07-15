import { createClient } from "@/lib/supabase/server";
import Dashboard from "./dashboard";

type Task = {
  id: string;
  title: string;
  status: string;
};

type Bug = {
  id: string;
  title: string;
  severity: string;
  status: string;
};

type Checklist = {
  id: string;
  title: string;
  items: Array<{ text: string; done: boolean }>;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { data: tasks },
    { data: bugs },
    { data: commands },
    { data: runbooks },
    { data: docs },
    { data: checklists },
  ] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, title, status")
      .order("created_at", { ascending: false }),
    supabase
      .from("bugs")
      .select("id, title, severity, status")
      .order("created_at", { ascending: false }),
    supabase
      .from("commands")
      .select("id", { count: "exact" }),
    supabase
      .from("runbooks")
      .select("id", { count: "exact" }),
    supabase
      .from("docs")
      .select("id", { count: "exact" }),
    supabase
      .from("checklists")
      .select("id, title, items")
      .order("created_at", { ascending: false }),
  ]);

  const taskList = (tasks ?? []) as Task[];
  const bugList = (bugs ?? []) as Bug[];
  const checklistList = (checklists ?? []) as Checklist[];

  const tasksCompleted = taskList.filter((t) => t.status === "done").length;
  const tasksInProgress = taskList.filter((t) => t.status === "doing").length;
  const openBugs = bugList.filter((b) => b.status !== "Fixed").length;
  const highSevBugs = bugList.filter(
    (b) => b.severity === "High" && b.status !== "Fixed"
  ).length;
  const commandsCount = commands?.length ?? 0;
  const runbooksCount = runbooks?.length ?? 0;
  const docsCount = docs?.length ?? 0;

  return (
    <Dashboard
      tasks={taskList}
      tasksCompleted={tasksCompleted}
      tasksInProgress={tasksInProgress}
      openBugs={openBugs}
      highSevBugs={highSevBugs}
      commandsCount={commandsCount}
      runbooksCount={runbooksCount}
      docsCount={docsCount}
      checklists={checklistList}
    />
  );
}
