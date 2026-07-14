import { login, signup } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <form className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-1 flex items-center gap-2 text-xl font-extrabold text-slate-100">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-lime-400 text-slate-900">
            ✦
          </span>
          taskbase
        </div>
        <p className="mb-6 text-xs text-slate-500">
          Sign in to your command center.
        </p>

        <label className="mb-1 block text-xs text-slate-400">Email</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-lime-400"
        />

        <label className="mb-1 block text-xs text-slate-400">Password</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-lime-400"
        />

        {error && (
          <p className="mb-3 rounded-lg bg-rose-950/40 px-3 py-2 text-xs text-rose-400">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            formAction={login}
            className="flex-1 rounded-lg bg-lime-400 py-2 text-sm font-semibold text-slate-900 transition hover:bg-lime-300"
          >
            Sign in
          </button>
          <button
            formAction={signup}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            Sign up
          </button>
        </div>
      </form>
    </main>
  );
}
