import { getPaginated } from "@/app/lib/data";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import Link from "next/link";

export const metadata = { title: "Movie | MyArchiveList" };

interface PageProps {
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export default async function MoviePage({ searchParams }: PageProps) {
  const { page, sort } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const currentSort = sort || "popular";
  const { results, totalPages, totalItems } = getPaginated("movie", currentPage, 24, currentSort);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * 24 + 1;
  const endItem = Math.min(currentPage * 24, totalItems);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6 mb-6">
          <div>
            {/* Breadcrumbs */}
            <div className="text-xs text-zinc-500 mb-2 flex items-center gap-1.5 font-medium">
              <Link href="/" className="hover:text-zinc-350 transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="text-zinc-350">Movie</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Daftar Movie</h1>
            <p className="text-xs text-zinc-500 mt-1.5 font-medium">
              Menampilkan {startItem}-{endItem} dari {totalItems.toLocaleString("id-ID")} judul
            </p>
          </div>

          {/* Category Switcher Tabs */}
          <div className="flex items-center gap-2">
            <Link href="/anime" className="border border-zinc-800/80 bg-zinc-900/40 text-zinc-450 hover:border-zinc-700 hover:text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150">
              Anime
            </Link>
            <Link href="/film" className="border border-zinc-800/80 bg-zinc-900/40 text-zinc-450 hover:border-zinc-700 hover:text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150">
              Film
            </Link>
            <Link href="/movie" className="bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-lg text-xs shadow-md shadow-indigo-600/20">
              Movie
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-900 bg-zinc-950 p-3.5 mb-8 text-xs font-semibold text-zinc-400">
          <div className="flex items-center gap-2.5">
            <span className="text-zinc-500">Urutkan:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { value: "popular", label: "Popular" },
                { value: "latest", label: "Terbaru" },
                { value: "rating", label: "Rating" },
                { value: "az", label: "A-Z" },
              ].map((opt) => (
                <Link
                  key={opt.value}
                  href={`/movie?sort=${opt.value}&page=1`}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
                    currentSort === opt.value
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "bg-zinc-900/40 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="text-zinc-500 font-medium hidden sm:block">
            <span>24 per halaman</span>
          </div>
        </div>

        {/* Content list */}
        {results.length === 0 ? (
          <EmptyState message="Data movie tidak ditemukan." />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {results.map((item, index) => (
                <Card key={item.id} item={item} category="movie" priority={index < 2} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/movie" />
          </>
        )}
      </div>
    </div>
  );
}