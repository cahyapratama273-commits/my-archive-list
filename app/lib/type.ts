export type Category = "anime" | "film" | "movie";

export interface MediaData {
  id: number;
  judul: string;
  tipe: string;
  rating: string;
  durasi: string;
  tahun: number;
  sutradara: string;
  kualitas: string;
  sinopsis: string;
  genres: string[];
  img: string;
}

export interface MediaWithCategory extends MediaData {
  category: Category;
}

export interface GenreCount {
  name: string;
  count: number;
}