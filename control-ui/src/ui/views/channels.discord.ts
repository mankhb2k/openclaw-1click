import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import { formatRelativeTimestamp } from "../format";
import type { DiscordStatus } from "../types";
import { renderChannelConfigSection } from "./channels.config";
import { formatConnectedLabel, formatProbeStatusLead, renderChannelStatusPill } from "./channels.shared";
import type { ChannelsProps } from "./channels.types";

export function renderDiscordCard(params: {
  props: ChannelsProps;
  discord?: DiscordStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, discord, accountCountLabel } = params;
  const connectedLabel = formatConnectedLabel(
    discord?.connected,
    props.snapshot?.channelAccounts?.discord ?? null,
  );

  const isRunning = discord?.running ?? false;
  const isConfigured = discord?.configured ?? false;
  const statusPill = isRunning
    ? renderChannelStatusPill("running", t("channels.status.yes"))
    : isConfigured
      ? renderChannelStatusPill("stopped", t("channels.status.no"))
      : renderChannelStatusPill("inactive", t("common.na"));

  return html`
    <div class="card">
      <div class="card-header-top">
        <div>
          <div class="card-title">Discord</div>
          <div class="card-sub">${t("channels.cardSub.discord")}</div>
        </div>
        <div class="card-actions">
          ${statusPill}
        </div>
      </div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${t("channels.labels.configured")}</span>
          <span>${discord?.configured ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.running")}</span>
          <span>${discord?.running ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.connected")}</span>
          <span>${connectedLabel}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.lastStart")}</span>
          <span>${discord?.lastStartAt ? formatRelativeTimestamp(discord.lastStartAt) : t("common.na")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.lastProbe")}</span>
          <span>${discord?.lastProbeAt ? formatRelativeTimestamp(discord.lastProbeAt) : t("common.na")}</span>
        </div>
      </div>

      ${
        discord?.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
            ${discord.lastError}
          </div>`
          : nothing
      }

      ${
        discord?.probe
          ? html`<div class="callout" style="margin-top: 12px;">
            ${formatProbeStatusLead(Boolean(discord.probe.ok))}
            ${discord.probe.status ?? ""} ${discord.probe.error ?? ""}
          </div>`
          : nothing
      }

      ${renderChannelConfigSection({ channelId: "discord", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("channels.actions.probe")}
        </button>
        ${discord?.configured
          ? html`<button
              class="btn danger"
              ?disabled=${props.channelLogoutBusy === "discord"}
              @click=${() => props.onLogoutChannel("discord")}
            >
              ${props.channelLogoutBusy === "discord" ? "..." : "Logout"}
            </button>`
          : nothing}
      </div>
    </div>
  `;
}
