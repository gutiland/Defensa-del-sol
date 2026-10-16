import { readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name);
    return entry.isDirectory()
      ? files(file)
      : file.endsWith(".js")
        ? [file]
        : [];
  });
}
for (const file of ["server.js", ...files("src"), ...files("scripts")]) {
  const result = spawnSync(process.execPath, ["--check", file], {
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log("Sintaxis de todos los módulos: correcta");
const tests = spawnSync(process.execPath, ["--test"], { stdio: "inherit" });
process.exit(tests.status ?? 1);
