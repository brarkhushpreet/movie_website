import type { MediaItem } from "@/lib/types";
import { MediaCard } from "./MediaCard";

export function MediaGrid({ items }: { items: MediaItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((media, index) => <MediaCard key={`${media.media_type}-${media.id}-${index}`} media={media} priority={index < 4} />)}
    </div>
  );
}
