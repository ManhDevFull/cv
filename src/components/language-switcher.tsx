import Link from "next/link";
import { LanguageCode, supportedLanguages } from "@/lib/i18n";

type Props = {
  currentLang: LanguageCode;
  slug?: string;
  align?: "left" | "right";
};

export function LanguageSwitcher({ currentLang, slug, align = "right" }: Props) {
  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      {supportedLanguages.map((lang) => {
        const isActive = lang === currentLang;
        return (
          <Link
            key={lang}
            href={slug ? `/${lang}/${slug}` : `/${lang}`}
            className={`win95-button px-3 py-1 text-[11px] tracking-[0.08em] ${
              isActive
                ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--border-strong)]"
                : "bg-[var(--panel)] text-[var(--foreground)]"
            }`}
            prefetch
          >
            {lang.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
