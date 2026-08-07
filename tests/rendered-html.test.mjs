import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished portfolio shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Petros Koutroulis/i);
  assert.match(html, /complex systems/i);
  assert.match(html, /Selected work/i);
  assert.match(html, /3DHUA/i);
  assert.match(html, /Aerial Detection Atlas/i);
  assert.match(html, /StudyRooms/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("does not publish private CV fields", async () => {
  const response = await render();
  const html = await response.text();
  assert.doesNotMatch(html, /6955413061|Ψηλορείτη|20\/09\/2004|Αμαρούσιο Αττικής/i);
  assert.match(html, /peterkoutroulis2004@gmail\.com/i);
});
