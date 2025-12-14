import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { normalizeLanguage } from "@/lib/i18n";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data-driven CV",
  description: "Dynamic, multilingual profile powered entirely by the database.",
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang?: string };
}>) {
  const lang = normalizeLanguage(params?.lang);

  return (
    <html lang={lang ?? "vi"} data-language={lang ?? "vi"}>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
