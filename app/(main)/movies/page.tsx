import type { Metadata } from "next";
import { BrowseView } from "@/components/BrowseView";
import { getBrowseByType } from "@/lib/tmdb";

export const metadata: Metadata = { title: "Movies" };

export default async function MoviesPage() {
  const data = await getBrowseByType("movie");
  return <BrowseView data={data} heroContext="Featured film" />;
}
