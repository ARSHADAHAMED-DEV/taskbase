"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Moves a task to a new column and appends it to the end of that
// column's order (position = current max + 1), so drag-between-columns
// never collides with existing ordering.
export async function updateTaskStatus(id: string, status: string) {
  const supabase = await createClient();

  const { data: last } = await supabase
    .from("tasks")
    .select("position")
    .eq("status", status)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? 0) + 1;

  const { error } = await supabase
    .from("tasks")
    .update({ status, position })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
}
