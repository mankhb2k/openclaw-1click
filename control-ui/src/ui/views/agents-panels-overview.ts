import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import { renderUiSelect } from "../components/ui-select";
import type { AgentIdentityResult, AgentsFilesListResult, AgentsListResult, ModelCatalogEntry } from "../types";
import {
  normalizeModelValue,
  parseFallbackList,
  resolveModelOptionsFromCatalog,
  resolveConfiguredProviders,
  filterCatalogByProviders,
  resolveAgentConfig,
  resolveModelFallbacks,
  resolveModelLabel,
  resolveModelPrimary,
} from "./agents-utils";
import type { AddProviderState, AgentsPanel } from "./agents";

const PROVIDER_OPTIONS = [
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "google", label: "Google (Gemini)" },
  { id: "openrouter", label: "OpenRouter" },
  { id: "mistral", label: "Mistral" },
  { id: "xai", label: "xAI (Grok)" },
  { id: "together", label: "Together AI" },
  { id: "groq", label: "Groq" },
  { id: "kilocode", label: "Kilocode" },
  { id: "ollama", label: "Ollama (Local)" },
];

const LOCAL_PROVIDERS = new Set(["ollama"]);

export function renderAgentOverview(params: {
  agent: AgentsListResult["agents"][number];
  basePath: string;
  defaultId: string | null;
  configForm: Record<string, unknown> | null;
  agentFilesList: AgentsFilesListResult | null;
  agentIdentity: AgentIdentityResult | null;
  agentIdentityLoading: boolean;
  agentIdentityError: string | null;
  configLoading: boolean;
  configSaving: boolean;
  configDirty: boolean;
  onConfigReload: () => void;
  onConfigSave: () => void;
  onModelChange: (agentId: string, modelId: string | null) => void;
  onModelFallbacksChange: (agentId: string, fallbacks: string[]) => void;
  onSelectPanel: (panel: AgentsPanel) => void;
  modelCatalog: ModelCatalogEntry[];
  addProvider: AddProviderState;
  onAddProviderOpen: () => void;
  onAddProviderClose: () => void;
  onAddProviderProviderChange: (provider: string) => void;
  onAddProviderKeyChange: (key: string) => void;
  onAddProviderBaseUrlChange: (baseUrl: string) => void;
  onAddProviderSubmit: () => void;
}) {
  const {
    agent,
    configForm,
    agentFilesList,
    configLoading,
    configSaving,
    configDirty,
    onConfigReload,
    onConfigSave,
    onModelChange,
    onModelFallbacksChange,
    onSelectPanel,
    modelCatalog,
    addProvider,
    onAddProviderOpen,
    onAddProviderClose,
    onAddProviderProviderChange,
    onAddProviderKeyChange,
    onAddProviderBaseUrlChange,
    onAddProviderSubmit,
  } = params;
  const config = resolveAgentConfig(configForm, agent.id);
  const workspaceFromFiles =
    agentFilesList && agentFilesList.agentId === agent.id ? agentFilesList.workspace : null;
  const workspace =
    workspaceFromFiles || config.entry?.workspace || config.defaults?.workspace || "default";
  const model = config.entry?.model
    ? resolveModelLabel(config.entry?.model)
    : resolveModelLabel(config.defaults?.model);
  const defaultModel = resolveModelLabel(config.defaults?.model);
  const entryPrimary = resolveModelPrimary(config.entry?.model);
  const defaultPrimary =
    resolveModelPrimary(config.defaults?.model) ||
    (defaultModel !== "-" ? normalizeModelValue(defaultModel) : null);
  const effectivePrimary = entryPrimary ?? defaultPrimary ?? null;
  const modelFallbacks = resolveModelFallbacks(config.entry?.model);
  const fallbackChips = modelFallbacks ?? [];
  const skillFilter = Array.isArray(config.entry?.skills) ? config.entry?.skills : null;
  const skillCount = skillFilter?.length ?? null;
  const isDefault = Boolean(params.defaultId && agent.id === params.defaultId);
  const disabled = !configForm || configLoading || configSaving;

  const removeChip = (index: number) => {
    const next = fallbackChips.filter((_, i) => i !== index);
    onModelFallbacksChange(agent.id, next);
  };

  const handleChipKeydown = (e: KeyboardEvent) => {
    const input = e.target as HTMLInputElement;
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const parsed = parseFallbackList(input.value);
      if (parsed.length > 0) {
        onModelFallbacksChange(agent.id, [...fallbackChips, ...parsed]);
        input.value = "";
      }
    }
  };

  const configuredProviders = resolveConfiguredProviders(configForm);
  const filteredCatalog = filterCatalogByProviders(modelCatalog, configuredProviders);
  const catalogOptions = resolveModelOptionsFromCatalog(filteredCatalog, effectivePrimary ?? undefined);
  const noCatalog = filteredCatalog.length === 0;

  return html`
    <section class="card">
      <div class="card-title">${t("agents.overview.title")}</div>
      <div class="card-sub">${t("agents.overview.sub")}</div>

      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">${t("agents.context.workspace")}</div>
          <div>
            <button
              type="button"
              class="workspace-link mono"
              @click=${() => onSelectPanel("files")}
              title=${t("agents.overview.openFilesTab")}
            >${workspace}</button>
          </div>
        </div>
        <div class="agent-kv">
          <div class="label">${t("agents.context.primaryModel")}</div>
          <div class="mono">${model}</div>
        </div>
        <div class="agent-kv">
          <div class="label">${t("agents.context.skillsFilter")}</div>
          <div>${skillFilter && skillCount != null ? t("agents.context.skillsSelected", { count: String(skillCount) }) : t("agents.context.allSkills")}</div>
        </div>
      </div>

      ${
        configDirty
          ? html`
              <div class="callout warn" style="margin-top: 16px">${t("agents.overview.unsaved")}</div>
            `
          : nothing
      }

      <div class="agent-model-select" style="margin-top: 20px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <div class="label" style="margin-bottom: 0;">${t("agents.overview.modelSelection")}</div>
          <button
            type="button"
            class="btn btn--sm"
            @click=${onAddProviderOpen}
          >${t("agents.overview.addApiProvider")}</button>
        </div>

        ${noCatalog
          ? html`<div class="callout" style="margin-top: 8px; margin-bottom: 8px;">${t("agents.overview.noProviders")}</div>`
          : nothing
        }

        <div class="agent-model-fields">
          <label class="field">
            <span>${isDefault ? t("agents.overview.primaryModelDefault") : t("agents.overview.primaryModel")}</span>
            ${renderUiSelect({
              value: isDefault ? (effectivePrimary ?? "") : (entryPrimary ?? ""),
              disabled: disabled || noCatalog,
              options: [
                ...(!isDefault
                  ? [{
                      value: "",
                      label: defaultPrimary
                        ? t("agents.overview.inheritDefaultWith", { model: defaultPrimary })
                        : t("agents.overview.inheritDefault"),
                    }]
                  : []),
                ...catalogOptions,
              ],
              onChange: (next) => onModelChange(agent.id, next || null),
            })}
          </label>
          <div class="field">
            <span>${t("agents.overview.fallbacks")}</span>
            <div class="agent-chip-input" @click=${(e: Event) => {
              const container = e.currentTarget as HTMLElement;
              const input = container.querySelector("input");
              if (input) {
                input.focus();
              }
            }}>
              ${fallbackChips.map(
                (chip, i) => html`
                  <span class="chip">
                    ${chip}
                    <button
                      type="button"
                      class="chip-remove"
                      ?disabled=${disabled}
                      @click=${() => removeChip(i)}
                    >&times;</button>
                  </span>
                `,
              )}
              <input
                ?disabled=${disabled}
                placeholder=${fallbackChips.length === 0 ? t("agents.overview.fallbackPlaceholder") : ""}
                @keydown=${handleChipKeydown}
                @blur=${(e: Event) => {
                  const input = e.target as HTMLInputElement;
                  const parsed = parseFallbackList(input.value);
                  if (parsed.length > 0) {
                    onModelFallbacksChange(agent.id, [...fallbackChips, ...parsed]);
                    input.value = "";
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div class="agent-model-actions">
          <button type="button" class="btn btn--sm" ?disabled=${configLoading} @click=${onConfigReload}>
            ${t("agents.configActions.reload")}
          </button>
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${configSaving || !configDirty}
            @click=${onConfigSave}
          >
            ${configSaving ? t("agents.configActions.saving") : t("agents.configActions.save")}
          </button>
        </div>
      </div>
    </section>

    ${addProvider.open ? html`
      <div class="add-provider-overlay" @click=${(e: MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains("add-provider-overlay")) {
          onAddProviderClose();
        }
      }}>
        <div class="add-provider-modal card">
          <div class="card-title">${t("agents.overview.addApiProvider")}</div>
          <div class="card-sub" style="margin-bottom: 16px;">${t("agents.overview.addApiProviderSub")}</div>

          <label class="field" style="margin-bottom: 12px;">
            <span>${t("agents.overview.providerLabel")}</span>
            <select
              .value=${addProvider.provider}
              @change=${(e: Event) => onAddProviderProviderChange((e.target as HTMLSelectElement).value)}
            >
              ${PROVIDER_OPTIONS.map(
                (p) => html`<option value=${p.id} ?selected=${p.id === addProvider.provider}>${p.label}</option>`
              )}
            </select>
          </label>

          ${LOCAL_PROVIDERS.has(addProvider.provider) ? html`
            <label class="field" style="margin-bottom: 16px;">
              <span>${t("agents.overview.baseUrlLabel")}</span>
              <input
                type="text"
                .value=${addProvider.baseUrl}
                placeholder=${t("agents.overview.baseUrlPlaceholder")}
                ?disabled=${addProvider.busy}
                @input=${(e: Event) => onAddProviderBaseUrlChange((e.target as HTMLInputElement).value)}
                @keydown=${(e: KeyboardEvent) => {
                  if (e.key === "Enter" && !addProvider.busy && addProvider.baseUrl.trim()) {
                    onAddProviderSubmit();
                  }
                }}
              />
            </label>
          ` : html`
            <label class="field" style="margin-bottom: 16px;">
              <span>${t("agents.overview.apiKeyLabel")}</span>
              <input
                type="password"
                .value=${addProvider.key}
                placeholder=${t("agents.overview.apiKeyPlaceholder")}
                ?disabled=${addProvider.busy}
                @input=${(e: Event) => onAddProviderKeyChange((e.target as HTMLInputElement).value)}
                @keydown=${(e: KeyboardEvent) => {
                  if (e.key === "Enter" && !addProvider.busy && addProvider.key.trim()) {
                    onAddProviderSubmit();
                  }
                }}
              />
            </label>
          `}

          ${addProvider.error
            ? html`<div class="callout danger" style="margin-bottom: 12px;">${addProvider.error}</div>`
            : nothing
          }

          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button
              type="button"
              class="btn btn--sm"
              ?disabled=${addProvider.busy}
              @click=${onAddProviderClose}
            >${t("agents.overview.cancel")}</button>
            <button
              type="button"
              class="btn btn--sm primary"
              ?disabled=${addProvider.busy || (LOCAL_PROVIDERS.has(addProvider.provider) ? !addProvider.baseUrl.trim() : !addProvider.key.trim())}
              @click=${onAddProviderSubmit}
            >
              ${addProvider.busy ? t("agents.overview.saving") : t("agents.overview.addApiProviderConfirm")}
            </button>
          </div>
        </div>
      </div>
    ` : nothing}
  `;
}
