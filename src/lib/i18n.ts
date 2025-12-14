export const supportedLanguages = ["vi", "en", "ru"] as const;

export type LanguageCode = (typeof supportedLanguages)[number];

export const defaultLanguage: LanguageCode = "vi";

export function isSupportedLanguage(value?: string | null): value is LanguageCode {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return supportedLanguages.includes(normalized as LanguageCode);
}

export function normalizeLanguage(value?: string): LanguageCode {
  const normalized = value?.trim().toLowerCase();
  if (isSupportedLanguage(normalized)) {
    return normalized as LanguageCode;
  }
  return defaultLanguage;
}
