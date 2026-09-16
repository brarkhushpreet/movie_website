import type { Metadata } from "next";
import { BrowseView } from "@/components/BrowseView";
import { GenrePills } from "@/components/GenrePills";
import { getGenres, getHomeData } from "@/lib/tmdb";

export const metadata: Metadata = { title: "Browse" };

export default async function BrowsePage() {
  const [data, genres] = await Promise.all([getHomeData(), getGenres()]);
  return (
    <>
      <BrowseView data={data} />
      <GenrePills genres={genres} />
    </>
  );
}
