import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  // middleware already called auth.getUser() (a network round trip to
  // Supabase) and redirected unauthenticated requests away, so it's safe
  // to read the session locally here instead of validating it again.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <AppShell userEmail={session?.user.email ?? null}>{children}</AppShell>;
}
