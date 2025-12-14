import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileShell } from "@/components/profile-shell";
import { defaultLanguage, isSupportedLanguage, normalizeLanguage } from "@/lib/i18n";
import { getProfile } from "@/lib/profile";

type ParamsPromise = Promise<{ lang?: string }>;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: ParamsPromise }): Promise<Metadata> {
  const { lang: langRaw } = await params;
  const langParam = langRaw?.trim().toLowerCase();
  const lang = isSupportedLanguage(langParam) ? langParam : defaultLanguage;
  const data = await getProfile(lang);
  if (!data) return { title: "Profile not found" };
  const { profile } = data;
  const title = profile.seo.title ?? profile.fullName;
  const description = profile.seo.description ?? profile.summary ?? undefined;
  return {
    title,
    description,
    keywords: profile.seo.keywords,
    openGraph: {
      title,
      description,
      url: `/${lang}`,
      locale: lang,
      type: "profile",
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        vi: "/vi",
        en: "/en",
        ru: "/ru",
      },
    },
  };
}

export default async function LangLandingPage({ params }: { params: ParamsPromise }) {
  const { lang: langRaw } = await params;
  const langParam = langRaw?.trim().toLowerCase();
  if (!isSupportedLanguage(langParam)) {
    redirect(`/${defaultLanguage}`);
  }
  const lang = normalizeLanguage(langParam);
  const data = await getProfile(lang);

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-6">
        <div className="brutal-card max-w-lg text-center space-y-2">
          <p className="brutal-card__title">No profiles found.</p>
          <p className="brutal-caption">Seed the database to continue.</p>
        </div>
      </main>
    );
  }

  return <ProfileShell key={lang} data={data} />;
}
