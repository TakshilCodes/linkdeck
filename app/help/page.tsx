import type { Metadata } from "next";
import HelpCenterClient from "@/components/help/HelpCenterClient";

export const metadata: Metadata = {
  title: "Help Center | LinkDeck",
  description: "Find answers, guides, and resources to get the most out of LinkDeck.",
};

export default function HelpPage() {
  return <HelpCenterClient />;
}
