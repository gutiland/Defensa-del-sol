import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  rm,
  rename,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createStaticServer, PROJECT_ROOT } from "../server.js";
import { buildSite } from "../scripts/build.js";
import {
  SECURITY_HEADERS,
  HTTPS_HEADERS,
} from "../scripts/security-headers.js";

test("Vercel publishes only dist with the same security policy as the local public server", async () => {
  const config = JSON.parse(
    await readFile(path.join(PROJECT_ROOT, "vercel.json"), "utf8"),
  );
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, "dist");
  assert.equal(config.buildCommand, "npm run build");
  assert.equal(config.rewrites, undefined);
  const rule = config.headers.find((rule) => rule.source === "/(.*)");
  const headers = Object.fromEntries(
    rule.headers.map(({ key, value }) => [key, value]),
  );
  for (const [key, value] of Object.entries({
    ...SECURITY_HEADERS,
    ...HTTPS_HEADERS,
  }))
    assert.equal(headers[key], value);
});

async function listen(options) {
  const server = await createStaticServer(options);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, port: server.address().port };
}
async function stop(server) {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
function request(port, url, method = "GET", headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: "127.0.0.1", port, path: url, method, headers, agent: false },
      (res) => {
        let text = "";
        res.setEncoding("utf8");
        res.on("data", (part) => {
          text += part;
        });
        res.on("end", () =>
          resolve({ status: res.statusCode, headers: res.headers, text }),
        );
      },
    );
    req.on("error", reject);
    req.end();
  });
}
async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), "acampada-security-"));
  await mkdir(path.join(root, "src"));
  await writeFile(
    path.join(root, "index.html"),
    '<html><head></head><body><p data-dev-only><a href="admin.html">Admin</a></p><script type="module" src="src/main.js"></script></body></html>',
  );
  await writeFile(path.join(root, "style.css"), "body { color: black; }");
  await writeFile(
    path.join(root, "src/main.js"),
    "export const ready = true;\n",
  );
  return root;
}
async function cleanup(root) {
  assert.equal(path.dirname(path.resolve(root)), path.resolve(tmpdir()));
  assert.ok(path.basename(root).startsWith("acampada-security-"));
  await rm(root, { recursive: true, force: true });
}

test("public build removes development imports and rejects unresolved dynamic imports before replacing dist", async () => {
  const root = await fixture();
  try {
    await writeFile(
      path.join(root, "src/main.js"),
      '// @development-only:start\nconst isAdmin = true;\nif (isAdmin) await import("./admin-game.js");\n// @development-only:end\nexport const ready = true;',
    );
    const result = await buildSite(root);
    const entry = await readFile(
      path.join(result.output, "src/main.js"),
      "utf8",
    );
    assert.ok(entry.includes("const isAdmin = false"));
    assert.ok(!entry.includes("admin-game.js"));
    await assert.rejects(
      readFile(path.join(result.output, "src/admin-game.js")),
    );
    await writeFile(
      path.join(root, "src/main.js"),
      'await import("./missing.js");',
    );
    await assert.rejects(buildSite(root), /Import no incluido/);
    assert.equal(
      await readFile(path.join(result.output, "src/main.js"), "utf8"),
      entry,
    );
  } finally {
    await cleanup(root);
  }
});

test("development reload includes newly imported modules without exposing unrelated files or changing public manifests", async () => {
  const root = await fixture();
  const servers = [];
  try {
    await mkdir(path.join(root, "src/ui"));
    for (const file of [
      "admin.html",
      "events.html",
      "performance.html",
      "src/admin-game.js",
      "src/ui/admin.js",
      "src/events-main.js",
      "src/performance-main.js",
    ])
      await writeFile(path.join(root, file), "");
    const dev = await listen({ root, development: true });
    servers.push(dev.server);
    const publicSite = await listen({ root });
    servers.push(publicSite.server);
    await writeFile(
      path.join(root, "src/new-module.js"),
      "export const ready = true;",
    );
    await writeFile(path.join(root, "src/private.js"), "private data");
    await writeFile(
      path.join(root, "src/main.js"),
      'import "./new-module.js";',
    );
    assert.equal((await request(dev.port, "/")).status, 200);
    assert.equal((await request(dev.port, "/src/new-module.js")).status, 200);
    assert.equal((await request(dev.port, "/src/private.js")).status, 404);
    assert.equal((await request(dev.port, "/server.js")).status, 404);
    assert.equal((await request(publicSite.port, "/")).status, 200);
    assert.equal(
      (await request(publicSite.port, "/src/new-module.js")).status,
      404,
    );
  } finally {
    for (const server of servers) await stop(server);
    await cleanup(root);
  }
});

test("public server serves actual game modules, denies private files and includes browser protections", async () => {
  const { server, port } = await listen({ root: PROJECT_ROOT });
  try {
    const page = await request(port, "/");
    assert.equal(page.status, 200);
    assert.ok(
      page.headers["content-security-policy"].includes("script-src 'self'"),
    );
    assert.equal(page.headers["x-content-type-options"], "nosniff");
    assert.equal(page.headers["x-frame-options"], "DENY");
    for (const url of ["/src/main.js", "/style.css", "/src/engine.js"])
      assert.equal((await request(port, url)).status, 200);
    for (const url of [
      "/server.js",
      "/AGENTS.md",
      "/package.json",
      "/package-lock.json",
      "/docs/roadmap.md",
      "/admin.html",
      "/events.html",
      "/performance.html",
      "/src/admin-game.js",
      "/src/ui/admin.js",
      "/.env",
      "/%25USERPROFILE%25/AppData/Roaming/npm-cache/package.json",
    ]) {
      assert.notEqual((await request(port, url)).status, 200, url);
    }
    for (const url of [
      "/..%5cpackage.json",
      "/%2e%2e/server.js",
      "/%00",
      "/%zz",
      "//example.com/",
      "/" + "x".repeat(2050),
    ])
      assert.equal((await request(port, url)).status, 400, url);
    const head = await request(port, "/", "HEAD");
    assert.equal(head.status, 200);
    assert.equal(head.text, "");
    assert.equal(
      (await request(port, "/", "GET", { "If-None-Match": page.headers.etag }))
        .status,
      304,
    );
    const post = await request(port, "/", "POST");
    assert.equal(post.status, 405);
    assert.equal(post.headers.allow, "GET, HEAD");
    assert.equal(
      (await request(port, "/", "GET", { Host: "attacker.example" })).status,
      421,
    );
  } finally {
    await stop(server);
  }
});

test("rate limit is bounded and emits Retry-After; development laboratories remain local resources", async () => {
  const { server, port } = await listen({
    root: PROJECT_ROOT,
    development: true,
    rateLimit: 2,
  });
  try {
    assert.equal((await request(port, "/admin.html")).status, 200);
    assert.equal((await request(port, "/src/admin-game.js")).status, 200);
    const response = await request(port, "/");
    assert.equal(response.status, 429);
    assert.ok(Number(response.headers["retry-after"]) > 0);
  } finally {
    await stop(server);
  }
});

test("build isolates distributable assets, removes laboratories and refuses unmanaged output or secrets", async () => {
  const root = await fixture();
  try {
    await writeFile(path.join(root, ".env"), "FAKE_FIXTURE_SECRET=not-real\n");
    await writeFile(path.join(root, "server.js"), "not public\n");
    const result = await buildSite(root);
    assert.deepEqual(result.files.sort(), [
      "index.html",
      "src/main.js",
      "style.css",
    ]);
    const html = await readFile(path.join(result.output, "index.html"), "utf8");
    assert.ok(!html.includes("admin.html"));
    assert.ok(html.includes('http-equiv="Content-Security-Policy"'));
    const headers = await readFile(
      path.join(result.output, "_headers"),
      "utf8",
    );
    assert.ok(headers.includes("Strict-Transport-Security"));
    await writeFile(path.join(result.output, "stale.txt"), "old artifact");
    await buildSite(root);
    await assert.rejects(readFile(path.join(result.output, "stale.txt")));
    await writeFile(
      path.join(root, "src/main.js"),
      'export const secret = "sk_live_123456789_FAKE_TEST";',
    );
    await assert.rejects(buildSite(root), /Posible secreto/);
    const { server, port } = await listen({
      root: result.output,
      publicOrigin: "https://game.example",
    });
    try {
      const response = await request(port, "/", "GET", {
        Host: "game.example",
      });
      assert.equal(response.status, 200);
      assert.equal(
        response.headers["strict-transport-security"],
        "max-age=31536000",
      );
      assert.equal((await request(port, "/server.js")).status, 404);
    } finally {
      await stop(server);
    }
    await rm(path.join(result.output, ".acampada-build"));
    await assert.rejects(buildSite(root), /no pertenece/);
  } finally {
    await cleanup(root);
  }
});

test("serving refuses a junction moved outside its root after startup", async (t) => {
  const root = await fixture(),
    external = await fixture();
  const { server, port } = await listen({ root });
  try {
    await rename(path.join(root, "src"), path.join(root, "src-old"));
    try {
      await symlink(
        path.join(external, "src"),
        path.join(root, "src"),
        "junction",
      );
    } catch (error) {
      if (["EPERM", "EACCES"].includes(error.code)) {
        t.skip("El sistema no permite crear el enlace de prueba");
        return;
      }
      throw error;
    }
    assert.equal((await request(port, "/src/main.js")).status, 403);
  } finally {
    await stop(server);
    await cleanup(root);
    await cleanup(external);
  }
});
