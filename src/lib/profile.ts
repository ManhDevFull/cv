import { Language } from "@prisma/client";
import { cache } from "react";
import { defaultLanguage, LanguageCode, normalizeLanguage, supportedLanguages } from "./i18n";
import { prisma } from "./prisma";

export type JsonRecord = Record<string, unknown>;

export type SectionUiConfig = {
  variant?: string;
  columns?: number;
  accent?: string;
  background?: string;
  showMetadataKeys?: string[];
  emphasize?: string;
} & JsonRecord;

export type TranslationFields = {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  metadata?: JsonRecord | null;
};

export type SectionItemView = {
  id: string;
  itemType: string;
  displayOrder: number;
  isActive: boolean;
  metadata: JsonRecord;
  translation?: TranslationFields;
};

export type SectionView = {
  id: string;
  key: string;
  displayOrder: number;
  isActive: boolean;
  uiConfig: SectionUiConfig;
  metadata: JsonRecord;
  translation?: TranslationFields;
  items: SectionItemView[];
};

export type ProfileView = {
  id: string;
  slug: string;
  level: string;
  dateOfBirth?: string | null;
  metadata?: JsonRecord | null;
  fullName: string;
  headline?: string | null;
  summary?: string | null;
  seo: {
    title?: string | null;
    description?: string | null;
    keywords: string[];
    metadata?: JsonRecord | null;
  };
};

export type ProfilePayload = {
  profile: ProfileView;
  sections: SectionView[];
  language: LanguageCode;
};

const languagePriority = (lang: LanguageCode): Language[] => {
  const primary = lang.toLowerCase() as LanguageCode;
  const fallback = defaultLanguage;
  const list = [primary];
  if (fallback !== primary) {
    list.push(fallback);
  }
  return list.map((code) => toPrismaLanguage(code));
};

const toPrismaLanguage = (lang: LanguageCode): Language => {
  switch (lang) {
    case "vi":
      return Language.vi;
    case "ru":
      return Language.ru;
    default:
      return Language.en;
  }
};

function pickTranslation<T extends { language: Language }>(
  translations: T[],
  languages: Language[],
): T | undefined {
  for (const lang of languages) {
    const match = translations.find((t) => t.language === lang);
    if (match) return match;
  }
  return translations[0];
}

const mergeMetadata = (base?: JsonRecord | null, override?: JsonRecord | null): JsonRecord => {
  const output: JsonRecord = { ...(base ?? {}) };
  if (!override) return output;
  for (const [key, value] of Object.entries(override)) {
    const baseValue = output[key];
    if (Array.isArray(baseValue) && Array.isArray(value)) {
      output[key] = value;
    } else if (
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue) &&
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      output[key] = mergeMetadata(baseValue as JsonRecord, value as JsonRecord);
    } else {
      output[key] = value;
    }
  }
  return output;
};

export const getProfile = async (langInput?: string): Promise<ProfilePayload | null> => {
  const normalized = normalizeLanguage(langInput);
  const languages = languagePriority(normalized);

  const profile = await prisma.profile.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: {
      translations: true,
      sections: {
        include: {
          translations: true,
          items: {
            include: { translations: true },
            orderBy: { displayOrder: "asc" },
            where: { isActive: true },
          },
        },
        orderBy: { displayOrder: "asc" },
        where: { isActive: true },
      },
    },
  });

  if (!profile) return null;

  const profileTranslation = pickTranslation(profile.translations, languages);

  const sections: SectionView[] = profile.sections.map((section) => {
    const sectionTranslation = pickTranslation(section.translations, languages);
    const items: SectionItemView[] = section.items.map((item) => {
      const itemTranslation = pickTranslation(item.translations, languages);
      return {
        id: item.id,
        itemType: item.itemType,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
        metadata: mergeMetadata(
          (item.metadata as JsonRecord) ?? {},
          (itemTranslation?.metadata as JsonRecord) ?? {},
        ),
        translation: itemTranslation
          ? {
              title: itemTranslation.title,
              subtitle: itemTranslation.subtitle,
              description: itemTranslation.description,
              metadata: (itemTranslation.metadata as JsonRecord) ?? {},
            }
          : undefined,
      };
    });

    return {
      id: section.id,
      key: section.key,
      displayOrder: section.displayOrder,
      isActive: section.isActive,
      uiConfig: (section.uiConfig as SectionUiConfig) ?? {},
      metadata: (section.metadata as JsonRecord) ?? {},
      translation: sectionTranslation
        ? {
            title: sectionTranslation.title,
            subtitle: sectionTranslation.subtitle,
            description: sectionTranslation.description,
            metadata: (sectionTranslation.metadata as JsonRecord) ?? {},
          }
        : undefined,
      items,
    };
  });

  return {
    language: normalized,
    profile: {
      id: profile.id,
      slug: profile.slug,
      level: profile.level,
      dateOfBirth: profile.dateOfBirth?.toISOString() ?? null,
      metadata: (profile.metadata as JsonRecord) ?? {},
      fullName: profileTranslation?.fullName ?? profile.slug,
      headline: profileTranslation?.headline,
      summary: profileTranslation?.summary,
      seo: {
        title: profileTranslation?.seoTitle ?? profileTranslation?.fullName,
        description: profileTranslation?.seoDescription ?? profileTranslation?.summary,
        keywords: profileTranslation?.seoKeywords ?? [],
        metadata: (profileTranslation?.seoMetadata as JsonRecord) ?? {},
      },
    },
    sections,
  };
};

export const getAllProfilePaths = cache(async () => {
  return supportedLanguages.map((lang) => ({ lang }));
});
