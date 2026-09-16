import type { Metadata } from "next";
import { BrowseView } from "@/components/BrowseView";
import { getBrowseByType } from "@/lib/tmdb";

export const metadata: Metadata = { title: "Series" };

export default async function SeriesPage() {
  const data = await getBrowseByType("tv");
  return <BrowseView data={data} heroContext="Series of the night" />;
}
