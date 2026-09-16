import "server-only";

import type { BrowseData, Genre, MediaDetails, MediaItem, MediaPage, MediaType } from "./types";

const TMDB_URL = "https://api.themoviedb.org/3";

const genreNames = new Map<number, string>([
  [12, "Adventure"], [18, "Drama"], [27, "Horror"], [28, "Action"], [35, "Comedy"],
  [53, "Thriller"], [80, "Crime"], [878, "Science Fiction"], [9648, "Mystery"],
  [10749, "Romance"], [10759, "Action & Adventure"], [10765, "Sci-Fi & Fantasy"],
]);

const fallbackTrailers = new Map<number, string>([
  [27205, "YoHD9XEInc0"], [66732, "b9EkMc79ZSU"], [1396, "HhesaQXLuRY"],
  [70523, "rrwycJ08PSA"], [438631, "8g18jFHCLXk"], [157336, "zSWdZVtXT7E"],
  [603, "vKQi3bBA1y8"], [155, "EXeTwQWrcwY"], [550, "qtRKdVHc-cE"],
  [475557, "zAGVQLHvwOY"], [13, "bLvqoHBptjg"], [60574, "oVzVdvGIC7U"],
  [71446, "_InqQJRqGW4"], [82856, "aOC8E8z_ifw"], [100088, "uLtkt8BonwM"],
  [94997, "DotnJ7tTA34"],
]);

const fallbackItems: MediaItem[] = [
  {
    id: 27205,
    media_type: "movie",
    title: "Inception",
    overview: "A skilled extractor who steals secrets through dream-sharing is offered a chance to erase his past by planting an idea in a target's mind.",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    release_date: "2010-07-15",
    vote_average: 8.4,
    genre_ids: [28, 878, 12],
  },
  {
    id: 66732,
    media_type: "tv",
    name: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    first_air_date: "2016-07-15",
    vote_average: 8.6,
    genre_ids: [18, 9648, 10765],
  },
  {
    id: 1396,
    media_type: "tv",
    name: "Breaking Bad",
    overview: "A chemistry teacher diagnosed with cancer turns to manufacturing methamphetamine to secure his family's future.",
    backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    first_air_date: "2008-01-20",
    vote_average: 9.5,
    genre_ids: [18, 80],
  },
  {
    id: 70523,
    media_type: "tv",
    name: "Dark",
    overview: "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery spanning generations.",
    backdrop_path: "/3lBDg3i6nn5R2NKFCJ6oKyUo2j5.jpg",
    poster_path: "/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
    first_air_date: "2017-12-01",
    vote_average: 8.4,
    genre_ids: [80, 18, 9648],
  },
  {
    id: 438631,
    media_type: "movie",
    title: "Dune",
    overview: "A gifted young man must travel to the universe's most dangerous planet to ensure the future of his family and his people.",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    release_date: "2021-09-15",
    vote_average: 7.8,
    genre_ids: [878, 12],
  },
  {
    id: 157336,
    media_type: "movie",
    title: "Interstellar",
    overview: "Explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    backdrop_path: "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    release_date: "2014-11-05",
    vote_average: 8.5,
    genre_ids: [12, 18, 878],
  },
  {
    id: 603,
    media_type: "movie",
    title: "The Matrix",
    overview: "A hacker discovers that the world he knows is a simulated reality and joins a rebellion to break free.",
    backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    release_date: "1999-03-30",
    vote_average: 8.2,
    genre_ids: [28, 878],
  },
  {
    id: 155,
    media_type: "movie",
    title: "The Dark Knight",
    overview: "Batman faces a criminal mastermind whose reign of chaos pushes Gotham and its heroes to their limits.",
    backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    genre_ids: [18, 28, 80],
  },
  {
    id: 550,
    media_type: "movie",
    title: "Fight Club",
    overview: "An insomniac office worker and a magnetic soap maker form an underground club that becomes something far larger.",
    backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    release_date: "1999-10-15",
    vote_average: 8.4,
    genre_ids: [18],
  },
  {
    id: 475557,
    media_type: "movie",
    title: "Joker",
    overview: "A struggling comedian in Gotham descends into isolation and ignites a movement in a city ready to erupt.",
    backdrop_path: "/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    poster_path: "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    release_date: "2019-10-01",
    vote_average: 8.1,
    genre_ids: [80, 18, 53],
  },
  {
    id: 13,
    media_type: "movie",
    title: "Forrest Gump",
    overview: "A kind-hearted man moves through decades of American history while never losing sight of the person he loves.",
    backdrop_path: "/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    release_date: "1994-06-23",
    vote_average: 8.5,
    genre_ids: [35, 18, 10749],
  },
  {
    id: 60574,
    media_type: "tv",
    name: "Peaky Blinders",
    overview: "A notorious gang in 1919 Birmingham is led by the fierce Tommy Shelby, a crime boss set on moving up in the world.",
    backdrop_path: "/wiE9doxiLwq3WCGamDIOb2PqBqc.jpg",
    poster_path: "/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    first_air_date: "2013-09-12",
    vote_average: 8.5,
    genre_ids: [18, 80],
  },
  {
    id: 71446,
    media_type: "tv",
    name: "Money Heist",
    overview: "A criminal mastermind recruits eight specialists for an audacious siege of the Royal Mint of Spain.",
    backdrop_path: "/gFZriCkpJYsApPZEF3jhxL4yLzG.jpg",
    poster_path: "/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    first_air_date: "2017-05-02",
    vote_average: 8.2,
    genre_ids: [80, 18],
  },
  {
    id: 82856,
    media_type: "tv",
    name: "The Mandalorian",
    overview: "A lone bounty hunter travels the outer reaches of the galaxy, far from the authority of the New Republic.",
    backdrop_path: "/9ijMGlJKqcslswWUzTEwScm82Gs.jpg",
    poster_path: "/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg",
    first_air_date: "2019-11-12",
    vote_average: 8.4,
    genre_ids: [10765, 10759, 18],
  },
  {
    id: 100088,
    media_type: "tv",
    name: "The Last of Us",
    overview: "A hardened survivor escorts a teenager across a ruined America, and their brutal journey becomes a fight for something to live for.",
    backdrop_path: "/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
    poster_path: "/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    first_air_date: "2023-01-15",
    vote_average: 8.5,
    genre_ids: [18],
  },
  {
    id: 94997,
    media_type: "tv",
    name: "House of the Dragon",
    overview: "The Targaryen dynasty stands at the height of its power as rival heirs pull the realm toward civil war.",
    backdrop_path: "/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg",
    poster_path: "/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
    first_air_date: "2022-08-21",
    vote_average: 8.3,
    genre_ids: [10765, 18, 10759],
  },
];

function normalize(items: MediaItem[], forcedType?: MediaType) {
  return items
    .filter((item) => item.backdrop_path || item.poster_path)
    .map((item) => ({
      ...item,
      media_type: forcedType || (item.media_type === "tv" ? "tv" : "movie"),
    }));
}

async function request<T>(path: string, params: Record<string, string> = {}, revalidate = 3600) {
  const token = process.env.TMDB_API_KEY;
  if (!token) throw new Error("TMDB_API_KEY is missing");

  const url = new URL(`${TMDB_URL}${path}`);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate },
    signal: AbortSignal.timeout(4500),
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

async function collection(path: string, forcedType?: MediaType, params: Record<string, string> = {}) {
  try {
    const page = await request<MediaPage>(path, params);
    return normalize(page.results, forcedType);
  } catch {
    const matching = forcedType ? fallbackItems.filter((item) => item.media_type === forcedType) : fallbackItems;
    return normalize(matching);
  }
}

export async function getHomeData(): Promise<BrowseData> {
  const [trending, popularMovies, popularSeries, topRated, newMovies, dramas] = await Promise.all([
    collection("/trending/all/week"),
    collection("/movie/popular", "movie"),
    collection("/tv/popular", "tv"),
    collection("/movie/top_rated", "movie"),
    collection("/movie/now_playing", "movie"),
    collection("/discover/tv", "tv", { with_genres: "18", sort_by: "vote_average.desc", "vote_count.gte": "500" }),
  ]);

  const hero = trending.find((item) => item.backdrop_path && item.overview) || fallbackItems[1];
  return {
    hero,
    rows: [
      { title: "Trending Now", eyebrow: "What everyone's watching", items: trending },
      { title: "Top 10 in India Today", items: popularMovies.slice(0, 10), ranked: true },
      { title: "Binge-worthy Series", items: popularSeries },
      { title: "Critically Acclaimed", items: topRated },
      { title: "Fresh This Week", items: newMovies },
      { title: "Stories That Stay With You", items: dramas },
    ],
  };
}

export async function getBrowseByType(type: MediaType): Promise<BrowseData> {
  const prefix = type === "movie" ? "movie" : "tv";
  const [popular, topRated, newReleases, action, comedy] = await Promise.all([
    collection(`/${prefix}/popular`, type),
    collection(`/${prefix}/top_rated`, type),
    collection(type === "movie" ? "/movie/upcoming" : "/tv/on_the_air", type),
    collection(`/discover/${prefix}`, type, { with_genres: type === "movie" ? "28" : "10759" }),
    collection(`/discover/${prefix}`, type, { with_genres: "35" }),
  ]);

  return {
    hero: popular.find((item) => item.backdrop_path && item.overview) || fallbackItems[0],
    rows: [
      { title: type === "movie" ? "Popular Movies" : "Popular Series", items: popular },
      { title: "Top 10 Today", items: topRated.slice(0, 10), ranked: true },
      { title: type === "movie" ? "Coming Soon" : "New Episodes", items: newReleases },
      { title: "Adrenaline Rush", items: action },
      { title: "Easy Laughs", items: comedy },
    ],
  };
}

export async function getNewAndPopular(): Promise<BrowseData> {
  const [trending, upcoming, airing, topMovies, topTv] = await Promise.all([
    collection("/trending/all/day"),
    collection("/movie/upcoming", "movie"),
    collection("/tv/on_the_air", "tv"),
    collection("/movie/top_rated", "movie"),
    collection("/tv/top_rated", "tv"),
  ]);

  return {
    hero: upcoming.find((item) => item.backdrop_path && item.overview) || trending[0] || fallbackItems[4],
    rows: [
      { title: "Trending Today", items: trending },
      { title: "Worth the Wait", items: upcoming },
      { title: "New Episodes", items: airing },
      { title: "Everyone's Talking About", items: [...topMovies.slice(0, 10), ...topTv.slice(0, 10)] },
    ],
  };
}

export async function searchMedia(query: string) {
  if (!query.trim()) return [];
  try {
    const page = await request<MediaPage>("/search/multi", { query: query.trim(), include_adult: "false" });
    return normalize(page.results);
  } catch {
    const needle = query.trim().toLowerCase();
    return normalize(fallbackItems).filter((item) => {
      const title = item.title || item.name || "";
      return title.toLowerCase().includes(needle) || item.overview.toLowerCase().includes(needle);
    });
  }
}

export async function discoverGenre(id: string, type: MediaType = "movie") {
  try {
    const page = await request<MediaPage>(`/discover/${type}`, { with_genres: id, sort_by: "popularity.desc" });
    return normalize(page.results, type);
  } catch {
    const genreId = Number(id);
    return normalize(fallbackItems.filter((item) => item.media_type === type && item.genre_ids?.includes(genreId)));
  }
}

export async function getGenres() {
  try {
    const [movies, tv] = await Promise.all([
      request<{ genres: Genre[] }>("/genre/movie/list"),
      request<{ genres: Genre[] }>("/genre/tv/list"),
    ]);
    return Array.from(new Map([...movies.genres, ...tv.genres].map((genre) => [genre.id, genre])).values());
  } catch {
    return [
      { id: 28, name: "Action" },
      { id: 35, name: "Comedy" },
      { id: 18, name: "Drama" },
      { id: 27, name: "Horror" },
      { id: 878, name: "Sci-Fi" },
    ];
  }
}

export async function getDetails(type: MediaType, id: string): Promise<MediaDetails | null> {
  try {
    const details = await request<MediaDetails>(`/${type}/${id}`, {
      append_to_response: "videos,credits,recommendations,similar",
    });
    return {
      ...details,
      media_type: type,
      recommendations: details.recommendations
        ? { results: normalize(details.recommendations.results, type) }
        : undefined,
      similar: details.similar ? { results: normalize(details.similar.results, type) } : undefined,
    };
  } catch {
    const fallback = fallbackItems.find((item) => item.id === Number(id) && item.media_type === type);
    if (!fallback) return null;
    const trailerKey = fallbackTrailers.get(fallback.id);
    return {
      ...fallback,
      genres: (fallback.genre_ids || []).map((genreId) => ({ id: genreId, name: genreNames.get(genreId) || "Stories" })),
      credits: { cast: [] },
      videos: {
        results: trailerKey
          ? [{ id: `fallback-${fallback.id}`, key: trailerKey, name: "Official Trailer", site: "YouTube", type: "Trailer", official: true }]
          : [],
      },
      recommendations: {
        results: fallbackItems.filter((item) => item.media_type === type && item.id !== fallback.id),
      },
    };
  }
}

export async function getPopularPreview() {
  return collection("/trending/all/week");
}
