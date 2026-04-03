import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import type { ChannelAccountSnapshot } from "../types";
import type { ChannelKey, ChannelsProps } from "./channels.types";

export function channelEnabled(key: ChannelKey, props: ChannelsProps) {
  const snapshot = props.snapshot;
  const channels = snapshot?.channels as Record<string, unknown> | null;
  if (!snapshot || !channels) {
    return false;
  }
  const channelStatus = channels[key] as Record<string, unknown> | undefined;
  const configured = typeof channelStatus?.configured === "boolean" && channelStatus.configured;
  const running = typeof channelStatus?.running === "boolean" && channelStatus.running;
  const connected = typeof channelStatus?.connected === "boolean" && channelStatus.connected;
  const accounts = snapshot.channelAccounts?.[key] ?? [];
  const accountActive = accounts.some(
    (account) => account.configured || account.running || account.connected,
  );
  return configured || running || connected || accountActive;
}

function resolveConnectedFromAccounts(
  accounts?: ChannelAccountSnapshot[] | null,
): boolean | null | undefined {
  if (!accounts?.length) {
    return undefined;
  }
  let sawFalse = false;
  for (const account of accounts) {
    if (account.connected === true) {
      return true;
    }
    if (account.connected === false) {
      sawFalse = true;
    }
  }
  return sawFalse ? false : undefined;
}

export function resolveChannelConnected(
  connected: boolean | null | undefined,
  accounts?: ChannelAccountSnapshot[] | null,
): boolean | null | undefined {
  if (typeof connected === "boolean") {
    return connected;
  }
  const fromAccounts = resolveConnectedFromAccounts(accounts);
  if (typeof fromAccounts === "boolean") {
    return fromAccounts;
  }
  return connected ?? undefined;
}

export function formatConnectedLabel(
  connected: boolean | null | undefined,
  accounts?: ChannelAccountSnapshot[] | null,
): string {
  const resolved = resolveChannelConnected(connected, accounts);
  if (resolved == null) {
    return t("common.na");
  }
  return resolved ? t("channels.status.yes") : t("channels.status.no");
}

export function getChannelAccountCount(
  key: ChannelKey,
  channelAccounts?: Record<string, ChannelAccountSnapshot[]> | null,
): number {
  return channelAccounts?.[key]?.length ?? 0;
}

/** Localized "Probe ok ·" / "Thử kết nối thành công ·" style prefix for probe callouts. */
export function formatProbeStatusLead(ok: boolean): string {
  return `${t("channels.probe.lead")} ${ok ? t("channels.probe.ok") : t("channels.probe.failed")}${t("channels.probe.suffix")}`;
}

export type ChannelStatusLevel = "running" | "stopped" | "inactive";

export function renderChannelStatusPill(level: ChannelStatusLevel, label: string) {
  return html`<span class="channel-status-pill channel-status-pill--${level}">${label}</span>`;
}

export function renderChannelAccountCount(
  key: ChannelKey,
  channelAccounts?: Record<string, ChannelAccountSnapshot[]> | null,
) {
  const count = getChannelAccountCount(key, channelAccounts);
  if (count < 2) {
    return nothing;
  }
  return html`<div class="account-count">${t("channels.accounts.count", { count: String(count) })}</div>`;
}
