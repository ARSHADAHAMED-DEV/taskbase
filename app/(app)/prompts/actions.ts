"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createPrompt(formData: FormData) {
  const title = String(formData.get("title")).trim();
  const body = String(formData.get("body")).trim();

  if (!title) throw new Error("Title is required");
  if (!body) throw new Error("Body is required");

  const supabase = await createClient();
  const { error } = await supabase
    .from("prompts")
    .insert({ title, body });
  if (error) {
    const msg = typeof error === "object" && error !== null && "message" in error
      ? String((error as any).message)
      : "Failed to create prompt";
    throw new Error(msg);
  }

  revalidatePath("/prompts");
  redirect("/prompts");
}
