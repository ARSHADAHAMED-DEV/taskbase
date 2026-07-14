"use client";

import { useState } from "react";
import Icon from "@/components/icon";

const PROMPTS = [
  {
    id: 1,
    title: "Architecture stress-test",
    body: "You are a staff engineer. Given the schema and constraints below, find the top 3 failure modes and propose fixes. Focus on tenant isolation and race conditions.",
  },
  {
    id: 2,
    title: "Draft an ADR",
    body: "Write an ADR for the following decision. Use Context / Decision / Consequences. Keep each section tight and list trade-offs explicitly.",
  },
  {
    id: 3,
    title: "Code review pass",
    body: "Review this diff for security, N+1 queries, and missing edge cases. Return findings ranked by severity with a one-line fix each.",
  },
  {
    id: 4,
    title: "Explain like I ship tomorrow",
    body: "Explain this concept in 5 bullet points assuming I need to implement it in production tomorrow. No fluff, just what matters.",
  },
];

export default function PromptsPage() {
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {PROMPTS.map((p) => (
          <PromptCard key={p.id} prompt={p} />
        ))}
      </div>
    </div>
  );
}

function PromptCard({ prompt }: { prompt: { id: number; title: string; body: string } }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(prompt.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  }

  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-bold text-slate-800 dark:text-slate-200">
          {prompt.title}
        </p>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <Icon name="copy" className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{prompt.body}</p>
    </div>
  );
}
