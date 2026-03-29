import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import { formatRelativeTimestamp } from "../format";
import type { IMessageStatus } from "../types";
import { renderChannelConfigSection } from "./channels.config";
import { formatProbeStatusLead } from "./channels.shared";
import type { ChannelsProps } from "./channels.types";

export function renderIMessageCard(params: {
  props: ChannelsProps;
  imessage?: IMessageStatus | null;
  accountCountLabel: unknown;
}) {
  const { props, imessage, accountCountLabel } = params;

  return html`
    <div class="card">
      <div class="card-title">iMessage</div>
      <div class="card-sub">${t("channels.cardSub.imessage")}</div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${t("channels.labels.configured")}</span>
          <span>${imessage?.configured ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.running")}</span>
          <span>${imessage?.running ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.lastStart")}</span>
          <span>${imessage?.lastStartAt ? formatRelativeTimestamp(imessage.lastStartAt) : t("common.na")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.lastProbe")}</span>
          <span>${imessage?.lastProbeAt ? formatRelativeTimestamp(imessage.lastProbeAt) : t("common.na")}</span>
        </div>
      </div>

      ${
        imessage?.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
            ${imessage.lastError}
          </div>`
          : nothing
      }

      ${
        imessage?.probe
          ? html`<div class="callout" style="margin-top: 12px;">
            ${formatProbeStatusLead(Boolean(imessage.probe.ok))}
            ${imessage.probe.error ?? ""}
          </div>`
          : nothing
      }

      ${renderChannelConfigSection({ channelId: "imessage", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("channels.actions.probe")}
        </button>
        ${imessage?.configured
          ? html`<button
              class="btn danger"
              ?disabled=${props.channelLogoutBusy === "imessage"}
              @click=${() => props.onLogoutChannel("imessage")}
            >
              ${props.channelLogoutBusy === "imessage" ? "..." : "Logout"}
            </button>`
          : nothing}
      </div>
    </div>
  `;
}
