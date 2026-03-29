import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import { formatRelativeTimestamp } from "../format";
import type { SlackStatus } from "../types";
import { renderChannelConfigSection } from "./channels.config";
import { formatProbeStatusLead } from "./channels.shared";
import type { ChannelsProps } from "./channels.types";

export function renderSlackCard(params: {
  props: ChannelsProps;
  slack?: SlackStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, slack, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">Slack</div>
      <div class="card-sub">${t("channels.cardSub.slack")}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${t("channels.labels.configured")}</span>
          <span>${slack?.configured ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.running")}</span>
          <span>${slack?.running ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.lastStart")}</span>
          <span>${slack?.lastStartAt ? formatRelativeTimestamp(slack.lastStartAt) : t("common.na")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.lastProbe")}</span>
          <span>${slack?.lastProbeAt ? formatRelativeTimestamp(slack.lastProbeAt) : t("common.na")}</span>
        </div>
      </div>

      ${
        slack?.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
            ${slack.lastError}
          </div>`
          : nothing
      }

      ${
        slack?.probe
          ? html`<div class="callout" style="margin-top: 12px;">
            ${formatProbeStatusLead(Boolean(slack.probe.ok))}
            ${slack.probe.status ?? ""} ${slack.probe.error ?? ""}
          </div>`
          : nothing
      }

      ${renderChannelConfigSection({ channelId: "slack", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("channels.actions.probe")}
        </button>
        ${slack?.configured
          ? html`<button
              class="btn danger"
              ?disabled=${props.channelLogoutBusy === "slack"}
              @click=${() => props.onLogoutChannel("slack")}
            >
              ${props.channelLogoutBusy === "slack" ? "..." : "Logout"}
            </button>`
          : nothing}
      </div>
    </div>
  `;
}
