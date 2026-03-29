import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import { formatRelativeTimestamp } from "../format";
import type { ChannelAccountSnapshot, TelegramStatus } from "../types";
import { renderChannelConfigSection } from "./channels.config";
import { formatProbeStatusLead, renderChannelStatusPill } from "./channels.shared";
import type { ChannelsProps } from "./channels.types";

export function renderTelegramCard(params: {
  props: ChannelsProps;
  telegram?: TelegramStatus;
  telegramAccounts: ChannelAccountSnapshot[];
  accountCountLabel: unknown;
}) {
  const { props, telegram, telegramAccounts, accountCountLabel } = params;
  const hasMultipleAccounts = telegramAccounts.length > 1;

  const renderAccountCard = (account: ChannelAccountSnapshot) => {
    const probe = account.probe as { bot?: { username?: string } } | undefined;
    const botUsername = probe?.bot?.username;
    const label = account.name || account.accountId;
    return html`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">
            ${botUsername ? `@${botUsername}` : label}
          </div>
          <div class="account-card-id">${account.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">${t("channels.labels.running")}</span>
            <span>${account.running ? t("channels.status.yes") : t("channels.status.no")}</span>
          </div>
          <div>
            <span class="label">${t("channels.labels.configured")}</span>
            <span>${account.configured ? t("channels.status.yes") : t("channels.status.no")}</span>
          </div>
          <div>
            <span class="label">${t("channels.labels.lastInbound")}</span>
            <span>${account.lastInboundAt ? formatRelativeTimestamp(account.lastInboundAt) : t("common.na")}</span>
          </div>
          ${
            account.lastError
              ? html`
                <div class="account-card-error">
                  ${account.lastError}
                </div>
              `
              : nothing
          }
        </div>
      </div>
    `;
  };

  const isRunning = telegram?.running ?? false;
  const isConfigured = telegram?.configured ?? false;
  const statusPill = isRunning
    ? renderChannelStatusPill("running", t("channels.status.yes"))
    : isConfigured
      ? renderChannelStatusPill("stopped", t("channels.status.no"))
      : renderChannelStatusPill("inactive", t("common.na"));

  return html`
    <div class="card">
      <div class="card-header-top">
        <div>
          <div class="card-title">${t("channels.titles.telegram")}</div>
          <div class="card-sub">${t("channels.cardSub.telegram")}</div>
        </div>
        <div class="card-actions">
          ${statusPill}
        </div>
      </div>
      ${accountCountLabel}

      ${
        hasMultipleAccounts
          ? html`
            <div class="account-card-list">
              ${telegramAccounts.map((account) => renderAccountCard(account))}
            </div>
          `
          : html`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">${t("channels.labels.configured")}</span>
                <span>${telegram?.configured ? t("channels.status.yes") : t("channels.status.no")}</span>
              </div>
              <div>
                <span class="label">${t("channels.labels.running")}</span>
                <span>${telegram?.running ? t("channels.status.yes") : t("channels.status.no")}</span>
              </div>
              <div>
                <span class="label">${t("channels.labels.mode")}</span>
                <span>${telegram?.mode ? t("channels.modes." + telegram.mode) : t("common.na")}</span>
              </div>
              <div>
                <span class="label">${t("channels.labels.lastStart")}</span>
                <span>${telegram?.lastStartAt ? formatRelativeTimestamp(telegram.lastStartAt) : t("common.na")}</span>
              </div>
              <div>
                <span class="label">${t("channels.labels.lastProbe")}</span>
                <span>${telegram?.lastProbeAt ? formatRelativeTimestamp(telegram.lastProbeAt) : t("common.na")}</span>
              </div>
            </div>
          `
      }

      ${
        telegram?.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
            ${telegram.lastError}
          </div>`
          : nothing
      }

      ${
        telegram?.probe
          ? html`<div class="callout" style="margin-top: 12px;">
            ${formatProbeStatusLead(Boolean(telegram.probe.ok))}
            ${telegram.probe.status ?? ""} ${telegram.probe.error ?? ""}
          </div>`
          : nothing
      }

      ${
        !telegram?.configured
          ? html`
            <div class="row" style="margin-top: 16px;">
              <button
                class="btn primary"
                @click=${() => props.onOpenChannelWizard("telegram")}
              >
                ${t("common.setup")} Telegram
              </button>
            </div>
          `
          : nothing
      }

      ${renderChannelConfigSection({ channelId: "telegram", props })}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${() => props.onRefresh(true)}>
          ${t("channels.actions.probe")}
        </button>
        ${telegram?.configured
          ? html`<button
              class="btn danger"
              ?disabled=${props.channelLogoutBusy === "telegram"}
              @click=${() => props.onLogoutChannel("telegram")}
            >
              ${props.channelLogoutBusy === "telegram" ? "..." : t("channels.actions.logout")}
            </button>`
          : nothing}
      </div>
    </div>
  `;
}
