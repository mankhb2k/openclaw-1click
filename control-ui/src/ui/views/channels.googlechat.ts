import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import { formatRelativeTimestamp } from "../format";
import type { GoogleChatStatus } from "../types";
import { renderChannelConfigSection } from "./channels.config";
import { formatConnectedLabel, formatProbeStatusLead, renderChannelStatusPill } from "./channels.shared";
import type { ChannelsProps } from "./channels.types";

export function renderGoogleChatCard(params: {
  props: ChannelsProps;
  googleChat?: GoogleChatStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, googleChat, accountCountLabel } = params;
  const connectedLabel = formatConnectedLabel(
    googleChat?.connected,
    props.snapshot?.channelAccounts?.googlechat ?? null,
  );

  const isRunning = googleChat?.running ?? false;
  const isConfigured = googleChat?.configured ?? false;
  const statusPill = isRunning
    ? renderChannelStatusPill("running", t("channels.status.yes"))
    : isConfigured
      ? renderChannelStatusPill("stopped", t("channels.status.no"))
      : renderChannelStatusPill("inactive", t("common.na"));

  return html`
    <div class="card">
      <div class="card-header-top">
        <div>
          <div class="card-title">Google Chat</div>
          <div class="card-sub">${t("channels.cardSub.googlechat")}</div>
        </div>
        <div class="card-actions">
          ${statusPill}
        </div>
      </div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${t("channels.labels.configured")}</span>
          <span>${googleChat ? (googleChat.configured ? t("channels.status.yes") : t("channels.status.no")) : t("common.na")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.running")}</span>
          <span>${googleChat ? (googleChat.running ? t("channels.status.yes") : t("channels.status.no")) : t("common.na")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.connected")}</span>
          <span>${connectedLabel}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.credential")}</span>
          <span>${googleChat?.credentialSource ?? t("common.na")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.audience")}</span>
          <span>
            ${
              googleChat?.audienceType
                ? `${googleChat.audienceType}${googleChat.audience ? ` · ${googleChat.audience}` : ""}`
                : t("common.na")
            }
          </span>
        </div>
        <div>
          <span class="label">${t("channels.labels.lastStart")}</span>
          <span>${googleChat?.lastStartAt ? formatRelativeTimestamp(googleChat.lastStartAt) : t("common.na")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.lastProbe")}</span>
          <span>${googleChat?.lastProbeAt ? formatRelativeTimestamp(googleChat.lastProbeAt) : t("common.na")}</span>
        </div>
      </div>

      ${
        googleChat?.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
            ${googleChat.lastError}
          </div>`
          : nothing
      }

      ${
        googleChat?.probe
          ? html`<div class="callout" style="margin-top: 12px;">
            ${formatProbeStatusLead(Boolean(googleChat.probe.ok))}
            ${googleChat.probe.status ?? ""} ${googleChat.probe.error ?? ""}
          </div>`
          : nothing
      }

      ${renderChannelConfigSection({ channelId: "googlechat", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("channels.actions.probe")}
        </button>
      </div>
    </div>
  `;
}
