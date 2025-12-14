import type { Metadata } from "next";
import { ProfileShell } from "@/components/profile-shell";
import { normalizeLanguage } from "@/lib/i18n";
import { getProfile } from "@/lib/profile";

type Props = { params: { lang?: string } };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = normalizeLanguage(params?.lang);
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

export default async function LangLandingPage({ params }: Props) {
  const lang = normalizeLanguage(params?.lang);
  const data = await getProfile(lang);

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
        <div className="frame-strong max-w-lg bg-[var(--panel)] p-6 text-center">
          <p className="text-lg font-semibold text-[var(--foreground)]">
            No profiles found. Seed the database to continue.
          </p>
        </div>
      </main>
    );
  }

  return <ProfileShell data={data} />;
}
