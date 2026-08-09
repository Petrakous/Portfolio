"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { getPortfolioSection, type PortfolioCard } from "./portfolio-data";
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
  const [isSwitching, setIsSwitching] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PortfolioCard | null>(null);
  const [carouselPosition, setCarouselPosition] = useState(0);
  const [carouselStep, setCarouselStep] = useState(285);
  const [isDraggingCarousel, setIsDraggingCarousel] = useState(false);
  const transitionTimer = useRef<number | null>(null);
  const carouselDragStart = useRef<number | null>(null);
  const carouselDragOrigin = useRef(0);
  const suppressCardClick = useRef(false);
  const signal = homeCopy.signals.find((item) => item.id === active);
  const section = active ? getPortfolioSection(active) : null;
  const visibleCards = section?.cards.slice(0, 5) ?? [];
  const cardIndex = visibleCards.length
    ? ((Math.round(carouselPosition) % visibleCards.length) + visibleCards.length) % visibleCards.length
    : 0;

  const distanceFromCenter = (index: number, position = carouselPosition) => {
    if (!visibleCards.length) return 0;
    let distance = (index - position) % visibleCards.length;
    if (distance > visibleCards.length / 2) distance -= visibleCards.length;
    if (distance < -visibleCards.length / 2) distance += visibleCards.length;
    return distance;
  };
  const beginCarouselDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    carouselDragStart.current = event.clientX;
    carouselDragOrigin.current = carouselPosition;
    suppressCardClick.current = false;
  };
  const updateCarouselDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (carouselDragStart.current === null) return;
    event.stopPropagation();
    const distance = event.clientX - carouselDragStart.current;
    if (Math.abs(distance) <= 6 && !isDraggingCarousel) return;
    if (!isDraggingCarousel) {
      suppressCardClick.current = true;
      setIsDraggingCarousel(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setCarouselPosition(carouselDragOrigin.current - distance / carouselStep);
  };
  const endCarouselDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (carouselDragStart.current === null) return;
    event.stopPropagation();
    carouselDragStart.current = null;
    setIsDraggingCarousel(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setCarouselPosition((position) => Math.round(position));
    window.setTimeout(() => { suppressCardClick.current = false; }, 0);
  };
  const cancelCarouselDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (carouselDragStart.current === null) return;
    carouselDragStart.current = null;
    suppressCardClick.current = false;
    setIsDraggingCarousel(false);
    setCarouselPosition(Math.round(carouselDragOrigin.current));
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const activateCarouselCard = (card: PortfolioCard, index: number) => {
    if (suppressCardClick.current) {
      suppressCardClick.current = false;
      return;
    }
    if (index === cardIndex) setSelectedCard(card);
    else setCarouselPosition((position) => position + distanceFromCenter(index, position));
  };

  const changeActive = (next: SignalId | null) => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    if (!active && next) {
      setActive(next);
      setCarouselPosition(0);
      return;
    }

    setIsSwitching(true);
    transitionTimer.current = window.setTimeout(() => {
      setActive(next);
      setCarouselPosition(0);
      if (!next) {
        setIsSwitching(false);
        transitionTimer.current = null;
        return;
      }
      transitionTimer.current = window.setTimeout(() => {
        setIsSwitching(false);
        transitionTimer.current = null;
      }, 70);
    }, 200);
  };

  useEffect(() => () => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
  }, []);

  useEffect(() => {
    const updateStep = () => setCarouselStep(window.innerWidth <= 760 ? Math.max(170, (window.innerWidth - 96) * .68) : 285);
    updateStep();
    window.addEventListener("resize", updateStep);
    return () => window.removeEventListener("resize", updateStep);
  }, []);

  useEffect(() => {
    if (!selectedCard) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCard(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedCard]);

  return (
    <main className="cinematic-home">
      <header className="home-identity"><p>{homeCopy.name}</p></header>
      <AvatarStage active={active} setActive={changeActive} />

      <aside className={`signal-card ${signal ? `is-open side-${signal.side}` : ""} ${isSwitching ? "is-switching" : ""}`} aria-live="polite" aria-hidden={!section}>
        {signal && section && (
          <>
            <div className="signal-card-meta">
              <span>{signal.index} / {signal.label}</span>
              <button className="signal-close" onClick={() => changeActive(null)} aria-label="Close information">×</button>
            </div>
            <div
              className={`signal-deck ${isDraggingCarousel ? "is-dragging" : ""}`}
              aria-label={`${signal.label} highlights`}
              onPointerDown={beginCarouselDrag}
              onPointerMove={updateCarouselDrag}
              onPointerUp={endCarouselDrag}
              onPointerCancel={cancelCarouselDrag}
            >
              {visibleCards.map((card, index) => {
                const distance = distanceFromCenter(index);
                const depth = Math.min(Math.abs(distance), 2.5);
                const isCentered = index === cardIndex;
                const edgeFade = Math.max(0, Math.min(1, (2 - depth) / .85));
                const cardOpacity = edgeFade * Math.max(.16, 1 - depth * .38);
                return (
                <article
                  className={`signal-slide ${isCentered ? "is-centered" : ""}`}
                  key={card.id}
                  aria-hidden={!isCentered}
                  style={{
                    transform: `translate3d(calc(-50% + ${distance * carouselStep}px), ${Math.min(depth, 1) * 10}px, ${24 - depth * 79}px) rotateY(${distance * -5}deg) scale(${1 - depth * .055})`,
                    opacity: cardOpacity,
                    filter: `blur(${depth * 2.1}px) saturate(${Math.max(.5, 1 - depth * .3)})`,
                    zIndex: Math.round(10 - depth * 2),
                    pointerEvents: depth <= 1.25 ? "auto" : "none",
                  }}
                >
                  <div className={`signal-slide-visual ${card.image ? "has-image" : "is-abstract"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {card.image && <img src={card.image} alt={card.imageAlt ?? ""} />}
                    {!card.image && <b>{String(index + 1).padStart(2, "0")}</b>}
                  </div>
                  <small>{card.kicker}</small>
                  <h1>{card.title}</h1>
                  <p>{card.summary}</p>
                  <div className="signal-slide-tags">{card.tags.slice(0, 3).map((tag) => <i key={tag}>{tag}</i>)}</div>
                  {isCentered && <span className="signal-slide-hint">View details ↗</span>}
                  <button
                    className="signal-slide-open"
                    type="button"
                    tabIndex={isCentered ? 0 : -1}
                    onClick={() => activateCarouselCard(card, index)}
                    aria-label={isCentered ? `Open details for ${card.title}` : `Show ${card.title}`}
                  />
                </article>
              )})}
            </div>
            <div className="signal-deck-footer">
              <span>{String(cardIndex + 1).padStart(2, "0")} / {String(visibleCards.length).padStart(2, "0")}</span>
              <a className="signal-more" href={section.href}>More <i>↗</i></a>
            </div>
          </>
        )}
      </aside>

      {selectedCard && section && (
        <div className="portfolio-dialog-backdrop">
          <button className="portfolio-dialog-dismiss" type="button" onClick={() => setSelectedCard(null)} aria-label="Close details" />
          <article className="portfolio-dialog" role="dialog" aria-modal="true" aria-labelledby="home-portfolio-dialog-title">
            <button className="portfolio-dialog-close" type="button" onClick={() => setSelectedCard(null)} aria-label="Close details">×</button>
            <div className="portfolio-dialog-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {selectedCard.image && <img src={selectedCard.image} alt={selectedCard.imageAlt ?? ""} />}
            </div>
            <div className="portfolio-dialog-copy">
              <small>{section.label} / {selectedCard.group}</small>
              <span>{selectedCard.kicker}</span>
              <h2 id="home-portfolio-dialog-title">{selectedCard.title}</h2>
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
