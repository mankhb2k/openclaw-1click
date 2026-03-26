import { html, nothing } from "lit";
import { t } from "../../i18n/index";
import { renderUiSelect } from "../components/ui-select";
import type { EventLogEntry } from "../app-events";
import { formatEventPayload } from "../presenter";

export type DebugProps = {
  loading: boolean;
  status: Record<string, unknown> | null;
  health: Record<string, unknown> | null;
  models: unknown[];
  heartbeat: unknown;
  eventLog: EventLogEntry[];
  methods: string[];
  callMethod: string;
  callParams: string;
  callResult: string | null;
  callError: string | null;
  onCallMethodChange: (next: string) => void;
  onCallParamsChange: (next: string) => void;
  onRefresh: () => void;
  onCall: () => void;
};

export function renderDebug(props: DebugProps) {
  const securityAudit =
    props.status && typeof props.status === "object"
      ? (props.status as { securityAudit?: { summary?: Record<string, number> } }).securityAudit
      : null;
  const securitySummary = securityAudit?.summary ?? null;
  const critical = securitySummary?.critical ?? 0;
  const warn = securitySummary?.warn ?? 0;
  const info = securitySummary?.info ?? 0;
  const securityTone = critical > 0 ? "danger" : warn > 0 ? "warn" : "success";
  const securityLabelText =
    critical > 0
      ? t("debugPage.security.critical", { count: String(critical) })
      : warn > 0
        ? t("debugPage.security.warnings", { count: String(warn) })
        : t("debugPage.security.none");
  const securityInfoSuffix =
    info > 0 ? t("debugPage.security.infoSuffix", { count: String(info) }) : "";

  return html`
    <section class="grid">
      <div class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">${t("debugPage.snapshots.title")}</div>
            <div class="card-sub">${t("debugPage.snapshots.subtitle")}</div>
          </div>
          <button class="btn" ?disabled=${props.loading} @click=${props.onRefresh}>
            ${props.loading ? t("debugPage.refreshing") : t("debugPage.refresh")}
          </button>
        </div>
        <div class="stack" style="margin-top: 12px;">
          <div>
            <div class="muted">${t("debugPage.status")}</div>
            ${
              securitySummary
                ? html`<div class="callout ${securityTone}" style="margin-top: 8px;">
                  ${t("debugPage.security.auditPrefix")} ${securityLabelText}${securityInfoSuffix}.
                  ${t("debugPage.security.runPrefix")}
                  <span class="mono">openclaw security audit --deep</span>
                  ${t("debugPage.security.runSuffix")}
                </div>`
                : nothing
            }
            <pre class="code-block">${JSON.stringify(props.status ?? {}, null, 2)}</pre>
          </div>
          <div>
            <div class="muted">${t("debugPage.health")}</div>
            <pre class="code-block">${JSON.stringify(props.health ?? {}, null, 2)}</pre>
          </div>
          <div>
            <div class="muted">${t("debugPage.lastHeartbeat")}</div>
            <pre class="code-block">${JSON.stringify(props.heartbeat ?? {}, null, 2)}</pre>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">${t("debugPage.manualRpc.title")}</div>
        <div class="card-sub">${t("debugPage.manualRpc.subtitle")}</div>
        <div class="stack" style="margin-top: 16px;">
          <label class="field">
            <span>${t("debugPage.method")}</span>
            ${renderUiSelect({
              value: props.callMethod,
              options: [
                ...(!props.callMethod
                  ? [{ value: "", label: t("debugPage.selectMethod"), disabled: true }]
                  : []),
                ...props.methods.map((m) => ({ value: m, label: m })),
              ],
              onChange: (next) => props.onCallMethodChange(next),
            })}
          </label>
          <label class="field">
            <span>${t("debugPage.paramsJson")}</span>
            <textarea
              .value=${props.callParams}
              @input=${(e: Event) =>
                props.onCallParamsChange((e.target as HTMLTextAreaElement).value)}
              rows="6"
            ></textarea>
          </label>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn primary" @click=${props.onCall}>${t("debugPage.call")}</button>
        </div>
        ${
          props.callError
            ? html`<div class="callout danger" style="margin-top: 12px;">
              ${props.callError}
            </div>`
            : nothing
        }
        ${
          props.callResult
            ? html`<pre class="code-block" style="margin-top: 12px;">${props.callResult}</pre>`
            : nothing
        }
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">${t("debugPage.models.title")}</div>
      <div class="card-sub">${t("debugPage.models.subtitle")}</div>
      <pre class="code-block" style="margin-top: 12px;">${JSON.stringify(
        props.models ?? [],
        null,
        2,
      )}</pre>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">${t("debugPage.eventLog.title")}</div>
      <div class="card-sub">${t("debugPage.eventLog.subtitle")}</div>
      ${
        props.eventLog.length === 0
          ? html`
              <div class="muted" style="margin-top: 12px">${t("debugPage.eventLog.empty")}</div>
            `
          : html`
            <div class="list debug-event-log" style="margin-top: 12px;">
              ${props.eventLog.map(
                (evt) => html`
                  <div class="list-item debug-event-log__item">
                    <div class="list-main">
                      <div class="list-title">${evt.event}</div>
                      <div class="list-sub">${new Date(evt.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta debug-event-log__meta">
                      <pre class="code-block debug-event-log__payload">${formatEventPayload(
                        evt.payload,
                      )}</pre>
                    </div>
                  </div>
                `,
              )}
            </div>
          `
      }
    </section>
  `;
}
