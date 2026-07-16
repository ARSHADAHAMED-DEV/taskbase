"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
import { updateDoc } from "../actions";
import { createClient } from "@/lib/supabase/client";

type Doc = {
  id: string;
  title: string;
  slug: string;
  status: string;
  body: string;
};

function inline(str: string, key: string | number) {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push(<span key={`${key}s${i++}`}>{str.slice(last, m.index)}</span>);
    const t = m[0];
    if (t.startsWith("**")) out.push(<strong key={`${key}b${i++}`}>{t.slice(2, -2)}</strong>);
    else out.push(<code key={`${key}c${i++}`}>{t.slice(1, -1)}</code>);
    last = re.lastIndex;
  }
  if (last < str.length) out.push(<span key={`${key}e`}>{str.slice(last)}</span>);
  return out;
}

function Markdown({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  text.split("\n").forEach((line, i) => {
    if (line.startsWith("## ")) out.push(<h3 key={i}>{inline(line.slice(3), i)}</h3>);
    else if (line.startsWith("# ")) out.push(<h2 key={i}>{inline(line.slice(2), i)}</h2>);
    else if (/^\s*[-*]\s/.test(line))
      out.push(
        <div key={i} className="li">
          <i>›</i>
          <span>{inline(line.replace(/^\s*[-*]\s/, ""), i)}</span>
        </div>
      );
    else if (/^\s*\d+\.\s/.test(line))
      out.push(
        <div key={i} className="li">
          <span>{inline(line.trim(), i)}</span>
        </div>
      );
    else if (line.trim() === "") out.push(<div key={i} className="sp" />);
    else out.push(<p key={i}>{inline(line, i)}</p>);
  });
  return <div className="md">{out}</div>;
}

export default function DocEditor({ doc }: { doc: Doc }) {
  const [title, setTitle] = useState(doc.title);
  const [body, setBody] = useState(doc.body);
  const [status, setStatus] = useState(doc.status);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
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

  async function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
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
    const { error } = await supabase.storage.from("doc-images").upload(path, file);

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
    <>
      <div className="phead">
        <div>
          <Link href="/docs" className="kick" style={{ display: "inline-block", marginBottom: 4 }}>
            ← All docs
          </Link>
          <input
            className="docttl"
            style={{ display: "block", fontSize: 34, fontWeight: 300, letterSpacing: "-.035em" }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="right" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="seg">
            {(["edit", "preview"] as const).map((m) => (
              <button
                key={m}
                className={mode === m ? "on" : ""}
                onClick={() => setMode(m)}
                style={{ textTransform: "capitalize" }}
              >
                {m}
              </button>
            ))}
          </div>
          <select
            className="inp"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: "8px 12px" }}
          >
            {["Draft", "Active", "Deprecated"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button className="btn" onClick={save} disabled={pending}>
            <Icon name={saved ? "check" : "docs"} size={13} />
            {pending ? "Saving…" : saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <div className="scroll">
        <div className="panel" style={{ display: "flex", flexDirection: "column" }}>
          <p className="dim" style={{ fontSize: 11, marginBottom: 10 }}>
            {uploading ? "Uploading image…" : "Tip: paste a screenshot to upload it inline."}
          </p>
          {mode === "edit" ? (
            <textarea
              ref={taRef}
              className="editor"
              spellCheck={false}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onPaste={onPaste}
            />
          ) : (
            <div style={{ minHeight: "52vh" }}>
              <Markdown text={body} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
