"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const createPageLink = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="mt-12 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold select-none">
      {/* Sebelumnya */}
      <NavLink
        href={createPageLink(currentPage - 1)}
        disabled={currentPage <= 1}
        label="Sebelumnya"
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        }
      />

      {/* Halaman Pertama */}
      {start > 1 && (
        <>
          <PageLink href={createPageLink(1)} page={1} active={currentPage === 1} />
          {start > 2 && <span className="px-1.5 text-zinc-650 cursor-default">...</span>}
        </>
      )}

      {/* Angka Halaman Tengah */}
      {pages.map((page) => (
        <PageLink
          key={page}
          href={createPageLink(page)}
          page={page}
          active={currentPage === page}
        />
      ))}

      {/* Halaman Terakhir */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1.5 text-zinc-650 cursor-default">...</span>}
          <PageLink
            href={createPageLink(totalPages)}
            page={totalPages}
            active={currentPage === totalPages}
          />
        </>
      )}

      {/* Berikutnya */}
      <NavLink
        href={createPageLink(currentPage + 1)}
        disabled={currentPage >= totalPages}
        label="Berikutnya"
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        }
        iconPosition="right"
      />
    </div>
  );
}

function PageLink({ href, page, active }: { href: string; page: number; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 ${
        active
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
          : "border border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700/60 hover:text-white"
      }`}
    >
      {page}
    </Link>
  );
}

function NavLink({
  href,
  disabled,
  label,
  icon,
  iconPosition = "left",
}: {
  href: string;
  disabled: boolean;
  label: string;
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
}) {
  if (disabled) {
    return (
      <span className="flex h-9 items-center gap-1 rounded-lg border border-zinc-900/60 bg-zinc-950 px-3 text-zinc-700 cursor-not-allowed opacity-40">
        {iconPosition === "left" && icon}
        <span>{label}</span>
        {iconPosition === "right" && icon}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="flex h-9 items-center gap-1 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 text-zinc-300 transition-all duration-200 hover:border-zinc-700/60 hover:text-white"
    >
      {iconPosition === "left" && icon}
      <span>{label}</span>
      {iconPosition === "right" && icon}
    </Link>
  );
}