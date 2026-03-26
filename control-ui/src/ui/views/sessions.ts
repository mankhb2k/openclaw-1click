import { html, nothing } from "lit";
import { renderUiSelect } from "../components/ui-select";
import { formatRelativeTimestamp } from "../format";
import { icons } from "../icons";
import { pathForTab } from "../navigation";
import { formatSessionTokens } from "../presenter";
import type { GatewaySessionRow, SessionsListResult } from "../types";
import { t } from "../../i18n/index";

function localizeRelativeAge(value: string): string {
  const s = value.trim();
  if (s === "n/a") {
    return t("common.na");
  }
  if (s === "Just now") {
    return t("sessions.relativeTime.justNow");
  }
  if (s === "Yesterday") {
    return t("sessions.relativeTime.yesterday");
  }
  const match = /^(\d+)([smhdw]) ago$/.exec(s);
  if (!match) {
    return value;
  }
  const count = match[1];
  const unitCode = match[2];
  const unit =
    unitCode === "s"
      ? t("sessions.relativeTime.units.s")
      : unitCode === "m"
        ? t("sessions.relativeTime.units.m")
        : unitCode === "h"
          ? t("sessions.relativeTime.units.h")
          : unitCode === "d"
            ? t("sessions.relativeTime.units.d")
            : unitCode === "w"
              ? t("sessions.relativeTime.units.w")
              : unitCode;
  return t("sessions.relativeTime.value", { count, unit });
}

export type SessionsProps = {
  loading: boolean;
  result: SessionsListResult | null;
  error: string | null;
  activeMinutes: string;
  limit: string;
  includeGlobal: boolean;
  includeUnknown: boolean;
  basePath: string;
  searchQuery: string;
  sortColumn: "key" | "kind" | "updated" | "tokens";
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
  selectedKeys: Set<string>;
  onFiltersChange: (next: {
    activeMinutes: string;
    limit: string;
    includeGlobal: boolean;
    includeUnknown: boolean;
  }) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (column: "key" | "kind" | "updated" | "tokens", dir: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRefresh: () => void;
  onPatch: (
    key: string,
    patch: {
      label?: string | null;
      thinkingLevel?: string | null;
      fastMode?: boolean | null;
      verboseLevel?: string | null;
      reasoningLevel?: string | null;
    },
  ) => void;
  onToggleSelect: (key: string) => void;
  onSelectPage: (keys: string[]) => void;
  onDeselectPage: (keys: string[]) => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  onNavigateToChat?: (sessionKey: string) => void;
};

const THINK_LEVELS = ["", "off", "minimal", "low", "medium", "high", "xhigh"] as const;
const BINARY_THINK_LEVELS = ["", "off", "on"] as const;
const VERBOSE_LEVELS = [
  { value: "", label: "inherit" },
  { value: "off", label: "off (explicit)" },
  { value: "on", label: "on" },
  { value: "full", label: "full" },
] as const;
const FAST_LEVELS = [
  { value: "", label: "inherit" },
  { value: "on", label: "on" },
  { value: "off", label: "off" },
] as const;
const REASONING_LEVELS = ["", "off", "on", "stream"] as const;
const PAGE_SIZES = [10, 25, 50, 100] as const;

function resolveThinkingLevelLabel(value: string, isBinary: boolean): string {
  if (!value) {
    return t("sessions.levels.inherit");
  }
  if (isBinary) {
    if (value === "off") {
      return t("sessions.levels.off");
    }
    if (value === "on") {
      return t("sessions.levels.on");
    }
    return `${value} (${t("sessions.levels.custom")})`;
  }
  if (value === "off") {
    return t("sessions.levels.off");
  }
  if (value === "minimal") {
    return t("sessions.thinkingLevels.minimal");
  }
  if (value === "low") {
    return t("sessions.thinkingLevels.low");
  }
  if (value === "medium") {
    return t("sessions.thinkingLevels.medium");
  }
  if (value === "high") {
    return t("sessions.thinkingLevels.high");
  }
  if (value === "xhigh") {
    return t("sessions.thinkingLevels.xhigh");
  }
  return `${value} (${t("sessions.levels.custom")})`;
}

function resolveFastLevelLabel(value: string): string {
  if (!value) {
    return t("sessions.levels.inherit");
  }
  if (value === "on") {
    return t("sessions.levels.on");
  }
  if (value === "off") {
    return t("sessions.levels.off");
  }
  return `${value} (${t("sessions.levels.custom")})`;
}

function resolveVerboseLevelLabel(value: string): string {
  if (!value) {
    return t("sessions.levels.inherit");
  }
  if (value === "off") {
    return t("sessions.levels.offExplicit");
  }
  if (value === "on") {
    return t("sessions.levels.on");
  }
  if (value === "full") {
    return t("sessions.levels.full");
  }
  return `${value} (${t("sessions.levels.custom")})`;
}

function resolveReasoningLevelLabel(value: string): string {
  if (!value) {
    return t("sessions.levels.inherit");
  }
  if (value === "off") {
    return t("sessions.levels.off");
  }
  if (value === "on") {
    return t("sessions.levels.on");
  }
  if (value === "stream") {
    return t("sessions.levels.stream");
  }
  return `${value} (${t("sessions.levels.custom")})`;
}

function normalizeProviderId(provider?: string | null): string {
  if (!provider) {
    return "";
  }
  const normalized = provider.trim().toLowerCase();
  if (normalized === "z.ai" || normalized === "z-ai") {
    return "zai";
  }
  return normalized;
}

function isBinaryThinkingProvider(provider?: string | null): boolean {
  return normalizeProviderId(provider) === "zai";
}

function resolveThinkLevelOptions(provider?: string | null): readonly string[] {
  return isBinaryThinkingProvider(provider) ? BINARY_THINK_LEVELS : THINK_LEVELS;
}

function withCurrentOption(options: readonly string[], current: string): string[] {
  if (!current) {
    return [...options];
  }
  if (options.includes(current)) {
    return [...options];
  }
  return [...options, current];
}

function withCurrentLabeledOption(
  options: readonly { value: string; label: string }[],
  current: string,
): Array<{ value: string; label: string }> {
  if (!current) {
    return [...options];
  }
  if (options.some((option) => option.value === current)) {
    return [...options];
  }
  return [...options, { value: current, label: `${current} (custom)` }];
}

function resolveThinkLevelDisplay(value: string, isBinary: boolean): string {
  if (!isBinary) {
    return value;
  }
  if (!value || value === "off") {
    return value;
  }
  return "on";
}

function resolveThinkLevelPatchValue(value: string, isBinary: boolean): string | null {
  if (!value) {
    return null;
  }
  if (!isBinary) {
    return value;
  }
  if (value === "on") {
    return "low";
  }
  return value;
}

function filterRows(rows: GatewaySessionRow[], query: string): GatewaySessionRow[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return rows;
  }
  return rows.filter((row) => {
    const key = (row.key ?? "").toLowerCase();
    const label = (row.label ?? "").toLowerCase();
    const kind = (row.kind ?? "").toLowerCase();
    const displayName = (row.displayName ?? "").toLowerCase();
    return key.includes(q) || label.includes(q) || kind.includes(q) || displayName.includes(q);
  });
}

function sortRows(
  rows: GatewaySessionRow[],
  column: "key" | "kind" | "updated" | "tokens",
  dir: "asc" | "desc",
): GatewaySessionRow[] {
  const cmp = dir === "asc" ? 1 : -1;
  return [...rows].toSorted((a, b) => {
    let diff = 0;
    switch (column) {
      case "key":
        diff = (a.key ?? "").localeCompare(b.key ?? "");
        break;
      case "kind":
        diff = (a.kind ?? "").localeCompare(b.kind ?? "");
        break;
      case "updated": {
        const au = a.updatedAt ?? 0;
        const bu = b.updatedAt ?? 0;
        diff = au - bu;
        break;
      }
      case "tokens": {
        const at = a.totalTokens ?? a.inputTokens ?? a.outputTokens ?? 0;
        const bt = b.totalTokens ?? b.inputTokens ?? b.outputTokens ?? 0;
        diff = at - bt;
        break;
      }
    }
    return diff * cmp;
  });
}

function paginateRows<T>(rows: T[], page: number, pageSize: number): T[] {
  const start = page * pageSize;
  return rows.slice(start, start + pageSize);
}

export function renderSessions(props: SessionsProps) {
  const rawRows = props.result?.sessions ?? [];
  const filtered = filterRows(rawRows, props.searchQuery);
  const sorted = sortRows(filtered, props.sortColumn, props.sortDir);
  const totalRows = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / props.pageSize));
  const page = Math.min(props.page, totalPages - 1);
  const paginated = paginateRows(sorted, page, props.pageSize);

  const sortHeader = (
    col: "key" | "kind" | "updated" | "tokens",
    label: string,
    extraClass = "",
  ) => {
    const isActive = props.sortColumn === col;
    const nextDir = isActive && props.sortDir === "asc" ? ("desc" as const) : ("asc" as const);
    return html`
      <th
        class=${extraClass}
        data-sortable
        data-sort-dir=${isActive ? props.sortDir : ""}
        @click=${() => props.onSortChange(col, isActive ? nextDir : "desc")}
      >
        ${label}
        <span class="data-table-sort-icon">${icons.arrowUpDown}</span>
      </th>
    `;
  };

  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between; margin-bottom: 12px;">
        <div>
          <div class="card-title">${t("sessions.title")}</div>
          <div class="card-sub">
            ${props.result ? t("sessions.cardSub.store", { path: props.result.path }) : t("sessions.cardSub.active")}
          </div>
        </div>
        <button class="btn" ?disabled=${props.loading} @click=${props.onRefresh}>
          ${props.loading ? t("sessions.loading") : t("common.refresh")}
        </button>
      </div>

      <div class="filters" style="margin-bottom: 12px;">
        <label class="field-inline">
          <span>${t("sessions.filters.active")}</span>
          <input
            style="width: 72px;"
            placeholder=${t("sessions.filters.minPlaceholder")}
            .value=${props.activeMinutes}
            @input=${(e: Event) =>
              props.onFiltersChange({
                activeMinutes: (e.target as HTMLInputElement).value,
                limit: props.limit,
                includeGlobal: props.includeGlobal,
                includeUnknown: props.includeUnknown,
              })}
          />
        </label>
        <label class="field-inline">
          <span>${t("sessions.filters.limit")}</span>
          <input
            style="width: 64px;"
            .value=${props.limit}
            @input=${(e: Event) =>
              props.onFiltersChange({
                activeMinutes: props.activeMinutes,
                limit: (e.target as HTMLInputElement).value,
                includeGlobal: props.includeGlobal,
                includeUnknown: props.includeUnknown,
              })}
          />
        </label>
        <label class="field-inline checkbox">
          <input
            type="checkbox"
            .checked=${props.includeGlobal}
            @change=${(e: Event) =>
              props.onFiltersChange({
                activeMinutes: props.activeMinutes,
                limit: props.limit,
                includeGlobal: (e.target as HTMLInputElement).checked,
                includeUnknown: props.includeUnknown,
              })}
          />
          <span>${t("sessions.filters.global")}</span>
        </label>
        <label class="field-inline checkbox">
          <input
            type="checkbox"
            .checked=${props.includeUnknown}
            @change=${(e: Event) =>
              props.onFiltersChange({
                activeMinutes: props.activeMinutes,
                limit: props.limit,
                includeGlobal: props.includeGlobal,
                includeUnknown: (e.target as HTMLInputElement).checked,
              })}
          />
          <span>${t("sessions.filters.unknown")}</span>
        </label>
      </div>

      ${
        props.error
          ? html`<div class="callout danger" style="margin-bottom: 12px;">${props.error}</div>`
          : nothing
      }

      <div class="data-table-wrapper data-table-wrapper--sessions">
        <div class="data-table-toolbar">
          <div class="data-table-search">
            <input
              type="text"
              placeholder=${t("sessions.search.placeholder")}
              .value=${props.searchQuery}
              @input=${(e: Event) => props.onSearchChange((e.target as HTMLInputElement).value)}
            />
          </div>
        </div>

        ${
          props.selectedKeys.size > 0
            ? html`
                <div class="data-table-bulk-bar">
                  <span>${t("sessions.bulk.selected", { count: String(props.selectedKeys.size) })}</span>
                  <button
                    class="btn btn--sm"
                    @click=${props.onDeselectAll}
                  >
                    ${t("sessions.bulk.unselect")}
                  </button>
                  <button
                    class="btn btn--sm danger"
                    ?disabled=${props.loading}
                    @click=${props.onDeleteSelected}
                  >
                    ${icons.trash} ${t("sessions.bulk.delete")}
                  </button>
                </div>
              `
            : nothing
        }

        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="data-table-checkbox-col">
                  ${
                    paginated.length > 0
                      ? html`<input
                        type="checkbox"
                        .checked=${paginated.length > 0 && paginated.every((r) => props.selectedKeys.has(r.key))}
                        .indeterminate=${paginated.some((r) => props.selectedKeys.has(r.key)) && !paginated.every((r) => props.selectedKeys.has(r.key))}
                        @change=${() => {
                          const allSelected = paginated.every((r) => props.selectedKeys.has(r.key));
                          if (allSelected) {
                            props.onDeselectPage(paginated.map((r) => r.key));
                          } else {
                            props.onSelectPage(paginated.map((r) => r.key));
                          }
                        }}
                        aria-label=${t("sessions.table.selectAllOnPage")}
                      />`
                      : nothing
                  }
                </th>
                ${sortHeader("key", t("sessions.table.headers.key"), "data-table-key-col")}
                <th>${t("sessions.table.headers.label")}</th>
                ${sortHeader("kind", t("sessions.table.headers.kind"))}
                ${sortHeader("updated", t("sessions.table.headers.updated"))}
                ${sortHeader("tokens", t("sessions.table.headers.tokens"))}
                <th>${t("sessions.table.headers.thinking")}</th>
                <th>${t("sessions.table.headers.fast")}</th>
                <th>${t("sessions.table.headers.verbose")}</th>
                <th>${t("sessions.table.headers.reasoning")}</th>
              </tr>
            </thead>
            <tbody>
              ${
                paginated.length === 0
                  ? html`
                      <tr>
                        <td colspan="10" style="text-align: center; padding: 48px 16px; color: var(--muted)">
                          ${t("sessions.empty.noSessions")}
                        </td>
                      </tr>
                    `
                  : paginated.map((row) =>
                      renderRow(
                        row,
                        props.basePath,
                        props.onPatch,
                        props.selectedKeys.has(row.key),
                        props.onToggleSelect,
                        props.loading,
                        props.onNavigateToChat,
                      ),
                    )
              }
            </tbody>
          </table>
        </div>

        ${
          totalRows > 0
            ? html`
                <div class="data-table-pagination">
                  <div class="data-table-pagination__info">
                    ${
                      totalRows === 1
                        ? t("sessions.pagination.info.single", {
                            start: String(page * props.pageSize + 1),
                            end: String(Math.min((page + 1) * props.pageSize, totalRows)),
                            total: String(totalRows),
                          })
                        : t("sessions.pagination.info.plural", {
                            start: String(page * props.pageSize + 1),
                            end: String(Math.min((page + 1) * props.pageSize, totalRows)),
                            total: String(totalRows),
                          })
                    }
                  </div>
                  <div class="data-table-pagination__controls">
                    ${renderUiSelect({
                      value: String(props.pageSize),
                      options: PAGE_SIZES.map((s) => ({
                        value: String(s),
                        label: t("sessions.pagination.pageSizeOption", { size: String(s) }),
                      })),
                      onChange: (next) => props.onPageSizeChange(Number(next)),
                    })}
                    <button
                      ?disabled=${page <= 0}
                      @click=${() => props.onPageChange(page - 1)}
                    >
                      ${t("sessions.pagination.previous")}
                    </button>
                    <button
                      ?disabled=${page >= totalPages - 1}
                      @click=${() => props.onPageChange(page + 1)}
                    >
                      ${t("sessions.pagination.next")}
                    </button>
                  </div>
                </div>
              `
            : nothing
        }
      </div>
    </section>
  `;
}

function renderRow(
  row: GatewaySessionRow,
  basePath: string,
  onPatch: SessionsProps["onPatch"],
  selected: boolean,
  onToggleSelect: SessionsProps["onToggleSelect"],
  disabled: boolean,
  onNavigateToChat?: (sessionKey: string) => void,
) {
  const updated = row.updatedAt ? localizeRelativeAge(formatRelativeTimestamp(row.updatedAt)) : t("common.na");
  const rawThinking = row.thinkingLevel ?? "";
  const isBinaryThinking = isBinaryThinkingProvider(row.modelProvider);
  const thinking = resolveThinkLevelDisplay(rawThinking, isBinaryThinking);
  const thinkLevels = withCurrentOption(resolveThinkLevelOptions(row.modelProvider), thinking);
  const fastMode = row.fastMode === true ? "on" : row.fastMode === false ? "off" : "";
  const fastLevels = withCurrentLabeledOption(FAST_LEVELS, fastMode).map((level) => ({
    value: level.value,
    label: resolveFastLevelLabel(level.value),
  }));
  const verbose = row.verboseLevel ?? "";
  const verboseLevels = withCurrentLabeledOption(VERBOSE_LEVELS, verbose).map((level) => ({
    value: level.value,
    label: resolveVerboseLevelLabel(level.value),
  }));
  const reasoning = row.reasoningLevel ?? "";
  const reasoningLevels = withCurrentOption(REASONING_LEVELS, reasoning);
  const displayName =
    typeof row.displayName === "string" && row.displayName.trim().length > 0
      ? row.displayName.trim()
      : null;
  const showDisplayName = Boolean(
    displayName &&
    displayName !== row.key &&
    displayName !== (typeof row.label === "string" ? row.label.trim() : ""),
  );
  const canLink = row.kind !== "global";
  const chatUrl = canLink
    ? `${pathForTab("chat", basePath)}?session=${encodeURIComponent(row.key)}`
    : null;
  const badgeClass =
    row.kind === "direct"
      ? "data-table-badge--direct"
      : row.kind === "group"
        ? "data-table-badge--group"
        : row.kind === "global"
          ? "data-table-badge--global"
          : "data-table-badge--unknown";

  return html`
    <tr>
      <td class="data-table-checkbox-col">
        <input
          type="checkbox"
          .checked=${selected}
          @change=${() => onToggleSelect(row.key)}
          aria-label=${t("sessions.table.selectSession")}
        />
      </td>
      <td class="data-table-key-col">
        <div class="mono session-key-cell">
          ${
            canLink
              ? html`<a
                  href=${chatUrl}
                  class="session-link"
                  @click=${(e: MouseEvent) => {
                    if (
                      e.defaultPrevented ||
                      e.button !== 0 ||
                      e.metaKey ||
                      e.ctrlKey ||
                      e.shiftKey ||
                      e.altKey
                    ) {
                      return;
                    }
                    if (onNavigateToChat) {
                      e.preventDefault();
                      onNavigateToChat(row.key);
                    }
                  }}
                >${row.key}</a>`
              : row.key
          }
          ${
            showDisplayName
              ? html`<span class="muted session-key-display-name">${displayName}</span>`
              : nothing
          }
        </div>
      </td>
      <td>
        <input
          .value=${row.label ?? ""}
          ?disabled=${disabled}
          placeholder=${t("sessions.row.optionalPlaceholder")}
          style="width: 100%; max-width: 140px; padding: 6px 10px; font-size: 13px; border: 1px solid var(--border); border-radius: var(--radius-sm);"
          @change=${(e: Event) => {
            const value = (e.target as HTMLInputElement).value.trim();
            onPatch(row.key, { label: value || null });
          }}
        />
      </td>
      <td>
        <span class="data-table-badge ${badgeClass}">${row.kind}</span>
      </td>
      <td>${updated}</td>
      <td>${formatSessionTokens(row)}</td>
      <td>
        ${renderUiSelect({
          value: thinking,
          disabled,
          options: thinkLevels.map((level) => ({ value: level, label: resolveThinkingLevelLabel(level, isBinaryThinking) })),
          onChange: (value) => {
            onPatch(row.key, {
              thinkingLevel: resolveThinkLevelPatchValue(value, isBinaryThinking),
            });
          },
        })}
      </td>
      <td>
        ${renderUiSelect({
          value: fastMode,
          disabled,
          options: fastLevels,
          onChange: (value) => {
            onPatch(row.key, { fastMode: value === "" ? null : value === "on" });
          },
        })}
      </td>
      <td>
        ${renderUiSelect({
          value: verbose,
          disabled,
          options: verboseLevels,
          onChange: (value) => {
            onPatch(row.key, { verboseLevel: value || null });
          },
        })}
      </td>
      <td>
        ${renderUiSelect({
          value: reasoning,
          disabled,
          options: reasoningLevels.map((level) => ({ value: level, label: resolveReasoningLevelLabel(level) })),
          onChange: (value) => {
            onPatch(row.key, { reasoningLevel: value || null });
          },
        })}
      </td>
    </tr>
  `;
}
