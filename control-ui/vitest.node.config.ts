import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const openclawSrc = path.resolve(repoRoot, "openclaw-src");

// Node-only tests for pure logic (no Playwright/browser dependency).
export default defineConfig({
  resolve: {
    alias: {
      "@openclaw": openclawSrc,
    },
  },
  test: {
    testTimeout: 120_000,
    include: ["src/**/*.node.test.ts"],
    environment: "node",
  },
});
