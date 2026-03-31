import { loadChannels, startWhatsAppLogin, waitWhatsAppLogin } from "./channels.ts";
import { loadConfig, saveConfig, updateConfigFormValue } from "./config.ts";
import type { ChannelWizardState } from "../views/channels.setup-wizard.types.ts";
import type { ConfigState } from "./config.ts";
import type { ChannelsState } from "./channels.types.ts";

export type WizardHostState = ChannelWizardState &
  ConfigState &
  ChannelsState & {
    requestUpdate?: () => void;
    appVersion?: string;
  };

/** Fields required for each channel in step 1 */
export type ChannelFieldDef = {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "password" | "tel" | "url";
  required?: boolean;
  hint?: string;
};

type ChannelSetupDef = {
  /** Config path segments to set (e.g. ["channels", "telegram", "botToken"]) */
  configFields: Array<{ path: Array<string | number>; fieldKey: string }>;
  /** Extra static values to always set when enabling */
  staticValues?: Array<{ path: Array<string | number>; value: unknown }>;
  /** Whether step 2 is QR-based (WhatsApp) */
  qrFlow?: boolean;
  /** Fields to show in step 1 */
  fields: ChannelFieldDef[];
};

const CHANNEL_SETUP_DEFS: Record<string, ChannelSetupDef> = {
  telegram: {
    fields: [
      {
        key: "botToken",
        label: "Bot Token",
        placeholder: "123456789:ABCdefGHI...",
        type: "password",
        required: true,
        hint: "Lấy token từ @BotFather trên Telegram",
      },
      {
        key: "ownerChatId",
        label: "Telegram Chat ID của bạn (tùy chọn)",
        placeholder: "123456789",
        type: "text",
        required: false,
        hint: "Nhận tin nhắn chào mừng khi kết nối. Lấy ID từ @userinfobot trên Telegram",
      },
    ],
    configFields: [{ path: ["channels", "telegram", "botToken"], fieldKey: "botToken" }],
    staticValues: [
      { path: ["channels", "telegram", "enabled"], value: true },
      // dmPolicy "open" cho phép nhận tin nhắn trực tiếp không cần pairing
      { path: ["channels", "telegram", "dmPolicy"], value: "open" },
      { path: ["channels", "telegram", "allowFrom"], value: ["*"] },
    ],
  },
  whatsapp: {
    fields: [],
    configFields: [],
    staticValues: [{ path: ["channels", "whatsapp", "enabled"], value: true }],
    qrFlow: true,
  },
  discord: {
    fields: [
      {
        key: "botToken",
        label: "Bot Token",
        placeholder: "MTExxx.xxx.xxx",
        type: "password",
        required: true,
        hint: "Lấy token từ Discord Developer Portal",
      },
    ],
    configFields: [{ path: ["channels", "discord", "botToken"], fieldKey: "botToken" }],
    staticValues: [{ path: ["channels", "discord", "enabled"], value: true }],
  },
  slack: {
    fields: [
      {
        key: "botToken",
        label: "Bot Token",
        placeholder: "xoxb-...",
        type: "password",
        required: true,
        hint: "Lấy Bot User OAuth Token từ Slack App settings",
      },
    ],
    configFields: [{ path: ["channels", "slack", "botToken"], fieldKey: "botToken" }],
    staticValues: [{ path: ["channels", "slack", "enabled"], value: true }],
  },
  signal: {
    fields: [
      {
        key: "phoneNumber",
        label: "Số điện thoại",
        placeholder: "+84901234567",
        type: "tel",
        required: true,
        hint: "Số điện thoại đã đăng ký Signal (bao gồm mã quốc gia)",
      },
    ],
    configFields: [{ path: ["channels", "signal", "phoneNumber"], fieldKey: "phoneNumber" }],
    staticValues: [{ path: ["channels", "signal", "enabled"], value: true }],
  },
  googlechat: {
    fields: [
      {
        key: "webhookUrl",
        label: "Webhook URL",
        placeholder: "https://chat.googleapis.com/v1/spaces/...",
        type: "url",
        required: true,
        hint: "Lấy URL webhook từ Google Chat space settings",
      },
    ],
    configFields: [{ path: ["channels", "googlechat", "webhookUrl"], fieldKey: "webhookUrl" }],
    staticValues: [{ path: ["channels", "googlechat", "enabled"], value: true }],
  },
};

export function getChannelSetupDef(channel: string): ChannelSetupDef | null {
  return CHANNEL_SETUP_DEFS[channel] ?? null;
}

export function openChannelWizard(state: WizardHostState, channel: string) {
  state.channelWizardOpen = true;
  state.channelWizardChannel = channel;
  state.channelWizardStep = 1;
  state.channelWizardFields = {};
  state.channelWizardBusy = false;
  state.channelWizardError = null;
  state.channelWizardDone = false;
}

export function closeChannelWizard(state: WizardHostState) {
  state.channelWizardOpen = false;
  state.channelWizardChannel = null;
  state.channelWizardStep = 1;
  state.channelWizardFields = {};
  state.channelWizardBusy = false;
  state.channelWizardError = null;
  state.channelWizardDone = false;
}

export function updateWizardField(state: WizardHostState, key: string, value: string) {
  state.channelWizardFields = { ...state.channelWizardFields, [key]: value };
  state.channelWizardError = null;
}

async function sendWelcomeMessage(state: WizardHostState, chatId: string): Promise<void> {
  if (!state.client || !state.connected) return;
  const version = state.appVersion ?? "";
  const versionPart = version ? `, bạn đang sử dụng phiên bản Openclaw-Desktop v${version}` : "";
  const message = `Chúc mừng bạn đã kết nối thành công${versionPart}. Bạn đang có dự định gì, hãy nói với tôi. Tôi đã sẵn sàng`;
  try {
    await state.client.request("send", {
      to: chatId,
      message,
      channel: "telegram",
      idempotencyKey: `welcome-telegram-${Date.now()}`,
    });
  } catch {
    // Best-effort — wizard already succeeded
  }
}

function validateFields(def: ChannelSetupDef, fields: Record<string, string>): string | null {
  for (const field of def.fields) {
    if (field.required && !fields[field.key]?.trim()) {
      return `Vui lòng nhập ${field.label}`;
    }
  }
  return null;
}

/**
 * Step 1 → 2: Validate inputs, patch config, save.
 */
export async function wizardSaveAndAdvance(state: WizardHostState) {
  const channel = state.channelWizardChannel;
  if (!channel || state.channelWizardBusy) {
    return;
  }

  const def = getChannelSetupDef(channel);
  if (!def) {
    state.channelWizardError = `Không có cấu hình cho kênh: ${channel}`;
    return;
  }

  const validationError = validateFields(def, state.channelWizardFields);
  if (validationError) {
    state.channelWizardError = validationError;
    return;
  }

  state.channelWizardBusy = true;
  state.channelWizardError = null;

  try {
    // Apply field values to config form
    for (const cf of def.configFields) {
      const value = state.channelWizardFields[cf.fieldKey]?.trim();
      if (value) {
        updateConfigFormValue(state, cf.path, value);
      }
    }

    // Apply static values (e.g. enabled: true)
    for (const sv of def.staticValues ?? []) {
      updateConfigFormValue(state, sv.path, sv.value);
    }

    // saveConfig dùng config.set — gateway tự hot-reload channel (không restart toàn bộ)
    await saveConfig(state);

    // Kiểm tra lỗi TRƯỚC khi gọi loadConfig vì loadConfig reset lastError = null
    // nếu không check ở đây, lỗi từ saveConfig (vd: gateway reject config) bị mất
    if (state.lastError) {
      state.channelWizardError = state.lastError;
      return;
    }

    // saveConfig đã gọi loadConfig nội bộ khi thành công;
    // gọi lại để đồng bộ snapshot nếu saveConfig thoát sớm (vd: baseHash missing)
    await loadConfig(state);

    if (state.lastError) {
      state.channelWizardError = state.lastError;
      return;
    }

    state.channelWizardStep = 2;

    // For non-QR channels, immediately probe and advance to step 3
    if (!def.qrFlow) {
      await loadChannels(state, true);
      state.channelWizardStep = 3;
      state.channelWizardDone = true;

      // Send welcome message if owner chat ID was provided (Telegram)
      if (channel === "telegram") {
        const ownerChatId = state.channelWizardFields["ownerChatId"]?.trim();
        if (ownerChatId) {
          await sendWelcomeMessage(state, ownerChatId);
        }
      }
    }
    // For QR channels (WhatsApp), stay on step 2 to show QR
  } catch (err) {
    state.channelWizardError = String(err);
  } finally {
    state.channelWizardBusy = false;
  }
}

/**
 * WhatsApp: Trigger QR login from step 2.
 */
export async function wizardStartWhatsAppQR(state: WizardHostState, force = false) {
  if (state.channelWizardBusy) {
    return;
  }
  state.channelWizardBusy = true;
  state.channelWizardError = null;
  try {
    await startWhatsAppLogin(state, force);
    if (state.whatsappLoginMessage?.toLowerCase().includes("error")) {
      state.channelWizardError = state.whatsappLoginMessage;
    }
  } catch (err) {
    state.channelWizardError = String(err);
  } finally {
    state.channelWizardBusy = false;
  }
}

/**
 * WhatsApp: Wait for QR scan, advance to step 3.
 */
export async function wizardWaitWhatsAppScan(state: WizardHostState) {
  if (state.channelWizardBusy) {
    return;
  }
  state.channelWizardBusy = true;
  state.channelWizardError = null;
  try {
    await waitWhatsAppLogin(state);
    if (state.whatsappLoginConnected) {
      await loadChannels(state, true);
      state.channelWizardStep = 3;
      state.channelWizardDone = true;
    } else {
      state.channelWizardError = state.whatsappLoginMessage ?? "Chưa quét mã QR. Vui lòng thử lại.";
    }
  } catch (err) {
    state.channelWizardError = String(err);
  } finally {
    state.channelWizardBusy = false;
  }
}
