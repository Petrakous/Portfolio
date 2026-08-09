"use client";

import { useEffect, useState } from "react";
import { getPortfolioSection } from "./portfolio-data";
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
      <div className="avatar-webgl" data-avatar-webgl><span data-avatar-status>LOADING 3D</span></div>
      <div className="cinematic-vignette" aria-hidden="true" />
      <div className="avatar-controls" aria-label="Explore the portfolio">
        {homeCopy.signals.map((signal) => (
          <button key={signal.id} className={`hotspot hotspot-${signal.id}`} onClick={() => activate(signal.id)} aria-pressed={active === signal.id}>
            <span>{signal.index}</span>{signal.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState<SignalId | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const signal = homeCopy.signals.find((item) => item.id === active);
  const section = active ? getPortfolioSection(active) : null;
  const visibleCards = section?.cards.slice(0, 5) ?? [];

  const moveCard = (direction: number) => {
    if (!visibleCards.length) return;
    setCardIndex((current) => (current + direction + visibleCards.length) % visibleCards.length);
  };
  const cardPosition = (index: number) => {
    const distance = (index - cardIndex + visibleCards.length) % visibleCards.length;
    if (distance === 0) return "is-active";
    if (distance === 1) return "is-next";
    if (distance === visibleCards.length - 1) return "is-prev";
    return "is-hidden";
  };

  return (
    <main className="cinematic-home">
      <header className="home-identity"><p>{homeCopy.name}</p><span>{homeCopy.role}</span></header>
      <AvatarStage active={active} setActive={(next) => { setActive(next); setCardIndex(0); }} />

      <aside className={`signal-card ${signal ? `is-open side-${signal.side}` : ""}`} aria-live="polite" aria-hidden={!section}>
        {signal && section && (
          <>
            <button className="signal-close" onClick={() => setActive(null)} aria-label="Close information">×</button>
            <span>{signal.index} / {signal.label}</span>
            <div className="signal-deck" aria-label={`${signal.label} highlights`}>
              {visibleCards.map((card, index) => (
                <article className={`signal-slide ${cardPosition(index)}`} key={card.id} aria-hidden={index !== cardIndex}>
                  <div className={`signal-slide-visual ${card.image ? "has-image" : "is-abstract"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {card.image && <img src={card.image} alt={card.imageAlt ?? ""} />}
                    {!card.image && <b>{String(index + 1).padStart(2, "0")}</b>}
                  </div>
                  <small>{card.kicker}</small>
                  <h1>{card.title}</h1>
                  <p>{card.summary}</p>
                  <div className="signal-slide-tags">{card.tags.slice(0, 3).map((tag) => <i key={tag}>{tag}</i>)}</div>
                </article>
              ))}
            </div>
            <div className="signal-deck-controls">
              <button onClick={() => moveCard(-1)} aria-label="Previous card">←</button>
              <span>{String(cardIndex + 1).padStart(2, "0")} / {String(visibleCards.length).padStart(2, "0")}</span>
              <button onClick={() => moveCard(1)} aria-label="Next card">→</button>
            </div>
            <a className="signal-more" href={section.href}>More <i>↗</i></a>
          </>
        )}
      </aside>
    </main>
  );
}
