"use client";

import { useState, useTransition } from "react";
import Icon from "@/components/icon";
import { createPrompt } from "./actions";

type Prompt = {
  id: string;
  title: string;
  body: string;
};

export default function PromptsList({ prompts: initialPrompts }: { prompts: Prompt[] }) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      fd.set("title", title);
      fd.set("body", body);
      await createPrompt(fd);
      setTitle("");
      setBody("");
    });
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Title
            </label>
            <input
              type="text"
              placeholder="Prompt title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Body
            </label>
            <textarea
              placeholder="Prompt body..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-lime-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white mt-1 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={pending || !title.trim() || !body.trim()}
            className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-lime-300 disabled:opacity-60"
          >
            {pending ? "Adding…" : "+ New prompt"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {prompts.map((p) => (
          <PromptCard key={p.id} prompt={p} />
        ))}
        {prompts.length === 0 && (
          <p className="col-span-full text-center text-sm text-slate-500 dark:text-slate-400 py-8">
            No prompts yet. Create one to get started.
          </p>
        )}
      </div>
    </div>
  );
}

function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(prompt.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  }

  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-bold text-slate-800 dark:text-slate-200">{prompt.title}</h3>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 shrink-0"
        >
          <Icon name="copy" className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{prompt.body}</p>
    </div>
  );
}
