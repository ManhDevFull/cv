import type { Metadata } from "next";
import { LanguageBoundary } from "@/components/language-boundary";
import "../globals.css";

export const metadata: Metadata = {
  title: "Data-driven CV",
  description: "Dynamic, multilingual profile powered entirely by the database.",
};

type ParamsPromise = Promise<{ lang?: string }>;

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: ParamsPromise;
}) {
  const { lang } = await params;
  return <LanguageBoundary lang={lang}>{children}</LanguageBoundary>;
}
