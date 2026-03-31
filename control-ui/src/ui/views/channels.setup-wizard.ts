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

// ─── SVG brand icons ─────────────────────────────────────────────────────────

const ICON_TELEGRAM = html`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;flex-shrink:0;">
  <path d="M21.198 2.433a2.25 2.25 0 0 0-2.187-.131L2.625 9.817a1.275 1.275 0 0 0 .093 2.367l3.918 1.228 1.528 4.826a1.125 1.125 0 0 0 1.852.436L12.3 16.22l4.197 3.12a1.275 1.275 0 0 0 2.003-.851l2.25-14.625a2.25 2.25 0 0 0-.552-1.431Z" fill="currentColor"/>
</svg>`;

const ICON_WHATSAPP = html`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;flex-shrink:0;">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.528 3.657 1.448 5.162L2 22l4.978-1.42A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm-1.37 14.278c-1.13-.567-2.093-1.42-2.808-2.478l1.15-1.15a.75.75 0 0 0 .165-.803l-.75-1.875a.75.75 0 0 0-.695-.472H7a.75.75 0 0 0-.75.75c0 4.142 3.358 7.5 7.5 7.5a.75.75 0 0 0 .75-.75v-.695a.75.75 0 0 0-.472-.694l-1.875-.75a.75.75 0 0 0-.803.165l-1.05 1.052-.57-.25Z" fill="currentColor"/>
</svg>`;

const ICON_DISCORD = html`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;flex-shrink:0;">
  <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02C2.61 8.99 1.9 12.55 2.23 16.07c0 .02.01.04.03.05a19.9 19.9 0 0 0 5.99 3.03c.03.01.06 0 .08-.02.46-.63.87-1.29 1.22-1.99.02-.04 0-.08-.04-.09-.65-.25-1.27-.55-1.87-.89-.04-.02-.04-.08-.01-.11.13-.1.25-.19.38-.29.02-.02.05-.02.07-.01 3.92 1.79 8.17 1.79 12.05 0 .02-.01.05-.01.07.01.13.1.25.2.38.29.04.03.04.09 0 .11-.6.35-1.22.65-1.87.89-.04.01-.05.06-.04.09.36.7.77 1.36 1.22 1.99.02.02.05.03.08.02a19.84 19.84 0 0 0 6-3.03c.02-.01.03-.03.03-.05.38-3.97-.64-7.5-2.7-10.72-.01-.01-.02-.02-.04-.02ZM8.52 13.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12Zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12Z" fill="currentColor"/>
</svg>`;

const ICON_SLACK = html`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;flex-shrink:0;">
  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.276 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.52 2.52v6.313A2.528 2.528 0 0 1 8.84 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.84 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.84 0a2.528 2.528 0 0 1 2.52 2.522v2.52H8.84zm0 1.276a2.528 2.528 0 0 1 2.52 2.521 2.528 2.528 0 0 1-2.52 2.52H2.522A2.528 2.528 0 0 1 0 8.839a2.528 2.528 0 0 1 2.522-2.521H8.84zm10.124 2.521a2.528 2.528 0 0 1 2.521-2.521A2.528 2.528 0 0 1 24 8.839a2.528 2.528 0 0 1-2.522 2.52h-2.521V8.839zm-1.276 0a2.528 2.528 0 0 1-2.52 2.52 2.528 2.528 0 0 1-2.521-2.52V2.522A2.528 2.528 0 0 1 15.165 0a2.528 2.528 0 0 1 2.52 2.522v6.317zm-2.52 10.124a2.528 2.528 0 0 1 2.52 2.521A2.528 2.528 0 0 1 15.165 24a2.528 2.528 0 0 1-2.521-2.522v-2.521h2.521zm0-1.276a2.528 2.528 0 0 1-2.521-2.52 2.528 2.528 0 0 1 2.521-2.521h6.318A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.52h-6.318z" fill="currentColor"/>
</svg>`;

const ICON_SIGNAL = html`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;flex-shrink:0;">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.19 0 2.31.28 3.3.77l-1.08 1.08A5.987 5.987 0 0 0 12 6.5c-1.57 0-3 .6-4.07 1.58L6.85 6.1C8.12 4.79 9.97 4 12 4l-.01 1zm-8 8c0-1.05.22-2.06.62-2.97l1.41 1.41A5.95 5.95 0 0 0 5.5 12c0 .78.16 1.53.44 2.21L4.56 15.6A9.952 9.952 0 0 1 4 12zm8 8c-1.97 0-3.78-.74-5.14-1.96l1.08-1.08A5.977 5.977 0 0 0 12 18.5c1.57 0 3-.6 4.07-1.58l1.08 1.08C15.88 19.21 14.03 20 12 20zm4.22-3.22L15.14 15.7A3.98 3.98 0 0 0 16 13c0-.92-.31-1.76-.83-2.43l1.42-1.42C17.47 10.24 18 11.06 18 13c0 1.42-.5 2.72-1.32 3.73l-.46.05zm1.92-8.56-1.41 1.41A5.95 5.95 0 0 0 18.5 12c0-.78-.16-1.53-.44-2.21L19.44 8.4C19.8 8.84 20 10.37 20 12l-.01.22h-.04z" fill="currentColor"/>
</svg>`;

const ICON_GOOGLECHAT = html`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;flex-shrink:0;">
  <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor"/>
</svg>`;

const ICON_IMESSAGE = html`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;flex-shrink:0;">
  <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-7 12H7v-2h6v2zm3-4H7V8h9v2z" fill="currentColor"/>
</svg>`;

const ICON_NOSTR = html`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;flex-shrink:0;">
  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
</svg>`;

const ICON_DEFAULT = html`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;flex-shrink:0;">
  <path d="M5 12.5c0 .313.461.858 1.53 1.393C7.914 14.585 9.877 15 12 15c2.123 0 4.086-.415 5.47-1.107 1.069-.535 1.53-1.08 1.53-1.393v-2.171C17.35 11.01 14.827 11.5 12 11.5c-2.827 0-5.35-.489-7-1.171V12.5zm14 2.829C17.35 16.51 14.827 17 12 17c-2.827 0-5.35-.489-7-1.171V18.5c0 .313.461.858 1.53 1.393C7.914 20.585 9.877 21 12 21c2.123 0 4.086-.415 5.47-1.107 1.069-.535 1.53-1.08 1.53-1.393v-2.171zM3 18.5v-9C3 7.015 7.03 5 12 5s9 2.015 9 4.5v9c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5z" fill="currentColor"/>
</svg>`;

const CHANNEL_ICONS: Record<string, unknown> = {
  telegram: ICON_TELEGRAM,
  whatsapp: ICON_WHATSAPP,
  discord: ICON_DISCORD,
  slack: ICON_SLACK,
  signal: ICON_SIGNAL,
  googlechat: ICON_GOOGLECHAT,
  imessage: ICON_IMESSAGE,
  nostr: ICON_NOSTR,
};

// ─── SVG brand color per channel ─────────────────────────────────────────────

const CHANNEL_COLORS: Record<string, string> = {
  telegram: "#229ED9",
  whatsapp: "#25D366",
  discord: "#5865F2",
  slack: "#4A154B",
  signal: "#3A76F0",
  googlechat: "#1A73E8",
  imessage: "#34C759",
  nostr: "#8B5CF6",
};

// ─── Step indicator ──────────────────────────────────────────────────────────

function renderStepIndicator(step: ChannelWizardStep, done: boolean) {
  const steps = [
    { num: 1, label: t("channels.wizard.stepDetails") },
    { num: 2, label: t("channels.wizard.stepConnect") },
    { num: 3, label: t("channels.wizard.stepFinish") },
  ];
  return html`
    <div style="display:flex; gap:8px; align-items:center; margin-bottom:24px;">
      ${steps.map((s, i) => {
        const isActive = !done && step === s.num;
        const isPast = done || step > s.num;
        return html`
          ${i > 0
            ? html`<div style="
                flex:1; height:2px;
                background:${isPast ? "var(--ok)" : "var(--border-strong)"};
                border-radius:2px;
                transition: background 0.3s ease;
              "></div>`
            : nothing}
          <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
            <div style="
              width:28px; height:28px; border-radius:50%;
              display:flex; align-items:center; justify-content:center;
              font-size:11px; font-weight:700;
              background:${isPast ? "var(--ok)" : isActive ? "var(--accent)" : "var(--bg-elevated)"};
              color:${isPast || isActive ? "#fff" : "var(--muted)"};
              border:1.5px solid ${isPast ? "var(--ok)" : isActive ? "var(--accent)" : "var(--border-strong)"};
              box-shadow:${isActive ? "0 0 0 3px var(--accent-subtle)" : "none"};
              transition: all 0.2s var(--ease-out);
            ">
              ${isPast
                ? html`<svg viewBox="0 0 16 16" fill="none" style="width:12px;height:12px;"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
                : s.num}
            </div>
            <div style="font-size:10px; font-weight:500; color:${isActive ? "var(--text-strong)" : "var(--muted)"}; white-space:nowrap; letter-spacing:0.01em;">
              ${s.label}
            </div>
          </div>
        `;
      })}
    </div>
  `;
}

// ─── Step 1 ──────────────────────────────────────────────────────────────────

function renderStep1(props: ChannelWizardProps) {
  const { channel, fields, busy, error, onFieldChange, onSaveAndAdvance } = props;
  if (!channel) return nothing;

  const def = getChannelSetupDef(channel);
  const docsHint = t(`channels.wizard.docs.${channel}`);
  const hasDocs = docsHint !== `channels.wizard.docs.${channel}`;

  if (channel === "whatsapp") {
    return html`
      <div>
        <p style="color:var(--muted); font-size:13px; line-height:1.65; margin:0 0 16px;">
          <span .innerHTML=${t("channels.wizard.whatsapp.intro")}></span>
        </p>
        <div class="callout" style="margin-bottom:16px; font-size:12px; line-height:1.6;">
          <span .innerHTML=${t("channels.wizard.whatsapp.note")}></span>
        </div>
        ${error ? html`<div class="callout danger" style="margin-bottom:12px;">${error}</div>` : nothing}
        <div class="row" style="margin-top:4px;">
          <button class="btn primary" ?disabled=${busy} @click=${() => onSaveAndAdvance()}>
            ${busy
              ? html`${_spinnerSvg()} ${t("common.working")}`
              : html`${_arrowRightSvg()} ${t("channels.wizard.continue")}`}
          </button>
          <button class="btn" ?disabled=${busy} @click=${() => props.onClose()}>${t("common.cancel")}</button>
        </div>
      </div>
    `;
  }

  if (!def || def.fields.length === 0) {
    return html`
      <div>
        <p style="color:var(--muted); font-size:13px;">${t("channels.config.schemaUnavailableRaw")}</p>
        ${error ? html`<div class="callout danger" style="margin-bottom:12px;">${error}</div>` : nothing}
        <div class="row" style="margin-top:16px;">
          <button class="btn primary" ?disabled=${busy} @click=${() => onSaveAndAdvance()}>
            ${busy ? html`${_spinnerSvg()} ${t("channels.wizard.enabling")}` : t("channels.wizard.enable")}
          </button>
          <button class="btn" ?disabled=${busy} @click=${() => props.onClose()}>${t("common.cancel")}</button>
        </div>
      </div>
    `;
  }

  return html`
    <div>
      ${hasDocs
        ? html`<div class="callout" style="margin-bottom:16px; font-size:12px; line-height:1.6;">${docsHint}</div>`
        : nothing}

      ${def.fields.map(
        (field) => html`
          <div class="field" style="margin-bottom:14px;">
            <span>
              ${field.label}
              ${field.required ? html`<span style="color:var(--danger); margin-left:2px;">*</span>` : nothing}
            </span>
            <div style="position:relative;">
              <input
                type=${field.type ?? "text"}
                placeholder=${field.placeholder}
                .value=${fields[field.key] ?? ""}
                ?disabled=${busy}
                @input=${(e: Event) => onFieldChange(field.key, (e.target as HTMLInputElement).value)}
                @keydown=${(e: KeyboardEvent) => {
                  if (e.key === "Enter" && !busy) onSaveAndAdvance();
                }}
              />
            </div>
            ${field.hint
              ? html`<div style="font-size:11px; color:var(--muted); margin-top:2px; line-height:1.5;">${field.hint}</div>`
              : nothing}
          </div>
        `,
      )}

      ${error ? html`<div class="callout danger" style="margin-bottom:12px;">${error}</div>` : nothing}

      <div class="row" style="margin-top:20px;">
        <button class="btn primary" ?disabled=${busy} @click=${() => onSaveAndAdvance()}>
          ${busy
            ? html`${_spinnerSvg()} ${t("channels.wizard.saving")}`
            : html`${_plugSvg()} ${t("channels.wizard.saveAndConnect")}`}
        </button>
        <button class="btn" ?disabled=${busy} @click=${() => props.onClose()}>${t("common.cancel")}</button>
      </div>
    </div>
  `;
}

// ─── Step 2: WhatsApp QR ─────────────────────────────────────────────────────

function renderStep2WhatsApp(props: ChannelWizardProps) {
  const { busy, error, whatsappQrDataUrl, whatsappMessage, onWhatsAppQR, onWhatsAppWaitScan } = props;
  return html`
    <div>
      <p style="color:var(--muted); font-size:13px; margin:0 0 16px; line-height:1.65;">
        ${t("channels.wizard.whatsapp.scanPrompt")}
      </p>

      ${whatsappQrDataUrl
        ? html`
          <div style="display:flex; justify-content:center; margin-bottom:16px;">
            <div style="
              background:#fff;
              padding:12px;
              border-radius:var(--radius-md);
              border:1px solid var(--border-strong);
              display:inline-block;
              box-shadow:var(--shadow-md);
            ">
              <img
                src=${whatsappQrDataUrl}
                alt=${t("channels.whatsappQrAlt")}
                style="width:180px; height:180px; display:block; image-rendering:pixelated;"
              />
            </div>
          </div>
          <div style="margin-bottom:12px;">
            <button class="btn" ?disabled=${busy} @click=${() => onWhatsAppQR(true)}>
              ${_refreshSvg()} ${t("channels.actions.refresh")}
            </button>
          </div>
        `
        : html`
          <div style="
            display:flex; align-items:center; justify-content:center;
            height:120px;
            border:1.5px dashed var(--border-strong);
            border-radius:var(--radius-md);
            margin-bottom:16px;
            background:var(--bg-elevated);
          ">
            <button class="btn primary" ?disabled=${busy} @click=${() => onWhatsAppQR(false)}>
              ${busy ? html`${_spinnerSvg()} ${t("common.loading")}` : html`${_qrSvg()} ${t("channels.actions.showQr")}`}
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
          ${busy
            ? html`${_spinnerSvg()} ${t("common.working")}`
            : html`${_checkSvg()} ${t("channels.wizard.whatsapp.scannedButton")}`}
        </button>
        <button class="btn" ?disabled=${busy} @click=${() => props.onClose()}>${t("common.close")}</button>
      </div>
    </div>
  `;
}

// ─── Step 2: Processing ──────────────────────────────────────────────────────

function renderStep2Processing() {
  return html`
    <div style="
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      padding:32px 0; gap:14px; text-align:center;
    ">
      <div style="
        width:48px; height:48px; border-radius:50%;
        background:var(--accent-subtle);
        border:1.5px solid var(--accent);
        display:flex; align-items:center; justify-content:center;
        animation:glow-pulse 2s ease-in-out infinite;
      ">
        ${_gearSvg()}
      </div>
      <div>
        <div style="font-size:14px; font-weight:600; color:var(--text-strong); margin-bottom:4px;">
          ${t("channels.wizard.processing")}
        </div>
        <div style="font-size:12px; color:var(--muted);">${_dotsSpinner()}</div>
      </div>
    </div>
  `;
}

// ─── Step 3: Success ─────────────────────────────────────────────────────────

function renderStep3Success(props: ChannelWizardProps) {
  const { channel, onClose } = props;
  const label = channel ? t(`channels.titles.${channel}`) : "";
  return html`
    <div style="
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      padding:20px 0 8px; gap:12px; text-align:center;
    ">
      <div style="
        width:56px; height:56px; border-radius:50%;
        background:var(--ok-subtle);
        border:1.5px solid var(--ok);
        display:flex; align-items:center; justify-content:center;
        animation:scale-in 0.3s var(--ease-spring);
      ">
        <svg viewBox="0 0 24 24" fill="none" style="width:26px;height:26px;color:var(--ok);">
          <path d="M5 12l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div>
        <div style="font-size:16px; font-weight:700; color:var(--text-strong); margin-bottom:6px;">
          ${t("channels.wizard.successTitle", { label })}
        </div>
        <div style="font-size:13px; color:var(--muted); line-height:1.6;">
          ${t("channels.wizard.successSub")}
        </div>
      </div>
      <button class="btn primary" style="margin-top:8px;" @click=${() => onClose()}>
        ${t("common.close")}
      </button>
    </div>
  `;
}

// ─── Inline SVG helpers ──────────────────────────────────────────────────────

function _spinnerSvg() {
  return html`<svg viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;animation:spin 0.8s linear infinite;flex-shrink:0;">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="28 56" stroke-linecap="round"/>
  </svg>`;
}

function _arrowRightSvg() {
  return html`<svg viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;flex-shrink:0;">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function _plugSvg() {
  return html`<svg viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;flex-shrink:0;">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function _refreshSvg() {
  return html`<svg viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;flex-shrink:0;">
    <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function _qrSvg() {
  return html`<svg viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;flex-shrink:0;">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
    <path d="M14 14h1v1h-1zM17 14h1v1h-1zM20 14h1v1h-1zM14 17h1v1h-1zM17 17h1v1h-1zM20 17h1v1h-1zM14 20h1v1h-1zM17 20h1v1h-1zM20 20h1v1h-1z" fill="currentColor"/>
  </svg>`;
}

function _checkSvg() {
  return html`<svg viewBox="0 0 24 24" fill="none" style="width:14px;height:14px;flex-shrink:0;">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function _gearSvg() {
  return html`<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:var(--accent);">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19.622 10.395l-1.097-2.65L20 6l-2-2-1.735 1.483-2.707-1.113L12.935 2h-1.954l-.632 2.401-2.645 1.115L6 4 4 6l1.453 1.789-1.08 2.657L2 11v2l2.373.554 1.138 2.572L4 18l2 2 1.854-1.437 2.689 1.048.621 2.389h1.865l.545-2.352 2.657-1.06L18 20l2-2-1.471-1.803 1.071-2.655L22 13v-2l-2.378-.605z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function _dotsSpinner() {
  return html`<span style="display:inline-flex;gap:3px;align-items:center;">
    <span style="width:4px;height:4px;border-radius:50%;background:var(--muted);animation:pulse-subtle 1.4s ease-in-out infinite;animation-delay:0ms;"></span>
    <span style="width:4px;height:4px;border-radius:50%;background:var(--muted);animation:pulse-subtle 1.4s ease-in-out infinite;animation-delay:0.2s;"></span>
    <span style="width:4px;height:4px;border-radius:50%;background:var(--muted);animation:pulse-subtle 1.4s ease-in-out infinite;animation-delay:0.4s;"></span>
  </span>`;
}

// ─── Main render ──────────────────────────────────────────────────────────────

export function renderChannelSetupWizard(props: ChannelWizardProps) {
  if (!props.open || !props.channel) return nothing;

  const { channel, step, done } = props;
  const label = channel ? t(`channels.titles.${channel}`) : "";
  const icon = CHANNEL_ICONS[channel] ?? ICON_DEFAULT;
  const brandColor = CHANNEL_COLORS[channel] ?? "var(--accent)";

  function renderContent() {
    if (done || step === 3) return renderStep3Success(props);
    if (step === 2) {
      if (channel === "whatsapp") return renderStep2WhatsApp(props);
      return renderStep2Processing();
    }
    return renderStep1(props);
  }

  return html`
    <!-- Overlay backdrop -->
    <div
      style="
        position:fixed; inset:0; z-index:1000;
        background:rgba(0,0,0,0.6);
        display:flex; align-items:center; justify-content:center;
        padding:16px;
        backdrop-filter:blur(2px);
        animation:fade-in 0.15s ease;
      "
      @click=${(e: MouseEvent) => {
        if (e.target === e.currentTarget && !props.busy) props.onClose();
      }}
    >
      <!-- Wizard card -->
      <div
        style="
          background:var(--card);
          border:1px solid var(--border-strong);
          border-radius:var(--radius-lg);
          padding:24px 28px 28px;
          width:100%;
          max-width:480px;
          box-shadow:var(--shadow-xl);
          animation:scale-in 0.2s var(--ease-out);
        "
        @click=${(e: MouseEvent) => e.stopPropagation()}
      >
        <!-- Header -->
        <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:20px; gap:12px;">
          <div style="display:flex; align-items:center; gap:12px; min-width:0;">
            <!-- Channel icon badge -->
            <div style="
              width:40px; height:40px; border-radius:var(--radius-md); flex-shrink:0;
              background:${brandColor}1a;
              border:1px solid ${brandColor}33;
              display:flex; align-items:center; justify-content:center;
              color:${brandColor};
            ">
              ${icon}
            </div>
            <div style="min-width:0;">
              <div style="font-size:15px; font-weight:700; color:var(--text-strong); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${t("channels.wizard.setupTitle", { label })}
              </div>
              <div style="font-size:11px; color:var(--muted); margin-top:2px;">
                ${t("channels.wizard.setupSub")}
              </div>
            </div>
          </div>
          <!-- Close button -->
          <button
            class="btn"
            style="padding:6px; min-width:32px; width:32px; height:32px; flex-shrink:0; color:var(--muted);"
            ?disabled=${props.busy}
            @click=${() => props.onClose()}
            title=${t("common.close")}
          >
            <svg viewBox="0 0 24 24" fill="none" style="width:16px;height:16px;">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Divider -->
        <div style="height:1px; background:var(--border); margin:0 -28px 20px;"></div>

        <!-- Step indicator -->
        ${renderStepIndicator(step, done)}

        <!-- Step content -->
        ${renderContent()}
      </div>
    </div>
  `;
}
