"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { projects, searchItems, skillDomains, type Project } from "./content";

type HeroMode = "neutral" | "knowledge" | "projects" | "research" | "about";
type ViewMode = "overview" | "lab";

const heroCopy: Record<HeroMode, { kicker: string; title: string; body: string }> = {
  neutral: {
    kicker: "Select a signal",
    title: "This interface is a map of the work.",
    body: "Use the head, hands, or chest. Every path is also available in the page below.",
  },
  knowledge: {
    kicker: "Knowledge map",
    title: "Skills, attached to evidence.",
    body: "Computer vision, spatial computing, research data tooling, and software engineering — each connected to something built.",
  },
  projects: {
    kicker: "Right hand · work",
    title: "Systems designed to be explored.",
    body: "From splat-rendered campuses to model-comparison surfaces and research curation workflows.",
  },
  research: {
    kicker: "Left hand · research",
    title: "Research becomes useful through tools.",
    body: "Current work supports TRIFFID with dataset pipelines, annotation, curation, visual QA, and reproducible media workflows.",
  },
  about: {
    kicker: "Chest · identity",
    title: "Petros Koutroulis — Petrakous.",
    body: "Research associate, Informatics & Telematics student, and builder of interfaces for complex technical work.",
  },
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function AvatarRig({ mode, setMode }: { mode: HeroMode; setMode: (mode: HeroMode) => void }) {
  const activate = (next: HeroMode) => setMode(mode === next ? "neutral" : next);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("avatar-mode", { detail: mode }));
  }, [mode]);

  return (
    <div className="avatar-stage" data-state={mode} aria-label="Interactive portfolio navigation">
      <div className="avatar-webgl" data-avatar-webgl>
        <span className="avatar-load-status" data-avatar-status>INITIALISING 3D SPLAT PROXY</span>
      </div>
      <div className="orbit orbit-a" />
      <div className="orbit orbit-b" />
      <div className="avatar-glow" />
      <div className="avatar-rig" aria-hidden="true">
        <div className="rig-shadow" />
        <div className="rig-head">
          <span className="face-grid" />
          <span className="face-eye eye-left" />
          <span className="face-eye eye-right" />
        </div>
        <div className="rig-neck" />
        <div className="rig-torso"><span>PK</span></div>
        <div className="rig-arm arm-left"><i className="upper" /><i className="lower" /><i className="hand" /></div>
        <div className="rig-arm arm-right"><i className="upper" /><i className="lower" /><i className="hand" /></div>
        <div className="rig-leg leg-left"><i className="upper" /><i className="lower" /></div>
        <div className="rig-leg leg-right"><i className="upper" /><i className="lower" /></div>
      </div>

      <button className="hotspot hotspot-head" onClick={() => activate("knowledge")} aria-pressed={mode === "knowledge"}>
        <span>01</span> Knowledge
      </button>
      <button className="hotspot hotspot-left" onClick={() => activate("research")} aria-pressed={mode === "research"}>
        <span>02</span> Research
      </button>
      <button className="hotspot hotspot-right" onClick={() => activate("projects")} aria-pressed={mode === "projects"}>
        <span>03</span> Work
      </button>
      <button className="hotspot hotspot-chest" onClick={() => activate("about")} aria-pressed={mode === "about"}>
        <span>04</span> About
      </button>

      <div className="skill-halo" aria-hidden={mode !== "knowledge"}>
        {['CV', '3D', 'DATA', 'WEB'].map((item) => <span key={item}>{item}</span>)}
      </div>
      <div className="hand-projects" aria-hidden={mode !== "projects"}>
        {projects.map((project) => (
          <button key={project.id} onClick={() => scrollToId(project.id)}>{project.index}<b>{project.title}</b></button>
        ))}
      </div>
      <div className="research-signal" aria-hidden={mode !== "research"}>
        <span>TRIFFID</span><span>CV GROUP</span><span>HUA</span>
      </div>
    </div>
  );
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchItems;
    return searchItems.filter((item) => `${item.label} ${item.kind} ${item.detail} ${item.keywords}`.toLowerCase().includes(normalized));
  }, [query]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="palette-backdrop">
      <button className="palette-dismiss" onClick={onClose} aria-label="Close portfolio search" />
      <section className="palette" role="dialog" aria-modal="true" aria-label="Search portfolio">
        <div className="palette-search">
          <span aria-hidden="true">⌕</span>
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, technologies, research…" />
          <kbd>ESC</kbd>
        </div>
        <div className="palette-results">
          {matches.length ? matches.slice(0, 9).map((item) => (
            <button key={`${item.kind}-${item.label}`} onClick={() => { onClose(); scrollToId(item.target); }}>
              <span><small>{item.kind}</small><b>{item.label}</b><em>{item.detail}</em></span>
              <i>↘</i>
            </button>
          )) : <p className="palette-empty">No matching signal. Try “Gaussian”, “Python”, “Java”, or “research”.</p>}
        </div>
      </section>
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="project-links">
      {project.live && <a href={project.live} target="_blank" rel="noreferrer">Live experience <span>↗</span></a>}
      {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">Source <span>↗</span></a>}
    </div>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  return (
    <div className="project-image-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={project.image} alt={project.imageAlt ?? ""} loading="lazy" />
      <div className="scanline" />
      <span className="image-coordinate">{project.index} / FIELD VIEW</span>
    </div>
  );
}

function ProjectChapter({ project, viewMode }: { project: Project; viewMode: ViewMode }) {
  return (
    <article className={`project-chapter tone-${project.tone}`} id={project.id} data-reveal>
      <header className="chapter-header">
        <span>{project.index}</span>
        <p>{project.eyebrow}</p>
        <i>{viewMode === "lab" ? "ENGINEERING VIEW" : "SELECTED WORK"}</i>
      </header>
      <div className="chapter-grid">
        <div className="chapter-copy">
          <h3>{project.title}</h3>
          <p className="project-summary">{project.summary}</p>
          <p className="project-description">{project.description}</p>
          <div className="project-role"><small>MY CONTRIBUTION</small><p>{project.contribution}</p></div>
          <ProjectLinks project={project} />
        </div>
        <div className="chapter-visual"><ProjectVisual project={project} /></div>
      </div>
      <footer className="chapter-footer">
        <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="fact-row">{project.facts.map((fact) => <span key={fact}><i />{fact}</span>)}</div>
      </footer>
      <div className="lab-specs" aria-hidden={viewMode !== "lab"}>
        <span><small>INPUT</small><b>{project.lab.input}</b></span>
        <span><small>RUNTIME</small><b>{project.lab.runtime}</b></span>
        <span><small>DELIVERY</small><b>{project.lab.delivery}</b></span>
        <span><small>ENGINEERING FOCUS</small><b>{project.lab.focus}</b></span>
      </div>
    </article>
  );
}

export default function Home() {
  const [heroMode, setHeroMode] = useState<HeroMode>("neutral");
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((current) => !current);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("avatar-view", { detail: viewMode }));
  }, [viewMode]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const onHeroPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 2}`);
    event.currentTarget.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 2}`);
  };

  return (
    <main className={`site-shell view-${viewMode}`}>
      <a className="skip-link" href="#selected-work">Skip to selected work</a>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Petrakous home"><b>PK</b><span>PETRAKOUS<small>RESEARCH / DEVELOPMENT</small></span></a>
        <nav aria-label="Primary navigation">
          <a href="#selected-work">Work</a>
          <a href="#experience">Path</a>
          <a href="#knowledge">Knowledge</a>
        </nav>
        <div className="top-actions">
          <div className="view-switch" aria-label="Portfolio view">
            <button aria-pressed={viewMode === "overview"} className={viewMode === "overview" ? "active" : ""} onClick={() => setViewMode("overview")}>Overview</button>
            <button aria-pressed={viewMode === "lab"} className={viewMode === "lab" ? "active" : ""} onClick={() => setViewMode("lab")}>Lab</button>
          </div>
          <button className="search-trigger" onClick={() => setPaletteOpen(true)} aria-label="Open portfolio search">⌕ <span>Search</span><kbd>⌘K</kbd></button>
        </div>
      </header>

      <section id="top" ref={heroRef} className="hero" onPointerMove={onHeroPointerMove}>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><i /> Research tooling · 3D systems · software engineering</p>
          <h1>I build tools that make <em>complex systems</em> usable.</h1>
          <p className="hero-lede">Petros Koutroulis is a research associate and developer working across computer vision, data pipelines, 3D web, and research software.</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => scrollToId("selected-work")}>Explore selected work <span>↓</span></button>
            <a href="mailto:peterkoutroulis2004@gmail.com">Start a conversation <span>↗</span></a>
          </div>
          <div className="availability"><span>AVAILABLE FOR SELECT COLLABORATIONS</span><span>ATHENS · GR</span></div>
        </div>

        <div className="hero-avatar"><AvatarRig mode={heroMode} setMode={setHeroMode} /></div>

        <aside className="hero-signal" aria-live="polite">
          <span>{heroCopy[heroMode].kicker}</span>
          <h2>{heroCopy[heroMode].title}</h2>
          <p>{heroCopy[heroMode].body}</p>
          {heroMode !== "neutral" && <button onClick={() => setHeroMode("neutral")}>Return to neutral ↙</button>}
        </aside>
        <div className="scroll-mark"><span>SCROLL TO ENTER</span><i /></div>
      </section>

      <section className="manifesto" data-reveal>
        <p>PORTFOLIO / PERSONAL RESEARCH LAB</p>
        <blockquote>“The interface is not decoration. It is how complex work becomes understandable.”</blockquote>
        <div><span>01 Spatial systems</span><span>02 Perception tooling</span><span>03 Research operations</span></div>
      </section>

      <section className="work-section" id="selected-work">
        <header className="section-heading" data-reveal>
          <p>SELECTED WORK <span>2024—NOW</span></p>
          <h2>Built for depth.<br /><em>Designed for use.</em></h2>
          <p>Three systems, three different ways of turning difficult technical material into something people can inspect, navigate, and act on.</p>
        </header>
        <div className="view-explainer" data-reveal>
          <span>{viewMode === "overview" ? "OVERVIEW MODE" : "LAB MODE"}</span>
          <p>{viewMode === "overview" ? "Narrative view: the problem, the interface, and the contribution." : "Engineering view: verified inputs, runtime, delivery path, and the constraint each system is designed around."}</p>
        </div>
        {projects.map((project) => <ProjectChapter key={project.id} project={project} viewMode={viewMode} />)}
      </section>

      <section className="pipeline-interlude" data-reveal>
        <div className="pipeline-copy">
          <p>RESEARCH PIPELINE / TRIFFID</p>
          <h2>From unstructured footage to <em>reviewable evidence.</em></h2>
          <p>The review workspace keeps human judgment visible: source review, scene selection, frame decisions, crop audit, and a repeatable export.</p>
          <div className="pipeline-steps">
            {['INGEST', 'DETECT', 'SELECT', 'REFINE', 'EXPORT'].map((step, index) => <span key={step}><i>{String(index + 1).padStart(2, '0')}</i>{step}</span>)}
          </div>
        </div>
        <div className="pipeline-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/triffid-crop-audit.png" alt="TRIFFID crop and graphics audit interface" loading="lazy" />
          <span>HUMAN-IN-THE-LOOP / CROP AUDIT</span>
        </div>
      </section>

      <section className="knowledge-section" id="knowledge">
        <header className="section-heading compact" data-reveal>
          <p>KNOWLEDGE MAP <span>CLAIM → EVIDENCE</span></p>
          <h2>No skill bars.<br /><em>Only proof.</em></h2>
        </header>
        <div className="knowledge-grid">
          {skillDomains.map((domain, index) => (
            <button key={domain.title} onClick={() => scrollToId(domain.project)} data-reveal>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{domain.title}</h3>
              <p>{domain.skills}</p>
              <small>USED IN</small>
              <strong>{domain.evidence}</strong>
              <i>↘</i>
            </button>
          ))}
        </div>
      </section>

      <section className="path-section" id="experience">
        <header className="section-heading compact" data-reveal>
          <p>PATH / CREDENTIALS <span>ATHENS, GREECE</span></p>
          <h2>Research in motion.<br /><em>Foundations in practice.</em></h2>
        </header>
        <div className="path-grid">
          <article className="current-role" data-reveal>
            <span>CURRENT / RELEVANT</span>
            <p>SEP 2025 — PRESENT</p>
            <h3>Research Associate</h3>
            <h4>Harokopio University · EU Horizon Europe / TRIFFID</h4>
            <p>Developing and curating dataset pipelines for computer-vision systems: annotation, quality assurance, data curation, image/video workflows, and collaboration across a multidisciplinary research team.</p>
            <div><span>COMPUTER VISION</span><span>DATASET OPERATIONS</span><span>RESEARCH TOOLING</span></div>
          </article>
          <div className="timeline" data-reveal>
            <article><span>2022 — PRESENT</span><h3>BSc Informatics & Telematics</h3><p>Harokopio University of Athens</p></article>
            <article><span>2020 — 2022</span><h3>IT Applications Technician</h3><p>1st Vocational High School of Glyfada · final vocational degree 18.9 / 20</p></article>
            <article><span>2019</span><h3>English Language Proficiency</h3><p>Michigan · CEFR C2 equivalent</p></article>
            <details><summary>Full work history <span>+</span></summary><p>Earlier roles in technical retail, hospitality, service, and operations built customer communication, adaptability, and practical teamwork. Kept here as context, not positioned as the technical headline.</p></details>
          </div>
        </div>
      </section>

      <section className="archive-section" data-reveal>
        <p>EARLIER WORK / ARCHIVE</p>
        <div>
          <h2>Experiments that built the foundation.</h2>
          <p>Early Python utilities, LAN games, GUI experiments, systems exploration, networking, and university work — supporting context rather than the headline.</p>
        </div>
        <a href="https://github.com/Petrakous/Showcase" target="_blank" rel="noreferrer">Browse GitHub archive <span>↗</span></a>
      </section>

      <footer id="contact">
        <p>CONTACT / NEXT SIGNAL</p>
        <h2>Let’s build something <em>interesting.</em></h2>
        <div className="footer-links">
          <a href="mailto:peterkoutroulis2004@gmail.com">Email <span>↗</span></a>
          <a href="https://github.com/Petrakous" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
          <a href="https://www.linkedin.com/in/petrakous" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
          <button onClick={() => setPaletteOpen(true)}>Full index <span>⌘K</span></button>
        </div>
        <div className="footer-meta"><span>© {new Date().getFullYear()} PETROS KOUTROULIS</span><span>BUILT AS AN INTERACTIVE RESEARCH INDEX</span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </main>
  );
}
