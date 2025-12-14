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

const cardClass = "brutal-card";

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

function SectionShell({ section, children }: { section: SectionView; children: ReactNode }) {
  return (
    <section id={section.key} className="brutal-section">
      <div className="brutal-section__header">
        <span className="brutal-section__eyebrow">{section.translation?.subtitle ?? section.key}</span>
        <h3 className="brutal-section__title">{section.translation?.title ?? section.key}</h3>
        {section.translation?.description ? (
          <p className="brutal-section__desc">{section.translation.description}</p>
        ) : null}
      </div>
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
      <div className={`${cardClass} brutal-card--soft grid gap-6 lg:grid-cols-[1.5fr,1fr]`}>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-black leading-tight">{item.translation?.title}</h3>
            {item.translation?.subtitle ? (
              <p className="font-semibold text-[var(--muted)]">{item.translation.subtitle}</p>
            ) : null}
            {item.translation?.description ? (
              <p className="brutal-caption">{item.translation.description}</p>
            ) : null}
          </div>

          {tags.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={String(tag)} className="brutal-tag">
                  {String(tag)}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {location ? (
              <span className="brutal-meta__item">
                <span className="text-[0.72rem] uppercase tracking-[0.14em] font-black">Location</span>
                <span className="ml-2 font-semibold">{location}</span>
              </span>
            ) : null}
            {availability ? (
              <span className="brutal-meta__item">
                <span className="text-[0.72rem] uppercase tracking-[0.14em] font-black">
                  Availability
                </span>
                <span className="ml-2 font-semibold">{availability}</span>
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <ActionButton key={String(action.key ?? action.label)} action={action} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {stats.length ? (
            <div className="brutal-stats">
              {stats.map((stat, idx) => (
                <div key={idx} className="brutal-stat">
                  <p className="brutal-stat__label">{String(stat.label ?? "Stat")}</p>
                  <p className="brutal-stat__value">{String(stat.value ?? "-")}</p>
                </div>
              ))}
            </div>
          ) : null}

          {highlights.length ? (
            <div className="space-y-2">
              <p className="brutal-card__title">Highlights</p>
              <ul className="brutal-list">
                {highlights.map((highlight, idx) => (
                  <li key={idx} className="brutal-highlight">
                    <span className="brutal-highlight__icon" aria-hidden />
                    <span>{String(highlight.label ?? highlight)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}

function TimelineSection({ section }: SectionRendererProps) {
  return (
    <SectionShell section={section}>
      <div className="brutal-list">
        {section.items.map((item) => (
          <div key={item.id} className={`${cardClass} brutal-card--soft brutal-rail`}>
            <span className="brutal-rail__dot" aria-hidden />
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="brutal-card__title">{item.translation?.title ?? item.itemType}</h3>
                  {item.translation?.subtitle ? (
                    <p className="brutal-card__subtitle">{item.translation.subtitle}</p>
                  ) : null}
                </div>
                <MetadataBadge item={item} keys={["startDate", "endDate"]} />
              </div>
              {item.translation?.description ? (
                <p className="brutal-caption">{item.translation.description}</p>
              ) : null}
              <MetadataList
                metadata={item.metadata}
                order={(section.uiConfig.showMetadataKeys as string[]) ?? []}
                omit={["actions", "highlights", "startDate", "endDate"]}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function CardsSection({ section }: SectionRendererProps) {
  const columns = Number(section.uiConfig.columns ?? 2);
  const gridCols = columns >= 3 ? "brutal-grid--three" : "brutal-grid--two";
  return (
    <SectionShell section={section}>
      <div className={`brutal-grid ${gridCols}`}>
        {section.items.map((item) => (
          <div key={item.id} className={`${cardClass} space-y-3`}>
            <div className="space-y-1">
              <h3 className="brutal-card__title">{item.translation?.title ?? item.itemType}</h3>
              {item.translation?.subtitle ? (
                <p className="brutal-card__subtitle">{item.translation.subtitle}</p>
              ) : null}
            </div>
            {item.translation?.description ? (
              <p className="brutal-caption">{item.translation.description}</p>
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
  const gridCols = columns >= 3 ? "brutal-grid--three" : "brutal-grid--two";
  return (
    <SectionShell section={section}>
      <div className={`brutal-grid ${gridCols}`}>
        {section.items.map((item) => (
          <div key={item.id} className="brutal-card brutal-card--soft space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="brutal-card__title">{item.translation?.title ?? item.itemType}</p>
              {item.metadata?.level ? (
                <span className="brutal-pill">{String(item.metadata.level)}</span>
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
  const gridCols = columns >= 4 ? "brutal-grid--four" : "brutal-grid--two";
  return (
    <SectionShell section={section}>
      <div className={`brutal-grid ${gridCols}`}>
        {section.items.map((item) => (
          <div
            key={item.id}
            className={`${cardClass} brutal-card--soft flex items-center gap-3`}
          >
            <div
              className="flex h-11 w-11 items-center justify-center text-sm font-black bg-[var(--panel)] shadow-[var(--shadow-sm)]"
              style={{ border: "var(--border-regular) solid var(--ink)" }}
            >
              {String(
                (item.metadata.icon as string) ?? (item.translation?.title ?? item.itemType),
              )[0]}
            </div>
            <div className="min-w-0">
              <p className="brutal-card__title truncate">{item.translation?.title ?? item.itemType}</p>
              {item.translation?.subtitle ? (
                <p className="brutal-card__subtitle truncate">{item.translation.subtitle}</p>
              ) : null}
              {item.metadata.url ? (
                <Link
                  href={String(item.metadata.url)}
                  className="font-semibold underline decoration-[var(--accent-2)] underline-offset-4"
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
      <div className="brutal-list">
        {section.items.map((item) => (
          <div key={item.id} className={`${cardClass} space-y-2`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="brutal-card__title">{item.translation?.title ?? item.itemType}</p>
              {item.translation?.subtitle ? (
                <p className="brutal-card__subtitle">{item.translation.subtitle}</p>
              ) : null}
            </div>
            {item.translation?.description ? (
              <p className="brutal-caption">{item.translation.description}</p>
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
    <div className="brutal-meta__item flex flex-col">
      <span className="text-[0.72rem] uppercase tracking-[0.14em] font-black">Timeline</span>
      <span className="font-semibold">
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
    <div className="flex flex-wrap gap-2">
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
        <div className="brutal-meta__item flex flex-col gap-1">
          <span className="text-[0.72rem] uppercase tracking-[0.14em] font-black">{label}</span>
          <div className="flex flex-wrap gap-1.5">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={typeof link.href === "string" ? link.href : String(link.href ?? "#")}
                className="underline decoration-[var(--accent-2)] font-semibold underline-offset-4"
              >
                {String(link.label ?? link.href ?? "Link")}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="brutal-meta__item flex flex-col gap-1">
        <span className="text-[0.72rem] uppercase tracking-[0.14em] font-black">{label}</span>
        <span className={`font-semibold ${compact ? "text-sm" : "text-base"}`}>
          {(value as unknown[]).map((item) => String(item)).join(" / ")}
        </span>
      </div>
    );
  }

  if (typeof value === "object") {
    if (!value) return null;
    return (
      <div className="brutal-meta__item flex flex-col gap-1">
        <span className="text-[0.72rem] uppercase tracking-[0.14em] font-black">{label}</span>
        <pre className="whitespace-pre-wrap break-words text-xs font-mono">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="brutal-meta__item flex flex-col gap-1">
      <span className="text-[0.72rem] uppercase tracking-[0.14em] font-black">{label}</span>
      <span className={`font-semibold ${compact ? "text-sm" : "text-base"}`}>{String(value)}</span>
    </div>
  );
}

function ActionButton({ action }: { action: ActionMeta }) {
  const label = action.label ?? action.key ?? "Action";
  const href = typeof action.href === "string" ? action.href : "#";
  const variant = String(action.variant ?? "primary");
  const variantClass =
    variant === "ghost"
      ? "brutal-button--ghost"
      : variant === "danger"
        ? "brutal-button--danger"
        : "brutal-button--primary";
  return (
    <Link href={href} className={`brutal-button ${variantClass}`}>
      {String(label)}
    </Link>
  );
}
