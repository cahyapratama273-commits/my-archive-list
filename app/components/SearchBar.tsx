"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MediaData, Category } from "@/app/lib/type";

interface SearchResults {
  anime: MediaData[];
  film: MediaData[];
  movie: MediaData[];
}

const EMPTY_RESULTS: SearchResults = { anime: [], film: [], movie: [] };

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults(EMPTY_RESULTS);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.warn("Gagal mencari:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setMobileExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileExpanded) inputRef.current?.focus();
  }, [mobileExpanded]);

  function closeAll() {
    setIsOpen(false);
    setMobileExpanded(false);
    setQuery("");
  }

  const totalResults = results.anime.length + results.film.length + results.movie.length;

  return (
    <div ref={containerRef} className="relative flex items-center">
      {!mobileExpanded && (
        <button
          onClick={() => setMobileExpanded(true)}
          className="rounded-lg p-2 text-white transition-colors hover:bg-indigo-600 md:hidden"
          aria-label="Buka pencarian"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      )}

      <div className="relative hidden w-full max-w-xs md:block">
        <SearchInput value={query} onChange={setQuery} onFocus={() => query && setIsOpen(true)} isLoading={isLoading} />
      </div>

      {mobileExpanded && (
        <div className="fixed inset-x-0 top-0 z-[60] flex items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-3 md:hidden">
          <div className="relative flex-1">
            <SearchInput
              ref={inputRef}
              value={query}
              onChange={setQuery}
              onFocus={() => query && setIsOpen(true)}
              isLoading={isLoading}
              autoFocus
            />
          </div>
          <button onClick={closeAll} className="flex-shrink-0 rounded-lg p-2 text-white transition-colors hover:bg-indigo-600" aria-label="Tutup pencarian">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {isOpen && (
        <div
          className={`overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl z-50 ${
            mobileExpanded
              ? "fixed inset-x-4 top-16 max-h-[75vh] md:hidden"
              : "absolute top-full mt-2 hidden w-full max-h-[70vh] md:block"
          }`}
        >
          {totalResults === 0 && !isLoading && (
            <p className="px-4 py-6 text-center text-sm text-zinc-500">
              Tidak ada hasil untuk &quot;{query}&quot;
            </p>
          )}

          {results.anime.length > 0 && <ResultGroup label="Anime" category="anime" items={results.anime} onItemClick={closeAll} />}
          {results.film.length > 0 && <ResultGroup label="Film" category="film" items={results.film} onItemClick={closeAll} />}
          {results.movie.length > 0 && <ResultGroup label="Movie" category="movie" items={results.movie} onItemClick={closeAll} />}
        </div>
      )}
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  onFocus,
  isLoading,
  autoFocus,
  ref,
}: {
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  isLoading: boolean;
  autoFocus?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}) {
  return (
    <>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        autoFocus={autoFocus}
        placeholder="Cari anime, film, atau movie..."
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      )}
    </>
  );
}

function ResultGroup({
  label,
  category,
  items,
  onItemClick,
}: {
  label: string;
  category: Category;
  items: MediaData[];
  onItemClick: () => void;
}) {
  return (
    <div className="border-t border-zinc-800 p-2 first:border-t-0">
      <p className="px-2 py-1 text-xs font-semibold uppercase text-indigo-400">{label}</p>
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/${category}/${item.id}`}
          onClick={onItemClick}
          className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-zinc-800"
        >
          <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-zinc-800">
            <Image src={item.img} alt={item.judul} fill className="object-cover" sizes="40px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-100">{item.judul}</p>
            <p className="text-xs text-zinc-500">{item.tahun}</p>
          </div>
          <span className="flex-shrink-0 text-xs font-semibold text-yellow-400">★ {item.rating}</span>
        </Link>
      ))}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}