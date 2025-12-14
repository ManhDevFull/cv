import Link from "next/link";
import { LanguageCode, supportedLanguages } from "@/lib/i18n";

type Props = {
  currentLang: LanguageCode;
  slug?: string;
  align?: "left" | "right";
};

export function LanguageSwitcher({ currentLang, slug, align = "right" }: Props) {
  return (
    <div className={`flex items-center gap-2 ${align === "right" ? "justify-end" : "justify-start"}`}>
      {supportedLanguages.map((lang) => {
        const isActive = lang === currentLang;
        return (
          <Link
            key={lang}
            href={slug ? `/${lang}/${slug}` : `/${lang}`}
            className={`brutal-pill ${isActive ? "is-active" : ""}`}
            prefetch
          >
            {lang.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
