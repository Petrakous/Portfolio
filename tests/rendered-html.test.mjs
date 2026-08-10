import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the fullscreen 3D index", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Petros Koutroulis/i);
  assert.match(html, /<header class="home-identity"><p>Petros Koutroulis<\/p><\/header>/i);
  assert.match(html, /href="\/(?:Portfolio\/)?favicon\.svg"/i);
  assert.doesNotMatch(html, /hotspot[^>]*>.*?<i aria-hidden/i);
  assert.match(html, /Knowledge/i);
  assert.match(html, /Credentials/i);
  assert.match(html, /Work/i);
  assert.match(html, /About/i);
  assert.doesNotMatch(html, /I build tools that make|available for select collaborations|Search portfolio/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-renders the curated work card index", async () => {
  const response = await render("/work");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Selected work/i);
  assert.match(html, /3DHUA/i);
  assert.match(html, /Aerial Detection Atlas/i);
  assert.match(html, /TRIFFID Review Studio/i);
  assert.match(html, /StudyRooms/i);
  assert.match(html, /Chicago Crime Analytics/i);
  assert.match(html, /Early years/i);
  assert.match(html, /Other experience/i);
  assert.match(html, /Open details for 3DHUA/i);
  assert.doesNotMatch(html, /Enough to understand/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-renders credentials, knowledge, and about card routes", async () => {
  const credentials = await render("/credentials");
  const knowledge = await render("/knowledge");
  const about = await render("/about");
  assert.equal(credentials.status, 200);
  assert.equal(knowledge.status, 200);
  assert.equal(about.status, 200);
  const credentialsHtml = await credentials.text();
  const knowledgeHtml = await knowledge.text();
  assert.match(credentialsHtml, /English Proficiency/i);
  assert.match(credentialsHtml, /card-count-1/i);
  assert.match(knowledgeHtml, /Knowledge, with evidence/i);
  assert.match(knowledgeHtml, /is-scrollable/i);
  assert.match(await about.text(), /Snow &amp; Mountains/i);
});

test("every portfolio card has a visual", async () => {
  for (const path of ["/work", "/credentials", "/knowledge", "/about"]) {
    const response = await render(path);
    const html = await response.text();
    assert.match(html, /portfolio-card-visual has-image/i);
    assert.doesNotMatch(html, /portfolio-card-visual is-abstract/i);
  }
});

test("does not publish private CV fields", async () => {
  for (const path of ["/work", "/credentials", "/knowledge", "/about"]) {
    const response = await render(path);
    const html = await response.text();
    assert.doesNotMatch(html, /6955413061|20\/09\/2004|16562|Ψηλορείτη|Αμαρούσιο Αττικής/i);
    assert.match(html, /peterkoutroulis2004@gmail\.com/i);
  }
});
