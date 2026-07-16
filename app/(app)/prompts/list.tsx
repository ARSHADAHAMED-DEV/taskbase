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
  const [prompts] = useState(initialPrompts);
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
    <div className="stack">
      <form onSubmit={handleCreate} className="panel">
        <div className="ptitle">
          <h3>New prompt</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input className="inp" placeholder="Prompt title…" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea
            className="inp"
            style={{ borderRadius: "var(--r-sm)", minHeight: 96, resize: "vertical" }}
            placeholder="Prompt body…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button className="btn" type="submit" disabled={pending || !title.trim() || !body.trim()} style={{ alignSelf: "flex-start" }}>
            <Icon name="plus" size={13} />
            {pending ? "Adding…" : "New prompt"}
          </button>
        </div>
      </form>

      <div className="g2">
        {prompts.map((p) => (
          <PromptCard key={p.id} prompt={p} />
        ))}
      </div>
      {prompts.length === 0 && (
        <p className="dim" style={{ textAlign: "center", fontSize: 13, padding: "32px 0" }}>
          No prompts yet. Create one to get started.
        </p>
      )}
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
    <div className="panel">
      <div className="ptitle">
        <h3>{prompt.title}</h3>
        <button className="btn ghost" onClick={copy}>
          <Icon name={copied ? "check" : "copy"} size={13} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="muted" style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
        {prompt.body}
      </p>
    </div>
  );
}
