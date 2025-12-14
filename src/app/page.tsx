import { redirect } from "next/navigation";
import { defaultLanguage } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function Home() {
  redirect(`/${defaultLanguage}`);
}
