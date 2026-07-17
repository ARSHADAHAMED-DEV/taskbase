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

// Creates a new task in the given column, appended to the end of that
// column's order (position = current max + 1).
export async function createTask(
  title: string,
  status: string,
  priority: string = "med",
  tag: string | null = null
) {
  const trimmed = title.trim();
  if (!trimmed) throw new Error("Title is required");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: last } = await supabase
    .from("tasks")
    .select("position")
    .eq("status", status)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? 0) + 1;

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title: trimmed,
      status,
      priority,
      tag: tag?.trim() || null,
      position,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
  return data;
}

// Edits an existing task's title, priority, and tag (not its column).
export async function updateTask(
  id: string,
  fields: { title: string; priority: string; tag: string | null }
) {
  const trimmed = fields.title.trim();
  if (!trimmed) throw new Error("Title is required");

  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({
      title: trimmed,
      priority: fields.priority,
      tag: fields.tag?.trim() || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
}
