import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Data-driven CV",
  description: "Dynamic, multilingual profile powered entirely by the database.",
};

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return children;
}
