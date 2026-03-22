import path from "node:path";
import { fileURLToPath } from "node:url";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, defineProject } from "vitest/config";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const openclawSrc = path.resolve(repoRoot, "openclaw-src");

export default defineConfig({
  resolve: {
    alias: {
      "@openclaw": openclawSrc,
    },
  },
  test: {
    projects: [
      defineProject({
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
          exclude: ["src/**/*.browser.test.ts", "src/**/*.node.test.ts"],
          environment: "jsdom",
        },
      }),
      defineProject({
        test: {
          name: "unit-node",
          include: ["src/**/*.node.test.ts"],
          environment: "jsdom",
        },
      }),
      defineProject({
        test: {
          name: "browser",
          include: ["src/**/*.browser.test.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium", name: "chromium" }],
            headless: true,
            ui: false,
          },
        },
      }),
    ],
  },
});
