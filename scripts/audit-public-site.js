import https from "node:https";
import http from "node:http";
import { writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { SECURITY_HEADERS } from "./security-headers.js";

const hostname = "defensa-del-sol-six.vercel.app";
const results = [];
function request(path, method = "GET", headers = {}, secure = true) {
  return new Promise((resolve, reject) => {
    const client = secure ? https : http;
    const req = client.request(
      {
        hostname,
        port: secure ? 443 : 80,
        path,
        method,
        headers,
        agent: false,
      },
      (res) => {
        const chunks = [];
        let size = 0;
        res.on("data", (chunk) => {
          size += chunk.length;
          if (size > 2 * 1024 * 1024) res.destroy(Error("Response size limit"));
          else chunks.push(chunk);
        });
        res.on("error", reject);
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks),
            tls: secure ? res.socket?.getProtocol?.() : undefined,
          }),
        );
      },
    );
    req.setTimeout(10000, () => req.destroy(Error("Request timeout")));
    req.on("error", reject);
    req.end();
  });
}
async function probe(path, method = "GET", headers = {}, secure = true) {
  try {
    const response = await request(path, method, headers, secure);
    results.push({
      path,
      method,
      scheme: secure ? "https" : "http",
      status: response.status,
      type: response.headers["content-type"],
      bytes: response.body.length,
    });
    return response;
  } catch (error) {
    results.push({ path, method, error: error.message });
    return null;
  }
}

const home = await probe("/");
if (!home) throw Error("Cannot reach the authorized site");
const text = home.body.toString("utf8");
const headers = Object.fromEntries(
  Object.keys(SECURITY_HEADERS).map((key) => [
    key,
    home.headers[key.toLowerCase()] || null,
  ]),
);
headers["Strict-Transport-Security"] =
  home.headers["strict-transport-security"] || null;
const redirect = await probe("/", "GET", {}, false);
const privatePaths = [
  "/.env",
  "/.env.local",
  "/.git/HEAD",
  "/.git/config",
  "/AGENTS.md",
  "/server.js",
  "/package.json",
  "/package-lock.json",
  "/vercel.json",
  "/admin.html",
  "/events.html",
  "/performance.html",
  "/src/admin-game.js",
  "/src/ui/admin.js",
  "/src/lab-budget.js",
  "/docs/secure-deployment.md",
];
const exposure = [];
for (const path of privatePaths) {
  const response = await probe(path);
  exposure.push({
    path,
    status: response?.status,
    returnsGame: response?.body.toString("utf8").includes('id="board"'),
    secretPattern: response
      ? /(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{8,}|-----BEGIN [A-Z ]*PRIVATE KEY/.test(
          response.body.toString("utf8"),
        )
      : false,
  });
}
for (const path of [
  "/%2e%2e/server.js",
  "/..%5cserver.js",
  "/src/%2e%2e/server.js",
  "/%00",
])
  await probe(path);
for (const method of ["HEAD", "OPTIONS", "TRACE", "POST"])
  await probe("/", method);
const cors = await probe("/", "GET", { Origin: "https://audit.invalid" });
const payload = "<img src=x onerror=alert(1)>";
const reflected = await probe("/?audit=" + encodeURIComponent(payload));
const manifestResponse = await probe("/integrity.json");
let manifest = {};
try {
  manifest = JSON.parse(manifestResponse?.body.toString("utf8")).files || {};
} catch {}
const assets = [];
const moduleAudit = {
  checked: 0,
  failures: [],
  secretPatterns: [],
  missingImports: [],
  hashMismatches: [],
};
for (const name of Object.keys(manifest).filter((name) =>
  /^src\/[A-Za-z0-9_/-]+\.js$/.test(name),
)) {
  const response = await probe("/" + name);
  moduleAudit.checked++;
  if (response?.status !== 200) {
    moduleAudit.failures.push(name);
    continue;
  }
  const source = response.body.toString("utf8");
  if (
    /(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{8,}|-----BEGIN [A-Z ]*PRIVATE KEY/.test(
      source,
    )
  )
    moduleAudit.secretPatterns.push(name);
  if (
    createHash("sha256").update(response.body).digest("hex") !== manifest[name]
  )
    moduleAudit.hashMismatches.push(name);
  const imports = [
    ...source.matchAll(
      /(?:\b(?:import|export)\s+(?:[^;]*?\s+from\s*)?)["']([^"']+)["']/g,
    ),
    ...source.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g),
  ];
  for (const match of imports) {
    const target = path.posix.normalize(
      path.posix.join(path.posix.dirname(name), match[1]),
    );
    if (!match[1].startsWith(".") || !manifest[target])
      moduleAudit.missingImports.push({ module: name, target: match[1] });
  }
}
for (const path of [
  "src/main.js",
  "src/engine.js",
  "src/data/support.js",
  "src/ui/support.js",
  "style.css",
]) {
  const response = await probe("/" + path);
  const body = response?.body.toString("utf8") || "";
  assets.push({
    path,
    status: response?.status,
    nosniff: response?.headers["x-content-type-options"],
    manifestMatches:
      response && manifest[path]
        ? createHash("sha256").update(response.body).digest("hex") ===
          manifest[path]
        : null,
    secretPattern:
      /(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{8,}|-----BEGIN [A-Z ]*PRIVATE KEY/.test(
        body,
      ),
    adminImports:
      path === "src/main.js"
        ? /import\(["'](?:\.\/admin-game|\.\/ui\/admin)\.js/.test(body)
        : undefined,
    externalFonts:
      path === "style.css" ? body.includes("fonts.googleapis.com") : undefined,
    paymentUrls:
      path === "src/data/support.js"
        ? body.match(/https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+/g) || []
        : undefined,
  });
}
const report = {
  target: "https://" + hostname,
  checkedAt: new Date().toISOString(),
  scope:
    "Low-impact checks of the authorized host only; no load testing, payments or data changes",
  home: {
    status: home.status,
    tls: home.tls,
    headers,
    hasGame: text.includes('id="board"'),
    hasLaboratoryLinks: /href=["'](?:admin|events|performance)\.html/.test(
      text,
    ),
    setsCookie: !!home.headers["set-cookie"],
  },
  httpRedirect: {
    status: redirect?.status,
    location: redirect?.headers.location,
  },
  cors: {
    allowOrigin: cors?.headers["access-control-allow-origin"] || null,
    allowCredentials: cors?.headers["access-control-allow-credentials"] || null,
  },
  reflectsRawPayload:
    reflected?.body.toString("utf8").includes(payload) || false,
  exposure,
  assets,
  manifestResources: Object.keys(manifest).length,
  requests: results,
};
await writeFile(
  "docs/public-security-audit-2026-10-16.json",
  JSON.stringify({ ...report, moduleAudit }, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      home: report.home,
      httpRedirect: report.httpRedirect,
      cors: report.cors,
      reflectsRawPayload: report.reflectsRawPayload,
      privatePaths: exposure.length,
      exposed: exposure.filter((item) => item.status === 200),
      moduleAudit,
      requestCount: results.length,
    },
    null,
    2,
  ),
);
