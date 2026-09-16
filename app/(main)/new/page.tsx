import type { Metadata } from "next";
import { BrowseView } from "@/components/BrowseView";
import { getNewAndPopular } from "@/lib/tmdb";

export const metadata: Metadata = { title: "New & Popular" };

export default async function NewPage() {
  const data = await getNewAndPopular();
  return <BrowseView data={data} heroContext="Arriving soon" />;
}
