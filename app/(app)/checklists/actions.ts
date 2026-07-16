"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createChecklist(formData: FormData) {
  const title = String(formData.get("title")).trim();

  if (!title) throw new Error("Title is required");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("checklists")
    .insert({ user_id: user.id, title, items: [] })
    .select()
    .single();

  if (error) {
    const msg = typeof error === "object" && error !== null && "message" in error
      ? String((error as any).message)
      : "Failed to create checklist";
    throw new Error(msg);
  }

  revalidatePath("/");
  return data;
}

export async function updateChecklistItems(id: string, items: Array<{ text: string; done: boolean }>) {
  if (!Array.isArray(items)) throw new Error("Items must be an array");

  const supabase = await createClient();
  const { error } = await supabase
    .from("checklists")
    .update({ items: JSON.parse(JSON.stringify(items)) })
    .eq("id", id)
    .select();

  if (error) {
    const msg = typeof error === "object" && error !== null && "message" in error
      ? String((error as any).message)
      : "Failed to update checklist";
    throw new Error(msg);
  }

  revalidatePath("/");
}

export async function deleteChecklist(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("checklists")
    .delete()
    .eq("id", id);

  if (error) {
    const msg = typeof error === "object" && error !== null && "message" in error
      ? String((error as any).message)
      : "Failed to delete checklist";
    throw new Error(msg);
  }

  revalidatePath("/");
}

export async function addChecklistItem(
  id: string,
  items: Array<{ text: string; done: boolean }>
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("checklists")
    .update({ items: JSON.parse(JSON.stringify(items)) })
    .eq("id", id)
    .select();

  if (error) {
    const msg = typeof error === "object" && error !== null && "message" in error
      ? String((error as any).message)
      : "Failed to add item";
    throw new Error(msg);
  }

  revalidatePath("/");
}

export async function deleteChecklistItem(
  id: string,
  items: Array<{ text: string; done: boolean }>
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("checklists")
    .update({ items: JSON.parse(JSON.stringify(items)) })
    .eq("id", id)
    .select();

  if (error) {
    const msg = typeof error === "object" && error !== null && "message" in error
      ? String((error as any).message)
      : "Failed to delete item";
    throw new Error(msg);
  }

  revalidatePath("/");
}
