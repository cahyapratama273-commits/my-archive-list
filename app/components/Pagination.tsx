import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <NavLink page={currentPage - 1} basePath={basePath} disabled={currentPage <= 1} label="Sebelumnya" />

      {start > 1 && (
        <>
          <PageLink page={1} basePath={basePath} active={currentPage === 1} />
          {start > 2 && <span className="px-1 text-zinc-600">...</span>}
        </>
      )}

      {pages.map((page) => (
        <PageLink key={page} page={page} basePath={basePath} active={currentPage === page} />
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-zinc-600">...</span>}
          <PageLink page={totalPages} basePath={basePath} active={currentPage === totalPages} />
        </>
      )}

      <NavLink page={currentPage + 1} basePath={basePath} disabled={currentPage >= totalPages} label="Berikutnya" />
    </div>
  );
}

function PageLink({ page, basePath, active }: { page: number; basePath: string; active: boolean }) {
  return (
    <Link
      href={`${basePath}?page=${page}`}
      className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-600 text-white"
          : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-indigo-500 hover:text-indigo-400"
      }`}
    >
      {page}
    </Link>
  );
}

function NavLink({
  page,
  basePath,
  disabled,
  label,
}: {
  page: number;
  basePath: string;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded-md border border-zinc-900 px-3 py-2 text-sm text-zinc-700">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={`${basePath}?page=${page}`}
      className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-indigo-500 hover:text-indigo-400"
    >
      {label}
    </Link>
  );
}