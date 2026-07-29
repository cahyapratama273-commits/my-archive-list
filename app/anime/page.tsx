import { getPaginated } from "@/app/lib/data";
import Card from "@/app/components/Card";
import EmptyState from "@/app/components/EmptyState";
import Pagination from "@/app/components/Pagination";

export const metadata = { title: "Anime | MyArchiveList" };

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AnimePage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const { results, totalPages } = getPaginated("anime", currentPage, 24);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-indigo-400">Daftar Anime</h1>

        {results.length === 0 ? (
          <EmptyState message="Data anime tidak ditemukan." />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-4">
              {results.map((item, index) => (
                <Card key={item.id} item={item} category="anime" priority={index < 2} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/anime" />
          </>
        )}
      </div>
    </div>
  );
}