import { NextResponse } from "next/server";
import { defaultLanguage, normalizeLanguage, isSupportedLanguage } from "./lib/i18n";

export function middleware(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/static")) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);

  // Redirect root to default language
  if (segments.length === 0) {
    return NextResponse.redirect(new URL(`/${defaultLanguage}`, url));
  }

  // Only allow /{lang}
  if (segments.length !== 1 || !isSupportedLanguage(normalizeLanguage(segments[0]))) {
    return NextResponse.redirect(new URL(`/${defaultLanguage}`, url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
