"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useTheme } from "@/app/lib/theme-context";
import Icon from "@/components/icon";
import { login, signup } from "./actions";

function SubmitButton({ mode }: { mode: "signin" | "signup" }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="btn"
      type="submit"
      formAction={mode === "signin" ? login : signup}
      disabled={pending}
      style={{ width: "100%", marginTop: 22, padding: 14, fontSize: 13.5 }}
    >
      {pending && (
        <span className="spin" style={{ display: "grid" }}>
          <Icon name="load" size={14} />
        </span>
      )}
      {mode === "signin" ? "Sign in" : "Create account"}
    </button>
  );
}

export default function LoginForm({ error }: { error?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [show, setShow] = useState(false);

  return (
    <main className="login">
      <button className="iconbtn ltoggle" onClick={toggleTheme} title="Toggle theme">
        <Icon name={theme === "dark" ? "sun" : "moon"} size={14} />
      </button>

      <form className="lcard fade">
        <div className="logo">
          <span className="mk">✦</span>
          <b>taskbase</b>
        </div>
        <h1>
          {mode === "signin" ? (
            <>
              Sign in to your
              <br />
              command center
            </>
          ) : (
            <>
              Create your
              <br />
              workspace
            </>
          )}
        </h1>
        <p className="sub">
          {mode === "signin"
            ? "Everything you've built this sprint, in one place."
            : "Start your build log."}
        </p>

        <label className="field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@studio.dev"
          />
        </label>

        <label className="field">
          <span>Password</span>
          <div className="box">
            <input
              name="password"
              type={show ? "text" : "password"}
              required
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="••••••••"
            />
            <button type="button" className="peek" onClick={() => setShow((s) => !s)}>
              {show ? "HIDE" : "SHOW"}
            </button>
          </div>
        </label>

        {error && (
          <p className="alert">
            <Icon name="warn" size={14} />
            {error}
          </p>
        )}

        <SubmitButton mode={mode} />

        <p className="dim" style={{ marginTop: 18, textAlign: "center", fontSize: 12 }}>
          {mode === "signin" ? "New here? " : "Have an account? "}
          <button
            type="button"
            style={{ fontWeight: 700, color: "var(--ink)" }}
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </form>
    </main>
  );
}
