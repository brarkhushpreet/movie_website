import type { BrowseData } from "@/lib/types";
import { Hero } from "./Hero";
import { MediaRow } from "./MediaRow";

export function BrowseView({ data, heroContext }: { data: BrowseData; heroContext?: string }) {
  return (
    <main>
      <Hero media={data.hero} context={heroContext} />
      <div className="relative z-10 -mt-24 space-y-1 sm:-mt-30 lg:-mt-28">
        {data.rows.map((row) => <MediaRow key={row.title} {...row} />)}
      </div>
    </main>
  );
}
