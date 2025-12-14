export const supportedLanguages = ["vi", "en", "ru"] as const;

export type LanguageCode = (typeof supportedLanguages)[number];

export const defaultLanguage: LanguageCode = "vi";

export function isSupportedLanguage(value?: string | null): value is LanguageCode {
  return Boolean(value) && supportedLanguages.includes(value as LanguageCode);
}

export function normalizeLanguage(value?: string): LanguageCode {
  if (isSupportedLanguage(value)) {
    return value;
  }
  return defaultLanguage;
}
