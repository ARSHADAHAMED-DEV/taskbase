"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { updateDoc } from "../actions";
import { createClient } from "@/lib/supabase/client";

type Doc = {
  id: string;
  title: string;
  slug: string;
  status: string;
  body: string;
};

export default function DocEditor({ doc }: { doc: Doc }) {
  const [title, setTitle] = useState(doc.title);
  const [body, setBody] = useState(doc.body);
  const [status, setStatus] = useState(doc.status);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pending, startSave] = useTransition();
  const taRef = useRef<HTMLTextAreaElement>(null);

  function save() {
    startSave(async () => {
      await updateDoc(doc.id, { title, body, status });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  // Ctrl/Cmd-V an image -> upload to Storage -> inject markdown at cursor.
  async function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const file = Array.from(e.clipboardData.files).find((f) =>
      f.type.startsWith("image/"),
    );
    if (!file) return;
    e.preventDefault();
    setUploading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setUploading(false);
      return;
    }

    const ext = file.type.split("/")[1] || "png";
    const path = `${user.id}/${doc.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("doc-images")
      .upload(path, file);

    if (error) {
      setUploading(false);
      alert("Image upload failed: " + error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("doc-images").getPublicUrl(path);

    const ta = taRef.current!;
    const pos = ta.selectionStart ?? body.length;
    const md = `\n![image](${publicUrl})\n`;
    setBody(body.slice(0, pos) + md + body.slice(pos));
    setUploading(false);
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Link href="/docs" className="text-xs text-slate-400 hover:text-slate-600">
        ← All docs
      </Link>

      <div className="mb-3 mt-3 flex flex-wrap items-center gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-2xl font-extrabold text-slate-900 outline-none"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 bg-transparent px-2 py-1 text-xs text-slate-600"
        >
          {["Draft", "Active", "Deprecated"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={save}
          disabled={pending}
          className="rounded-lg bg-lime-400 px-4 py-1.5 text-sm font-semibold text-slate-900 transition hover:bg-lime-300 disabled:opacity-60"
        >
          {pending ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>

      <p className="mb-2 text-[11px] text-slate-400">
        {uploading
          ? "Uploading image…"
          : "Tip: paste a screenshot to upload it inline."}
      </p>

      <textarea
        ref={taRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onPaste={onPaste}
        spellCheck={false}
        className="min-h-[60vh] w-full resize-none rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm leading-relaxed text-slate-800 outline-none focus:border-lime-300"
      />
    </div>
  );
}
