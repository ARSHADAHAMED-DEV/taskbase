"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return (
    input.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "untitled"
  );
}

export async function createDoc() {
  const supabase = await createClient();

  const base = slugify("untitled");
  let slug = base;
  for (let i = 2; ; i++) {
    const { data } = await supabase
      .from("docs").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${base}-${i}`;
  }

  const { data, error } = await supabase
    .from("docs")
    .insert({ title: "Untitled", slug, body: "# Untitled\n\n" })
    .select("slug").single();
  if (error) throw new Error(error.message);

  revalidatePath("/docs");
  redirect(`/docs/${data.slug}`);
}

export async function createDocAction() {
  await createDoc();
}

export async function updateDoc(
  id: string,
  fields: { title: string; body: string; status: string },
) {
  const supabase = await createClient();
  const { error } = await supabase.from("docs").update(fields).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/docs");
}