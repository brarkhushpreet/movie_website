export type MediaType = "movie" | "tv";

export type Genre = {
  id: number;
  name: string;
};

export type MediaItem = {
  id: number;
  media_type: MediaType;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  popularity?: number;
  genre_ids?: number[];
  adult?: boolean;
};

export type CastMember = {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
};

export type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
};

export type MediaDetails = MediaItem & {
  genres: Genre[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  tagline?: string;
  status?: string;
  credits?: { cast: CastMember[] };
  videos?: { results: Video[] };
  recommendations?: { results: MediaItem[] };
  similar?: { results: MediaItem[] };
};

export type MediaPage = {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
};

export type BrowseData = {
  hero: MediaItem;
  rows: Array<{
    title: string;
    eyebrow?: string;
    items: MediaItem[];
    ranked?: boolean;
  }>;
};
