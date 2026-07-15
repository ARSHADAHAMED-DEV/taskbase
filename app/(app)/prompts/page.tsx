import { createClient } from "@/lib/supabase/server";
import PromptsList from "./list";

type Prompt = {
  id: string;
  title: string;
  body: string;
};

export default async function PromptsPage() {
  const supabase = await createClient();
  const { data: prompts } = await supabase
    .from("prompts")
    .select("id, title, body")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Prompts
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your reusable Claude + Gemini prompts
        </p>
      </div>

      <PromptsList prompts={(prompts ?? []) as Prompt[]} />
    </div>
  );
}
