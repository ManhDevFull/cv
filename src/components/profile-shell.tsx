import { LanguageSwitcher } from "./language-switcher";
import { SectionRenderer } from "./section-renderer";
import { ThemeToggle } from "./theme-toggle";
import type { ReactNode } from "react";
import type { ProfilePayload, ProfileView } from "@/lib/profile";

export function ProfileShell({ data }: { data: ProfilePayload }) {
  const { profile, sections, language } = data;
  const metadataTags = buildProfileMeta(profile.metadata, profile.level);
  const quickFacts = buildQuickFacts(profile);

  return (
    <div className="brutal-backdrop">
      <div className="brutal-container">
        <div className="brutal-toolbar">
          <div className="brutal-toolbar__group">
            <span className="brutal-pill">Data-driven CV</span>
            <span className="brutal-pill">/{language}</span>
          </div>
          <div className="brutal-toolbar__group">
            <ThemeToggle />
            <LanguageSwitcher currentLang={language} />
          </div>
        </div>

        <div className="brutal-frame space-y-6">
          <header className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="brutal-section__eyebrow">Profile</span>
              </div>
              <div className="space-y-2">
                <h1 className="brutal-title">{profile.fullName}</h1>
                {profile.headline ? <p className="brutal-lead">{profile.headline}</p> : null}
              </div>
              {profile.summary ? <p className="brutal-caption">{profile.summary}</p> : null}
              {metadataTags.length > 0 ? <div className="brutal-meta">{metadataTags}</div> : null}
            </div>

            <div className="brutal-card brutal-card--soft space-y-3">
              <p className="brutal-card__title">Snapshot</p>
              <div className="brutal-stats">
                {quickFacts.map((fact) => (
                  <div key={fact.label} className="brutal-stat">
                    <p className="brutal-stat__label">{fact.label}</p>
                    <p className="brutal-stat__value">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <div className="brutal-divider" />

          <div className="flex flex-col gap-4">
            {sections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function buildQuickFacts(profile: ProfileView) {
  const facts: { label: string; value: string }[] = [];
  const location = safeText(profile.metadata?.location);
  const focus = Array.isArray(profile.metadata?.focus)
    ? (profile.metadata?.focus as unknown[]).slice(0, 3).join(" / ")
    : safeText(profile.metadata?.focus);
  const availability = safeText(profile.metadata?.availability);

  if (profile.level) facts.push({ label: "Level", value: profile.level });
  if (location) facts.push({ label: "Location", value: location });
  if (availability) facts.push({ label: "Availability", value: availability });
  if (focus) facts.push({ label: "Focus", value: focus });

  return facts.slice(0, 4);
}

function buildProfileMeta(metadata?: Record<string, unknown> | null, level?: string) {
  if (!metadata && !level) return [];
  const entries = Object.entries(metadata ?? {}).filter(
    ([, value]) => value !== null && value !== undefined,
  );
  const lines: ReactNode[] = [];
  if (level) {
    lines.push(
      <span key="level" className="brutal-tag">
        <span className="text-[0.72rem] uppercase tracking-[0.14em] font-black">Level</span>
        <span className="font-semibold">{level}</span>
      </span>,
    );
  }
  for (const [key, value] of entries) {
    const content = Array.isArray(value) ? value.join(", ") : String(value);
    lines.push(
      <span key={key} className="brutal-tag">
        <span className="text-[0.72rem] uppercase tracking-[0.14em] font-black">
          {prettyLabel(key)}
        </span>
        <span className="font-semibold">{content}</span>
      </span>,
    );
  }
  return lines;
}

function prettyLabel(text: string) {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function safeText(value: unknown | null | undefined) {
  return value === null || value === undefined ? undefined : String(value);
}
