import { t } from "./index.ts";

function safeI18nKeySegment(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, "_");
}

function translateOrFallback(key: string, fallback: string): string {
  const out = t(key);
  return out === key ? fallback : out;
}

export function translateToolSectionLabel(sectionId: string, fallback: string): string {
  return translateOrFallback(`agents.tools.sections.${safeI18nKeySegment(sectionId)}`, fallback);
}

export function translateToolDescription(toolId: string, fallback: string): string {
  return translateOrFallback(`agents.tools.descriptions.${safeI18nKeySegment(toolId)}`, fallback);
}

export function translateToolProfileLabel(profileId: string, fallback: string): string {
  return translateOrFallback(`agents.tools.profiles.${safeI18nKeySegment(profileId)}`, fallback);
}
