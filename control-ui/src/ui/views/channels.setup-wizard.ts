import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import { getChannelSetupDef } from "../controllers/channels-wizard";
import type { ChannelWizardStep } from "./channels.setup-wizard.types";

export type ChannelWizardProps = {
  open: boolean;
  channel: string | null;
  step: ChannelWizardStep;
  fields: Record<string, string>;
  busy: boolean;
  error: string | null;
  done: boolean;
  /** WhatsApp QR data URL (from whatsappLoginQrDataUrl) */
  whatsappQrDataUrl: string | null;
  whatsappMessage: string | null;
  whatsappConnected: boolean | null;
  onClose: () => void;
  onFieldChange: (key: string, value: string) => void;
  onSaveAndAdvance: () => void;
  onWhatsAppQR: (force: boolean) => void;
  onWhatsAppWaitScan: () => void;
};

// Removed hardcoded CHANNEL_LABELS

const CHANNEL_ICONS: Record<string, string> = {
  telegram: "✈",
  whatsapp: "💬",
  discord: "🎮",
  slack: "🔷",
  signal: "🔒",
  googlechat: "💼",
  imessage: "🍎",
  nostr: "⚡",
};

// Removed hardcoded CHANNEL_DOCS

function renderStepIndicator(step: ChannelWizardStep, done: boolean) {
  const steps = [
    { num: 1, label: t("channels.wizard.stepDetails") },
    { num: 2, label: t("channels.wizard.stepConnect") },
    { num: 3, label: t("channels.wizard.stepFinish") },
  ];
  return html`
    <div style="display:flex; gap:8px; align-items:center; margin-bottom:20px;">
      ${steps.map((s, i) => {
        const isActive = !done && step === s.num;
        const isPast = done || step > s.num;
        return html`
          ${i > 0
            ? html`<div style="flex:1; height:2px; background:${isPast ? "var(--color-success, #22c55e)" : "var(--color-border, #333)"}; border-radius:2px;"></div>`
            : nothing}
          <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
            <div style="
              width:28px; height:28px; border-radius:50%;
              display:flex; align-items:center; justify-content:center;
              font-size:12px; font-weight:700;
              background:${isPast ? "var(--color-success, #22c55e)" : isActive ? "var(--color-primary, #7c3aed)" : "var(--color-surface-2, #2a2a2a)"};
              color:${isPast || isActive ? "#fff" : "var(--color-muted, #888)"};
              border: 1px solid ${isPast ? "var(--color-success, #22c55e)" : isActive ? "var(--color-primary, #7c3aed)" : "var(--color-border, #444)"};
            ">
              ${isPast ? "✓" : s.num}
            </div>
            <div style="font-size:10px; color:${isActive ? "var(--color-text, #fff)" : "var(--color-muted, #888)"}; white-space:nowrap;">
              ${s.label}
            </div>
          </div>
        `;
      })}
    </div>
  `;
}

function renderStep1(props: ChannelWizardProps) {
  const { channel, fields, busy, error, onFieldChange, onSaveAndAdvance } = props;
  if (!channel) return nothing;

  const def = getChannelSetupDef(channel);
  const docsHint = t(`channels.wizard.docs.${channel}`);
  const hasDocs = docsHint !== `channels.wizard.docs.${channel}`;

  if (channel === "whatsapp") {
    return html`
      <div>
        <p style="color:var(--color-muted,#888); font-size:13px; line-height:1.6; margin:0 0 16px;">
          <span .innerHTML=${t("channels.wizard.whatsapp.intro")}></span>
        </p>
        <div class="callout" style="margin-bottom:16px; font-size:12px; line-height:1.6;">
          <span .innerHTML=${t("channels.wizard.whatsapp.note")}></span>
        </div>
        ${error ? html`<div class="callout danger" style="margin-bottom:12px;">${error}</div>` : nothing}
        <div class="row">
          <button class="btn primary" ?disabled=${busy} @click=${() => onSaveAndAdvance()}>
            ${busy ? t("common.working") : t("channels.wizard.continue")}
          </button>
          <button class="btn" ?disabled=${busy} @click=${() => props.onClose()}>${t("common.cancel")}</button>
        </div>
      </div>
    `;
  }

  if (!def || def.fields.length === 0) {
    return html`
      <div>
        <p style="color:var(--color-muted,#888); font-size:13px;">
          ${t("channels.config.schemaUnavailableRaw")}
        </p>
        ${error ? html`<div class="callout danger" style="margin-bottom:12px;">${error}</div>` : nothing}
        <div class="row" style="margin-top:16px;">
          <button class="btn primary" ?disabled=${busy} @click=${() => onSaveAndAdvance()}>
            ${busy ? t("channels.wizard.enabling") : t("channels.wizard.enable")}
          </button>
          <button class="btn" ?disabled=${busy} @click=${() => props.onClose()}>${t("common.cancel")}</button>
        </div>
      </div>
    `;
  }

  return html`
    <div>
      ${hasDocs
        ? html`<div class="callout" style="margin-bottom:16px; font-size:12px; line-height:1.6;">
            ${docsHint}
          </div>`
        : nothing}
      ${def.fields.map(
        (field) => html`
          <div style="margin-bottom:14px;">
            <label style="display:block; font-size:12px; color:var(--color-muted,#888); margin-bottom:4px;">
              ${field.label}${field.required ? html`<span style="color:#f87171;"> *</span>` : nothing}
            </label>
            <input
              class="input"
              type=${field.type ?? "text"}
              placeholder=${field.placeholder}
              .value=${fields[field.key] ?? ""}
              ?disabled=${busy}
              style="width:100%; box-sizing:border-box;"
              @input=${(e: Event) => onFieldChange(field.key, (e.target as HTMLInputElement).value)}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === "Enter" && !busy) onSaveAndAdvance();
              }}
            />
            ${field.hint
              ? html`<div style="font-size:11px; color:var(--color-muted,#666); margin-top:4px;">${field.hint}</div>`
              : nothing}
          </div>
        `,
      )}
      ${error ? html`<div class="callout danger" style="margin-bottom:12px;">${error}</div>` : nothing}
      <div class="row" style="margin-top:16px;">
        <button class="btn primary" ?disabled=${busy} @click=${() => onSaveAndAdvance()}>
          ${busy ? t("channels.wizard.saving") : t("channels.wizard.saveAndConnect")}
        </button>
        <button class="btn" ?disabled=${busy} @click=${() => props.onClose()}>${t("common.cancel")}</button>
      </div>
    </div>
  `;
}

function renderStep2WhatsApp(props: ChannelWizardProps) {
  const { busy, error, whatsappQrDataUrl, whatsappMessage, onWhatsAppQR, onWhatsAppWaitScan } =
    props;
  return html`
    <div>
      <p style="color:var(--color-muted,#888); font-size:13px; margin:0 0 16px; line-height:1.6;">
        ${t("channels.wizard.whatsapp.scanPrompt")}
      </p>
      ${whatsappQrDataUrl
        ? html`
          <div style="text-align:center; margin-bottom:16px; background:white; padding:12px; border-radius:8px; display:inline-block;">
            <img
              src=${whatsappQrDataUrl}
              alt=${t("channels.whatsappQrAlt")}
              style="width:200px; height:200px; display:block;"
            />
          </div>
          <div style="margin-bottom:12px;">
            <button class="btn" ?disabled=${busy} @click=${() => onWhatsAppQR(true)}>
              ${t("channels.actions.refresh")}
            </button>
          </div>
        `
        : html`
          <div style="margin-bottom:16px;">
            <button class="btn primary" ?disabled=${busy} @click=${() => onWhatsAppQR(false)}>
              ${busy ? t("common.loading") : t("channels.actions.showQr")}
            </button>
          </div>
        `}
      ${whatsappMessage
        ? html`<div class="callout" style="margin-bottom:12px; font-size:12px;">${whatsappMessage}</div>`
        : nothing}
      ${error ? html`<div class="callout danger" style="margin-bottom:12px;">${error}</div>` : nothing}
      <div class="callout" style="margin-bottom:16px; font-size:12px; line-height:1.5;">
        <span .innerHTML=${t("channels.wizard.whatsapp.waitScanned")}></span>
      </div>
      <div class="row">
        <button class="btn primary" ?disabled=${busy} @click=${() => onWhatsAppWaitScan()}>
          ${busy ? t("common.working") : t("channels.wizard.whatsapp.scannedButton")}
        </button>
        <button class="btn" ?disabled=${busy} @click=${() => props.onClose()}>${t("common.close")}</button>
      </div>
    </div>
  `;
}

function renderStep2Processing() {
  return html`
    <div style="text-align:center; padding:24px 0;">
      <div style="font-size:32px; margin-bottom:12px;">⚙️</div>
      <div style="font-size:14px; color:var(--color-muted,#888);">${t("channels.wizard.processing")}</div>
    </div>
  `;
}

function renderStep3Success(props: ChannelWizardProps) {
  const { channel, onClose } = props;
  const label = channel ? (t(`channels.titles.${channel}`)) : "";
  return html`
    <div style="text-align:center; padding:16px 0;">
      <div style="font-size:48px; margin-bottom:12px;">✅</div>
      <div style="font-size:16px; font-weight:600; margin-bottom:8px;">
        ${t("channels.wizard.successTitle", { label })}
      </div>
      <div style="font-size:13px; color:var(--color-muted,#888); margin-bottom:24px; line-height:1.6;">
        ${t("channels.wizard.successSub")}
      </div>
      <button class="btn primary" @click=${() => onClose()}>${t("common.close")}</button>
    </div>
  `;
}

export function renderChannelSetupWizard(props: ChannelWizardProps) {
  if (!props.open || !props.channel) {
    return nothing;
  }

  const { channel, step, done } = props;
  const label = channel ? (t(`channels.titles.${channel}`)) : "";
  const icon = CHANNEL_ICONS[channel] ?? "📡";

  function renderContent() {
    if (done || step === 3) {
      return renderStep3Success(props);
    }
    if (step === 2) {
      if (channel === "whatsapp") {
        return renderStep2WhatsApp(props);
      }
      return renderStep2Processing();
    }
    return renderStep1(props);
  }

  return html`
    <!-- Overlay backdrop -->
    <div
      style="
        position:fixed; inset:0; z-index:1000;
        background:rgba(0,0,0,0.65);
        display:flex; align-items:center; justify-content:center;
        padding:16px;
      "
      @click=${(e: MouseEvent) => {
        if (e.target === e.currentTarget && !props.busy) props.onClose();
      }}
    >
      <!-- Wizard card -->
      <div
        style="
          background:var(--color-surface,#1a1a1a);
          border:1px solid var(--color-border,#333);
          border-radius:12px;
          padding:24px;
          width:100%;
          max-width:460px;
          box-shadow:0 20px 60px rgba(0,0,0,0.5);
        "
        @click=${(e: MouseEvent) => e.stopPropagation()}
      >
        <!-- Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:22px;">${icon}</span>
            <div>
              <div style="font-size:15px; font-weight:700;">${t("channels.wizard.setupTitle", { label })}</div>
              <div style="font-size:11px; color:var(--color-muted,#888);">${t("channels.wizard.setupSub")}</div>
            </div>
          </div>
          <button
            class="btn"
            style="padding:4px 8px; font-size:16px; line-height:1;"
            ?disabled=${props.busy}
            @click=${() => props.onClose()}
            title=${t("common.close")}
          >
            ✕
          </button>
        </div>

        <!-- Step indicator -->
        ${renderStepIndicator(step, done)}

        <!-- Step content -->
        ${renderContent()}
      </div>
    </div>
  `;
}
