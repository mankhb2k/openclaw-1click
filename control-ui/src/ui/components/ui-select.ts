import { html, nothing } from "lit";
import type { TemplateResult } from "lit";

export type UiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  isGroup?: boolean;
};

type UiSelectParams = {
  value: string;
  options: UiSelectOption[];
  onChange: (next: string) => void;
  className?: string;
  disabled?: boolean;
  title?: string;
  menuAlign?: "left" | "right";
};

type UiMultiSelectParams = {
  selected: string[];
  options: UiSelectOption[];
  onChange: (next: string[]) => void;
  className?: string;
  title?: string;
  menuAlign?: "left" | "right";
  emptyLabel?: string;
};

function closeOnOutsideClick(details: HTMLDetailsElement) {
  const onClick = (event: MouseEvent) => {
    const path = event.composedPath();
    if (!path.includes(details)) {
      details.open = false;
      window.removeEventListener("click", onClick, true);
    }
  };
  window.addEventListener("click", onClick, true);
}

function selectedLabel(value: string, options: UiSelectOption[]): string {
  const match = options.find((opt) => opt.value === value);
  return match?.label ?? value;
}

export function renderUiSelect(params: UiSelectParams): TemplateResult {
  const menuAlign = params.menuAlign ?? "left";
  const classes = [
    "ui-select",
    params.className ?? "",
    menuAlign === "right" ? "ui-select--menu-right" : "",
    params.disabled ? "ui-select--disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return html`
    <details
      class=${classes}
      @toggle=${(event: Event) => {
        const details = event.currentTarget as HTMLDetailsElement;
        if (details.open) {
          closeOnOutsideClick(details);
        }
      }}
    >
      <summary class="ui-select__trigger" title=${params.title ?? nothing}>
        <span class="ui-select__label">${selectedLabel(params.value, params.options)}</span>
        <span class="ui-select__chevron" aria-hidden="true">▾</span>
      </summary>
      <div class="ui-select__menu" role="listbox">
        ${params.options.map(
          (opt) => opt.isGroup
            ? html`<div class="ui-select__group-header" aria-hidden="true">${opt.label}</div>`
            : html`
            <button
              type="button"
              class="ui-select__option ${opt.value === params.value ? "ui-select__option--active" : ""}"
              ?disabled=${Boolean(params.disabled || opt.disabled)}
              aria-selected=${opt.value === params.value ? "true" : "false"}
              @click=${(event: MouseEvent) => {
                // Single-select: đóng dropdown ngay sau khi chọn.
                // Người dùng muốn chọn lại thì cần bấm mở dropdown lần nữa.
                const btn = event.currentTarget as HTMLElement;
                const details = btn.closest("details") as HTMLDetailsElement | null;
                if (details) {
                  details.open = false;
                }
                params.onChange(opt.value);
              }}
            >
              ${opt.label}
            </button>
          `,
        )}
      </div>
    </details>
  `;
}

export function renderUiMultiSelect(params: UiMultiSelectParams): TemplateResult {
  const selected = new Set(params.selected);
  const selectedLabels = params.options
    .filter((opt) => selected.has(opt.value))
    .map((opt) => opt.label);
  const summary =
    selectedLabels.length === 0
      ? (params.emptyLabel ?? "All")
      : selectedLabels.length <= 2
        ? selectedLabels.join(", ")
        : `${selectedLabels[0]} +${selectedLabels.length - 1}`;
  const menuAlign = params.menuAlign ?? "left";
  const classes = [
    "ui-select",
    "ui-select--multi",
    params.className ?? "",
    menuAlign === "right" ? "ui-select--menu-right" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return html`
    <details
      class=${classes}
      @toggle=${(event: Event) => {
        const details = event.currentTarget as HTMLDetailsElement;
        if (details.open) {
          closeOnOutsideClick(details);
        }
      }}
    >
      <summary class="ui-select__trigger" title=${params.title ?? nothing}>
        <span class="ui-select__label">${summary}</span>
        <span class="ui-select__chevron" aria-hidden="true">▾</span>
      </summary>
      <div class="ui-select__menu" role="listbox" aria-multiselectable="true">
        ${params.options.map((opt) => {
          const checked = selected.has(opt.value);
          return html`
            <label class="ui-select__check-option">
              <input
                type="checkbox"
                .checked=${checked}
                ?disabled=${Boolean(opt.disabled)}
                @change=${(event: Event) => {
                  const input = event.target as HTMLInputElement;
                  const next = new Set(params.selected);
                  if (input.checked) {
                    next.add(opt.value);
                  } else {
                    next.delete(opt.value);
                  }
                  params.onChange(Array.from(next));
                }}
              />
              <span>${opt.label}</span>
            </label>
          `;
        })}
      </div>
    </details>
  `;
}
