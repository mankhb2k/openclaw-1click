/**
 * Runs before the Lit app so CSP allows only module scripts (no inline script in index.html).
 * Mirrors the boot snippet that upstream ships in index.html.
 */
(function themeBoot() {
  const THEMES: Record<string, 1> = { claw: 1, knot: 1, dash: 1 };
  const MODES: Record<string, 1> = { system: 1, light: 1, dark: 1 };
  const LEGACY: Record<string, string> = {
    dark: "claw:dark",
    light: "claw:light",
    openknot: "knot:dark",
    fieldmanual: "dash:dark",
    clawdash: "dash:light",
    system: "claw:system",
  };
  try {
    const keys = Object.keys(localStorage);
    let raw: string | null = null;
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].indexOf("openclaw.control.settings.v1") === 0) {
        raw = localStorage.getItem(keys[i]);
        if (raw) break;
      }
    }
    if (!raw) return;
    const s = JSON.parse(raw) as { theme?: string; themeMode?: string };
    let t = typeof s.theme === "string" ? s.theme : "";
    let m = typeof s.themeMode === "string" ? s.themeMode : "";
    const legacy = LEGACY[t];
    const theme = THEMES[t] ? t : legacy ? legacy.split(":")[0]! : "claw";
    let mode = MODES[m] ? m : legacy ? legacy.split(":")[1]! : "system";
    if (mode === "system") {
      mode = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    const resolved =
      theme === "knot"
        ? mode === "light"
          ? "openknot-light"
          : "openknot"
        : theme === "dash"
          ? mode === "light"
            ? "dash-light"
            : "dash"
          : mode === "light"
            ? "light"
            : "dark";
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.setAttribute(
      "data-theme-mode",
      resolved.indexOf("light") !== -1 ? "light" : "dark",
    );
  } catch {
    /* ignore */
  }
})();
