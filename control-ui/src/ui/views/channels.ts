import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import { formatRelativeTimestamp } from "../format";
import { renderChannelSetupWizard } from "./channels.setup-wizard";
import { renderGatewayWizard } from "./gateway-wizard";
import type {
  ChannelAccountSnapshot,
  ChannelUiMetaEntry,
  ChannelsStatusSnapshot,
  DiscordStatus,
  GoogleChatStatus,
  IMessageStatus,
  NostrProfile,
  NostrStatus,
  SignalStatus,
  SlackStatus,
  TelegramStatus,
  WhatsAppStatus,
} from "../types";
import { renderChannelConfigSection } from "./channels.config";
import { renderDiscordCard } from "./channels.discord";
import { renderGoogleChatCard } from "./channels.googlechat";
import { renderIMessageCard } from "./channels.imessage";
import { renderNostrCard } from "./channels.nostr";
import { channelEnabled, formatConnectedLabel, renderChannelAccountCount } from "./channels.shared";
import { renderSignalCard } from "./channels.signal";
import { renderSlackCard } from "./channels.slack";
import { renderTelegramCard } from "./channels.telegram";
import type { ChannelKey, ChannelsChannelData, ChannelsProps } from "./channels.types";
import { renderWhatsAppCard } from "./channels.whatsapp";

export function renderChannels(props: ChannelsProps) {
  const channels = props.snapshot?.channels as Record<string, unknown> | null;
  const whatsapp = (channels?.whatsapp ?? undefined) as WhatsAppStatus | undefined;
  const telegram = (channels?.telegram ?? undefined) as TelegramStatus | undefined;
  const discord = (channels?.discord ?? null) as DiscordStatus | null;
  const googlechat = (channels?.googlechat ?? null) as GoogleChatStatus | null;
  const slack = (channels?.slack ?? null) as SlackStatus | null;
  const signal = (channels?.signal ?? null) as SignalStatus | null;
  const imessage = (channels?.imessage ?? null) as IMessageStatus | null;
  const nostr = (channels?.nostr ?? null) as NostrStatus | null;
  const channelOrder = resolveChannelOrder(props.snapshot);
  const orderedChannels = channelOrder
    .map((key, index) => ({
      key,
      enabled: channelEnabled(key, props),
      order: index,
    }))
    .toSorted((a, b) => {
      if (a.enabled !== b.enabled) {
        return a.enabled ? -1 : 1;
      }
      return a.order - b.order;
    });

  return html`
    ${renderChannelSetupWizard({
      open: props.channelWizardOpen,
      channel: props.channelWizardChannel,
      step: props.channelWizardStep,
      fields: props.channelWizardFields,
      busy: props.channelWizardBusy,
      error: props.channelWizardError,
      done: props.channelWizardDone,
      whatsappQrDataUrl: props.whatsappQrDataUrl,
      whatsappMessage: props.whatsappMessage,
      whatsappConnected: props.whatsappConnected,
      onClose: () => props.onCloseChannelWizard(),
      onFieldChange: (key, value) => props.onWizardFieldChange(key, value),
      onSaveAndAdvance: () => props.onWizardSaveAndAdvance(),
      onWhatsAppQR: (force) => props.onWizardWhatsAppQR(force),
      onWhatsAppWaitScan: () => props.onWizardWaitWhatsAppScan(),
    })}

    ${renderGatewayWizard({
      open: props.gatewayWizardOpen,
      step: props.gatewayWizardStep,
      status: props.gatewayWizardStatus,
      busy: props.gatewayWizardBusy,
      error: props.gatewayWizardError,
      done: props.gatewayWizardDone,
      inputValue: props.gatewayWizardInputValue,
      multiSelectValues: props.gatewayWizardMultiSelectValues,
      onClose: () => props.onCancelGatewayWizard(),
      onNext: (answer) => props.onGatewayWizardNext(answer),
      onInputChange: (v) => props.onGatewayWizardInputChange(v),
      onToggleMultiSelect: (v) => props.onGatewayWizardToggleMultiSelect(v),
    })}


    <section class="grid grid-cols-2">
      ${orderedChannels.map((channel) =>
        renderChannel(channel.key, props, {
          whatsapp,
          telegram,
          discord,
          googlechat,
          slack,
          signal,
          imessage,
          nostr,
          channelAccounts: props.snapshot?.channelAccounts ?? null,
        }),
      )}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">${t("channels.page.healthTitle")}</div>
          <div class="card-sub">${t("channels.page.healthSub")}</div>
        </div>
        <div class="muted">${props.lastSuccessAt ? formatRelativeTimestamp(props.lastSuccessAt) : t("common.na")}</div>
      </div>
      ${
        props.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
            ${props.lastError}
          </div>`
          : nothing
      }
      <pre class="code-block" style="margin-top: 12px;">
${props.snapshot ? JSON.stringify(props.snapshot, null, 2) : t("channels.page.noSnapshot")}
      </pre>
    </section>
  `;
}

function resolveChannelOrder(snapshot: ChannelsStatusSnapshot | null): ChannelKey[] {
  if (snapshot?.channelMeta?.length) {
    return snapshot.channelMeta.map((entry) => entry.id);
  }
  if (snapshot?.channelOrder?.length) {
    return snapshot.channelOrder;
  }
  return ["whatsapp", "telegram", "discord", "googlechat", "slack", "signal", "imessage", "nostr"];
}

function renderChannel(key: ChannelKey, props: ChannelsProps, data: ChannelsChannelData) {
  const accountCountLabel = renderChannelAccountCount(key, data.channelAccounts);
  switch (key) {
    case "whatsapp":
      return renderWhatsAppCard({
        props,
        whatsapp: data.whatsapp,
        accountCountLabel,
      });
    case "telegram":
      return renderTelegramCard({
        props,
        telegram: data.telegram,
        telegramAccounts: data.channelAccounts?.telegram ?? [],
        accountCountLabel,
      });
    case "discord":
      return renderDiscordCard({
        props,
        discord: data.discord,
        accountCountLabel,
      });
    case "googlechat":
      return renderGoogleChatCard({
        props,
        googleChat: data.googlechat,
        accountCountLabel,
      });
    case "slack":
      return renderSlackCard({
        props,
        slack: data.slack,
        accountCountLabel,
      });
    case "signal":
      return renderSignalCard({
        props,
        signal: data.signal,
        accountCountLabel,
      });
    case "imessage":
      return renderIMessageCard({
        props,
        imessage: data.imessage,
        accountCountLabel,
      });
    case "nostr": {
      const nostrAccounts = data.channelAccounts?.nostr ?? [];
      const primaryAccount = nostrAccounts[0];
      const accountId = primaryAccount?.accountId ?? "default";
      const profile =
        (primaryAccount as { profile?: NostrProfile | null } | undefined)?.profile ?? null;
      const showForm =
        props.nostrProfileAccountId === accountId ? props.nostrProfileFormState : null;
      const profileFormCallbacks = showForm
        ? {
            onFieldChange: props.onNostrProfileFieldChange,
            onSave: props.onNostrProfileSave,
            onImport: props.onNostrProfileImport,
            onCancel: props.onNostrProfileCancel,
            onToggleAdvanced: props.onNostrProfileToggleAdvanced,
          }
        : null;
      return renderNostrCard({
        props,
        nostr: data.nostr,
        nostrAccounts,
        accountCountLabel,
        profileFormState: showForm,
        profileFormCallbacks,
        onEditProfile: () => props.onNostrProfileEdit(accountId, profile),
      });
    }
    default:
      return renderGenericChannelCard(key, props, data.channelAccounts ?? {});
  }
}

function renderGenericChannelCard(
  key: ChannelKey,
  props: ChannelsProps,
  channelAccounts: Record<string, ChannelAccountSnapshot[]>,
) {
  const label = resolveChannelLabel(props.snapshot, key);
  const status = props.snapshot?.channels?.[key] as Record<string, unknown> | undefined;
  const configured = typeof status?.configured === "boolean" ? status.configured : undefined;
  const running = typeof status?.running === "boolean" ? status.running : undefined;
  const connected = typeof status?.connected === "boolean" ? status.connected : undefined;
  const lastError = typeof status?.lastError === "string" ? status.lastError : undefined;
  const accounts = channelAccounts[key] ?? [];
  const accountCountLabel = renderChannelAccountCount(key, channelAccounts);
  const connectedLabel = formatConnectedLabel(connected, accounts);

  return html`
    <div class="card">
      <div class="card-title">${label}</div>
      <div class="card-sub">${t("channels.cardSub.generic")}</div>
      ${accountCountLabel}

      ${
        accounts.length > 0
          ? html`
            <div class="account-card-list">
              ${accounts.map((account) => renderGenericAccount(account))}
            </div>
          `
          : html`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">${t("channels.labels.configured")}</span>
                <span>${channelTriState(configured)}</span>
              </div>
              <div>
                <span class="label">${t("channels.labels.running")}</span>
                <span>${channelTriState(running)}</span>
              </div>
              <div>
                <span class="label">${t("channels.labels.connected")}</span>
                <span>${connectedLabel}</span>
              </div>
            </div>
          `
      }

      ${
        lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
            ${lastError}
          </div>`
          : nothing
      }

      ${
        !configured
          ? html`
            <div class="row" style="margin-top: 16px;">
              <button
                class="btn primary"
                @click=${() => props.onOpenChannelWizard(key)}
              >
                ${t("common.setup")} ${label}
              </button>
            </div>
          `
          : nothing
      }

      ${renderChannelConfigSection({ channelId: key, props })}
    </div>
  `;
}

function resolveChannelMetaMap(
  snapshot: ChannelsStatusSnapshot | null,
): Record<string, ChannelUiMetaEntry> {
  if (!snapshot?.channelMeta?.length) {
    return {};
  }
  return Object.fromEntries(snapshot.channelMeta.map((entry) => [entry.id, entry]));
}

function resolveChannelLabel(snapshot: ChannelsStatusSnapshot | null, key: string): string {
  const localized = t(`channels.titles.${key}`);
  if (localized !== `channels.titles.${key}`) {
    return localized;
  }
  const meta = resolveChannelMetaMap(snapshot)[key];
  return meta?.label ?? snapshot?.channelLabels?.[key] ?? key;
}

const RECENT_ACTIVITY_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

function hasRecentActivity(account: ChannelAccountSnapshot): boolean {
  if (!account.lastInboundAt) {
    return false;
  }
  return Date.now() - account.lastInboundAt < RECENT_ACTIVITY_THRESHOLD_MS;
}

function channelTriState(value: boolean | null | undefined): string {
  if (value == null) {
    return t("common.na");
  }
  return value ? t("channels.status.yes") : t("channels.status.no");
}

function deriveRunningLabel(account: ChannelAccountSnapshot): string {
  if (account.running) {
    return t("channels.status.yes");
  }
  if (hasRecentActivity(account)) {
    return t("channels.status.active");
  }
  return t("channels.status.no");
}

function deriveConnectedLabel(account: ChannelAccountSnapshot): string {
  if (account.connected === true) {
    return t("channels.status.yes");
  }
  if (account.connected === false) {
    return t("channels.status.no");
  }
  if (hasRecentActivity(account)) {
    return t("channels.status.active");
  }
  return t("common.na");
}

function renderGenericAccount(account: ChannelAccountSnapshot) {
  return html`
    <div class="account-card">
      <div class="account-card-header">
        <div class="account-card-title">${account.name || account.accountId}</div>
        <div class="account-card-id">${account.accountId}</div>
      </div>
      <div class="status-list account-card-status">
        <div>
          <span class="label">${t("channels.labels.running")}</span>
          <span>${deriveRunningLabel(account)}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.configured")}</span>
          <span>${account.configured ? t("channels.status.yes") : t("channels.status.no")}</span>
        </div>
        <div>
          <span class="label">${t("channels.labels.connected")}</span>
          <span>${deriveConnectedLabel(account)}</span>
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
}
