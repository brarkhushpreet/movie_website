import { notFound } from "next/navigation";
import { MemberGate } from "@/components/MemberGate";
import { TrailerPlayer } from "@/components/TrailerPlayer";
import { getDetails } from "@/lib/tmdb";
import type { MediaType } from "@/lib/types";

type Props = { params: Promise<{ type: string; id: string }> };

export default async function WatchPage({ params }: Props) {
  const { type: rawType, id } = await params;
  if (rawType !== "movie" && rawType !== "tv") notFound();
  const type = rawType as MediaType;
  const media = await getDetails(type, id);
  if (!media) notFound();
  const trailer = media.videos?.results.find((video) => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser"));

  return <MemberGate><TrailerPlayer media={media} type={type} trailerKey={trailer?.key} /></MemberGate>;
}
