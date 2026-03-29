import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import { formatRelativeTimestamp, formatDurationHuman } from "../format";
import type { WhatsAppStatus } from "../types";
import { renderChannelConfigSection } from "./channels.config";
import { renderChannelStatusPill } from "./channels.shared";
import type { ChannelsProps } from "./channels.types";

export function renderWhatsAppCard(params: {
  props: ChannelsProps;
  whatsapp?: WhatsAppStatus;
  accountCountLabel: unknown;
}) {
  const { props, whatsapp, accountCountLabel } = params;

  const isRunning = whatsapp?.running ?? false;
  const isConfigured = whatsapp?.configured ?? false;
  const statusPill = isRunning
    ? renderChannelStatusPill("running", t("channels.status.yes"))
    : isConfigured
      ? renderChannelStatusPill("stopped", t("channels.status.no"))
      : renderChannelStatusPill("inactive", t("common.na"));

  return html`
    <div class="card">
      <div class="card-header-top">
        <div>
          <div class="card-title">${t("channels.titles.whatsapp")}</div>
          <div class="card-sub">${t("channels.cardSub.whatsapp")}</div>
        </div>
        <div class="card-actions">
          ${statusPill}
        </div>
      </div>
      ${accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">${t("channels.labels.configured")}</span>
          <span>${whatsapp?.configured ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.linked")}</span>
          <span>${whatsapp?.linked ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.running")}</span>
          <span>${whatsapp?.running ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.connected")}</span>
          <span>${whatsapp?.connected ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.lastConnect")}</span>
          <span>
            ${whatsapp?.lastConnectedAt ? formatRelativeTimestamp(whatsapp.lastConnectedAt) : t("common.na")}
          </span>
        </div>
        <div>
          <span class="label">${t("channels.labels.lastMessage")}</span>
          <span>
            ${whatsapp?.lastMessageAt ? formatRelativeTimestamp(whatsapp.lastMessageAt) : t("common.na")}
          </span>
        </div>
        <div>
          <span class="label">${t("channels.labels.authAge")}</span>
          <span>
            ${whatsapp?.authAgeMs != null ? formatDurationHuman(whatsapp.authAgeMs) : t("common.na")}
          </span>
        </div>
      </div>

      ${
        whatsapp?.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
            ${whatsapp.lastError}
          </div>`
          : nothing
      }

      ${
        props.whatsappMessage
          ? html`<div class="callout" style="margin-top: 12px;">
            ${props.whatsappMessage}
          </div>`
          : nothing
      }

      ${
        props.whatsappQrDataUrl
          ? html`<div class="qr-wrap">
            <img src=${props.whatsappQrDataUrl} alt=${t("channels.whatsappQrAlt")} />
          </div>`
          : nothing
      }

      ${
        !whatsapp?.configured
          ? html`
            <div class="row" style="margin-top: 16px; margin-bottom: 8px;">
              <button
                class="btn primary"
                @click=${() => props.onOpenChannelWizard("whatsapp")}
              >
                ${t("common.setup")} WhatsApp
              </button>
            </div>
          `
          : nothing
      }

      <div class="row" style="margin-top: 14px; flex-wrap: wrap;">
        <button
          class="btn primary"
          ?disabled=${props.whatsappBusy}
          @click=${() => props.onWhatsAppStart(false)}
        >
          ${props.whatsappBusy ? t("channels.actions.working") : t("channels.actions.showQr")}
        </button>
        <button
          class="btn"
          ?disabled=${props.whatsappBusy}
          @click=${() => props.onWhatsAppStart(true)}
        >
          ${t("channels.actions.relink")}
        </button>
        <button
          class="btn"
          ?disabled=${props.whatsappBusy}
          @click=${() => props.onWhatsAppWait()}
        >
          ${t("channels.actions.waitForScan")}
        </button>
        <button
          class="btn danger"
          ?disabled=${props.whatsappBusy}
          @click=${() => props.onWhatsAppLogout()}
        >
          ${t("channels.actions.logout")}
        </button>
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("channels.actions.refresh")}
        </button>
      </div>

      ${renderChannelConfigSection({ channelId: "whatsapp", props })}
    </div>
  `;
}
