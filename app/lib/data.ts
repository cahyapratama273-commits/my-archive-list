import animeData from "@/data/Anime.json";
import filmData from "@/data/Film.json";
import movieData from "@/data/Movie.json";
import genreList from "@/data/Genre.json";
import { MediaData, MediaWithCategory, Category, GenreCount } from "./type";

const DATASETS: Record<Category, MediaData[]> = {
  anime: animeData as MediaData[],
  film: filmData as MediaData[],
  movie: movieData as MediaData[],
};

function byRatingDesc(a: MediaData, b: MediaData) {
  return parseFloat(b.rating) - parseFloat(a.rating);
}

export function getPopular(category: Category, limit: number = 10): MediaData[] {
  return [...DATASETS[category]].sort(byRatingDesc).slice(0, limit);
}

export function getPaginated(category: Category, page: number = 1, perPage: number = 24, sortBy: string = "popular") {
  const data = [...DATASETS[category]];
  
  if (sortBy === "latest" || sortBy === "terbaru") {
    data.sort((a, b) => b.tahun - a.tahun);
  } else if (sortBy === "rating") {
    data.sort(byRatingDesc);
  } else if (sortBy === "az") {
    data.sort((a, b) => a.judul.localeCompare(b.judul, "id"));
  } else {
    data.sort(byRatingDesc);
  }

  const totalPages = Math.max(1, Math.ceil(data.length / perPage));
  const start = (page - 1) * perPage;
  return { 
    results: data.slice(start, start + perPage), 
    totalPages,
    totalItems: data.length
  };
}

export function getById(category: Category, id: number): MediaData | null {
  return DATASETS[category].find((item) => item.id === id) ?? null;
}

export function search(category: Category, query: string, limit: number = 8): MediaData[] {
  const q = query.toLowerCase();
  return DATASETS[category].filter((item) => item.judul.toLowerCase().includes(q)).slice(0, limit);
}

export function searchAll(query: string) {
  if (!query.trim()) return { anime: [], film: [], movie: [] };
  return {
    anime: search("anime", query),
    film: search("film", query),
    movie: search("movie", query),
  };
}

/** Daftar genre yang tersedia (diambil dari data JSON terpisah, bisa ditambah kapan saja) */
export function getAllGenres(): string[] {
  return genreList as string[];
}

/** Gabungan semua item dari 3 kategori, masing-masing ditandai kategorinya */
export function getAllMedia(): MediaWithCategory[] {
  return [
    ...DATASETS.anime.map((item) => ({ ...item, category: "anime" as Category })),
    ...DATASETS.film.map((item) => ({ ...item, category: "film" as Category })),
    ...DATASETS.movie.map((item) => ({ ...item, category: "movie" as Category })),
  ];
}

/**
 * Cari item lintas kategori berdasarkan beberapa genre sekaligus.
 * mode "any" = item cocok kalau punya salah satu genre yang dipilih (OR)
 * mode "all" = item cocok hanya kalau punya semua genre yang dipilih (AND)
 */
export function searchByGenres(selected: string[], mode: "any" | "all" = "any"): MediaWithCategory[] {
  if (selected.length === 0) return [];

  const all = getAllMedia();
  return all
    .filter((item) =>
      mode === "all"
        ? selected.every((g) => item.genres.includes(g))
        : selected.some((g) => item.genres.includes(g))
    )
    .sort(byRatingDesc);
}

/** Dulu dipakai untuk genre per-kategori, masih berguna kalau butuh statistik jumlah item per genre */
export function getGenreCounts(): GenreCount[] {
  const genreMap = new Map<string, number>();
  for (const item of getAllMedia()) {
    for (const genre of item.genres) {
      genreMap.set(genre, (genreMap.get(genre) ?? 0) + 1);
    }
  }
  return Array.from(genreMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getSimilar(category: Category, id: number, limit: number = 5): MediaData[] {
  const current = getById(category, id);
  if (!current) return [];
  
  return DATASETS[category]
    .filter((item) => item.id !== id && item.genres.some((g) => current.genres.includes(g)))
    .sort(byRatingDesc)
    .slice(0, limit);
}