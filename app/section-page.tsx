import type { PortfolioSection } from "./portfolio-data";

export function SectionPage({ section }: { section: PortfolioSection }) {
  const groups = [...new Set(section.cards.map((card) => card.group))];

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

      {groups.map((group) => (
        <section className="card-group" key={group} aria-labelledby={`${section.id}-${group.replaceAll(" ", "-")}`}>
          <header>
            <h2 id={`${section.id}-${group.replaceAll(" ", "-")}`}>{group}</h2>
            <span>{String(section.cards.filter((card) => card.group === group).length).padStart(2, "0")}</span>
          </header>
          <div className="portfolio-card-grid">
            {section.cards.filter((card) => card.group === group).map((card, index) => (
              <article className="portfolio-card" key={card.id} id={card.id}>
                <div className={`portfolio-card-visual ${card.image ? "has-image" : "is-abstract"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {card.image && <img src={card.image} alt={card.imageAlt ?? ""} />}
                  {!card.image && <b>{String(index + 1).padStart(2, "0")}</b>}
                </div>
                <small>{card.kicker}</small>
                <h3>{card.title}</h3>
                <p>{card.summary}</p>
                {card.evidence && <em>{card.evidence}</em>}
                <div>{card.tags.map((tag) => <i key={tag}>{tag}</i>)}</div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <footer className="section-index-footer">
        <p>Enough to understand. More when it matters.</p>
        <div>
          <a href="https://github.com/Petrakous" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/petrakous" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href="mailto:peterkoutroulis2004@gmail.com">Email ↗</a>
        </div>
      </footer>
    </main>
  );
}
