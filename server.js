import http from "node:http";
import { open, realpath } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { siteFiles } from "./scripts/site-files.js";
import { SECURITY_HEADERS, HTTPS_HEADERS } from "./scripts/security-headers.js";

export const PROJECT_ROOT = fileURLToPath(new URL(".", import.meta.url));
export async function createStaticServer({
  root = PROJECT_ROOT,
  development = false,
  publicOrigin = null,
  rateLimit = 600,
  rateWindow = 60000,
} = {}) {
  const realRoot = await realpath(root);
  let allowed = await siteFiles(realRoot, development);
  const origin = publicOrigin ? new URL(publicOrigin) : null;
  if (
    origin &&
    (origin.protocol !== "https:" ||
      origin.username ||
      origin.password ||
      origin.pathname !== "/" ||
      origin.search ||
      origin.hash)
  )
    throw Error(
      "PUBLIC_ORIGIN debe ser un origen HTTPS sin ruta ni credenciales",
    );
  const requests = new Map();
  const server = http.createServer(
    { maxHeaderSize: 16384, connectionsCheckingInterval: 1000 },
    async (req, res) => {
      for (const [name, value] of Object.entries(SECURITY_HEADERS))
        res.setHeader(name, value);
      if (origin)
        for (const [name, value] of Object.entries(HTTPS_HEADERS))
          res.setHeader(name, value);
      res.setHeader("Cache-Control", "no-cache");
      const fail = (status, text) => {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.writeHead(status);
        res.end(req.method === "HEAD" ? undefined : text);
      };
      let handle;
      try {
        const host = req.headers.host,
          localPort = server.address()?.port;
        const validHosts = new Set([
          `localhost:${localPort}`,
          `127.0.0.1:${localPort}`,
          `[::1]:${localPort}`,
          ...(origin ? [origin.host] : []),
        ]);
        if (!host || !validHosts.has(host.toLowerCase()))
          return fail(421, "Host no permitido");
        const ip = req.socket.remoteAddress,
          now = Date.now();
        for (const [key, window] of requests)
          if (now - window.at >= rateWindow) requests.delete(key);
        if (!requests.has(ip)) {
          if (requests.size >= 1024) return fail(429, "Demasiadas solicitudes");
          requests.set(ip, { at: now, count: 0 });
        }
        const window = requests.get(ip);
        if (++window.count > rateLimit) {
          res.setHeader("Retry-After", String(Math.ceil(rateWindow / 1000)));
          return fail(429, "Demasiadas solicitudes");
        }
        if (!["GET", "HEAD"].includes(req.method)) {
          res.setHeader("Allow", "GET, HEAD");
          res.setHeader("Connection", "close");
          return fail(405, "Método no permitido");
        }
        if (
          req.headers["transfer-encoding"] ||
          (req.headers["content-length"] &&
            req.headers["content-length"] !== "0")
        ) {
          res.setHeader("Connection", "close");
          return fail(413, "Cuerpo no permitido");
        }
        if (
          !req.url ||
          req.url.length > 2048 ||
          !req.url.startsWith("/") ||
          req.url.startsWith("//")
        )
          return fail(400, "Ruta inválida");
        const pathname = decodeURIComponent(req.url.split("?")[0]);
        if (
          /[\\\x00-\x1f\x7f]/.test(pathname) ||
          pathname
            .split("/")
            .some(
              (part) => part === "." || part === ".." || part.startsWith("."),
            )
        )
          return fail(400, "Ruta inválida");
        const name = pathname === "/" ? "index.html" : pathname.slice(1);
        if (development && ["index.html", "src/main.js"].includes(name))
          allowed = await siteFiles(realRoot, true);
        if (!allowed.has(name)) return fail(404, "No encontrado");
        const actual = await realpath(path.join(realRoot, name));
        if (!actual.startsWith(realRoot + path.sep))
          return fail(403, "Recurso no permitido");
        handle = await open(actual, "r");
        const stat = await handle.stat();
        if (!stat.isFile() || stat.size > 2 * 1024 * 1024)
          return fail(413, "Recurso no permitido");
        const etag = `W/"${stat.size.toString(16)}-${Math.trunc(stat.mtimeMs).toString(16)}"`;
        res.setHeader("ETag", etag);
        if (req.headers["if-none-match"] === etag) {
          res.writeHead(304);
          res.end();
          return;
        }
        res.setHeader(
          "Content-Type",
          {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "text/javascript; charset=utf-8",
            ".ttf": "font/ttf",
            ".svg": "image/svg+xml",
            ".txt": "text/plain; charset=utf-8",
          }[path.extname(name)],
        );
        res.setHeader("Content-Length", stat.size);
        if (req.method === "HEAD" || !stat.size) {
          res.writeHead(200);
          res.end();
          return;
        }
        await pipeline(
          handle.createReadStream({
            autoClose: false,
            start: 0,
            end: stat.size - 1,
          }),
          res,
        );
      } catch (error) {
        if (!res.headersSent)
          fail(error instanceof URIError ? 400 : 404, "No encontrado");
        else res.destroy();
      } finally {
        await handle?.close().catch(() => {});
      }
    },
  );
  server.headersTimeout = 10000;
  server.requestTimeout = 15000;
  server.keepAliveTimeout = 5000;
  server.maxRequestsPerSocket = 100;
  const connections = new Set();
  server.on("connection", (socket) => {
    if (connections.size >= 128) {
      socket.destroy();
      return;
    }
    connections.add(socket);
    socket.once("close", () => connections.delete(socket));
  });
  server.on("clientError", (_, socket) => {
    if (socket.writable)
      socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
    else socket.destroy();
  });
  return server;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const production =
      process.argv.includes("--public") ||
      process.env.NODE_ENV === "production";
    const host = production ? process.env.HOST || "127.0.0.1" : "127.0.0.1";
    const port = Number(process.env.PORT || 3000);
    if (!Number.isInteger(port) || port < 1 || port > 65535)
      throw Error("PORT inválido");
    if (
      !["127.0.0.1", "localhost", "::1"].includes(host) &&
      !process.env.PUBLIC_ORIGIN
    )
      throw Error(
        "Escuchar en red requiere PUBLIC_ORIGIN HTTPS y un proxy TLS delante",
      );
    const server = await createStaticServer({
      root: production ? path.join(PROJECT_ROOT, "dist") : PROJECT_ROOT,
      development: !production,
      publicOrigin: process.env.PUBLIC_ORIGIN || null,
    });
    server.on("error", (error) => {
      console.error(
        error.code === "EADDRINUSE"
          ? `Puerto ${port} ocupado. Usa otra variable PORT o cierra el servidor anterior.`
          : "No se pudo iniciar el servidor.",
      );
      process.exitCode = 1;
    });
    server.listen(port, host, () =>
      console.log(
        `Acampada Sol: http://${host}:${port} · ${production ? "distribución pública" : "desarrollo local"}`,
      ),
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
