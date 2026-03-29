import type {
  ChannelAccountSnapshot,
  ChannelsStatusSnapshot,
  ConfigUiHints,
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
import type { NostrProfileFormState } from "./channels.nostr-profile-form";
import type { ChannelWizardStep } from "./channels.setup-wizard.types";

export type ChannelKey = string;

export type ChannelsProps = {
  connected: boolean;
  loading: boolean;
  snapshot: ChannelsStatusSnapshot | null;
  lastError: string | null;
  lastSuccessAt: number | null;
  whatsappMessage: string | null;
  whatsappQrDataUrl: string | null;
  whatsappConnected: boolean | null;
  whatsappBusy: boolean;
  channelLogoutBusy: string | null;
  channelLogoutError: string | null;
  onLogoutChannel: (channelId: string) => void;
  configSchema: unknown;
  configSchemaLoading: boolean;
  configForm: Record<string, unknown> | null;
  configUiHints: ConfigUiHints;
  configSaving: boolean;
  configFormDirty: boolean;
  nostrProfileFormState: NostrProfileFormState | null;
  nostrProfileAccountId: string | null;
  onRefresh: (probe: boolean) => void;
  onWhatsAppStart: (force: boolean) => void;
  onWhatsAppWait: () => void;
  onWhatsAppLogout: () => void;
  onConfigPatch: (path: Array<string | number>, value: unknown) => void;
  onConfigSave: () => void;
  onConfigReload: () => void;
  onNostrProfileEdit: (accountId: string, profile: NostrProfile | null) => void;
  onNostrProfileCancel: () => void;
  onNostrProfileFieldChange: (field: keyof NostrProfile, value: string) => void;
  onNostrProfileSave: () => void;
  onNostrProfileImport: () => void;
  onNostrProfileToggleAdvanced: () => void;
  channelWizardOpen: boolean;
  channelWizardChannel: string | null;
  channelWizardStep: ChannelWizardStep;
  channelWizardFields: Record<string, string>;
  channelWizardBusy: boolean;
  channelWizardError: string | null;
  channelWizardDone: boolean;
  onOpenChannelWizard: (channel: string) => void;
  onCloseChannelWizard: () => void;
  onWizardFieldChange: (key: string, value: string) => void;
  onWizardSaveAndAdvance: () => void;
  onWizardWhatsAppQR: (force: boolean) => void;
  onWizardWaitWhatsAppScan: () => void;
  gatewayWizardOpen: boolean;
  gatewayWizardSessionId: string | null;
  gatewayWizardStep: import("../controllers/gateway-wizard").WizardStep | null;
  gatewayWizardStatus: import("../controllers/gateway-wizard").WizardSessionStatus | null;
  gatewayWizardBusy: boolean;
  gatewayWizardError: string | null;
  gatewayWizardDone: boolean;
  gatewayWizardInputValue: string;
  gatewayWizardMultiSelectValues: string[];
  onStartGatewayWizard: () => void;
  onCancelGatewayWizard: () => void;
  onGatewayWizardNext: (answer?: { stepId: string; value?: unknown }) => void;
  onGatewayWizardInputChange: (value: string) => void;
  onGatewayWizardToggleMultiSelect: (value: string) => void;
};

export type ChannelsChannelData = {
  whatsapp?: WhatsAppStatus;
  telegram?: TelegramStatus;
  discord?: DiscordStatus | null;
  googlechat?: GoogleChatStatus | null;
  slack?: SlackStatus | null;
  signal?: SignalStatus | null;
  imessage?: IMessageStatus | null;
  nostr?: NostrStatus | null;
  channelAccounts?: Record<string, ChannelAccountSnapshot[]> | null;
};
