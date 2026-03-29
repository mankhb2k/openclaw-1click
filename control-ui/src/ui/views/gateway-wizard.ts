import { html, nothing } from "lit";
import type { WizardStep, WizardSessionStatus } from "../controllers/gateway-wizard.ts";

export type GatewayWizardViewProps = {
  open: boolean;
  step: WizardStep | null;
  status: WizardSessionStatus | null;
  busy: boolean;
  error: string | null;
  done: boolean;
  inputValue: string;
  multiSelectValues: string[];
  onClose: () => void;
  onNext: (answer?: { stepId: string; value?: unknown }) => void;
  onInputChange: (value: string) => void;
  onToggleMultiSelect: (value: string) => void;
};

function renderStepContent(props: GatewayWizardViewProps) {
  const { step, busy, inputValue, multiSelectValues, onNext, onInputChange, onToggleMultiSelect } = props;
  if (!step) return nothing;

  const submitWithValue = (value?: unknown) => {
    onNext({ stepId: step.id, value });
  };

  switch (step.type) {
    case "note":
    case "action":
      return html`
        <div>
          ${step.message ? html`<pre style="white-space:pre-wrap; font-size:13px; color:var(--color-text,#e5e5e5); margin:0 0 16px; line-height:1.6; font-family:inherit;">${step.message}</pre>` : nothing}
          <div class="row">
            <button class="btn primary" ?disabled=${busy} @click=${() => onNext(undefined)}>
              ${busy ? "Đang xử lý..." : "Tiếp tục →"}
            </button>
            <button class="btn" @click=${() => props.onClose()}>Huỷ</button>
          </div>
        </div>
      `;

    case "confirm":
      return html`
        <div>
          ${step.message ? html`<p style="font-size:14px; margin:0 0 20px; line-height:1.6;">${step.message}</p>` : nothing}
          <div class="row">
            <button class="btn primary" ?disabled=${busy} @click=${() => submitWithValue(true)}>
              ${busy ? "..." : "Có ✓"}
            </button>
            <button class="btn" ?disabled=${busy} @click=${() => submitWithValue(false)}>
              Không
            </button>
            <button class="btn" @click=${() => props.onClose()}>Huỷ</button>
          </div>
        </div>
      `;

    case "text":
      return html`
        <div>
          ${step.message ? html`<p style="font-size:13px; color:var(--color-muted,#888); margin:0 0 12px; line-height:1.5;">${step.message}</p>` : nothing}
          <input
            class="input"
            type=${step.sensitive ? "password" : "text"}
            placeholder=${step.placeholder ?? ""}
            .value=${inputValue}
            ?disabled=${busy}
            style="width:100%; box-sizing:border-box; margin-bottom:16px;"
            @input=${(e: Event) => onInputChange((e.target as HTMLInputElement).value)}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === "Enter" && !busy) submitWithValue(inputValue);
            }}
          />
          <div class="row">
            <button class="btn primary" ?disabled=${busy || !inputValue.trim()} @click=${() => submitWithValue(inputValue)}>
              ${busy ? "Đang xử lý..." : "Tiếp tục →"}
            </button>
            <button class="btn" @click=${() => props.onClose()}>Huỷ</button>
          </div>
        </div>
      `;

    case "select":
      return html`
        <div>
          ${step.message ? html`<p style="font-size:13px; color:var(--color-muted,#888); margin:0 0 12px; line-height:1.5;">${step.message}</p>` : nothing}
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
            ${(step.options ?? []).map((opt) => html`
              <button
                class="btn"
                style="text-align:left; justify-content:flex-start;"
                ?disabled=${busy}
                @click=${() => submitWithValue(opt.value)}
              >
                <div>
                  <div style="font-weight:600;">${opt.label}</div>
                  ${opt.hint ? html`<div style="font-size:11px; color:var(--color-muted,#888); margin-top:2px;">${opt.hint}</div>` : nothing}
                </div>
              </button>
            `)}
          </div>
          <button class="btn" @click=${() => props.onClose()}>Huỷ</button>
        </div>
      `;

    case "multiselect":
      return html`
        <div>
          ${step.message ? html`<p style="font-size:13px; color:var(--color-muted,#888); margin:0 0 12px; line-height:1.5;">${step.message}</p>` : nothing}
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
            ${(step.options ?? []).map((opt) => {
              const strVal = String(opt.value);
              const selected = multiSelectValues.includes(strVal);
              return html`
                <label style="display:flex; align-items:flex-start; gap:10px; cursor:pointer; padding:8px; border-radius:6px; border:1px solid ${selected ? "var(--color-primary,#7c3aed)" : "var(--color-border,#333)"}; background:${selected ? "var(--color-primary-bg,rgba(124,58,237,0.1))" : "transparent"};">
                  <input
                    type="checkbox"
                    .checked=${selected}
                    @change=${() => onToggleMultiSelect(strVal)}
                    style="margin-top:2px; flex-shrink:0;"
                  />
                  <div>
                    <div style="font-weight:600; font-size:13px;">${opt.label}</div>
                    ${opt.hint ? html`<div style="font-size:11px; color:var(--color-muted,#888); margin-top:2px;">${opt.hint}</div>` : nothing}
                  </div>
                </label>
              `;
            })}
          </div>
          <div class="row">
            <button class="btn primary" ?disabled=${busy} @click=${() => submitWithValue(multiSelectValues)}>
              ${busy ? "Đang xử lý..." : "Tiếp tục →"}
            </button>
            <button class="btn" @click=${() => props.onClose()}>Huỷ</button>
          </div>
        </div>
      `;

    case "progress":
      return html`
        <div style="text-align:center; padding:24px 0;">
          <div style="font-size:28px; margin-bottom:12px; animation: spin 1s linear infinite; display:inline-block;">⚙️</div>
          <div style="font-size:13px; color:var(--color-muted,#888); margin-bottom:8px;">
            ${step.message ?? "Đang thực thi..."}
          </div>
          ${busy ? html`<div style="font-size:11px; color:var(--color-muted,#666);">Vui lòng chờ...</div>` : nothing}
        </div>
      `;

    default:
      return html`<div class="callout">Bước không xác định: ${step.type}</div>`;
  }
}

export function renderGatewayWizard(props: GatewayWizardViewProps) {
  if (!props.open) return nothing;

  const { step, status, busy, error, done } = props;

  function renderContent() {
    if (done || status === "done") {
      return html`
        <div style="text-align:center; padding:16px 0;">
          <div style="font-size:48px; margin-bottom:12px;">✅</div>
          <div style="font-size:16px; font-weight:700; margin-bottom:8px;">Cấu hình hoàn tất!</div>
          <div style="font-size:13px; color:var(--color-muted,#888); margin-bottom:24px; line-height:1.6;">
            Gateway đã được cấu hình thành công. Khởi động lại nếu cần thiết.
          </div>
          <button class="btn primary" @click=${() => props.onClose()}>Đóng</button>
        </div>
      `;
    }
    if (status === "cancelled") {
      return html`
        <div style="text-align:center; padding:16px 0;">
          <div style="font-size:40px; margin-bottom:12px;">🚫</div>
          <div style="font-size:14px; color:var(--color-muted,#888); margin-bottom:16px;">Wizard đã bị huỷ.</div>
          <button class="btn" @click=${() => props.onClose()}>Đóng</button>
        </div>
      `;
    }
    if (status === "error") {
      return html`
        <div>
          <div class="callout danger" style="margin-bottom:16px;">
            ${error ?? "Đã xảy ra lỗi."}
          </div>
          <button class="btn" @click=${() => props.onClose()}>Đóng</button>
        </div>
      `;
    }
    if (!step && busy) {
      return html`
        <div style="text-align:center; padding:24px 0;">
          <div style="font-size:13px; color:var(--color-muted,#888);">Đang khởi động wizard...</div>
        </div>
      `;
    }
    if (!step) {
      return html`<div class="callout">Không có bước nào từ wizard.</div>`;
    }
    return renderStepContent(props);
  }

  const stepTitle = step?.title ?? (done ? "Hoàn tất" : "Đang chạy...");

  return html`
    <div
      style="position:fixed; inset:0; z-index:1010; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; padding:16px;"
      @click=${(e: MouseEvent) => { if (e.target === e.currentTarget && !busy) props.onClose(); }}
    >
      <div
        style="background:var(--color-surface,#1a1a1a); border:1px solid var(--color-border,#333); border-radius:12px; padding:24px; width:100%; max-width:520px; max-height:80vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.5);"
        @click=${(e: MouseEvent) => e.stopPropagation()}
      >
        <!-- Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:22px;">⚙️</span>
            <div>
              <div style="font-size:15px; font-weight:700;">Cấu hình Gateway</div>
              <div style="font-size:11px; color:var(--color-muted,#888);">${stepTitle}</div>
            </div>
          </div>
          <button
            class="btn"
            style="padding:4px 8px; font-size:16px; line-height:1;"
            ?disabled=${busy}
            @click=${() => props.onClose()}
            title="Huỷ và đóng"
          >✕</button>
        </div>

        ${error && !done && status !== "error"
          ? html`<div class="callout danger" style="margin-bottom:12px; font-size:12px;">${error}</div>`
          : nothing}

        ${renderContent()}
      </div>
    </div>
  `;
}
