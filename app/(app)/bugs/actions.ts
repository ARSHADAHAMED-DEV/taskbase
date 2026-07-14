"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createBug(formData: FormData) {
  const title = String(formData.get("title")).trim();
  if (!title) throw new Error("Title is required");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bugs")
    .insert({ title, severity: "Med", status: "Open" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/bugs");
  redirect("/bugs");
}

export async function updateBugStatus(id: string, status: string) {
  const statuses = ["Open", "In progress", "Fixed"];
  const idx = statuses.indexOf(status);
  const nextStatus = statuses[(idx + 1) % statuses.length];

  const supabase = await createClient();
  const { error } = await supabase
    .from("bugs")
    .update({ status: nextStatus })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/bugs");
}
