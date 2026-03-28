import { html, nothing } from "lit";
import { icons } from "../icons";
import { formatPresenceAge } from "../presenter";
import type { DesktopUpdatePhase, DesktopUpdateState, PresenceEntry } from "../types";
import { t } from "../../i18n/index";

export type InstancesProps = {
  loading: boolean;
  entries: PresenceEntry[];
  lastError: string | null;
  statusMessage: string | null;
  onRefresh: () => void;
  /** True when running inside OpenClaw Desktop (Electron preload bridge). */
  desktopShell: boolean;
  /** Packaged app version from Electron (`app.getVersion()`), when known. */
  desktopAppVersion: string | null;
  desktopInstancesUpdate: InstancesDesktopUpdateProps | null;
};

export type InstancesDesktopUpdateProps = {
  availableVersion: string;
  announcementTitle: string | null;
  announcementDescription: string | null;
  phase: DesktopUpdatePhase;
  progressPercent: number | null;
  updateRunning: boolean;
  connected: boolean;
  onUpdate: () => void;
};

export function buildDesktopInstancesUpdateProps(
  du: DesktopUpdateState | null,
  updateRunning: boolean,
  connected: boolean,
  onUpdate: () => void,
): InstancesDesktopUpdateProps | null {
  if (!du?.enabled || !du.isPackaged) {
    return null;
  }
  const v = du.availableVersion;
  const cur = du.currentVersion;
  if (!v || v === cur) {
    return null;
  }
  if (du.phase !== "available" && du.phase !== "downloading" && du.phase !== "downloaded") {
    return null;
  }
  return {
    availableVersion: v,
    announcementTitle: du.announcementTitle,
    announcementDescription: du.announcementDescription,
    phase: du.phase,
    progressPercent: du.progressPercent,
    updateRunning,
    connected,
    onUpdate,
  };
}

let hostsRevealed = false;

function localizeRelativeAge(value: string): string {
  const s = value.trim();
  if (s === "n/a") {
    return t("common.na");
  }
  if (s === "Just now") {
    return t("instances.relativeTime.justNow");
  }
  if (s === "Yesterday") {
    return t("instances.relativeTime.yesterday");
  }
  const match = /^(\d+)([smhdw]) ago$/.exec(s);
  if (!match) {
    return value;
  }
  const count = match[1];
  const unitCode = match[2];
  const unit =
    unitCode === "s"
      ? t("instances.relativeTime.units.s")
      : unitCode === "m"
        ? t("instances.relativeTime.units.m")
        : unitCode === "h"
          ? t("instances.relativeTime.units.h")
          : unitCode === "d"
            ? t("instances.relativeTime.units.d")
            : unitCode === "w"
              ? t("instances.relativeTime.units.w")
              : unitCode;
  return t("instances.relativeTime.value", { count, unit });
}

function renderDesktopUpdateBar(props: InstancesDesktopUpdateProps) {
  const readyToRestart =
    props.phase === "downloaded" ||
    (props.phase === "downloading" && (props.progressPercent ?? 0) >= 100);
  const disabled =
    props.phase === "downloaded"
      ? props.updateRunning
      : !props.connected || props.updateRunning;
  const label = readyToRestart
    ? t("desktopUpdate.installButton")
    : props.phase === "downloading"
      ? `${t("desktopUpdate.downloading")}${
          props.progressPercent != null
            ? ` ${Math.round(props.progressPercent)}%`
            : ""
        }`
      : props.updateRunning
        ? t("desktopUpdate.updatingButton")
        : t("instances.desktopUpdate.updateButton");

  return html`
    <div class="instances-desktop-update" role="region" aria-label=${t("instances.desktopUpdate.regionAria")}>
      <div class="instances-desktop-update__body">
        <div class="instances-desktop-update__title">
          ${
            props.announcementTitle?.trim()
              ? props.announcementTitle
              : t("instances.desktopUpdate.fallbackTitle", { version: props.availableVersion })
          }
        </div>
        ${
          props.announcementDescription?.trim()
            ? html`<div class="instances-desktop-update__notes muted">${props.announcementDescription}</div>`
            : nothing
        }
      </div>
      <button class="btn primary instances-desktop-update__btn" ?disabled=${disabled} @click=${props.onUpdate}>
        ${label}
      </button>
    </div>
  `;
}

export function renderInstances(props: InstancesProps) {
  const masked = !hostsRevealed;

  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">${t("instances.connectedInstances.title")}</div>
          <div class="card-sub">${t("instances.connectedInstances.subtitle")}</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button
            class="btn btn--icon ${masked ? "" : "active"}"
            @click=${() => {
              hostsRevealed = !hostsRevealed;
              props.onRefresh();
            }}
            title=${masked ? t("instances.toggleHosts.show") : t("instances.toggleHosts.hide")}
            aria-label=${t("instances.toggleHosts.ariaLabel")}
            aria-pressed=${!masked}
            style="width: 36px; height: 36px;"
          >
            ${masked ? icons.eyeOff : icons.eye}
          </button>
          <button class="btn" ?disabled=${props.loading} @click=${props.onRefresh}>
            ${props.loading ? t("instances.loading") : t("common.refresh")}
          </button>
        </div>
      </div>
      ${
        props.lastError
          ? html`<div class="callout danger" style="margin-top: 12px;">
            ${props.lastError}
          </div>`
          : nothing
      }
      ${
        props.statusMessage
          ? html`<div class="callout" style="margin-top: 12px;">
            ${props.statusMessage}
          </div>`
          : nothing
      }
      ${props.desktopInstancesUpdate ? renderDesktopUpdateBar(props.desktopInstancesUpdate) : nothing}
      <div class="list" style="margin-top: 16px;">
        ${
          props.entries.length === 0
            ? html`
                <div class="muted">${t("instances.empty")}</div>
              `
            : props.entries.map((entry) =>
                renderEntry(entry, masked, {
                  desktopShell: props.desktopShell,
                  desktopAppVersion: props.desktopAppVersion,
                }),
              )
        }
      </div>
    </section>
  `;
}

function renderEntry(
  entry: PresenceEntry,
  masked: boolean,
  opts: { desktopShell: boolean; desktopAppVersion: string | null },
) {
  const lastInput =
    entry.lastInputSeconds != null
      ? localizeRelativeAge(`${entry.lastInputSeconds}s ago`)
      : t("common.na");
  const mode = entry.mode ?? t("instances.unknownMode");
  const isDesktopGateway =
    opts.desktopShell && (entry.mode ?? "").toLowerCase().trim() === "gateway";
  const host = isDesktopGateway
    ? t("instances.desktopGatewayTitle")
    : (entry.host ?? t("instances.unknownHost"));
  const ip = entry.ip ?? null;
  const roles = Array.isArray(entry.roles) ? entry.roles.filter(Boolean) : [];
  const scopes = Array.isArray(entry.scopes) ? entry.scopes.filter(Boolean) : [];
  const scopesLabel =
    scopes.length > 0
      ? scopes.length > 3
        ? t("instances.scopes.count", { count: String(scopes.length) })
        : t("instances.scopes.list", { scopes: scopes.join(", ") })
      : null;
  const versionForDisplay =
    isDesktopGateway && opts.desktopAppVersion ? opts.desktopAppVersion : (entry.version ?? "");
  return html`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          <span class="${masked && !isDesktopGateway ? "redacted" : ""}">${host}</span>
        </div>
        <div class="list-sub">
          ${ip ? html`<span class="${masked ? "redacted" : ""}">${ip}</span> ` : nothing}${mode}
          ${versionForDisplay ? ` ${versionForDisplay}` : ""}
        </div>
        <div class="chip-row">
          <span class="chip">${mode}</span>
          ${roles.map((role) => html`<span class="chip">${role}</span>`)}
          ${scopesLabel ? html`<span class="chip">${scopesLabel}</span>` : nothing}
          ${entry.platform ? html`<span class="chip">${entry.platform}</span>` : nothing}
          ${entry.deviceFamily ? html`<span class="chip">${entry.deviceFamily}</span>` : nothing}
          ${
            entry.modelIdentifier
              ? html`<span class="chip">${entry.modelIdentifier}</span>`
              : nothing
          }
          ${versionForDisplay ? html`<span class="chip">${versionForDisplay}</span>` : nothing}
        </div>
      </div>
      <div class="list-meta">
        <div>${localizeRelativeAge(formatPresenceAge(entry))}</div>
        <div class="muted">${t("instances.labels.lastInput", { value: lastInput })}</div>
        <div class="muted">
          ${entry.reason?.trim()
            ? t("instances.labels.reason", { value: entry.reason.trim() })
            : t("instances.labels.reasonUnknown")}
        </div>
      </div>
    </div>
  `;
}
