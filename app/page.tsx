"use client";

import { useEffect, useState } from "react";
import { homeCopy, type SignalId } from "./site-copy";

function AvatarStage({ active, setActive }: { active: SignalId | null; setActive: (signal: SignalId | null) => void }) {
  const activate = (signal: SignalId) => setActive(active === signal ? null : signal);

  useEffect(() => {
    const existing = document.querySelector("script[data-avatar-runtime]");
    if (existing) return;
    const runtime = document.createElement("script");
    runtime.type = "module";
    runtime.src = "/avatar/avatar-viewer.js";
    runtime.dataset.avatarRuntime = "true";
    document.body.append(runtime);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("avatar-mode", { detail: active ?? "neutral" }));
  }, [active]);

  return (
    <div className="avatar-stage" data-state={active ?? "neutral"} aria-label="Interactive 3D navigation">
      <div className="avatar-webgl" data-avatar-webgl>
        <span data-avatar-status>LOADING 3D</span>
      </div>
      <div className="cinematic-vignette" aria-hidden="true" />
      <div className="avatar-controls" aria-label="Explore the portfolio">
        {homeCopy.signals.map((signal) => (
          <button
            key={signal.id}
            className={`hotspot hotspot-${signal.id}`}
            onClick={() => activate(signal.id)}
            aria-pressed={active === signal.id}
          >
            <span>{signal.index}</span>{signal.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState<SignalId | null>(null);
  const signal = homeCopy.signals.find((item) => item.id === active);

  return (
    <main className="cinematic-home">
      <header className="home-identity">
        <p>{homeCopy.name}</p>
        <span>{homeCopy.role}</span>
      </header>

      <AvatarStage active={active} setActive={setActive} />

      <aside className={`signal-card ${signal ? `is-open side-${signal.side}` : ""}`} aria-live="polite" aria-hidden={!signal}>
        {signal && (
          <>
            <button className="signal-close" onClick={() => setActive(null)} aria-label="Close information">×</button>
            <span>{signal.index} / {signal.label}</span>
            <h1>{signal.title}</h1>
            <p>{signal.body}</p>
            <ul>{signal.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            {signal.href && <a href={signal.href}>{signal.action} <i>↗</i></a>}
          </>
        )}
      </aside>
    </main>
  );
}
