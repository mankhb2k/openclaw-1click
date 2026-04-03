import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import { formatRelativeTimestamp } from "../format";
import type { SignalStatus } from "../types";
import { renderChannelConfigSection } from "./channels.config";
import { formatConnectedLabel, formatProbeStatusLead, renderChannelStatusPill } from "./channels.shared";
import type { ChannelsProps } from "./channels.types";

export function renderSignalCard(params: {
  props: ChannelsProps;
  signal?: SignalStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, signal, accountCountLabel } = params;
  const connectedLabel = formatConnectedLabel(
    signal?.connected,
    props.snapshot?.channelAccounts?.signal ?? null,
  );

  const isRunning = signal?.running ?? false;
  const isConfigured = signal?.configured ?? false;
  const statusPill = isRunning
    ? renderChannelStatusPill("running", t("channels.status.yes"))
    : isConfigured
      ? renderChannelStatusPill("stopped", t("channels.status.no"))
      : renderChannelStatusPill("inactive", t("common.na"));

  return html`
    <div class="card">
      <div class="card-header-top">
        <div>
          <div class="card-title">Signal</div>
          <div class="card-sub">${t("channels.cardSub.signal")}</div>
        </div>
        <div class="card-actions">
          ${statusPill}
        </div>
      </div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${t("channels.labels.configured")}</span>
          <span>${signal?.configured ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.running")}</span>
          <span>${signal?.running ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.connected")}</span>
          <span>${connectedLabel}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.baseUrl")}</span>
          <span>${signal?.baseUrl ?? t("common.na")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.lastStart")}</span>
          <span>${signal?.lastStartAt ? formatRelativeTimestamp(signal.lastStartAt) : t("common.na")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.lastProbe")}</span>
          <span>${signal?.lastProbeAt ? formatRelativeTimestamp(signal.lastProbeAt) : t("common.na")}</span>
        </div>
      </div>

      ${
        signal?.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
            ${signal.lastError}
          </div>`
          : nothing
      }

      ${
        signal?.probe
          ? html`<div class="callout" style="margin-top: 12px;">
            ${formatProbeStatusLead(Boolean(signal.probe.ok))}
            ${signal.probe.status ?? ""} ${signal.probe.error ?? ""}
          </div>`
          : nothing
      }

      ${renderChannelConfigSection({ channelId: "signal", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("channels.actions.probe")}
        </button>
        ${signal?.configured
          ? html`<button
              class="btn danger"
              ?disabled=${props.channelLogoutBusy === "signal"}
              @click=${() => props.onLogoutChannel("signal")}
            >
              ${props.channelLogoutBusy === "signal" ? "..." : "Logout"}
            </button>`
          : nothing}
      </div>
    </div>
  `;
}
