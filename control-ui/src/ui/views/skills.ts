import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import type { SkillMessageMap } from "../controllers/skills";
import { clampText } from "../format";
import type { SkillStatusEntry, SkillStatusReport } from "../types";
import { groupSkills } from "./skills-grouping";
import {
  computeSkillMissing,
  computeSkillReasons,
  renderSkillStatusChips,
} from "./skills-shared";

export type SkillsProps = {
  connected: boolean;
  loading: boolean;
  report: SkillStatusReport | null;
  error: string | null;
  filter: string;
  edits: Record<string, string>;
  busyKey: string | null;
  messages: SkillMessageMap;
  onFilterChange: (next: string) => void;
  onRefresh: () => void;
  onToggle: (skillKey: string, enabled: boolean) => void;
  onEdit: (skillKey: string, value: string) => void;
  onSaveKey: (skillKey: string) => void;
  onInstall: (skillKey: string, name: string, installId: string) => void;
};

export function renderSkills(props: SkillsProps) {
  const skills = props.report?.skills ?? [];
  const filter = props.filter.trim().toLowerCase();
  const filtered = filter
    ? skills.filter((skill) =>
        [skill.name, skill.description, skill.source].join(" ").toLowerCase().includes(filter),
      )
    : skills;
  const groups = groupSkills(filtered);

  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">${t("agents.skills.title")}</div>
          <div class="card-sub">${t("agents.skills.pageSubtitle")}</div>
        </div>
        <button class="btn" ?disabled=${props.loading || !props.connected} @click=${props.onRefresh}>
          ${props.loading ? t("agents.loading") : t("common.refresh")}
        </button>
      </div>

      <div class="filters" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 14px;">
        <a
          class="btn"
          href="https://clawhub.com"
          target="_blank"
          rel="noreferrer"
          title=${t("agents.skills.browseStoreTitle")}
        >${t("agents.skills.browseStore")}</a>
        <label class="field" style="flex: 1; min-width: 180px;">
          <input
            .value=${props.filter}
            @input=${(e: Event) => props.onFilterChange((e.target as HTMLInputElement).value)}
            placeholder=${t("agents.skills.filterPlaceholder")}
            autocomplete="off"
            name="skills-filter"
          />
        </label>
        <div class="muted">${t("agents.skills.shown", { count: String(filtered.length) })}</div>
      </div>

      ${
        props.error
          ? html`<div class="callout danger" style="margin-top: 12px;">${props.error}</div>`
          : nothing
      }

      ${
        filtered.length === 0
          ? html`
              <div class="muted" style="margin-top: 16px">
                ${
                  !props.connected && !props.report
                    ? t("agents.skills.notConnectedGateway")
                    : t("agents.skills.noneFound")
                }
              </div>
            `
          : html`
            <div class="agent-skills-groups" style="margin-top: 16px;">
              ${groups.map((group) => {
                const groupTitleKey = `agents.skills.groups.${group.id}`;
                const groupTitleRaw = t(groupTitleKey);
                const groupTitle = groupTitleRaw === groupTitleKey ? group.label : groupTitleRaw;
                return html`
                  <details class="agent-skills-group" open>
                    <summary class="agent-skills-header">
                      <span>${groupTitle}</span>
                      <span class="muted">${group.skills.length}</span>
                    </summary>
                    <div class="list skills-grid">
                      ${group.skills.map((skill) => renderSkill(skill, props))}
                    </div>
                  </details>
                `;
              })}
            </div>
          `
      }
    </section>
  `;
}

function renderSkill(skill: SkillStatusEntry, props: SkillsProps) {
  const busy = props.busyKey === skill.skillKey;
  const apiKey = props.edits[skill.skillKey] ?? "";
  const message = props.messages[skill.skillKey] ?? null;
  const canInstall = skill.install.length > 0 && skill.missing.bins.length > 0;
  const showBundledBadge = Boolean(skill.bundled && skill.source !== "openclaw-bundled");
  const missing = computeSkillMissing(skill);
  const reasons = computeSkillReasons(skill);
  return html`
    <div class="list-item agent-skill-row skills-page-skill-card">
      <div class="list-main">
        <div class="list-title">
          ${skill.emoji ? `${skill.emoji} ` : ""}${skill.name}
        </div>
        <div class="list-sub">${clampText(skill.description, 140)}</div>
        ${renderSkillStatusChips({ skill, showBundledBadge })}
        ${
          missing.length > 0
            ? html`
              <div class="muted" style="margin-top: 6px;">
                ${t("agents.skills.missingPrefix")} ${missing.join(", ")}
              </div>
            `
            : nothing
        }
        ${
          reasons.length > 0
            ? html`
              <div class="muted" style="margin-top: 6px;">
                ${t("agents.skills.reasonPrefix")} ${reasons.join(", ")}
              </div>
            `
            : nothing
        }
      </div>
      <div class="list-meta skills-page-skill-meta">
        <div class="skills-page-skill-actions">
          <label
            class="cfg-toggle skills-page-skill-toggle"
            title=${!skill.disabled ? t("common.enabled") : t("common.disabled")}
          >
            <input
              type="checkbox"
              .checked=${!skill.disabled}
              ?disabled=${busy || !props.connected}
              aria-label=${t("agents.skills.toggleAria", { name: skill.name })}
              @change=${(e: Event) => {
                const el = e.target as HTMLInputElement;
                props.onToggle(skill.skillKey, el.checked);
              }}
            />
            <span class="cfg-toggle__track"></span>
          </label>
          ${
            canInstall
              ? html`<button
                class="btn"
                ?disabled=${busy}
                @click=${() => props.onInstall(skill.skillKey, skill.name, skill.install[0].id)}
              >
                ${busy ? t("agents.skills.installing") : skill.install[0].label}
              </button>`
              : nothing
          }
        </div>
        ${
          message
            ? html`<div
              class="muted"
              style="margin-top: 8px; color: ${
                message.kind === "error"
                  ? "var(--danger-color, #d14343)"
                  : "var(--success-color, #0a7f5a)"
              };"
            >
              ${message.message}
            </div>`
            : nothing
        }
        ${
          skill.primaryEnv
            ? html`
              <div class="field" style="margin-top: 10px;">
                <span>${t("agents.skills.apiKey")}</span>
                <input
                  type="password"
                  .value=${apiKey}
                  @input=${(e: Event) =>
                    props.onEdit(skill.skillKey, (e.target as HTMLInputElement).value)}
                />
              </div>
              <button
                class="btn primary"
                style="margin-top: 8px;"
                ?disabled=${busy || !Object.hasOwn(props.edits, skill.skillKey)}
                @click=${() => props.onSaveKey(skill.skillKey)}
              >
                ${t("agents.skills.saveKey")}
              </button>
            `
            : nothing
        }
      </div>
    </div>
  `;
}
