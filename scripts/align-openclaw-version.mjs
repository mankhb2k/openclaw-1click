/**
 * Keeps npm `openclaw` at the version listed in `openclaw-version.pin` (match your openclaw-src sync).
 * Run via `npm run align:openclaw` or automatically before `npm run dist`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const pinPath = path.join(root, "openclaw-version.pin");

if (!fs.existsSync(pinPath)) {
  console.log("[align-openclaw] no openclaw-version.pin — skip");
  process.exit(0);
}

let pin = "";
for (const line of fs.readFileSync(pinPath, "utf8").split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) {
    continue;
  }
  pin = t;
  break;
}
if (!pin) {
  console.log("[align-openclaw] no version line in openclaw-version.pin — skip");
  process.exit(0);
}

let current = "";
try {
  const pkgPath = path.join(root, "node_modules", "openclaw", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  current = typeof pkg.version === "string" ? pkg.version.trim() : "";
} catch {
  current = "";
}

if (current === pin) {
  console.log(`[align-openclaw] openclaw@${pin} already installed`);
  process.exit(0);
}

console.log(`[align-openclaw] installing openclaw@${pin} (was ${current || "missing"})`);
execSync(`npm install openclaw@${pin} --save-exact`, { cwd: root, stdio: "inherit" });
