import { createClient } from "@/lib/supabase/server";
import PageHead from "@/components/page-head";
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
    <>
      <PageHead kicker="Your reusable Claude + Gemini prompts" title="Prompts" />
      <div className="scroll">
        <PromptsList prompts={(prompts ?? []) as Prompt[]} />
      </div>
    </>
  );
}
