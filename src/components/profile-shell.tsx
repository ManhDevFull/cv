import { LanguageSwitcher } from "./language-switcher";
import { SectionRenderer } from "./section-renderer";
import { ThemeToggle } from "./theme-toggle";
import type { ProfilePayload } from "@/lib/profile";

export function ProfileShell({ data }: { data: ProfilePayload }) {
  const { profile, sections, language } = data;
  const metadataBadges = buildProfileBadges(profile.metadata);

  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pt-10 sm:px-6 lg:px-8">
        <header className="win95-window frame-strong">
          <div className="win95-titlebar flex items-center justify-between border-b-[3px] border-[var(--border-strong)]">
            <span>Profile</span>
            <div className="flex gap-2">
              <ThemeToggle />
              <LanguageSwitcher currentLang={language} />
            </div>
          </div>
          <div className="px-6 py-5 text-sm">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-extrabold leading-tight text-[var(--foreground)]">
                {profile.fullName}
              </h1>
              {profile.headline ? (
                <p className="text-base font-semibold text-[var(--foreground)]/85">
                  {profile.headline}
                </p>
              ) : null}
            </div>
            {profile.summary ? (
              <p className="mt-3 max-w-3xl text-sm text-[var(--foreground)]/90">{profile.summary}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="win95-button frame-light px-3 py-1 text-[11px] font-semibold shadow-none">
                {profile.level}
              </span>
              {metadataBadges}
            </div>
          </div>
        </header>

        <div className="space-y-10">
          {sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}

function buildProfileBadges(metadata?: Record<string, unknown> | null) {
  if (!metadata) return null;
  return Object.entries(metadata)
    .filter(([, value]) => value !== null && value !== undefined)
    .slice(0, 6)
    .map(([key, value]) => (
      <span
        key={key}
        className="tag-chip text-[11px] font-semibold"
      >
        {formatLabel(key)}: {Array.isArray(value) ? value.join(", ") : String(value)}
      </span>
    ));
}

function formatLabel(text: string) {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
