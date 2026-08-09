"use client";

import { useEffect, useState } from "react";
import type { PortfolioCard, PortfolioSection } from "./portfolio-data";

export function SectionPage({ section }: { section: PortfolioSection }) {
  const groups = [...new Set(section.cards.map((card) => card.group))];
  const [selectedCard, setSelectedCard] = useState<PortfolioCard | null>(null);

  useEffect(() => {
    if (!selectedCard) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCard(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedCard]);

  return (
    <main className="section-index">
      <header className="section-index-header">
        {/* Full navigation intentionally reinitializes the standalone WebGL runtime. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">← 3D INDEX</a>
        <p>PETROS KOUTROULIS</p>
      </header>

      <section className="section-index-intro">
        <span>{section.label}</span>
        <h1>{section.title}</h1>
        <p>{section.intro}</p>
      </section>

      {groups.map((group) => {
        const cards = section.cards.filter((card) => card.group === group);
        const layoutClass = cards.length <= 3 ? `is-centered card-count-${cards.length}` : "is-scrollable";
        return (
          <section className="card-group" key={group} aria-labelledby={`${section.id}-${group.replaceAll(" ", "-")}`}>
            <header>
              <h2 id={`${section.id}-${group.replaceAll(" ", "-")}`}>{group}</h2>
              <span>{String(cards.length).padStart(2, "0")}</span>
            </header>
            <div className={`portfolio-card-grid ${layoutClass}`}>
              {cards.map((card) => (
                <article className="portfolio-card" key={card.id} id={card.id}>
                  <div className="portfolio-card-visual has-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.image} alt={card.imageAlt ?? ""} />
                  </div>
                  <small>{card.kicker}</small>
                  <h3>{card.title}</h3>
                  <p>{card.summary}</p>
                  {card.evidence && <em>{card.evidence}</em>}
                  <div className="portfolio-card-tags">{card.tags.map((tag) => <i key={tag}>{tag}</i>)}</div>
                  <span className="portfolio-card-hint">Open ↗</span>
                  <button className="portfolio-card-open" type="button" onClick={() => setSelectedCard(card)} aria-label={`Open details for ${card.title}`} />
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <footer className="section-index-footer">
        <div>
          <a href="https://github.com/Petrakous" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/petrakous" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href="mailto:peterkoutroulis2004@gmail.com">Email ↗</a>
        </div>
      </footer>

      {selectedCard && (
        <div className="portfolio-dialog-backdrop">
          <button className="portfolio-dialog-dismiss" type="button" onClick={() => setSelectedCard(null)} aria-label="Close details" />
          <article className="portfolio-dialog" role="dialog" aria-modal="true" aria-labelledby="portfolio-dialog-title">
            <button className="portfolio-dialog-close" type="button" onClick={() => setSelectedCard(null)} aria-label="Close details">×</button>
            <div className="portfolio-dialog-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedCard.image} alt={selectedCard.imageAlt ?? ""} />
            </div>
            <div className="portfolio-dialog-copy">
              <small>{section.label} / {selectedCard.group}</small>
              <span>{selectedCard.kicker}</span>
              <h2 id="portfolio-dialog-title">{selectedCard.title}</h2>
              <p>{selectedCard.summary}</p>
              {selectedCard.evidence && <div className="portfolio-dialog-evidence"><b>Evidence</b>{selectedCard.evidence}</div>}
              <div className="portfolio-dialog-tags">{selectedCard.tags.map((tag) => <i key={tag}>{tag}</i>)}</div>
              {selectedCard.links?.length ? (
                <div className="portfolio-dialog-links">
                  {selectedCard.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
                </div>
              ) : null}
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
