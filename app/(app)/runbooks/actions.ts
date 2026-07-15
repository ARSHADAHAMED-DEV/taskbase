"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Step = {
  text: string;
  done: boolean;
};

export async function createRunbook(formData: FormData) {
  const title = String(formData.get("title")).trim();

  if (!title) throw new Error("Title is required");

  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const starterSteps: Step[] = [{ text: "First step", done: false }];

  const supabase = await createClient();
  const { error } = await supabase
    .from("runbooks")
    .insert({ title, slug, steps: starterSteps });
  if (error) {
    const msg = typeof error === "object" && error !== null && "message" in error
      ? String((error as any).message)
      : "Failed to create runbook";
    throw new Error(msg);
  }

  revalidatePath("/runbooks");
  redirect("/runbooks");
}

export async function updateRunbookSteps(id: string, steps: Step[]) {
  if (!id) throw new Error("Runbook ID is required");
  if (!Array.isArray(steps)) throw new Error("Steps must be an array");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("runbooks")
    .update({ steps: JSON.parse(JSON.stringify(steps)) })
    .eq("id", id)
    .select();

  if (error) {
    const msg = typeof error === "object" && error !== null && "message" in error
      ? String((error as any).message)
      : "Failed to update runbook";
    throw new Error(msg);
  }

  revalidatePath("/runbooks");
  return data;
}
