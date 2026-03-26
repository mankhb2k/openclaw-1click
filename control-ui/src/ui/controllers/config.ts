import type { GatewayBrowserClient } from "../gateway.ts";
import type {
  ConfigSchemaResponse,
  ConfigSnapshot,
  ConfigUiHints,
  DesktopUpdateState,
} from "../types.ts";
import type { JsonSchema } from "../views/config-form.shared.ts";
import { coerceFormValues } from "./config/form-coerce.ts";
import {
  cloneConfigObject,
  removePathValue,
  serializeConfigForm,
  setPathValue,
} from "./config/form-utils.ts";

export type ConfigState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  applySessionKey: string;
  configLoading: boolean;
  configRaw: string;
  configRawOriginal: string;
  configValid: boolean | null;
  configIssues: unknown[];
  configSaving: boolean;
  configApplying: boolean;
  updateRunning: boolean;
  configSnapshot: ConfigSnapshot | null;
  configSchema: unknown;
  configSchemaVersion: string | null;
  configSchemaLoading: boolean;
  configUiHints: ConfigUiHints;
  configForm: Record<string, unknown> | null;
  configFormOriginal: Record<string, unknown> | null;
  configFormDirty: boolean;
  configFormMode: "form" | "raw";
  configSearchQuery: string;
  configActiveSection: string | null;
  configActiveSubsection: string | null;
  lastError: string | null;
  /** Transient success / follow-up message after `update.run` (e.g. restart desktop). */
  updateNotice: string | null;
};

type DesktopUpdateBridge = {
  runUpdateOpenclaw: () => Promise<
    { ok: true; message?: string } | { ok: false; error?: string; stderrTail?: string }
  >;
  getUpdateState?: () => Promise<DesktopUpdateState>;
};

function getDesktopUpdateBridge(): DesktopUpdateBridge | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  const bridge = (window as Window & { openclawDesktop?: DesktopUpdateBridge }).openclawDesktop;
  if (bridge && typeof bridge.runUpdateOpenclaw === "function") {
    return bridge;
  }
  return undefined;
}

export async function loadConfig(state: ConfigState) {
  if (!state.client || !state.connected) {
    return;
  }
  state.configLoading = true;
  state.lastError = null;
  try {
    const res = await state.client.request<ConfigSnapshot>("config.get", {});
    applyConfigSnapshot(state, res);
  } catch (err) {
    state.lastError = String(err);
  } finally {
    state.configLoading = false;
  }
}

export async function loadConfigSchema(state: ConfigState) {
  if (!state.client || !state.connected) {
    return;
  }
  if (state.configSchemaLoading) {
    return;
  }
  state.configSchemaLoading = true;
  try {
    const res = await state.client.request<ConfigSchemaResponse>("config.schema", {});
    applyConfigSchema(state, res);
  } catch (err) {
    state.lastError = String(err);
  } finally {
    state.configSchemaLoading = false;
  }
}

export function applyConfigSchema(state: ConfigState, res: ConfigSchemaResponse) {
  state.configSchema = res.schema ?? null;
  state.configUiHints = res.uiHints ?? {};
  state.configSchemaVersion = res.version ?? null;
}

export function applyConfigSnapshot(state: ConfigState, snapshot: ConfigSnapshot) {
  state.configSnapshot = snapshot;
  const rawFromSnapshot =
    typeof snapshot.raw === "string"
      ? snapshot.raw
      : snapshot.config && typeof snapshot.config === "object"
        ? serializeConfigForm(snapshot.config)
        : state.configRaw;
  if (!state.configFormDirty || state.configFormMode === "raw") {
    state.configRaw = rawFromSnapshot;
  } else if (state.configForm) {
    state.configRaw = serializeConfigForm(state.configForm);
  } else {
    state.configRaw = rawFromSnapshot;
  }
  state.configValid = typeof snapshot.valid === "boolean" ? snapshot.valid : null;
  state.configIssues = Array.isArray(snapshot.issues) ? snapshot.issues : [];

  if (!state.configFormDirty) {
    state.configForm = cloneConfigObject(snapshot.config ?? {});
    state.configFormOriginal = cloneConfigObject(snapshot.config ?? {});
    state.configRawOriginal = rawFromSnapshot;
  }
}

function asJsonSchema(value: unknown): JsonSchema | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as JsonSchema;
}

/**
 * Serialize the form state for submission to `config.set` / `config.apply`.
 *
 * HTML `<input>` elements produce string `.value` properties, so numeric and
 * boolean config fields can leak into `configForm` as strings.  We coerce
 * them back to their schema-defined types before JSON serialization so the
 * gateway's Zod validation always sees correctly typed values.
 */
function serializeFormForSubmit(state: ConfigState): string {
  if (state.configFormMode !== "form" || !state.configForm) {
    return state.configRaw;
  }
  const schema = asJsonSchema(state.configSchema);
  const form = schema
    ? (coerceFormValues(state.configForm, schema) as Record<string, unknown>)
    : state.configForm;
  return serializeConfigForm(form);
}

export async function saveConfig(state: ConfigState) {
  if (!state.client || !state.connected) {
    return;
  }
  state.configSaving = true;
  state.lastError = null;
  try {
    const raw = serializeFormForSubmit(state);
    const baseHash = state.configSnapshot?.hash;
    if (!baseHash) {
      state.lastError = "Config hash missing; reload and retry.";
      return;
    }
    await state.client.request("config.set", { raw, baseHash });
    state.configFormDirty = false;
    await loadConfig(state);
  } catch (err) {
    state.lastError = String(err);
  } finally {
    state.configSaving = false;
  }
}

type UpdateRunStep = {
  name?: string;
  command?: string;
  exitCode?: number | null;
  stderrTail?: string | null;
};

type UpdateRunResponse = {
  ok?: boolean;
  result?: {
    status?: string;
    reason?: string;
    mode?: string;
    steps?: UpdateRunStep[];
  };
};

function formatUpdateRunFailure(res: UpdateRunResponse | null | undefined): string {
  if (!res) {
    return "Cập nhật thất bại: gateway không trả về dữ liệu.";
  }
  const r = res.result;
  const status = r?.status ?? "error";
  const reason = r?.reason?.trim() || "Không có mô tả.";
  const parts: string[] = [`Cập nhật thất bại (${status}): ${reason}`];
  const steps = Array.isArray(r?.steps) ? r.steps : [];
  const bad = steps.filter(
    (s) => s && typeof s.exitCode === "number" && s.exitCode !== 0,
  );
  const tailFrom = bad.length > 0 ? bad[bad.length - 1] : steps[steps.length - 1];
  if (tailFrom?.stderrTail && String(tailFrom.stderrTail).trim()) {
    const tail = String(tailFrom.stderrTail).trim();
    parts.push(tail.length > 2000 ? `…${tail.slice(-2000)}` : tail);
  } else if (tailFrom?.command) {
    parts.push(`Lệnh: ${tailFrom.command}`);
  }
  return parts.join("\n\n");
}

export async function applyConfig(state: ConfigState) {
  if (!state.client || !state.connected) {
    return;
  }
  state.configApplying = true;
  state.lastError = null;
  try {
    const raw = serializeFormForSubmit(state);
    const baseHash = state.configSnapshot?.hash;
    if (!baseHash) {
      state.lastError = "Config hash missing; reload and retry.";
      return;
    }
    await state.client.request("config.apply", {
      raw,
      baseHash,
      sessionKey: state.applySessionKey,
    });
    state.configFormDirty = false;
    await loadConfig(state);
  } catch (err) {
    state.lastError = String(err);
  } finally {
    state.configApplying = false;
  }
}

export async function runUpdate(state: ConfigState) {
  if (!state.connected) {
    return;
  }

  const desktopBridge = getDesktopUpdateBridge();
  if (desktopBridge) {
    state.updateRunning = true;
    state.lastError = null;
    state.updateNotice = null;
    try {
      const updateState = desktopBridge.getUpdateState ? await desktopBridge.getUpdateState() : null;
      if (updateState?.enabled && updateState.phase === "downloaded") {
        const res = await desktopBridge.runUpdateOpenclaw();
        if (!res.ok) {
          const extra = res.stderrTail?.trim() ? `\n\n${res.stderrTail.trim()}` : "";
          state.lastError = (res.error ?? "Cập nhật thất bại.") + extra;
          return;
        }
        state.lastError = null;
        state.updateNotice = res.message ?? "Đang cài đặt bản cập nhật và khởi động lại ứng dụng.";
        return;
      }
      const res = await desktopBridge.runUpdateOpenclaw();
      if (!res.ok) {
        const extra = res.stderrTail?.trim() ? `\n\n${res.stderrTail.trim()}` : "";
        state.lastError = (res.error ?? "Cập nhật thất bại.") + extra;
        return;
      }
      state.lastError = null;
      state.updateNotice = res.message ?? "Đã gửi lệnh cập nhật.";
    } catch (err) {
      state.lastError = String(err);
    } finally {
      state.updateRunning = false;
    }
    return;
  }

  if (!state.client) {
    return;
  }
  state.updateRunning = true;
  state.lastError = null;
  state.updateNotice = null;
  try {
    const res = await state.client.request<UpdateRunResponse>("update.run", {
      sessionKey: state.applySessionKey,
    });
    const st = res?.result?.status;
    const reason = typeof res?.result?.reason === "string" ? res.result.reason : "";

    if (!res || res.ok === false || st === "error") {
      state.lastError = formatUpdateRunFailure(res);
      return;
    }

    if (st === "skipped") {
      if (reason === "not-git-install") {
        state.lastError =
          "Gateway chưa chạy nhánh cập nhật cho Desktop (thiếu bản vá sau npm install). Chạy: npm install rồi khởi động lại app, hoặc tắt app và trong thư mục dự án chạy: npm run update:openclaw";
      } else {
        state.lastError = `Cập nhật bị bỏ qua (${reason || "skipped"}). Thử: npm run update:openclaw tại thư mục dự án, hoặc xem log gateway.`;
      }
      return;
    }

    if (st !== "ok") {
      state.lastError = `Cập nhật: trạng thái không mong đợi (${String(st)}). ${reason}`.trim();
      return;
    }

    state.lastError = null;
    state.updateNotice =
      "Đã chạy cập nhật gói openclaw. Đóng hoàn toàn OpenClaw rồi mở lại để gateway nạp bản mới (Windows thường không tự restart process). Nếu banner vẫn báo có bản mới, chạy thêm: npm run update:openclaw trong thư mục dự án.";
  } catch (err) {
    state.lastError = String(err);
  } finally {
    state.updateRunning = false;
  }
}

export function updateConfigFormValue(
  state: ConfigState,
  path: Array<string | number>,
  value: unknown,
) {
  const base = cloneConfigObject(state.configForm ?? state.configSnapshot?.config ?? {});
  setPathValue(base, path, value);
  state.configForm = base;
  state.configFormDirty = true;
  if (state.configFormMode === "form") {
    state.configRaw = serializeConfigForm(base);
  }
}

export function removeConfigFormValue(state: ConfigState, path: Array<string | number>) {
  const base = cloneConfigObject(state.configForm ?? state.configSnapshot?.config ?? {});
  removePathValue(base, path);
  state.configForm = base;
  state.configFormDirty = true;
  if (state.configFormMode === "form") {
    state.configRaw = serializeConfigForm(base);
  }
}

export function findAgentConfigEntryIndex(
  config: Record<string, unknown> | null,
  agentId: string,
): number {
  const normalizedAgentId = agentId.trim();
  if (!normalizedAgentId) {
    return -1;
  }
  const list = (config as { agents?: { list?: unknown[] } } | null)?.agents?.list;
  if (!Array.isArray(list)) {
    return -1;
  }
  return list.findIndex(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      "id" in entry &&
      (entry as { id?: string }).id === normalizedAgentId,
  );
}

export function ensureAgentConfigEntry(state: ConfigState, agentId: string): number {
  const normalizedAgentId = agentId.trim();
  if (!normalizedAgentId) {
    return -1;
  }
  const source =
    state.configForm ?? (state.configSnapshot?.config as Record<string, unknown> | null);
  const existingIndex = findAgentConfigEntryIndex(source, normalizedAgentId);
  if (existingIndex >= 0) {
    return existingIndex;
  }
  const list = (source as { agents?: { list?: unknown[] } } | null)?.agents?.list;
  const nextIndex = Array.isArray(list) ? list.length : 0;
  updateConfigFormValue(state, ["agents", "list", nextIndex, "id"], normalizedAgentId);
  return nextIndex;
}

export async function openConfigFile(state: ConfigState): Promise<void> {
  if (!state.client || !state.connected) {
    return;
  }
  try {
    await state.client.request("config.openFile", {});
  } catch {
    const path = state.configSnapshot?.path;
    if (path) {
      try {
        await navigator.clipboard.writeText(path);
      } catch {
        // ignore
      }
    }
  }
}
