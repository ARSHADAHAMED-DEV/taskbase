-- =============================================================
-- Taskbase — internal command center: initial schema
-- Model: SINGLE-USER. Every row is owned by a Supabase auth user.
-- Security: Row-Level Security so the database itself enforces
--           "you can only touch your own rows" — never trusted
--           from the client.
--
-- To go multi-tenant later (the real Taskbase SaaS): add a
-- workspace_id column + workspaces/workspace_members tables, and
-- change each policy from `user_id = auth.uid()` to a membership
-- check. The column shape below is deliberately close to that.
-- =============================================================

create extension if not exists "pgcrypto";  -- for gen_random_uuid()

-- ---------- shared trigger: keep updated_at fresh ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================ DOCS ============================
create table public.docs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title      text not null default 'Untitled',
  slug       text not null,
  category   text not null default 'Dev Logs'
             check (category in ('Architecture','Dev Logs','SOPs')),
  status     text not null default 'Draft'
             check (status in ('Draft','Active','Deprecated')),
  body       text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)        -- slug is unique per user, not globally
);
create index docs_user_idx on public.docs (user_id, updated_at desc);
create trigger docs_set_updated_at before update on public.docs
  for each row execute function public.set_updated_at();

-- ============================ TASKS ==========================
create table public.tasks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title      text not null,
  status     text not null default 'backlog'
             check (status in ('backlog','doing','review','done')),
  priority   text not null default 'med'
             check (priority in ('low','med','high')),
  tag        text,
  position   double precision not null default 0,   -- ordering within a column
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tasks_user_idx on public.tasks (user_id, status, position);
create trigger tasks_set_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();

-- ========================== RUNBOOKS =========================
create table public.runbooks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title      text not null,
  slug       text not null,
  steps      jsonb not null default '[]'::jsonb,  -- [{ "text": "...", "done": false }]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);
create index runbooks_user_idx on public.runbooks (user_id);
create trigger runbooks_set_updated_at before update on public.runbooks
  for each row execute function public.set_updated_at();

-- ========================== COMMANDS =========================
create table public.commands (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  label      text not null,
  cmd        text not null,
  tag        text,
  created_at timestamptz not null default now()
);
create index commands_user_idx on public.commands (user_id);

-- ========================== ROADMAP ==========================
create table public.roadmap_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title      text not null,
  lane       text not null default 'later' check (lane in ('now','next','later')),
  position   double precision not null default 0,
  created_at timestamptz not null default now()
);
create index roadmap_user_idx on public.roadmap_items (user_id, lane, position);

-- ============================ BUGS ===========================
create table public.bugs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title      text not null,
  severity   text not null default 'Med' check (severity in ('Low','Med','High')),
  status     text not null default 'Open' check (status in ('Open','In progress','Fixed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bugs_user_idx on public.bugs (user_id);
create trigger bugs_set_updated_at before update on public.bugs
  for each row execute function public.set_updated_at();

-- ========================= CHANGELOG =========================
create table public.changelog (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  version    text not null,
  label      text,                              -- e.g. "Day 5"
  notes      jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index changelog_user_idx on public.changelog (user_id, created_at desc);

-- ========================= RESOURCES =========================
create table public.resources (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name        text not null,
  description text,
  url         text not null,
  created_at  timestamptz not null default now()
);
create index resources_user_idx on public.resources (user_id);

-- ========================== PROMPTS ==========================
create table public.prompts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title      text not null,
  body       text not null,
  created_at timestamptz not null default now()
);
create index prompts_user_idx on public.prompts (user_id);

-- ==================================================================
-- ROW LEVEL SECURITY
-- Enable RLS on every table and add owner-only policies. Because
-- user_id defaults to auth.uid(), inserts don't need to send it, and
-- the WITH CHECK guarantees a client can never write another user's id.
-- ==================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'docs','tasks','runbooks','commands','roadmap_items',
    'bugs','changelog','resources','prompts'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy "owner_select" on public.%I for select using (user_id = auth.uid());', t);
    execute format('create policy "owner_insert" on public.%I for insert with check (user_id = auth.uid());', t);
    execute format('create policy "owner_update" on public.%I for update using (user_id = auth.uid()) with check (user_id = auth.uid());', t);
    execute format('create policy "owner_delete" on public.%I for delete using (user_id = auth.uid());', t);
  end loop;
end $$;

-- ==================================================================
-- OPTIONAL: storage bucket for pasted images in the markdown editor.
-- (You can also create the bucket in the Supabase dashboard UI.)
-- Files are stored under `${auth.uid()}/...` so the insert/delete
-- policies scope writes to the owner. The bucket is public so the
-- ![](publicUrl) markdown renders without signed URLs — fine for an
-- internal tool; switch to signed URLs if these should stay private.
-- ==================================================================
insert into storage.buckets (id, name, public)
values ('doc-images', 'doc-images', true)
on conflict (id) do nothing;

create policy "doc_images_insert" on storage.objects for insert
  with check (bucket_id = 'doc-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "doc_images_delete" on storage.objects for delete
  using (bucket_id = 'doc-images' and (storage.foldername(name))[1] = auth.uid()::text);

-- ==================================================================
-- OPTIONAL SEED (run AFTER you've signed up once).
-- auth.uid() is NULL in the SQL editor, so paste your own user id:
--   select id, email from auth.users;   -- copy your id
-- then:
--   insert into public.docs (user_id, title, slug, category, status, body)
--   values ('<YOUR-USER-ID>', 'System Architecture ADR',
--           'system-architecture-adr', 'Architecture', 'Active',
--           '# ADR-001: Next.js + Supabase\n\n## Context\n...');
-- ==================================================================
