/**
 * Local helper to verify the GitHub Pages static export.
 * Mirrors the CI steps: strip API routes, then build with DEPLOY_TARGET.
 */
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(root, "src", "app", "api");
const apiBackup = path.join(root, ".api-backup");

function run(cmd, args, env = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function restoreApi() {
  if (!existsSync(apiBackup)) return;
  mkdirSync(path.dirname(apiDir), { recursive: true });
  if (existsSync(apiDir)) rmSync(apiDir, { recursive: true, force: true });
  cpSync(apiBackup, apiDir, { recursive: true });
  rmSync(apiBackup, { recursive: true, force: true });
}

try {
  if (existsSync(apiDir)) {
    if (existsSync(apiBackup)) rmSync(apiBackup, { recursive: true, force: true });
    cpSync(apiDir, apiBackup, { recursive: true });
    rmSync(apiDir, { recursive: true, force: true });
  }

  writeFileSync(path.join(root, "public", ".nojekyll"), "");

  run("npm", ["run", "build"], { DEPLOY_TARGET: "github-pages" });
  console.log("\nStatic site ready in /out — preview with: npx serve out");
} catch (err) {
  restoreApi();
  throw err;
}

restoreApi();
