import { projects } from "../content";

export default function WorkPage() {
  return (
    <main className="work-index">
      <header className="work-index-header">
        {/* Full document navigation reinitializes the standalone WebGL runtime. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">← 3D INDEX</a>
        <div><span>SELECTED WORK</span><p>PETROS KOUTROULIS</p></div>
      </header>

      <section className="work-intro">
        <p>RESEARCH / DEVELOPMENT</p>
        <h1>Systems made<br />for <em>use.</em></h1>
        <span>Computer vision, research operations, and spatial interfaces.</span>
      </section>

      <section className="work-list" aria-label="Selected projects">
        {projects.map((project) => (
          <article key={project.id} id={project.id}>
            <div className="work-number">{project.index}</div>
            <div className="work-copy">
              <span>{project.eyebrow}</span>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <small>{project.contribution}</small>
              <div className="work-tags">{project.tags.map((tag) => <i key={tag}>{tag}</i>)}</div>
              <div className="work-links">
                {project.live && <a href={project.live} target="_blank" rel="noreferrer">LIVE ↗</a>}
                {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">SOURCE ↗</a>}
              </div>
            </div>
            <div className="work-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.image} alt={project.imageAlt ?? ""} />
            </div>
          </article>
        ))}
      </section>

      <footer className="work-footer">
        <p>RESEARCH ASSOCIATE · ATHENS, GREECE</p>
        <a href="mailto:peterkoutroulis2004@gmail.com">peterkoutroulis2004@gmail.com ↗</a>
      </footer>
    </main>
  );
}
