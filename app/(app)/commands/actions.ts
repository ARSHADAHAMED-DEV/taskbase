"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createCommand(formData: FormData) {
  const label = String(formData.get("label")).trim();
  const cmd = String(formData.get("cmd")).trim();
  const tag = String(formData.get("tag")).trim() || "custom";

  if (!label) throw new Error("Label is required");
  if (!cmd) throw new Error("Command is required");

  const supabase = await createClient();
  const { error } = await supabase.from("commands").insert({ label, cmd, tag });
  if (error) throw new Error(error.message);

  revalidatePath("/commands");
  redirect("/commands");
}

export async function updateCommand(formData: FormData) {
  const id = String(formData.get("id")).trim();
  const label = String(formData.get("label")).trim();
  const cmd = String(formData.get("cmd")).trim();
  const tag = String(formData.get("tag")).trim() || "custom";

  if (!id) throw new Error("Command ID is required");
  if (!label) throw new Error("Label is required");
  if (!cmd) throw new Error("Command is required");

  const supabase = await createClient();
  const { error } = await supabase
    .from("commands")
    .update({ label, cmd, tag })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/commands");
}

export async function deleteCommand(formData: FormData) {
  const id = String(formData.get("id")).trim();

  if (!id) throw new Error("Command ID is required");

  const supabase = await createClient();
  const { error } = await supabase.from("commands").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/commands");
}
