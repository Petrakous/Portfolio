const configuredBase = import.meta.env.BASE_URL || "/";
const basePath = configuredBase === "/" ? "" : configuredBase.replace(/\/+$/, "");

export function sitePath(path = "/") {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("mailto:")) return path;
  const relativePath = path.replace(/^\/+/, "");
  return `${basePath}/${relativePath}`;
}
