"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createChangelogEntry(formData: FormData) {
  const version = String(formData.get("version")).trim();
  const label = String(formData.get("label")).trim();
  const notesText = String(formData.get("notes")).trim();

  if (!version) throw new Error("Version is required");
  if (!label) throw new Error("Label is required");
  if (!notesText) throw new Error("Notes are required");

  const notes = notesText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (notes.length === 0) throw new Error("At least one note is required");

  const supabase = await createClient();
  const { error } = await supabase
    .from("changelog")
    .insert({ version, label, notes: JSON.parse(JSON.stringify(notes)) });
  if (error) {
    const msg = typeof error === "object" && error !== null && "message" in error
      ? String((error as any).message)
      : "Failed to create changelog entry";
    throw new Error(msg);
  }

  revalidatePath("/changelog");
  redirect("/changelog");
}
