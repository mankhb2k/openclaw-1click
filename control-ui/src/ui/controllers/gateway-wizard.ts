import type { GatewayBrowserClient } from "../gateway.ts";

export type WizardStepOption = {
  value: unknown;
  label: string;
  hint?: string;
};

export type WizardStepType = "note" | "select" | "text" | "confirm" | "multiselect" | "progress" | "action";

export type WizardStep = {
  id: string;
  type: WizardStepType;
  title?: string;
  message?: string;
  options?: WizardStepOption[];
  initialValue?: unknown;
  placeholder?: string;
  sensitive?: boolean;
  executor?: "gateway" | "client";
};

export type WizardSessionStatus = "running" | "done" | "cancelled" | "error";

export type GatewayWizardState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  gatewayWizardOpen: boolean;
  gatewayWizardSessionId: string | null;
  gatewayWizardStep: WizardStep | null;
  gatewayWizardStatus: WizardSessionStatus | null;
  gatewayWizardBusy: boolean;
  gatewayWizardError: string | null;
  gatewayWizardDone: boolean;
  gatewayWizardInputValue: string;
  gatewayWizardMultiSelectValues: string[];
};

export async function startGatewayWizard(state: GatewayWizardState) {
  if (!state.client || !state.connected || state.gatewayWizardBusy) return;
  state.gatewayWizardOpen = true;
  state.gatewayWizardBusy = true;
  state.gatewayWizardError = null;
  state.gatewayWizardDone = false;
  state.gatewayWizardSessionId = null;
  state.gatewayWizardStep = null;
  state.gatewayWizardStatus = "running";
  state.gatewayWizardInputValue = "";
  state.gatewayWizardMultiSelectValues = [];
  try {
    const res = await state.client.request<{
      sessionId: string;
      done: boolean;
      step?: WizardStep;
      status?: WizardSessionStatus;
      error?: string;
    }>("wizard.start", { mode: "local" });
    state.gatewayWizardSessionId = res.sessionId;
    state.gatewayWizardStep = res.step ?? null;
    state.gatewayWizardStatus = res.status ?? "running";
    state.gatewayWizardDone = res.done;
    if (res.error) state.gatewayWizardError = res.error;
    if (res.done) state.gatewayWizardDone = true;
    // Auto-advance gateway-side executor steps
    if (!res.done && res.step?.executor === "gateway") {
      await advanceGatewayWizard(state, undefined);
    }
  } catch (err) {
    state.gatewayWizardError = String(err);
    state.gatewayWizardStatus = "error";
  } finally {
    state.gatewayWizardBusy = false;
  }
}

export async function advanceGatewayWizard(
  state: GatewayWizardState,
  answer: { stepId: string; value?: unknown } | undefined,
) {
  if (!state.client || !state.connected || state.gatewayWizardBusy) return;
  const sessionId = state.gatewayWizardSessionId;
  if (!sessionId) return;
  state.gatewayWizardBusy = true;
  state.gatewayWizardError = null;
  state.gatewayWizardInputValue = "";
  state.gatewayWizardMultiSelectValues = [];
  try {
    const params: Record<string, unknown> = { sessionId };
    if (answer) params.answer = answer;
    const res = await state.client.request<{
      done: boolean;
      step?: WizardStep;
      status?: WizardSessionStatus;
      error?: string;
    }>("wizard.next", params, { timeoutMs: 60000 });
    state.gatewayWizardStep = res.step ?? null;
    state.gatewayWizardStatus = res.status ?? "running";
    state.gatewayWizardDone = res.done;
    if (res.error) state.gatewayWizardError = res.error;
    // Prefill initialValue
    if (res.step?.initialValue !== undefined) {
      if (res.step.type === "text") {
        state.gatewayWizardInputValue = String(res.step.initialValue ?? "");
      }
      if (res.step.type === "multiselect" && Array.isArray(res.step.initialValue)) {
        state.gatewayWizardMultiSelectValues = res.step.initialValue.map(String);
      }
    }
    // Auto-advance gateway-side steps
    if (!res.done && res.step?.executor === "gateway") {
      await advanceGatewayWizard(state, undefined);
    }
  } catch (err) {
    state.gatewayWizardError = String(err);
    state.gatewayWizardStatus = "error";
  } finally {
    state.gatewayWizardBusy = false;
  }
}

export async function cancelGatewayWizard(state: GatewayWizardState) {
  const sessionId = state.gatewayWizardSessionId;
  if (sessionId && state.client && state.connected) {
    try {
      await state.client.request("wizard.cancel", { sessionId });
    } catch {
      // ignore cancel errors
    }
  }
  state.gatewayWizardOpen = false;
  state.gatewayWizardSessionId = null;
  state.gatewayWizardStep = null;
  state.gatewayWizardStatus = null;
  state.gatewayWizardBusy = false;
  state.gatewayWizardError = null;
  state.gatewayWizardDone = false;
  state.gatewayWizardInputValue = "";
  state.gatewayWizardMultiSelectValues = [];
}

export function updateWizardInput(state: GatewayWizardState, value: string) {
  state.gatewayWizardInputValue = value;
}

export function toggleWizardMultiSelect(state: GatewayWizardState, value: string) {
  const current = state.gatewayWizardMultiSelectValues;
  if (current.includes(value)) {
    state.gatewayWizardMultiSelectValues = current.filter((v) => v !== value);
  } else {
    state.gatewayWizardMultiSelectValues = [...current, value];
  }
}
