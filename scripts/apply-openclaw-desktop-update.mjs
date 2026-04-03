/**
 * Patches bundled OpenClaw chunks after `npm install` (idempotent):
 * 1) runGatewayUpdate: desktop root npm/pnpm/bun update (not-git-install skip).
 * 2) exec chunk: windowsHide on spawn/execFile so Windows updates don't flash a console.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const distDir = path.join(repoRoot, "node_modules", "openclaw", "dist");

const MARKER = "desktop app root update";

const BLOCK = `	const desktopAppRoot = process.env.OPENCLAW_DESKTOP_APP_ROOT?.trim();
	if (desktopAppRoot) {
		let desktopPkgOk = false;
		try {
			await fs.access(path.join(desktopAppRoot, "package.json"));
			desktopPkgOk = true;
		} catch {
			desktopPkgOk = false;
		}
		if (desktopPkgOk) {
			const mgr = await detectPackageManager(desktopAppRoot);
			const argv = mgr === "pnpm" ? ["pnpm", "update", "openclaw"] : mgr === "bun" ? ["bun", "update", "openclaw"] : ["npm", "update", "openclaw"];
			const mode = mgr === "pnpm" ? "pnpm" : mgr === "bun" ? "bun" : "npm";
			const desktopStep = await runStep({
				runCommand,
				name: "${MARKER}",
				argv,
				cwd: desktopAppRoot,
				timeoutMs,
				progress,
				stepIndex: 0,
				totalSteps: 1
			});
			const afterVersion = await readPackageVersion(pkgRoot);
			return {
				status: desktopStep.exitCode === 0 ? "ok" : "error",
				mode,
				root: pkgRoot,
				reason: desktopStep.exitCode === 0 ? void 0 : "desktop-app-root-update-failed",
				before: { version: beforeVersion },
				after: { version: afterVersion },
				steps: [desktopStep],
				durationMs: Date.now() - startedAt
			};
		}
	}
`;

const SPAWN_HIDE_NEEDLE =
  "\t\twindowsVerbatimArguments: useCmdWrapper ? true : windowsVerbatimArguments,\n\t\t...shouldSpawnWithShell({";
const SPAWN_HIDE_INJECT =
  '\t\twindowsVerbatimArguments: useCmdWrapper ? true : windowsVerbatimArguments,\n\t\t...(process$1.platform === "win32" ? { windowsHide: true } : {}),\n\t\t...shouldSpawnWithShell({';
const SPAWN_HIDE_DONE =
  '...(process$1.platform === "win32" ? { windowsHide: true } : {}),\n\t\t...shouldSpawnWithShell({';

const EXEC_HIDE_NEEDLE =
  "\t\t], {\n\t\t\t...options,\n\t\t\twindowsVerbatimArguments: true\n\t\t}) : await execFileAsync(execCommand, execArgs, options);";
const EXEC_HIDE_INJECT =
  '\t\t], {\n\t\t\t...options,\n\t\t\twindowsVerbatimArguments: true,\n\t\t\t...(process$1.platform === "win32" ? { windowsHide: true } : {})\n\t\t}) : await execFileAsync(execCommand, execArgs, process$1.platform === "win32" ? { ...options, windowsHide: true } : options);';
const EXEC_HIDE_DONE =
  "process$1.platform === \"win32\" ? { ...options, windowsHide: true } : options);";

function patchUpdateRunnerFiles() {
  const needle = '\treturn {\n\t\tstatus: "skipped",\n\t\tmode: "unknown",\n\t\troot: pkgRoot,\n\t\treason: "not-git-install",';
  const files = fs.readdirSync(distDir).filter((f) => {
    if (!f.endsWith(".js")) return false;
    const c = fs.readFileSync(path.join(distDir, f), "utf8");
    return c.includes(needle) && !c.includes(MARKER);
  });
  for (const name of files) {
    const p = path.join(distDir, name);
    let s = fs.readFileSync(p, "utf8");
    if (s.includes(MARKER)) {
      continue;
    }
    if (!s.includes(needle)) {
      continue;
    }
    s = s.replace(needle, `${BLOCK}${needle}`);
    fs.writeFileSync(p, s, "utf8");
    console.log(`[apply-openclaw-desktop-update] patched ${path.relative(repoRoot, p)}`);
  }
}

function patchExecChunks() {
  const files = fs.readdirSync(distDir).filter((f) => /^exec-.+\.js$/.test(f));
  for (const name of files) {
    const p = path.join(distDir, name);
    let s = fs.readFileSync(p, "utf8");
    if (!s.includes("runCommandWithTimeout")) {
      continue;
    }
    let changed = false;
    if (!s.includes(SPAWN_HIDE_DONE) && s.includes(SPAWN_HIDE_NEEDLE)) {
      s = s.replace(SPAWN_HIDE_NEEDLE, SPAWN_HIDE_INJECT);
      changed = true;
    }
    if (!s.includes(EXEC_HIDE_DONE) && s.includes(EXEC_HIDE_NEEDLE)) {
      s = s.replace(EXEC_HIDE_NEEDLE, EXEC_HIDE_INJECT);
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(p, s, "utf8");
      console.log(`[apply-openclaw-desktop-update] exec windowsHide ${path.relative(repoRoot, p)}`);
    }
  }
}

function main() {
  if (!fs.existsSync(distDir)) {
    return;
  }
  patchUpdateRunnerFiles();
  patchExecChunks();
}

main();
