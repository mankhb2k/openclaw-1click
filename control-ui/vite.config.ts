import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const openclawSrc = path.resolve(repoRoot, "openclaw-src");

function normalizeBase(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return "/";
  }
  if (trimmed === "./") {
    return "./";
  }
  if (trimmed.endsWith("/")) {
    return trimmed;
  }
  return `${trimmed}/`;
}

export default defineConfig(() => {
  const envBase = process.env.OPENCLAW_CONTROL_UI_BASE_PATH?.trim();
  // "/" matches gateway at http://127.0.0.1:PORT/ (Electron + hash). Avoid "./" + hash edge cases.
  const base = envBase ? normalizeBase(envBase) : "/";
  return {
    base,
    publicDir: path.resolve(here, "public"),
    resolve: {
      alias: {
        "@openclaw": openclawSrc,
      },
    },
    optimizeDeps: {
      include: ["lit/directives/repeat.js"],
    },
    build: {
      outDir: path.resolve(repoRoot, "dist/control-ui"),
      emptyOutDir: true,
      sourcemap: true,
      // Keep CI/onboard logs clean; current control UI chunking is intentionally above 500 kB.
      chunkSizeWarningLimit: 1024,
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
    },
    plugins: [
      {
        name: "electron-strip-crossorigin",
        closeBundle() {
          const indexPath = path.resolve(repoRoot, "dist/control-ui/index.html");
          try {
            if (!fs.existsSync(indexPath)) return;
            const html = fs
              .readFileSync(indexPath, "utf8")
              .replace(/\s+crossorigin(?:="anonymous")?/gi, "");
            fs.writeFileSync(indexPath, html, "utf8");
          } catch {
            /* ignore */
          }
        },
      },
      {
        name: "control-ui-dev-stubs",
        configureServer(server) {
          server.middlewares.use("/__openclaw/control-ui-config.json", (_req, res) => {
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                basePath: "/",
                assistantName: "",
                assistantAvatar: "",
                assistantAgentId: "",
              }),
            );
          });
        },
      },
    ],
  };
});
