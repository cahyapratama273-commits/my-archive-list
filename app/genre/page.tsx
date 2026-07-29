import Link from "next/link";
import { getAllGenres, searchByGenres } from "@/app/lib/data";
import Card from "@/app/components/Card";
import EmptyState from "@/app/components/EmptyState";

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
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-indigo-400">Jelajahi Genre</h1>
        <p className="mb-8 text-sm text-zinc-500">
          Pilih satu atau lebih genre untuk melihat anime, film, dan movie yang sesuai.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {visibleGenres.map((genre) => (
            <GenreChip key={genre} genre={genre} selected={selected} />
          ))}

          {moreGenres.length > 0 && (
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-indigo-500 hover:text-indigo-400 [&::-webkit-details-marker]:hidden">
                Lainnya
                <svg className="h-3 w-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="absolute left-0 top-full z-10 mt-2 flex w-64 flex-wrap gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-xl">
                {moreGenres.map((genre) => (
                  <GenreChip key={genre} genre={genre} selected={selected} />
                ))}
              </div>
            </details>
          )}

          {selected.length > 0 && (
            <Link
              href="/genre"
              className="rounded-full border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 transition-colors hover:border-red-500 hover:text-red-400"
            >
              Reset
            </Link>
          )}
        </div>

        <div className="mt-10">
          {selected.length === 0 && (
            <p className="py-10 text-center text-sm text-zinc-500">
              Pilih genre di atas untuk melihat daftarnya.
            </p>
          )}

          {selected.length > 0 && results.length === 0 && (
            <EmptyState message={`Tidak ada hasil untuk genre yang dipilih.`} />
          )}

          {selected.length > 0 && results.length > 0 && (
            <>
              <h2 className="mb-4 text-lg font-semibold text-zinc-100">
                {results.length} hasil ditemukan
              </h2>
              <div className="grid grid-cols-3 gap-4 lg:grid-cols-4">
                {results.map((item, index) => (
                  <Card key={`${item.category}-${item.id}`} item={item} category={item.category} priority={index < 2} />
                ))}
              </div>
            </>
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
      className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "border-indigo-500 bg-indigo-600 text-white"
          : "border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-indigo-500 hover:text-indigo-400"
      }`}
    >
      {genre}
    </Link>
  );
}