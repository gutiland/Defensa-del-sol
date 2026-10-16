import {
  mkdir,
  readFile,
  writeFile,
  realpath,
  lstat,
  rm,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { siteFiles } from "./site-files.js";
import { SECURITY_HEADERS, staticHeadersFile } from "./security-headers.js";

export async function buildSite(
  root = fileURLToPath(new URL("..", import.meta.url)),
) {
  root = await realpath(root);
  const output = path.resolve(root, "dist"),
    marker = path.join(output, ".acampada-build");
  // Only ever replace our generated dist, never a symlink or an arbitrary folder.
  if (path.dirname(output) !== root || path.basename(output) !== "dist")
    throw Error("Destino de compilación inválido");
  let previous = null;
  try {
    previous = await lstat(output);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (previous) {
    if (
      previous.isSymbolicLink() ||
      !previous.isDirectory() ||
      (await realpath(output)) !== output
    )
      throw Error("dist debe ser una carpeta local sin enlaces");
    if (
      (await readFile(marker, "utf8").catch(() => "")) !==
      "acampada-sol-generated-v1\n"
    )
      throw Error("dist ya existe y no pertenece al generador; no se modifica");
  }
  const files = await siteFiles(root),
    contents = new Map();
  for (const name of files) {
    let text = await readFile(path.join(root, name), "utf8");
    if (Buffer.byteLength(text) > 2 * 1024 * 1024)
      throw Error(`Recurso demasiado grande: ${name}`);
    if (
      /(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{8,}|-----BEGIN [A-Z ]*PRIVATE KEY/.test(
        text,
      )
    )
      throw Error(`Posible secreto en ${name}; distribución cancelada`);
    if (name === "index.html") {
      text = text.replace(
        /<(p|section)\b[^>]*\bdata-dev-only\b[^>]*>[\s\S]*?<\/\1>/g,
        "",
      );
      const csp = SECURITY_HEADERS["Content-Security-Policy"].replace(
        "; frame-ancestors 'none'",
        "",
      );
      text = text.replace(
        "<head>",
        `<head>\n<meta http-equiv="Content-Security-Policy" content="${csp}">\n<meta name="referrer" content="no-referrer">`,
      );
      if (/href="(?:admin|events|performance)\.html"|data-dev-only/.test(text))
        throw Error("Enlaces de laboratorio en distribución pública");
    }
    if (name === "src/main.js")
      text = text.replace(
        /\/\/ @development-only:start\r?\n[\s\S]*?\/\/ @development-only:end/g,
        "const isAdmin = false;\nlet AdminGame, mountAdmin;",
      );
    contents.set(name, text);
  }
  for (const [name, text] of contents) {
    if (!name.endsWith(".js")) continue;
    const imports = [
      ...text.matchAll(
        /(?:\b(?:import|export)\s+(?:[^;]*?\s+from\s*)?)["']([^"']+)["']/g,
      ),
      ...text.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g),
    ];
    for (const match of imports) {
      const target = path.posix.normalize(
        path.posix.join(path.posix.dirname(name), match[1]),
      );
      if (!match[1].startsWith(".") || !contents.has(target))
        throw Error(
          `Import no incluido en distribución: ${name} → ${match[1]}`,
        );
    }
  }
  // Absolute target checked above; only a directory bearing our marker is removed.
  if (previous) await rm(output, { recursive: true, force: false });
  await mkdir(output, { recursive: true });
  await writeFile(marker, "acampada-sol-generated-v1\n");
  const hashes = {};
  for (const [name, text] of contents) {
    const target = path.join(output, name);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, text);
    hashes[name] = createHash("sha256").update(text).digest("hex");
  }
  await writeFile(path.join(output, "_headers"), staticHeadersFile());
  await writeFile(
    path.join(output, "integrity.json"),
    JSON.stringify({ algorithm: "sha256", files: hashes }, null, 2) + "\n",
  );
  return { output, files: [...contents.keys()] };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const result = await buildSite();
    console.log(
      `Distribución pública: ${result.output} (${result.files.length} recursos)`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
