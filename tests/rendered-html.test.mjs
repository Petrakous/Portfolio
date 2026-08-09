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
  assert.match(html, /Research Associate/i);
  assert.match(html, /Knowledge/i);
  assert.match(html, /Research/i);
  assert.match(html, /Work/i);
  assert.match(html, /About/i);
  assert.doesNotMatch(html, /I build tools that make/i);
  assert.doesNotMatch(html, /available for select collaborations/i);
  assert.doesNotMatch(html, /Search portfolio/i);
  assert.doesNotMatch(html, /StudyRooms/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-renders selected work on its own route", async () => {
  const response = await render("/work");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Selected work/i);
  assert.match(html, /3DHUA/i);
  assert.match(html, /Aerial Detection Atlas/i);
  assert.match(html, /TRIFFID Review Studio/i);
  assert.doesNotMatch(html, /StudyRooms/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("does not publish private CV fields", async () => {
  const response = await render("/work");
  const html = await response.text();
  assert.doesNotMatch(html, /6955413061|Ψηλορείτη|20\/09\/2004|Αμαρούσιο Αττικής/i);
  assert.match(html, /peterkoutroulis2004@gmail\.com/i);
});
