import Link from "next/link";
import type { ReactNode } from "react";
import type { SectionItemView, SectionView } from "@/lib/profile";

type SectionRendererProps = {
  section: SectionView;
};

type StatMeta = { label?: unknown; value?: unknown };
type HighlightMeta = { label?: unknown; icon?: unknown };
type ActionMeta = { key?: unknown; label?: unknown; href?: unknown; variant?: unknown };

const asArrayOf = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);
const safeText = (value: unknown | null | undefined) =>
  value === null || value === undefined ? undefined : String(value);

const cardClass =
  "win95-window frame-medium bg-[var(--panel)] p-4 text-[var(--foreground)]";

export function SectionRenderer({ section }: SectionRendererProps) {
  if (!section.isActive) return null;

  const variant = (section.uiConfig.variant as string) ?? "cards";

  switch (variant) {
    case "hero":
      return <HeroSection section={section} />;
    case "timeline":
      return <TimelineSection section={section} />;
    case "badges":
      return <BadgesSection section={section} />;
    case "icons":
      return <IconsSection section={section} />;
    case "list":
      return <ListSection section={section} />;
    default:
      return <CardsSection section={section} />;
  }
}

function SectionShell({
  section,
  children,
}: {
  section: SectionView;
  children: ReactNode;
}) {
  return (
    <section id={section.key} className="space-y-2">
      <header className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground)]/85">
          {section.translation?.subtitle ?? section.key}
        </p>
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            {section.translation?.title ?? section.key}
          </h2>
          {section.translation?.description ? (
            <p className="text-xs text-[var(--foreground)]/70">{section.translation.description}</p>
          ) : null}
        </div>
      </header>
      {children}
    </section>
  );
}

function HeroSection({ section }: SectionRendererProps) {
  const item = section.items[0];
  if (!item) return null;

  const stats = asArrayOf<StatMeta>(section.metadata?.stats);
  const highlights = asArrayOf<HighlightMeta>(item.metadata?.highlights);
  const actions = asArrayOf<ActionMeta>(item.metadata?.actions);
  const tags = asArrayOf<string | number>(item.metadata?.tags);
  const locationSource =
    item.metadata?.location ??
    section.translation?.metadata?.location ??
    item.translation?.metadata?.location;
  const availabilitySource =
    item.metadata?.availability ??
    section.translation?.metadata?.availability ??
    item.translation?.metadata?.availability;
  const location = typeof locationSource === "string" ? locationSource : safeText(locationSource);
  const availability =
    typeof availabilitySource === "string" ? availabilitySource : safeText(availabilitySource);

  return (
    <SectionShell section={section}>
      <div className="grid gap-4 border-[3px] border-[var(--border-strong)] bg-[var(--panel)] p-5 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
              {item.translation?.title}
            </h1>
            <p className="text-sm font-semibold text-[var(--foreground)]/85">
              {item.translation?.subtitle}
            </p>
            <p className="text-sm text-[var(--foreground)]/80">{item.translation?.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={String(tag)}
                className="win95-button px-2 py-1 text-[11px]"
              >
                {String(tag)}
              </span>
            ))}
          </div>
          <div className="space-y-3">
            {location ? (
              <div className="flex items-center gap-2 text-sm text-[var(--foreground)]/80">
                <span className="h-2 w-2 bg-[var(--foreground)]" />
                {location}
              </div>
            ) : null}
            {availability ? (
              <div className="flex items-center gap-2 text-sm text-[var(--foreground)]/85">
                <span className="h-2 w-2 bg-[var(--foreground)]" />
                {availability}
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <ActionButton key={String(action.key ?? action.label)} action={action} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2 border-[2px] border-[var(--border-medium)] bg-[var(--panel)] p-3 soft-shadow-light sm:grid-cols-2">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1 border-[1px] border-[var(--border-light)] bg-[var(--panel)] p-2">
                <p className="text-[11px] text-[var(--foreground)]/75">{String(stat.label ?? "Stat")}</p>
                <p className="text-base font-semibold text-[var(--foreground)]">
                  {String(stat.value ?? "-")}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-[2px] border-[var(--border-medium)] bg-[var(--panel)] p-3">
            <p className="text-sm font-semibold text-[var(--foreground)]">Highlights</p>
            <ul className="space-y-2">
              {highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[var(--foreground)]/80">
                  <span className="mt-1 h-2 w-2 bg-[var(--foreground)]" />
                  <span>{String(highlight.label ?? highlight)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function TimelineSection({ section }: SectionRendererProps) {
  return (
    <SectionShell section={section}>
      <div className="space-y-6">
        {section.items.map((item, idx) => (
          <div key={item.id} className="relative">
            {idx !== section.items.length - 1 ? (
              <span className="absolute left-3 top-8 h-full w-px bg-[var(--border)]" aria-hidden />
            ) : null}
            <div className={`${cardClass} relative grid gap-3 sm:grid-cols-[auto,1fr]`}>
              <div className="flex h-6 w-6 items-center justify-center border-2 border-[var(--border-strong)] bg-[var(--panel)] text-xs font-bold text-[var(--foreground)]">
                {idx + 1}
              </div>
              <div className="space-y-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-[var(--foreground)]">
                      {item.translation?.title ?? item.itemType}
                    </h3>
                    {item.translation?.subtitle ? (
                      <p className="text-sm text-[var(--foreground)]/75">{item.translation.subtitle}</p>
                    ) : null}
                  </div>
                  <MetadataBadge item={item} keys={["startDate", "endDate"]} />
                </div>
                {item.translation?.description ? (
                  <p className="text-sm text-[var(--foreground)]/85">{item.translation.description}</p>
                ) : null}
                <MetadataList
                  metadata={item.metadata}
                  order={(section.uiConfig.showMetadataKeys as string[]) ?? []}
                  omit={["actions", "highlights", "startDate", "endDate"]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function CardsSection({ section }: SectionRendererProps) {
  const columns = Number(section.uiConfig.columns ?? 2);
  const gridCols = columns >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <SectionShell section={section}>
          <div className={`grid gap-3 ${gridCols}`}>
            {section.items.map((item) => (
              <div key={item.id} className={`${cardClass} space-y-3`}>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {item.translation?.title ?? item.itemType}
              </h3>
              {item.translation?.subtitle ? (
                <p className="text-sm text-[var(--foreground)]/80">{item.translation.subtitle}</p>
              ) : null}
            </div>
            {item.translation?.description ? (
              <p className="text-sm text-[var(--foreground)]/85">{item.translation.description}</p>
            ) : null}
            <MetadataList
              metadata={item.metadata}
              order={(section.uiConfig.showMetadataKeys as string[]) ?? []}
            />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function BadgesSection({ section }: SectionRendererProps) {
  const columns = Number(section.uiConfig.columns ?? 3);
  const gridCols = columns >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <SectionShell section={section}>
          <div className={`grid gap-3 ${gridCols}`}>
            {section.items.map((item) => (
          <div key={item.id} className="frame-medium bg-[var(--panel)] p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {item.translation?.title ?? item.itemType}
              </p>
              {item.metadata?.level ? (
                <span className="tag-chip bg-[var(--panel)] text-[11px]">
                  {String(item.metadata.level)}
                </span>
              ) : null}
            </div>
            <MetadataList metadata={item.metadata} order={["keywords"]} compact />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function IconsSection({ section }: SectionRendererProps) {
  const columns = Number(section.uiConfig.columns ?? 4);
  const gridCols = columns >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-2";
  return (
    <SectionShell section={section}>
      <div className={`grid gap-3 ${gridCols}`}>
        {section.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 frame-medium bg-[var(--panel)] p-3"
          >
            <div className="flex h-10 w-10 items-center justify-center border-[2px] border-[var(--border-medium)] bg-[var(--panel)] text-sm font-semibold text-[var(--foreground)]">
              {String((item.metadata.icon as string) ?? (item.translation?.title ?? item.itemType))[0]}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                {item.translation?.title ?? item.itemType}
              </p>
              {item.translation?.subtitle ? (
                <p className="truncate text-xs text-[var(--foreground)]/75">{item.translation.subtitle}</p>
              ) : null}
              {item.metadata.url ? (
                <Link
                  href={String(item.metadata.url)}
                  className="text-xs font-medium text-[var(--accent)] hover:outline hover:outline-2 hover:outline-[var(--accent)]"
                >
                  {String(item.metadata.username ?? item.metadata.url)}
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function ListSection({ section }: SectionRendererProps) {
  return (
    <SectionShell section={section}>
      <div className="space-y-3">
        {section.items.map((item) => (
          <div key={item.id} className={`${cardClass} space-y-2`}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-base font-semibold text-[var(--foreground)]">
                {item.translation?.title ?? item.itemType}
              </p>
              {item.translation?.subtitle ? (
                <p className="text-xs text-[var(--foreground)]/75">{item.translation.subtitle}</p>
              ) : null}
            </div>
            {item.translation?.description ? (
              <p className="text-sm text-[var(--foreground)]/85">{item.translation.description}</p>
            ) : null}
            <MetadataList metadata={item.metadata} />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function MetadataBadge({ item, keys }: { item: SectionItemView; keys: string[] }) {
  const start = item.metadata?.[keys[0]];
  const end = item.metadata?.[keys[1]];
  if (!start && !end) return null;
  const startText = start ? String(start) : "-";
  const endText = end ? `-> ${String(end)}` : "-> Present";
  return (
    <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--foreground)]">
      <span className="tag-chip border-[1px] border-[var(--border-medium)] px-2 py-1">
        {startText} {endText}
      </span>
    </div>
  );
}
function prettyLabel(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

type MetadataListProps = {
  metadata?: Record<string, unknown>;
  order?: string[];
  omit?: string[];
  compact?: boolean;
};

function MetadataList({ metadata = {}, order = [], omit = [], compact = false }: MetadataListProps) {
  const entries = Object.entries(metadata).filter(
    ([key, value]) => !omit.includes(key) && value !== null && value !== undefined,
  );

  const sortOrder = (key: string) => {
    const index = order.indexOf(key);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };

  const sorted = entries.sort(([a], [b]) => sortOrder(a) - sortOrder(b));

  if (sorted.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "text-xs" : "text-sm"}`}>
      {sorted.map(([key, value]) => (
        <MetadataValue key={key} label={prettyLabel(key)} value={value} compact={compact} />
      ))}
    </div>
  );
}

function MetadataValue({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: unknown;
  compact?: boolean;
}) {
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    const isLinkArray = value.every(
      (v): v is { href: unknown; label?: unknown } =>
        Boolean(v) && typeof v === "object" && "href" in v,
    );
    if (isLinkArray) {
      const links = value as { href: unknown; label?: unknown }[];
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="tag-chip px-2 py-1 text-[10px] font-semibold">
            {label}
          </span>
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={typeof link.href === "string" ? link.href : String(link.href ?? "#")}
              className="tag-chip px-3 py-1 text-[11px] font-semibold hover:outline hover:outline-2 hover:outline-[var(--accent)]"
            >
              {String(link.label ?? link.href ?? "Link")}
            </Link>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="tag-chip px-2 py-1 text-[10px] font-semibold">
          {label}
        </span>
        {(value as unknown[]).map((item, idx) => (
          <span
            key={idx}
            className="tag-chip px-3 py-1 text-[11px] font-semibold"
          >
            {String(item)}
          </span>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    if (!value) return null;
    return (
      <div className="frame-light bg-[var(--panel)] px-3 py-2 text-xs text-[var(--foreground)]/85">
        <p className="font-semibold text-[var(--foreground)]">{label}</p>
        <pre className="whitespace-pre-wrap break-words text-[11px] text-[var(--foreground)]/75">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="tag-chip px-2 py-1 text-[10px] font-semibold uppercase tracking-wide">
        {label}
      </span>
      <span className={`font-medium text-[var(--foreground)] ${compact ? "text-xs" : "text-sm"}`}>
        {String(value)}
      </span>
    </div>
  );
}

function ActionButton({ action }: { action: ActionMeta }) {
  const label = action.label ?? action.key ?? "Action";
  return (
    <Link
      href={typeof action.href === "string" ? action.href : "#"}
      className="win95-button px-4 py-2 text-sm font-semibold"
    >
      {String(label)}
    </Link>
  );
}
