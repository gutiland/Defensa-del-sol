import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
export const PUBLIC_ENTRIES = ["index.html", "style.css", "src/main.js"];
const DEV_ENTRIES = [
  "admin.html",
  "events.html",
  "performance.html",
  "src/admin-game.js",
  "src/ui/admin.js",
  "src/events-main.js",
  "src/performance-main.js",
];
export async function siteFiles(root, development = false) {
  const resolvedRoot = await realpath(root),
    files = new Set();
  async function visit(name) {
    name = name.replaceAll("\\", "/");
    if (files.has(name)) return;
    if (!/^(?:src\/[a-zA-Z0-9_/-]+\.js|[a-z-]+\.(?:html|css))$/.test(name))
      throw Error(`Recurso no permitido: ${name}`);
    const actual = await realpath(path.join(root, name));
    if (!actual.startsWith(resolvedRoot + path.sep))
      throw Error("Recurso fuera de la raíz pública");
    files.add(name);
    if (name.endsWith(".js")) {
      const source = await readFile(actual, "utf8");
      for (const match of source.matchAll(
        /(?:\b(?:import|export)\s+(?:[^;]*?\s+from\s*)?)["']([^"']+)["']/g,
      )) {
        if (!match[1].startsWith("."))
          throw Error("Solo se permiten módulos locales en la distribución");
        await visit(
          path.posix.normalize(
            path.posix.join(path.posix.dirname(name), match[1]),
          ),
        );
      }
    }
  }
  for (const entry of [...PUBLIC_ENTRIES, ...(development ? DEV_ENTRIES : [])])
    await visit(entry);
  return files;
}
