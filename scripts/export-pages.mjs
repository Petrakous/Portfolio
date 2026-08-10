import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const clientDir = path.join(root, "dist", "client");
const outputDir = path.join(root, "pages-dist");
const routes = ["/", "/work", "/credentials", "/knowledge", "/about"];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(clientDir, outputDir, {
  recursive: true,
  filter(source) {
    return !source.includes(`${path.sep}.vite`) && !source.endsWith("_headers");
  },
});

const workerUrl = pathToFileURL(path.join(root, "dist", "server", "index.js"));
workerUrl.searchParams.set("export", Date.now().toString());
const { default: worker } = await import(workerUrl.href);
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const context = { waitUntil() {}, passThroughOnException() {} };

for (const route of routes) {
  const response = await worker.fetch(
    new Request(`https://petrakous.github.io${route}`, {
      headers: {
        accept: "text/html",
        "x-forwarded-host": "petrakous.github.io",
        "x-forwarded-proto": "https",
      },
    }),
    env,
    context,
  );
  if (!response.ok) throw new Error(`Could not render ${route}: ${response.status}`);
  const html = await response.text();
  const routeDir = route === "/" ? outputDir : path.join(outputDir, route.slice(1));
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, "index.html"), html);
}

await cp(path.join(outputDir, "index.html"), path.join(outputDir, "404.html"));
await writeFile(path.join(outputDir, ".nojekyll"), "");
console.log(`Exported ${routes.length} routes to ${outputDir}`);
