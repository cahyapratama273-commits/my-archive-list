import Link from "next/link";
import { getAllGenres, searchByGenres } from "@/app/lib/data";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";

export const metadata = { title: "Genre | MyArchiveList" };

interface PageProps {
  searchParams: Promise<{ g?: string | string[] }>;
}

const VISIBLE_LIMIT = 10;

export default async function GenrePage({ searchParams }: PageProps) {
  const { g } = await searchParams;
  const selected = g ? (Array.isArray(g) ? g : [g]) : [];

  const allGenres = getAllGenres();
  const visibleGenres = allGenres.slice(0, VISIBLE_LIMIT);
  const moreGenres = allGenres.slice(VISIBLE_LIMIT);

  const results = searchByGenres(selected);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Title Header */}
        <div className="border-b border-zinc-900 pb-6 mb-8">
          {/* Breadcrumbs */}
          <div className="text-xs text-zinc-500 mb-2 flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-zinc-350 transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-zinc-350">Genre</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Jelajahi Genre</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 font-medium">
            Pilih satu atau lebih genre untuk melihat anime, film, dan movie yang sesuai.
          </p>
        </div>

        {/* Filter Chips Container */}
        <div className="flex flex-wrap items-center gap-2.5">
          {visibleGenres.map((genre) => (
            <GenreChip key={genre} genre={genre} selected={selected} />
          ))}

          {moreGenres.length > 0 && (
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-zinc-800/80 bg-zinc-900/40 px-4.5 py-2 text-xs sm:text-sm font-semibold text-zinc-300 transition-colors hover:border-indigo-500 hover:text-indigo-400 [&::-webkit-details-marker]:hidden">
                Lainnya
                <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="absolute left-0 top-full z-15 mt-2 flex w-72 flex-wrap gap-2 rounded-xl border border-zinc-800 bg-zinc-900/95 p-4.5 shadow-2xl backdrop-blur-md">
                {moreGenres.map((genre) => (
                  <GenreChip key={genre} genre={genre} selected={selected} />
                ))}
              </div>
            </details>
          )}

          {selected.length > 0 && (
            <Link
              href="/genre"
              className="rounded-full border border-zinc-800 bg-zinc-950 px-4.5 py-2 text-xs sm:text-sm font-semibold text-zinc-400 transition-colors hover:border-rose-500/50 hover:text-rose-400"
            >
              Reset
            </Link>
          )}
        </div>

        {/* Results List */}
        <div className="mt-12">
          {selected.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-850 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-zinc-650 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-zinc-500">
                Pilih satu atau beberapa genre di atas untuk menyaring katalog.
              </p>
            </div>
          )}

          {selected.length > 0 && results.length === 0 && (
            <EmptyState message="Tidak ada hasil untuk kombinasi genre yang dipilih." />
          )}

          {selected.length > 0 && results.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                <span className="h-5 w-1 rounded-full bg-indigo-650 block" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Ditemukan {results.length} Judul
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {results.map((item, index) => (
                  <Card key={`${item.category}-${item.id}`} item={item} category={item.category} priority={index < 2} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GenreChip({ genre, selected }: { genre: string; selected: string[] }) {
  const isActive = selected.includes(genre);

  const nextSelected = isActive
    ? selected.filter((g) => g !== genre)
    : [...selected, genre];

  const href =
    nextSelected.length === 0
      ? "/genre"
      : `/genre?${nextSelected.map((g) => `g=${encodeURIComponent(g)}`).join("&")}`;

  return (
    <Link
      href={href}
      className={`rounded-full border px-4.5 py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
        isActive
          ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500"
          : "border-zinc-800/80 bg-zinc-900/30 text-zinc-350 hover:border-indigo-500/50 hover:text-indigo-400"
      }`}
    >
      {genre}
    </Link>
  );
}