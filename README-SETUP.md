# Taskbase — Docs slice wired to Supabase

This is the first vertical cut: **auth → schema + RLS → live data → slug routing → image storage**, with the **Docs** module fully connected. The other eight modules already have tables and policies in the schema; they just need pages wired the same way Docs is.

## What's here

```
supabase/migrations/0001_init.sql   # all tables, RLS, triggers, storage bucket
middleware.ts                       # session refresh + route gate
lib/supabase/client.ts              # browser client (Client Components)
lib/supabase/server.ts              # server client (Server Components/Actions)
lib/supabase/middleware.ts          # updateSession helper
app/login/page.tsx + actions.ts     # real Supabase Auth (kills admin123)
app/docs/page.tsx                    # live SELECT list  (replaces seedDocs)
app/docs/[slug]/page.tsx             # fetch one doc by slug (deep-linkable)
app/docs/[slug]/editor.tsx           # save via Server Action + paste-to-upload
app/docs/actions.ts                  # createDoc / updateDoc
```

## Setup (about 10 minutes)

1. **Create a Supabase project** at supabase.com, then copy the URL + anon key into `.env.local` (see `.env.local.example`).

2. **Run the migration.** Either paste `supabase/migrations/0001_init.sql` into the Supabase SQL editor and run it, or with the CLI:
   ```bash
   supabase link --project-ref YOUR-REF
   supabase db push
   ```

3. **Turn off email confirmation** (solo internal tool): Supabase → Authentication → Providers → Email → disable "Confirm email". Otherwise `signUp` won't create a session until you click a link.

4. **Install deps** in your Next.js app (App Router, TS, Tailwind assumed — you already have these):
   ```bash
   pnpm add @supabase/supabase-js @supabase/ssr
   ```
   Make sure `@/*` resolves to the project root in `tsconfig.json`:
   ```json
   { "compilerOptions": { "paths": { "@/*": ["./*"] } } }
   ```

5. **Run it.**
   ```bash
   pnpm dev
   ```
   Visit any page → you're redirected to `/login` → sign up once → land on `/docs`.

## Prove the plumbing works

- Create a doc, type into it, hit **Save**, then **hard-refresh**. It persists. (Old prototype: gone on refresh.)
- Copy the `/docs/<slug>` URL, open it in a new tab → loads that exact doc.
- Open dev tools and delete the `admin123`-style bypass — there isn't one; the gate is the httpOnly session cookie the middleware checks server-side.
- In the SQL editor, `select * from docs;` shows your `user_id` on every row. RLS means a second account can't read them.
- Paste a screenshot into the editor → it uploads to the `doc-images` bucket and drops `![image](...)` at your cursor.

## Wiring the remaining modules (same recipe)

For Tasks, Bugs, etc., repeat the Docs pattern:
1. A Server Component page that does `supabase.from('<table>').select(...)`.
2. A Server Action for writes (`insert`/`update`/`delete`).
3. Client Components for interactivity (e.g. Kanban drag calls an `updateTaskStatus` action).

RLS is already on for all of them, so there's no per-module security work — just the data wiring.

## Notes / decisions

- **Single-user model.** Every row carries `user_id` defaulting to `auth.uid()`. To go multi-tenant later, add `workspace_id` + a `workspace_members` table and change each policy from `user_id = auth.uid()` to a membership check. Nothing else in this code assumes single-user.
- **uuid + slug.** uuid PKs keep IDs non-enumerable; the per-user-unique `slug` gives clean URLs.
- **Storage bucket is public** so `![](publicUrl)` renders without signed URLs. Writes are still owner-scoped by path. Switch to a private bucket + signed URLs if images must stay confidential.
