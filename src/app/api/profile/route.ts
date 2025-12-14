import { NextResponse } from "next/server";
import { getProfile } from "@/lib/profile";
import { normalizeLanguage } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get("lang");
  const language = normalizeLanguage(langParam ?? undefined);
  const data = await getProfile(language);

  if (!data) {
    return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    profile: data.profile,
    sections: data.sections,
    language: data.language,
  });
}
