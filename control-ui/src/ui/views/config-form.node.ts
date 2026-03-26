import { html, nothing, type TemplateResult } from "lit";
import { t } from "../../i18n/index";
import { renderUiSelect } from "../components/ui-select";
import { icons as sharedIcons } from "../icons";
import type { ConfigUiHints } from "../types";
import {
  defaultValue,
  hasSensitiveConfigData,
  hintForPath,
  humanize,
  pathKey,
  REDACTED_PLACEHOLDER,
  schemaType,
  type JsonSchema,
} from "./config-form.shared";

const META_KEYS = new Set(["title", "description", "default", "nullable", "tags", "x-tags"]);

function isAnySchema(schema: JsonSchema): boolean {
  const keys = Object.keys(schema ?? {}).filter((key) => !META_KEYS.has(key));
  return keys.length === 0;
}

function jsonValue(value: unknown): string {
  if (value === undefined) {
    return "";
  }
  try {
    return JSON.stringify(value, null, 2) ?? "";
  } catch {
    return "";
  }
}

// SVG Icons as template literals
const icons = {
  chevronDown: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,
  plus: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,
  minus: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,
  trash: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  `,
  edit: html`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  `,
};

type FieldMeta = {
  label: string;
  help?: string;
  tags: string[];
};

const CONFIG_COPY_KEY_BY_TEXT: Record<string, string> = {
  "Hide value": "config.copy.hideValue",
  "Reveal value": "config.copy.revealValue",
  "Disable stream mode to reveal value": "config.copy.disableStreamModeToReveal",
  "Unsupported schema node. Use Raw mode.": "config.copy.unsupportedSchemaNode",
  "Unsupported type: {type}. Use Raw mode.": "config.copy.unsupportedType",
  "Reset to default": "config.copy.resetToDefault",
  "Select...": "config.copy.selectPlaceholder",
  "JSON value": "config.copy.jsonValue",
  "Unsupported array schema. Use Raw mode.": "config.copy.unsupportedArraySchema",
  item: "config.copy.item",
  items: "config.copy.items",
  Add: "config.copy.add",
  'No items yet. Click "Add" to create one.': "config.copy.noItemsYet",
  "Remove item": "config.copy.removeItem",
  "Custom entries": "config.copy.customEntries",
  "Add Entry": "config.copy.addEntry",
  "No custom entries.": "config.copy.noCustomEntries",
  Key: "config.copy.key",
  "Remove entry": "config.copy.removeEntry",
  random: "config.copy.random",
  default: "config.copy.default",
  off: "config.copy.off",
  old: "config.copy.old",
  new: "config.copy.new",
  summarize: "config.copy.summarize",
  always: "config.copy.always",
  inbound: "config.copy.inbound",
  tagged: "config.copy.tagged",
  final: "config.copy.final",
  all: "config.copy.all",
  session: "config.copy.session",
  targets: "config.copy.targets",
  both: "config.copy.both",
  raw: "config.copy.raw",
  hash: "config.copy.hash",
  local: "config.copy.local",
  remote: "config.copy.remote",
  rate_limit: "config.copy.rate_limit",
  overloaded: "config.copy.overloaded",
  network: "config.copy.network",
  timeout: "config.copy.timeout",
  server_error: "config.copy.server_error",
  wake: "config.copy.wake",
  agent: "config.copy.agent",
  now: "config.copy.now",
  "next-heartbeat": "config.copy.next_heartbeat",
  none: "config.copy.none",
  npm: "config.copy.npm",
  archive: "config.copy.archive",
  path: "config.copy.path",
  auto: "config.copy.auto",
  lan: "config.copy.lan",
  loopback: "config.copy.loopback",
  custom: "config.copy.custom",
  tailnet: "config.copy.tailnet",
  serve: "config.copy.serve",
  funnel: "config.copy.funnel",
  direct: "config.copy.direct",
  ssh: "config.copy.ssh",
  minimal: "config.copy.minimal",
  full: "config.copy.full",
  token: "config.copy.token",
  password: "config.copy.password",
  "trusted-proxy": "config.copy.trusted_proxy",
  Auto: "config.copy.update.auto",
  "Auto Update Beta Check Interval (hours)": "config.copy.update.betaCheckHours.label",
  "How often beta-channel checks run in hours (default: 1).":
    "config.copy.update.betaCheckHours.help",
  performance: "config.copy.update.performance",
  "Auto Update Enabled": "config.copy.update.enabled.label",
  "Whether auto-update downloads packages while idle (default: true).":
    "config.copy.update.enabled.help",
  advanced: "config.copy.update.advanced",
  "Auto Update Stable Delay (hours)": "config.copy.update.stableDelayHours.label",
  "Minimum delay before stable channel auto apply starts (default: 6).":
    "config.copy.update.stableDelayHours.help",
  "Auto Update Stable Jitter (hours)": "config.copy.update.stableJitterHours.label",
  "Extra stable-channel rollout spread window in hours (default: 12).":
    "config.copy.update.stableJitterHours.help",
  "Update Channel": "config.copy.update.channel.label",
  'Update channel for gui + runtime install ("stable", "beta", "dev")':
    "config.copy.update.channel.help",
  Cli: "config.copy.cli.label",
  CLI: "config.copy.cli.label",
  "CLI presentation controls for local command output behavior such as banner and tagline style. Use this section to keep startup output aligned with operator preference without changing runtime behavior.":
    "config.copy.cli.help",
  Diagnostics: "config.copy.diagnostics.label",
  "Diagnostics controls for targeted tracing, telemetry export, and cache inspection during debugging. Keep baseline diagnostics minimal in production and enable deeper signals only when investigating issues.":
    "config.copy.diagnostics.help",
  "Diagnostics Flags": "config.copy.diagnostics.flagsLabel",
  'Enable targeted diagnostics logs by flag (e.g. ["telegram.http"]). Supports wildcards like "telegram.*" or "*".':
    "config.copy.diagnostics.flagsHelp",
  Acp: "config.copy.acp.label",
  ACP: "config.copy.acp.label",
  "ACP runtime controls for enabling dispatch, selecting backends, constraining allowed agent targets, and tuning streamed turn projection behavior.":
    "config.copy.acp.help",
  Mcp: "config.copy.mcp.label",
  MCP: "config.copy.mcp.label",
  "Global MCP server definitions managed by OpenClaw. Embedded Pi and other runtime adapters can consume these servers without storing them inside Pi-owned project settings.":
    "config.copy.mcp.help",
  Secrets: "config.copy.secrets.label",
  secrets: "config.copy.secrets.label",
  Logs: "config.copy.logs.label",
  "Custom Redaction Patterns": "config.copy.logs.customRedactionPatterns.label",
  "Additional custom redact regex patterns applied to log output before emission/storage. Use this to mask org-specific tokens and identifiers not covered by built-in redaction rules.":
    "config.copy.logs.customRedactionPatterns.help",
  "Gateway HTTP API configuration grouping endpoint toggles and transport-facing API exposure controls. Keep only required endpoints enabled to reduce attack surface.":
    "config.copy.infrastructure.gateway.http.help",
  "Push-delivery settings used by the gateway when it needs to wake or notify paired devices. Configure relay-backed APNs here for official iOS builds; direct APNs auth remains env-based for local/manual builds.":
    "config.copy.infrastructure.gateway.push.help",
  "Live config-reload policy for how edits are applied and when full restarts are triggered. Keep hybrid behavior for safest operational updates unless debugging reload internals.":
    "config.copy.infrastructure.gateway.reload.help",
  "Remote gateway connection settings for direct or SSH transport when this instance proxies to another runtime host. Use remote mode only when split-host operation is intentionally configured.":
    "config.copy.infrastructure.gateway.remote.help",
  "Tailscale integration settings for Serve/Funnel exposure and lifecycle handling on gateway start/exit. Keep off unless your deployment intentionally relies on Tailscale ingress.":
    "config.copy.infrastructure.gateway.tailscale.help",
  "TLS certificate and key settings for terminating HTTPS directly in the gateway process. Use explicit certificates in production and avoid plaintext exposure on untrusted networks.":
    "config.copy.infrastructure.gateway.tls.help",
  "Groups browser-proxy settings for exposing local browser control through node routing. Enable only when remote node workflows need your local browser profiles.":
    "config.copy.infrastructure.nodeHost.browserProxy.help",
  "Reconnect backoff policy for web channel reconnect attempts after transport failure. Keep bounded retries and jitter tuned to avoid thundering-herd reconnect behavior.":
    "config.copy.infrastructure.web.reconnect.help",
  "Named browser profile connection map used for explicit routing to CDP ports or URLs with optional metadata. Keep profile names consistent and avoid overlapping endpoint definitions.":
    "config.copy.infrastructure.browser.profiles.help",
  "Bind IP address for the Chrome extension relay listener. Leave unset for loopback-only access, or set an explicit non-loopback IP such as 0.0.0.0 only when the relay must be reachable across network namespaces (for example WSL2) and the surrounding network is already trusted.":
    "config.copy.infrastructure.browser.extensionRelayBind.help",
  "Default snapshot capture configuration used when callers do not provide explicit snapshot options. Tune this for consistent capture behavior across channels and automation paths.":
    "config.copy.infrastructure.browser.snapshotDefaults.help",
  "Server-side request forgery guardrail settings for browser/network fetch paths that could reach internal hosts. Keep restrictive defaults in production and open only explicitly approved targets.":
    "config.copy.infrastructure.browser.ssrfPolicy.help",
  "mDNS discovery configuration group for local network advertisement and discovery behavior tuning. Keep minimal mode for routine LAN discovery unless extra metadata is required.":
    "config.copy.infrastructure.discovery.mdns.help",
  "Wide-area discovery configuration group for exposing discovery signals beyond local-link scopes. Enable only in deployments that intentionally aggregate gateway presence across sites.":
    "config.copy.infrastructure.discovery.wideArea.help",
  "Max characters of each workspace bootstrap file injected into the system prompt before truncation (default: 20000).":
    "config.copy.aiAgents.bootstrapMaxChars.help",
  'Inject agent-visible warning text when bootstrap files are truncated: "off", "once" (default), or "always".':
    "config.copy.aiAgents.bootstrapPromptTruncationWarning.help",
  "Max total characters across all injected workspace bootstrap files (default: 150000).":
    "config.copy.aiAgents.bootstrapTotalMaxChars.help",
  'Include elapsed time in message envelopes ("on" or "off").':
    "config.copy.aiAgents.envelopeElapsed.help",
  'Include absolute timestamps in message envelopes ("on" or "off").':
    "config.copy.aiAgents.envelopeTimestamp.help",
  'Timezone for message envelopes ("utc", "local", "user", or an IANA timezone string).':
    "config.copy.aiAgents.envelopeTimezone.help",
  "Max image side length in pixels when sanitizing transcript/tool-result image payloads (default: 1200).":
    "config.copy.aiAgents.imageMaxDimensionPx.help",
  "Maximum PDF file size in megabytes for the PDF tool (default: 10).":
    "config.copy.aiAgents.pdfMaxBytesMb.help",
  "Maximum number of PDF pages to process for the PDF tool (default: 20).":
    "config.copy.aiAgents.pdfMaxPages.help",
  "Optional repository root shown in the system prompt runtime line (overrides auto-detect).":
    "config.copy.aiAgents.repoRoot.help",
  "Default workspace path exposed to agent runtime tools for filesystem context and repo-aware behavior. Set this explicitly when running from wrappers so path resolution stays deterministic.":
    "config.copy.aiAgents.workspace.help",
  "Allowlist of target agent IDs permitted for agent_to_agent calls when orchestration is enabled. Use explicit allowlists to avoid uncontrolled cross-agent call graphs.":
    "config.copy.aiAgents.tools.agentToAgentAllow.help",
  "Enables the agent_to_agent tool surface so one agent can invoke another agent at runtime. Keep off in simple deployments and enable only when orchestration value outweighs complexity.":
    "config.copy.aiAgents.tools.agentToAgentEnabled.help",
  "Enables elevated tool execution path when sender and policy checks pass. Keep disabled in public/shared channels and enable only for trusted owner-operated contexts.":
    "config.copy.aiAgents.tools.elevatedEnabled.help",
  "Approval strategy for when exec commands require human confirmation before running. Use stricter ask behavior in shared channels and lower-friction settings in private operator contexts.":
    "config.copy.aiAgents.tools.execAsk.help",
  "Selects execution host strategy for shell commands, typically controlling local vs delegated execution environment. Use the safest host mode that still satisfies your automation requirements.":
    "config.copy.aiAgents.tools.execHost.help",
  "Node binding configuration for exec tooling when command execution is delegated through connected nodes. Use explicit node binding only when multi-node routing is required.":
    "config.copy.aiAgents.tools.execNode.help",
  "When true (default), backgrounded exec sessions on exit and node exec lifecycle events enqueue a system event and request a heartbeat.":
    "config.copy.aiAgents.tools.execNotifyOnExit.help",
  "When true, successful backgrounded exec exits with empty output still enqueue a completion system event (default: false).":
    "config.copy.aiAgents.tools.execNotifyOnExitEmptySuccess.help",
  "Directories to prepend to PATH for exec runs (gateway/sandbox).":
    "config.copy.aiAgents.tools.execPathPrepend.help",
  "Allow stdin-only safe binaries to run without explicit allowlist entries.":
    "config.copy.aiAgents.tools.execSafeBins.help",
  "Additional explicit directories trusted for safe-bin path checks (PATH entries are never auto-trusted).":
    "config.copy.aiAgents.tools.execSafeBinTrustedDirs.help",
  "Execution security posture selector controlling sandbox/approval expectations for command execution. Keep strict security mode for untrusted prompts and relax only for trusted operator workflows.":
    "config.copy.aiAgents.tools.execSecurity.help",
  "Restrict filesystem tools (read/write/edit/apply_patch) to the workspace directory (default: false).":
    "config.copy.aiAgents.tools.fsWorkspaceOnly.help",
  "Enable automatic link understanding pre-processing so URLs can be summarized before agent reasoning. Keep enabled for richer context, and disable when strict minimal processing is required.":
    "config.copy.aiAgents.tools.linksEnabled.help",
  "Maximum number of links expanded per turn during link understanding. Use lower values to control latency/cost in chatty threads and higher values when multi-link context is critical.":
    "config.copy.aiAgents.tools.linksMaxLinks.help",
  "Preferred model list for link understanding tasks, evaluated in order as fallbacks when supported. Use lightweight models first for routine summarization and heavier models only when needed.":
    "config.copy.aiAgents.tools.linksModels.help",
  "Per-link understanding timeout budget in seconds before unresolved links are skipped. Keep this bounded to avoid long stalls when external sites are slow or unreachable.":
    "config.copy.aiAgents.tools.linksTimeoutSeconds.help",
  "Critical threshold for repetitive patterns when detector is enabled (default: 20).":
    "config.copy.aiAgents.tools.loopCriticalThreshold.help",
  "Enable repetitive tool-call loop detection and backoff safety checks (default: false).":
    "config.copy.aiAgents.tools.loopEnabled.help",
  "Global no-progress breaker threshold (default: 30).":
    "config.copy.aiAgents.tools.loopGlobalCircuitBreakerThreshold.help",
  "Tool history window size for loop detection (default: 30).":
    "config.copy.aiAgents.tools.loopHistorySize.help",
  "Warning threshold for repetitive patterns when detector is enabled (default: 10).":
    "config.copy.aiAgents.tools.loopWarningThreshold.help",
  "Maximum number of concurrent media understanding operations per turn across image, audio, and video tasks. Lower this in resource-constrained deployments to prevent CPU/network saturation.":
    "config.copy.aiAgents.tools.mediaConcurrency.help",
  "Shared fallback model list used by media understanding tools when modality-specific model lists are not set. Keep this aligned with available multimodal providers to avoid runtime fallback churn.":
    "config.copy.aiAgents.tools.mediaModels.help",
  "Legacy override: allow cross-context sends across all providers.":
    "config.copy.aiAgents.tools.crossContextAllowAcrossProviders.help",
  'Controls which sessions can be targeted by sessions_list/sessions_history/sessions_send. ("tree" default = current session + spawned subagent sessions; "self" = only current; "agent" = any session in the current agent id; "all" = any session; cross-agent still requires tools.agentToAgent).':
    "config.copy.aiAgents.tools.sessionsVisibility.help",
  "Automatic AWS Bedrock model discovery settings used to synthesize provider model entries from account visibility. Keep discovery scoped and refresh intervals conservative to reduce API churn.":
    "config.copy.aiAgents.models.bedrockDiscovery.help",
  "Max reply-back turns between requester and target agents during agent-to-agent exchanges (0-5). Use lower values to hard-limit chatter loops and preserve predictable run completion.":
    "config.copy.aiAgents.sessionAgentToAgentMaxPingPongTurns.help",
  "Target size after disk-budget cleanup (high-water mark). Defaults to 80% of maxDiskBytes; set explicitly for tighter reclaim behavior on constrained disks.":
    "config.copy.aiAgents.sessionMaintenanceHighWaterBytes.help",
  "Optional per-agent sessions-directory disk budget (for example `500mb`). Use this to cap session storage per agent; when exceeded, warn mode reports pressure and enforce mode performs oldest-first cleanup.":
    "config.copy.aiAgents.sessionMaintenanceMaxDiskBytes.help",
  "Caps total session entry count retained in the store to prevent unbounded growth over time. Use lower limits for constrained environments, or higher limits when longer history is required.":
    "config.copy.aiAgents.sessionMaintenanceMaxEntries.help",
  'Determines whether maintenance policies are only reported ("warn") or actively applied ("enforce"). Keep "warn" during rollout and switch to "enforce" after validating safe thresholds.':
    "config.copy.aiAgents.sessionMaintenanceMode.help",
  "Removes entries older than this duration (for example `30d` or `12h`) during maintenance passes. Use this as the primary age-retention control and align it with data retention policy.":
    "config.copy.aiAgents.sessionMaintenancePruneAfter.help",
  "Deprecated age-retention field kept for compatibility with legacy configs using day counts. Use session.maintenance.pruneAfter instead so duration syntax and behavior are consistent.":
    "config.copy.aiAgents.sessionMaintenancePruneDays.help",
  "Rotates the session store when file size exceeds a threshold such as `10mb` or `1gb`. Use this to bound single-file growth and keep backup/restore operations manageable.":
    "config.copy.aiAgents.sessionMaintenanceRotateBytes.help",
  "Sets local-hour boundary (0-23) for daily reset mode so sessions roll over at predictable times. Use with mode=daily and align to operator timezone expectations for human-readable behavior.":
    "config.copy.aiAgents.sessionResetAtHour.help",
  "Sets inactivity window before reset for idle mode and can also act as secondary guard with daily mode. Use larger values to preserve continuity or smaller values for fresher short-lived threads.":
    "config.copy.aiAgents.sessionResetIdleMinutes.help",
  'Selects reset strategy: "daily" resets at a configured hour and "idle" resets after inactivity windows. Keep one clear mode per policy to avoid surprising context turnover patterns.':
    "config.copy.aiAgents.sessionResetMode.help",
  'Sets fallback action when no sendPolicy rule matches: "allow" or "deny". Keep "allow" for simpler setups, or choose "deny" when you require explicit allow rules for every destination.':
    "config.copy.aiAgents.sessionSendPolicyDefault.help",
  'Ordered allow/deny rules evaluated before the default action, for example `{ action: "deny", match: { channel: "discord" } }`. Put most specific rules first so broad rules do not shadow exceptions.':
    "config.copy.aiAgents.sessionSendPolicyRules.help",
  "Global master switch for thread-bound session routing features and focused thread delivery behavior. Keep enabled for modern thread workflows unless you need to disable thread binding globally.":
    "config.copy.aiAgents.sessionThreadBindingsEnabled.help",
  "Default inactivity window in hours for thread-bound sessions across providers/channels (0 disables idle auto-unfocus). Default: 24.":
    "config.copy.aiAgents.sessionThreadBindingsIdleHours.help",
  "Optional hard max age in hours for thread-bound sessions across providers/channels (0 disables hard cap). Default: 0.":
    "config.copy.aiAgents.sessionThreadBindingsMaxAgeHours.help",
  'Controls whether heartbeat delivery may target direct/DM chats: "allow" (default) permits DM delivery and "block" suppresses direct-target sends.':
    "config.copy.aiAgents.heartbeatDirectPolicy.help",
  "Suppress tool error warning payloads during heartbeat runs.":
    "config.copy.aiAgents.heartbeatSuppressToolErrorWarnings.help",
  'Delivery target ("last", "none", or a channel id).':
    "config.copy.aiAgents.heartbeatTarget.help",
  'Delivery target ("last", "none", or a channel id). Known channels: telegram, whatsapp, discord, irc, googlechat, slack, signal, imessage, line.':
    "config.copy.aiAgents.heartbeatTargetKnownChannels.help",
};

function translateConfigCopy(raw: string | undefined): string | undefined {
  if (!raw) {
    return raw;
  }
  const normalized = raw.trim();
  const key = CONFIG_COPY_KEY_BY_TEXT[normalized];
  if (!key) {
    return raw;
  }
  const localized = t(key);
  return localized === key ? raw : localized;
}

type SensitiveRenderParams = {
  path: Array<string | number>;
  value: unknown;
  hints: ConfigUiHints;
  revealSensitive: boolean;
  isSensitivePathRevealed?: (path: Array<string | number>) => boolean;
};

type SensitiveRenderState = {
  isSensitive: boolean;
  isRedacted: boolean;
  isRevealed: boolean;
  canReveal: boolean;
};

export type ConfigSearchCriteria = {
  text: string;
  tags: string[];
};

function getSensitiveRenderState(params: SensitiveRenderParams): SensitiveRenderState {
  const isSensitive = hasSensitiveConfigData(params.value, params.path, params.hints);
  const isRevealed =
    isSensitive &&
    (params.revealSensitive || (params.isSensitivePathRevealed?.(params.path) ?? false));
  return {
    isSensitive,
    isRedacted: isSensitive && !isRevealed,
    isRevealed,
    canReveal: isSensitive,
  };
}

function renderSensitiveToggleButton(params: {
  path: Array<string | number>;
  state: SensitiveRenderState;
  disabled: boolean;
  onToggleSensitivePath?: (path: Array<string | number>) => void;
}): TemplateResult | typeof nothing {
  const { state } = params;
  if (!state.isSensitive || !params.onToggleSensitivePath) {
    return nothing;
  }
  return html`
    <button
      type="button"
      class="btn btn--icon ${state.isRevealed ? "active" : ""}"
      style="width:28px;height:28px;padding:0;"
      title=${
        state.canReveal
          ? state.isRevealed
            ? (translateConfigCopy("Hide value") ?? "Hide value")
            : (translateConfigCopy("Reveal value") ?? "Reveal value")
          : (translateConfigCopy("Disable stream mode to reveal value") ??
            "Disable stream mode to reveal value")
      }
      aria-label=${
        state.canReveal
          ? state.isRevealed
            ? (translateConfigCopy("Hide value") ?? "Hide value")
            : (translateConfigCopy("Reveal value") ?? "Reveal value")
          : (translateConfigCopy("Disable stream mode to reveal value") ??
            "Disable stream mode to reveal value")
      }
      aria-pressed=${state.isRevealed}
      ?disabled=${params.disabled || !state.canReveal}
      @click=${() => params.onToggleSensitivePath?.(params.path)}
    >
      ${state.isRevealed ? sharedIcons.eye : sharedIcons.eyeOff}
    </button>
  `;
}

function hasSearchCriteria(criteria: ConfigSearchCriteria | undefined): boolean {
  return Boolean(criteria && (criteria.text.length > 0 || criteria.tags.length > 0));
}

export function parseConfigSearchQuery(query: string): ConfigSearchCriteria {
  const tags: string[] = [];
  const seen = new Set<string>();
  const raw = query.trim();
  const stripped = raw.replace(/(^|\s)tag:([^\s]+)/gi, (_, leading: string, token: string) => {
    const normalized = token.trim().toLowerCase();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      tags.push(normalized);
    }
    return leading;
  });
  return {
    text: stripped.trim().toLowerCase(),
    tags,
  };
}

function normalizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const value of raw) {
    if (typeof value !== "string") {
      continue;
    }
    const tag = value.trim();
    if (!tag) {
      continue;
    }
    const key = tag.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    tags.push(tag);
  }
  return tags;
}

function resolvePathTranslation(
  path: Array<string | number>,
  kind: "label" | "help",
): string | undefined {
  const pathKey = path.filter((segment): segment is string => typeof segment === "string").join(".");
  if (!pathKey) {
    return undefined;
  }
  const key = `config.fields.${pathKey}.${kind}`;
  const localized = t(key);
  return localized === key ? undefined : localized;
}

function resolveFieldMeta(
  path: Array<string | number>,
  schema: JsonSchema,
  hints: ConfigUiHints,
): FieldMeta {
  const hint = hintForPath(path, hints);
  const label =
    resolvePathTranslation(path, "label") ??
    translateConfigCopy(hint?.label ?? schema.title ?? humanize(String(path.at(-1))));
  const help =
    resolvePathTranslation(path, "help") ?? translateConfigCopy(hint?.help ?? schema.description);
  const schemaTags = normalizeTags(schema["x-tags"] ?? schema.tags);
  const hintTags = normalizeTags(hint?.tags);
  return {
    label: label ?? humanize(String(path.at(-1))),
    help,
    tags: hintTags.length > 0 ? hintTags : schemaTags,
  };
}

function matchesText(text: string, candidates: Array<string | undefined>): boolean {
  if (!text) {
    return true;
  }
  for (const candidate of candidates) {
    if (candidate && candidate.toLowerCase().includes(text)) {
      return true;
    }
  }
  return false;
}

function matchesTags(filterTags: string[], fieldTags: string[]): boolean {
  if (filterTags.length === 0) {
    return true;
  }
  const normalized = new Set(fieldTags.map((tag) => tag.toLowerCase()));
  return filterTags.every((tag) => normalized.has(tag));
}

function matchesNodeSelf(params: {
  schema: JsonSchema;
  path: Array<string | number>;
  hints: ConfigUiHints;
  criteria: ConfigSearchCriteria;
}): boolean {
  const { schema, path, hints, criteria } = params;
  if (!hasSearchCriteria(criteria)) {
    return true;
  }
  const { label, help, tags } = resolveFieldMeta(path, schema, hints);
  if (!matchesTags(criteria.tags, tags)) {
    return false;
  }

  if (!criteria.text) {
    return true;
  }

  const pathLabel = path
    .filter((segment): segment is string => typeof segment === "string")
    .join(".");
  const enumText =
    schema.enum && schema.enum.length > 0
      ? schema.enum.map((value) => String(value)).join(" ")
      : "";

  return matchesText(criteria.text, [
    label,
    help,
    schema.title,
    schema.description,
    pathLabel,
    enumText,
  ]);
}

export function matchesNodeSearch(params: {
  schema: JsonSchema;
  value: unknown;
  path: Array<string | number>;
  hints: ConfigUiHints;
  criteria: ConfigSearchCriteria;
}): boolean {
  const { schema, value, path, hints, criteria } = params;
  if (!hasSearchCriteria(criteria)) {
    return true;
  }
  if (matchesNodeSelf({ schema, path, hints, criteria })) {
    return true;
  }

  const type = schemaType(schema);
  if (type === "object") {
    const fallback = value ?? schema.default;
    const obj =
      fallback && typeof fallback === "object" && !Array.isArray(fallback)
        ? (fallback as Record<string, unknown>)
        : {};
    const props = schema.properties ?? {};
    for (const [propKey, node] of Object.entries(props)) {
      if (
        matchesNodeSearch({
          schema: node,
          value: obj[propKey],
          path: [...path, propKey],
          hints,
          criteria,
        })
      ) {
        return true;
      }
    }
    const additional = schema.additionalProperties;
    if (additional && typeof additional === "object") {
      const reserved = new Set(Object.keys(props));
      for (const [entryKey, entryValue] of Object.entries(obj)) {
        if (reserved.has(entryKey)) {
          continue;
        }
        if (
          matchesNodeSearch({
            schema: additional,
            value: entryValue,
            path: [...path, entryKey],
            hints,
            criteria,
          })
        ) {
          return true;
        }
      }
    }
    return false;
  }

  if (type === "array") {
    const itemsSchema = Array.isArray(schema.items) ? schema.items[0] : schema.items;
    if (!itemsSchema) {
      return false;
    }
    const arr = Array.isArray(value) ? value : Array.isArray(schema.default) ? schema.default : [];
    if (arr.length === 0) {
      return false;
    }
    for (let idx = 0; idx < arr.length; idx += 1) {
      if (
        matchesNodeSearch({
          schema: itemsSchema,
          value: arr[idx],
          path: [...path, idx],
          hints,
          criteria,
        })
      ) {
        return true;
      }
    }
  }

  return false;
}

function renderTags(tags: string[]): TemplateResult | typeof nothing {
  if (tags.length === 0) {
    return nothing;
  }
  return html`
    <div class="cfg-tags">
      ${tags.map((tag) => html`<span class="cfg-tag">${tag}</span>`)}
    </div>
  `;
}

export function renderNode(params: {
  schema: JsonSchema;
  value: unknown;
  path: Array<string | number>;
  hints: ConfigUiHints;
  unsupported: Set<string>;
  disabled: boolean;
  showLabel?: boolean;
  searchCriteria?: ConfigSearchCriteria;
  revealSensitive?: boolean;
  isSensitivePathRevealed?: (path: Array<string | number>) => boolean;
  onToggleSensitivePath?: (path: Array<string | number>) => void;
  onPatch: (path: Array<string | number>, value: unknown) => void;
}): TemplateResult | typeof nothing {
  const { schema, value, path, hints, unsupported, disabled, onPatch } = params;
  const showLabel = params.showLabel ?? true;
  const type = schemaType(schema);
  const { label, help, tags } = resolveFieldMeta(path, schema, hints);
  const key = pathKey(path);
  const criteria = params.searchCriteria;

  if (unsupported.has(key)) {
    return html`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${label}</div>
      <div class="cfg-field__error">
        ${translateConfigCopy("Unsupported schema node. Use Raw mode.")}
      </div>
    </div>`;
  }
  if (
    criteria &&
    hasSearchCriteria(criteria) &&
    !matchesNodeSearch({ schema, value, path, hints, criteria })
  ) {
    return nothing;
  }

  // Handle anyOf/oneOf unions
  if (schema.anyOf || schema.oneOf) {
    const variants = schema.anyOf ?? schema.oneOf ?? [];
    const nonNull = variants.filter(
      (v) => !(v.type === "null" || (Array.isArray(v.type) && v.type.includes("null"))),
    );

    if (nonNull.length === 1) {
      return renderNode({ ...params, schema: nonNull[0] });
    }

    // Check if it's a set of literal values (enum-like)
    const extractLiteral = (v: JsonSchema): unknown => {
      if (v.const !== undefined) {
        return v.const;
      }
      if (v.enum && v.enum.length === 1) {
        return v.enum[0];
      }
      return undefined;
    };
    const literals = nonNull.map(extractLiteral);
    const allLiterals = literals.every((v) => v !== undefined);

    if (allLiterals && literals.length > 0 && literals.length <= 5) {
      // Use segmented control for small sets
      const resolvedValue = value ?? schema.default;
      return html`
        <div class="cfg-field">
          ${showLabel ? html`<label class="cfg-field__label">${label}</label>` : nothing}
          ${help ? html`<div class="cfg-field__help">${help}</div>` : nothing}
          ${renderTags(tags)}
          <div class="cfg-segmented">
            ${literals.map(
              (lit) => html`
              <button
                type="button"
                class="cfg-segmented__btn ${
                  // oxlint-disable typescript/no-base-to-string
                  lit === resolvedValue || String(lit) === String(resolvedValue) ? "active" : ""
                }"
                ?disabled=${disabled}
                @click=${() => onPatch(path, lit)}
              >
                ${
                  // oxlint-disable typescript/no-base-to-string
                  String(lit)
                }
              </button>
            `,
            )}
          </div>
        </div>
      `;
    }

    if (allLiterals && literals.length > 5) {
      // Use dropdown for larger sets
      return renderSelect({ ...params, options: literals, value: value ?? schema.default });
    }

    // Handle mixed primitive types
    const primitiveTypes = new Set(nonNull.map((variant) => schemaType(variant)).filter(Boolean));
    const normalizedTypes = new Set(
      [...primitiveTypes].map((v) => (v === "integer" ? "number" : v)),
    );

    if ([...normalizedTypes].every((v) => ["string", "number", "boolean"].includes(v as string))) {
      const hasString = normalizedTypes.has("string");
      const hasNumber = normalizedTypes.has("number");
      const hasBoolean = normalizedTypes.has("boolean");

      if (hasBoolean && normalizedTypes.size === 1) {
        return renderNode({
          ...params,
          schema: { ...schema, type: "boolean", anyOf: undefined, oneOf: undefined },
        });
      }

      if (hasString || hasNumber) {
        return renderTextInput({
          ...params,
          inputType: hasNumber && !hasString ? "number" : "text",
        });
      }
    }

    // Complex union (e.g. array | object) — render as JSON textarea
    return renderJsonTextarea({
      schema,
      value,
      path,
      hints,
      disabled,
      showLabel,
      revealSensitive: params.revealSensitive ?? false,
      isSensitivePathRevealed: params.isSensitivePathRevealed,
      onToggleSensitivePath: params.onToggleSensitivePath,
      onPatch,
    });
  }

  // Enum - use segmented for small, dropdown for large
  if (schema.enum) {
    const options = schema.enum;
    if (options.length <= 5) {
      const resolvedValue = value ?? schema.default;
      return html`
        <div class="cfg-field">
          ${showLabel ? html`<label class="cfg-field__label">${label}</label>` : nothing}
          ${help ? html`<div class="cfg-field__help">${help}</div>` : nothing}
          ${renderTags(tags)}
          <div class="cfg-segmented">
            ${options.map(
              (opt) => html`
              <button
                type="button"
                class="cfg-segmented__btn ${opt === resolvedValue || String(opt) === String(resolvedValue) ? "active" : ""}"
                ?disabled=${disabled}
                @click=${() => onPatch(path, opt)}
              >
                ${String(opt)}
              </button>
            `,
            )}
          </div>
        </div>
      `;
    }
    return renderSelect({ ...params, options, value: value ?? schema.default });
  }

  // Object type - collapsible section
  if (type === "object") {
    return renderObject(params);
  }

  // Array type
  if (type === "array") {
    return renderArray(params);
  }

  // Boolean - toggle row
  if (type === "boolean") {
    const displayValue =
      typeof value === "boolean"
        ? value
        : typeof schema.default === "boolean"
          ? schema.default
          : false;
    return html`
      <label class="cfg-toggle-row ${disabled ? "disabled" : ""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${label}</span>
          ${help ? html`<span class="cfg-toggle-row__help">${help}</span>` : nothing}
          ${renderTags(tags)}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${displayValue}
            ?disabled=${disabled}
            @change=${(e: Event) => onPatch(path, (e.target as HTMLInputElement).checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `;
  }

  // Number/Integer
  if (type === "number" || type === "integer") {
    return renderNumberInput(params);
  }

  // String
  if (type === "string") {
    return renderTextInput({ ...params, inputType: "text" });
  }

  // Fallback
  return html`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${label}</div>
      <div class="cfg-field__error">
        ${(translateConfigCopy("Unsupported type: {type}. Use Raw mode.") ??
          "Unsupported type: {type}. Use Raw mode.").replace("{type}", String(type))}
      </div>
    </div>
  `;
}

function renderTextInput(params: {
  schema: JsonSchema;
  value: unknown;
  path: Array<string | number>;
  hints: ConfigUiHints;
  disabled: boolean;
  showLabel?: boolean;
  searchCriteria?: ConfigSearchCriteria;
  revealSensitive?: boolean;
  isSensitivePathRevealed?: (path: Array<string | number>) => boolean;
  onToggleSensitivePath?: (path: Array<string | number>) => void;
  inputType: "text" | "number";
  onPatch: (path: Array<string | number>, value: unknown) => void;
}): TemplateResult {
  const { schema, value, path, hints, disabled, onPatch, inputType } = params;
  const showLabel = params.showLabel ?? true;
  const hint = hintForPath(path, hints);
  const { label, help, tags } = resolveFieldMeta(path, schema, hints);
  const sensitiveState = getSensitiveRenderState({
    path,
    value,
    hints,
    revealSensitive: params.revealSensitive ?? false,
    isSensitivePathRevealed: params.isSensitivePathRevealed,
  });
  const placeholder = sensitiveState.isRedacted
    ? REDACTED_PLACEHOLDER
    : (hint?.placeholder ??
      // oxlint-disable typescript/no-base-to-string
      (schema.default !== undefined ? `Default: ${String(schema.default)}` : ""));
  const displayValue = sensitiveState.isRedacted ? "" : (value ?? "");
  const effectiveInputType =
    sensitiveState.isSensitive && !sensitiveState.isRedacted ? "text" : inputType;

  return html`
    <div class="cfg-field">
      ${showLabel ? html`<label class="cfg-field__label">${label}</label>` : nothing}
      ${help ? html`<div class="cfg-field__help">${help}</div>` : nothing}
      ${renderTags(tags)}
      <div class="cfg-input-wrap">
        <input
          type=${effectiveInputType}
          class="cfg-input${sensitiveState.isRedacted ? " cfg-input--redacted" : ""}"
          placeholder=${placeholder}
          .value=${displayValue == null ? "" : String(displayValue)}
          ?disabled=${disabled}
          ?readonly=${sensitiveState.isRedacted}
          @click=${() => {
            if (sensitiveState.isRedacted && params.onToggleSensitivePath) {
              params.onToggleSensitivePath(path);
            }
          }}
          @input=${(e: Event) => {
            if (sensitiveState.isRedacted) {
              return;
            }
            const raw = (e.target as HTMLInputElement).value;
            if (inputType === "number") {
              if (raw.trim() === "") {
                onPatch(path, undefined);
                return;
              }
              const parsed = Number(raw);
              onPatch(path, Number.isNaN(parsed) ? raw : parsed);
              return;
            }
            onPatch(path, raw);
          }}
          @change=${(e: Event) => {
            if (inputType === "number" || sensitiveState.isRedacted) {
              return;
            }
            const raw = (e.target as HTMLInputElement).value;
            onPatch(path, raw.trim());
          }}
        />
        ${renderSensitiveToggleButton({
          path,
          state: sensitiveState,
          disabled,
          onToggleSensitivePath: params.onToggleSensitivePath,
        })}
        ${
          schema.default !== undefined
            ? html`
          <button
            type="button"
            class="cfg-input__reset"
            title=${translateConfigCopy("Reset to default") ?? "Reset to default"}
            ?disabled=${disabled || sensitiveState.isRedacted}
            @click=${() => onPatch(path, schema.default)}
          >↺</button>
        `
            : nothing
        }
      </div>
    </div>
  `;
}

function renderNumberInput(params: {
  schema: JsonSchema;
  value: unknown;
  path: Array<string | number>;
  hints: ConfigUiHints;
  disabled: boolean;
  showLabel?: boolean;
  searchCriteria?: ConfigSearchCriteria;
  onPatch: (path: Array<string | number>, value: unknown) => void;
}): TemplateResult {
  const { schema, value, path, hints, disabled, onPatch } = params;
  const showLabel = params.showLabel ?? true;
  const { label, help, tags } = resolveFieldMeta(path, schema, hints);
  const displayValue = value ?? schema.default ?? "";
  const numValue = typeof displayValue === "number" ? displayValue : 0;

  return html`
    <div class="cfg-field">
      ${showLabel ? html`<label class="cfg-field__label">${label}</label>` : nothing}
      ${help ? html`<div class="cfg-field__help">${help}</div>` : nothing}
      ${renderTags(tags)}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${disabled}
          @click=${() => onPatch(path, numValue - 1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${displayValue == null ? "" : String(displayValue)}
          ?disabled=${disabled}
          @input=${(e: Event) => {
            const raw = (e.target as HTMLInputElement).value;
            const parsed = raw === "" ? undefined : Number(raw);
            onPatch(path, parsed);
          }}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${disabled}
          @click=${() => onPatch(path, numValue + 1)}
        >+</button>
      </div>
    </div>
  `;
}

function renderSelect(params: {
  schema: JsonSchema;
  value: unknown;
  path: Array<string | number>;
  hints: ConfigUiHints;
  disabled: boolean;
  showLabel?: boolean;
  searchCriteria?: ConfigSearchCriteria;
  options: unknown[];
  onPatch: (path: Array<string | number>, value: unknown) => void;
}): TemplateResult {
  const { schema, value, path, hints, disabled, options, onPatch } = params;
  const showLabel = params.showLabel ?? true;
  const { label, help, tags } = resolveFieldMeta(path, schema, hints);
  const resolvedValue = value ?? schema.default;
  const currentIndex = options.findIndex(
    (opt) => opt === resolvedValue || String(opt) === String(resolvedValue),
  );
  const unset = "__unset__";

  return html`
    <div class="cfg-field">
      ${showLabel ? html`<label class="cfg-field__label">${label}</label>` : nothing}
      ${help ? html`<div class="cfg-field__help">${help}</div>` : nothing}
      ${renderTags(tags)}
      ${renderUiSelect({
        className: "cfg-select",
        disabled,
        value: currentIndex >= 0 ? String(currentIndex) : unset,
        options: [
          { value: unset, label: translateConfigCopy("Select...") ?? "Select..." },
          ...options.map((opt, idx) => ({
            value: String(idx),
            label: translateConfigCopy(String(opt)) ?? String(opt),
          })),
        ],
        onChange: (val) => {
          onPatch(path, val === unset ? undefined : options[Number(val)]);
        },
      })}
    </div>
  `;
}

function renderJsonTextarea(params: {
  schema: JsonSchema;
  value: unknown;
  path: Array<string | number>;
  hints: ConfigUiHints;
  disabled: boolean;
  showLabel?: boolean;
  revealSensitive?: boolean;
  isSensitivePathRevealed?: (path: Array<string | number>) => boolean;
  onToggleSensitivePath?: (path: Array<string | number>) => void;
  onPatch: (path: Array<string | number>, value: unknown) => void;
}): TemplateResult {
  const { schema, value, path, hints, disabled, onPatch } = params;
  const showLabel = params.showLabel ?? true;
  const { label, help, tags } = resolveFieldMeta(path, schema, hints);
  const fallback = jsonValue(value);
  const sensitiveState = getSensitiveRenderState({
    path,
    value,
    hints,
    revealSensitive: params.revealSensitive ?? false,
    isSensitivePathRevealed: params.isSensitivePathRevealed,
  });
  const displayValue = sensitiveState.isRedacted ? "" : fallback;

  return html`
    <div class="cfg-field">
      ${showLabel ? html`<label class="cfg-field__label">${label}</label>` : nothing}
      ${help ? html`<div class="cfg-field__help">${help}</div>` : nothing}
      ${renderTags(tags)}
      <div class="cfg-input-wrap">
        <textarea
          class="cfg-textarea${sensitiveState.isRedacted ? " cfg-textarea--redacted" : ""}"
          placeholder=${
            sensitiveState.isRedacted
              ? REDACTED_PLACEHOLDER
              : (translateConfigCopy("JSON value") ?? "JSON value")
          }
          rows="3"
          .value=${displayValue}
          ?disabled=${disabled}
          ?readonly=${sensitiveState.isRedacted}
          @click=${() => {
            if (sensitiveState.isRedacted && params.onToggleSensitivePath) {
              params.onToggleSensitivePath(path);
            }
          }}
          @change=${(e: Event) => {
            if (sensitiveState.isRedacted) {
              return;
            }
            const target = e.target as HTMLTextAreaElement;
            const raw = target.value.trim();
            if (!raw) {
              onPatch(path, undefined);
              return;
            }
            try {
              onPatch(path, JSON.parse(raw));
            } catch {
              target.value = fallback;
            }
          }}
        ></textarea>
        ${renderSensitiveToggleButton({
          path,
          state: sensitiveState,
          disabled,
          onToggleSensitivePath: params.onToggleSensitivePath,
        })}
      </div>
    </div>
  `;
}

function renderObject(params: {
  schema: JsonSchema;
  value: unknown;
  path: Array<string | number>;
  hints: ConfigUiHints;
  unsupported: Set<string>;
  disabled: boolean;
  showLabel?: boolean;
  searchCriteria?: ConfigSearchCriteria;
  revealSensitive?: boolean;
  isSensitivePathRevealed?: (path: Array<string | number>) => boolean;
  onToggleSensitivePath?: (path: Array<string | number>) => void;
  onPatch: (path: Array<string | number>, value: unknown) => void;
}): TemplateResult {
  const {
    schema,
    value,
    path,
    hints,
    unsupported,
    disabled,
    onPatch,
    searchCriteria,
    revealSensitive,
    isSensitivePathRevealed,
    onToggleSensitivePath,
  } = params;
  const showLabel = params.showLabel ?? true;
  const { label, help, tags } = resolveFieldMeta(path, schema, hints);
  const selfMatched =
    searchCriteria && hasSearchCriteria(searchCriteria)
      ? matchesNodeSelf({ schema, path, hints, criteria: searchCriteria })
      : false;
  const childSearchCriteria = selfMatched ? undefined : searchCriteria;

  const fallback = value ?? schema.default;
  const obj =
    fallback && typeof fallback === "object" && !Array.isArray(fallback)
      ? (fallback as Record<string, unknown>)
      : {};
  const props = schema.properties ?? {};
  const entries = Object.entries(props);

  // Sort by hint order
  const sorted = entries.toSorted((a, b) => {
    const orderA = hintForPath([...path, a[0]], hints)?.order ?? 0;
    const orderB = hintForPath([...path, b[0]], hints)?.order ?? 0;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a[0].localeCompare(b[0]);
  });

  const reserved = new Set(Object.keys(props));
  const additional = schema.additionalProperties;
  const allowExtra = Boolean(additional) && typeof additional === "object";

  const fields = html`
    ${sorted.map(([propKey, node]) =>
      renderNode({
        schema: node,
        value: obj[propKey],
        path: [...path, propKey],
        hints,
        unsupported,
        disabled,
        searchCriteria: childSearchCriteria,
        revealSensitive,
        isSensitivePathRevealed,
        onToggleSensitivePath,
        onPatch,
      }),
    )}
    ${
      allowExtra
        ? renderMapField({
            schema: additional,
            value: obj,
            path,
            hints,
            unsupported,
            disabled,
            reservedKeys: reserved,
            searchCriteria: childSearchCriteria,
            revealSensitive,
            isSensitivePathRevealed,
            onToggleSensitivePath,
            onPatch,
          })
        : nothing
    }
  `;

  // For top-level, don't wrap in collapsible
  if (path.length === 1) {
    return html`
      <div class="cfg-fields">
        ${fields}
      </div>
    `;
  }

  if (!showLabel) {
    return html`
      <div class="cfg-fields cfg-fields--inline">
        ${fields}
      </div>
    `;
  }

  // Nested objects get collapsible treatment
  return html`
    <details class="cfg-object" ?open=${path.length <= 2}>
      <summary class="cfg-object__header">
        <span class="cfg-object__title-wrap">
          <span class="cfg-object__title">${label}</span>
          ${renderTags(tags)}
        </span>
        <span class="cfg-object__chevron">${icons.chevronDown}</span>
      </summary>
      ${help ? html`<div class="cfg-object__help">${help}</div>` : nothing}
      <div class="cfg-object__content">
        ${fields}
      </div>
    </details>
  `;
}

function renderArray(params: {
  schema: JsonSchema;
  value: unknown;
  path: Array<string | number>;
  hints: ConfigUiHints;
  unsupported: Set<string>;
  disabled: boolean;
  showLabel?: boolean;
  searchCriteria?: ConfigSearchCriteria;
  revealSensitive?: boolean;
  isSensitivePathRevealed?: (path: Array<string | number>) => boolean;
  onToggleSensitivePath?: (path: Array<string | number>) => void;
  onPatch: (path: Array<string | number>, value: unknown) => void;
}): TemplateResult {
  const {
    schema,
    value,
    path,
    hints,
    unsupported,
    disabled,
    onPatch,
    searchCriteria,
    revealSensitive,
    isSensitivePathRevealed,
    onToggleSensitivePath,
  } = params;
  const showLabel = params.showLabel ?? true;
  const { label, help, tags } = resolveFieldMeta(path, schema, hints);
  const selfMatched =
    searchCriteria && hasSearchCriteria(searchCriteria)
      ? matchesNodeSelf({ schema, path, hints, criteria: searchCriteria })
      : false;
  const childSearchCriteria = selfMatched ? undefined : searchCriteria;

  const itemsSchema = Array.isArray(schema.items) ? schema.items[0] : schema.items;
  if (!itemsSchema) {
    return html`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${label}</div>
        <div class="cfg-field__error">
          ${translateConfigCopy("Unsupported array schema. Use Raw mode.")}
        </div>
      </div>
    `;
  }

  const arr = Array.isArray(value) ? value : Array.isArray(schema.default) ? schema.default : [];

  return html`
    <div class="cfg-array">
      <div class="cfg-array__header">
        <div class="cfg-array__title">
          ${showLabel ? html`<span class="cfg-array__label">${label}</span>` : nothing}
          ${renderTags(tags)}
        </div>
        <span class="cfg-array__count">
          ${arr.length}
          ${
            arr.length !== 1
              ? (translateConfigCopy("items") ?? "items")
              : (translateConfigCopy("item") ?? "item")
          }
        </span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${disabled}
          @click=${() => {
            const next = [...arr, defaultValue(itemsSchema)];
            onPatch(path, next);
          }}
        >
          <span class="cfg-array__add-icon">${icons.plus}</span>
          ${translateConfigCopy("Add") ?? "Add"}
        </button>
      </div>
      ${help ? html`<div class="cfg-array__help">${help}</div>` : nothing}

      ${
        arr.length === 0
          ? html`
              <div class="cfg-array__empty">
                ${translateConfigCopy('No items yet. Click "Add" to create one.')}
              </div>
            `
          : html`
        <div class="cfg-array__items">
          ${arr.map(
            (item, idx) => html`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${idx + 1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title=${translateConfigCopy("Remove item") ?? "Remove item"}
                  ?disabled=${disabled}
                  @click=${() => {
                    const next = [...arr];
                    next.splice(idx, 1);
                    onPatch(path, next);
                  }}
                >
                  ${icons.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${renderNode({
                  schema: itemsSchema,
                  value: item,
                  path: [...path, idx],
                  hints,
                  unsupported,
                  disabled,
                  searchCriteria: childSearchCriteria,
                  showLabel: false,
                  revealSensitive,
                  isSensitivePathRevealed,
                  onToggleSensitivePath,
                  onPatch,
                })}
              </div>
            </div>
          `,
          )}
        </div>
      `
      }
    </div>
  `;
}

function renderMapField(params: {
  schema: JsonSchema;
  value: Record<string, unknown>;
  path: Array<string | number>;
  hints: ConfigUiHints;
  unsupported: Set<string>;
  disabled: boolean;
  reservedKeys: Set<string>;
  searchCriteria?: ConfigSearchCriteria;
  revealSensitive?: boolean;
  isSensitivePathRevealed?: (path: Array<string | number>) => boolean;
  onToggleSensitivePath?: (path: Array<string | number>) => void;
  onPatch: (path: Array<string | number>, value: unknown) => void;
}): TemplateResult {
  const {
    schema,
    value,
    path,
    hints,
    unsupported,
    disabled,
    reservedKeys,
    onPatch,
    searchCriteria,
    revealSensitive,
    isSensitivePathRevealed,
    onToggleSensitivePath,
  } = params;
  const anySchema = isAnySchema(schema);
  const entries = Object.entries(value ?? {}).filter(([key]) => !reservedKeys.has(key));
  const visibleEntries =
    searchCriteria && hasSearchCriteria(searchCriteria)
      ? entries.filter(([key, entryValue]) =>
          matchesNodeSearch({
            schema,
            value: entryValue,
            path: [...path, key],
            hints,
            criteria: searchCriteria,
          }),
        )
      : entries;

  return html`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">${translateConfigCopy("Custom entries")}</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${disabled}
          @click=${() => {
            const next = { ...value };
            let index = 1;
            let key = `custom-${index}`;
            while (key in next) {
              index += 1;
              key = `custom-${index}`;
            }
            next[key] = anySchema ? {} : defaultValue(schema);
            onPatch(path, next);
          }}
        >
          <span class="cfg-map__add-icon">${icons.plus}</span>
          ${translateConfigCopy("Add Entry") ?? "Add Entry"}
        </button>
      </div>

      ${
        visibleEntries.length === 0
          ? html`
              <div class="cfg-map__empty">${translateConfigCopy("No custom entries.")}</div>
            `
          : html`
        <div class="cfg-map__items">
          ${visibleEntries.map(([key, entryValue]) => {
            const valuePath = [...path, key];
            const fallback = jsonValue(entryValue);
            const sensitiveState = getSensitiveRenderState({
              path: valuePath,
              value: entryValue,
              hints,
              revealSensitive: revealSensitive ?? false,
              isSensitivePathRevealed,
            });
            return html`
              <div class="cfg-map__item">
                <div class="cfg-map__item-header">
                  <div class="cfg-map__item-key">
                    <input
                      type="text"
                      class="cfg-input cfg-input--sm"
                      placeholder=${translateConfigCopy("Key") ?? "Key"}
                      .value=${key}
                      ?disabled=${disabled}
                      @change=${(e: Event) => {
                        const nextKey = (e.target as HTMLInputElement).value.trim();
                        if (!nextKey || nextKey === key) {
                          return;
                        }
                        const next = { ...value };
                        if (nextKey in next) {
                          return;
                        }
                        next[nextKey] = next[key];
                        delete next[key];
                        onPatch(path, next);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    class="cfg-map__item-remove"
                    title=${translateConfigCopy("Remove entry") ?? "Remove entry"}
                    ?disabled=${disabled}
                    @click=${() => {
                      const next = { ...value };
                      delete next[key];
                      onPatch(path, next);
                    }}
                  >
                    ${icons.trash}
                  </button>
                </div>
                <div class="cfg-map__item-value">
                  ${
                    anySchema
                      ? html`
                        <div class="cfg-input-wrap">
                          <textarea
                            class="cfg-textarea cfg-textarea--sm${sensitiveState.isRedacted ? " cfg-textarea--redacted" : ""}"
                            placeholder=${
                              sensitiveState.isRedacted
                                ? REDACTED_PLACEHOLDER
                                : (translateConfigCopy("JSON value") ?? "JSON value")
                            }
                            rows="2"
                            .value=${sensitiveState.isRedacted ? "" : fallback}
                            ?disabled=${disabled}
                            ?readonly=${sensitiveState.isRedacted}
                            @click=${() => {
                              if (sensitiveState.isRedacted && onToggleSensitivePath) {
                                onToggleSensitivePath(valuePath);
                              }
                            }}
                            @change=${(e: Event) => {
                              if (sensitiveState.isRedacted) {
                                return;
                              }
                              const target = e.target as HTMLTextAreaElement;
                              const raw = target.value.trim();
                              if (!raw) {
                                onPatch(valuePath, undefined);
                                return;
                              }
                              try {
                                onPatch(valuePath, JSON.parse(raw));
                              } catch {
                                target.value = fallback;
                              }
                            }}
                          ></textarea>
                          ${renderSensitiveToggleButton({
                            path: valuePath,
                            state: sensitiveState,
                            disabled,
                            onToggleSensitivePath,
                          })}
                        </div>
                      `
                      : renderNode({
                          schema,
                          value: entryValue,
                          path: valuePath,
                          hints,
                          unsupported,
                          disabled,
                          searchCriteria,
                          showLabel: false,
                          revealSensitive,
                          isSensitivePathRevealed,
                          onToggleSensitivePath,
                          onPatch,
                        })
                  }
                </div>
              </div>
            `;
          })}
        </div>
      `
      }
    </div>
  `;
}
