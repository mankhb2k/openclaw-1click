import type { OpenClawApp } from "./app.ts";
import {
  advanceGatewayWizard,
  cancelGatewayWizard,
  startGatewayWizard,
  toggleWizardMultiSelect,
  updateWizardInput,
} from "./controllers/gateway-wizard.ts";

export async function handleStartGatewayWizard(host: OpenClawApp) {
  await startGatewayWizard(host);
}

export async function handleCancelGatewayWizard(host: OpenClawApp) {
  await cancelGatewayWizard(host);
}

export async function handleGatewayWizardNext(
  host: OpenClawApp,
  answer?: { stepId: string; value?: unknown },
) {
  await advanceGatewayWizard(host, answer);
}

export function handleGatewayWizardInputChange(host: OpenClawApp, value: string) {
  updateWizardInput(host, value);
}

export function handleGatewayWizardToggleMultiSelect(host: OpenClawApp, value: string) {
  toggleWizardMultiSelect(host, value);
}
