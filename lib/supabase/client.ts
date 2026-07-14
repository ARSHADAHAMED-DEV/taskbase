import { createBrowserClient } from "@supabase/ssr";

// Used in Client Components (e.g. the doc editor's paste-to-upload).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
