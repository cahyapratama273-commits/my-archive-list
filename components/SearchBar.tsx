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
    <div ref={containerRef} className="relative flex items-center w-full">
      {!mobileExpanded && (
        <button
          onClick={() => setMobileExpanded(true)}
          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white md:hidden"
          aria-label="Buka pencarian"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      )}

      <div className="relative hidden w-full md:block">
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
          <button onClick={closeAll} className="flex-shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors" aria-label="Tutup pencarian">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {isOpen && (
        <div
          className={`overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl z-50 ${
            mobileExpanded
              ? "fixed inset-x-4 top-16 max-h-[75vh] md:hidden"
              : "absolute top-full right-0 left-0 mt-2 hidden max-h-[70vh] md:block"
          }`}
        >
          {totalResults === 0 && !isLoading && (
            <p className="px-4 py-8 text-center text-sm text-zinc-500">
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
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
        <SearchIcon className="h-4 w-4" />
      </div>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        autoFocus={autoFocus}
        placeholder="Cari anime, film, atau movie..."
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2 pl-9 pr-10 text-sm text-zinc-100 placeholder:text-zinc-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-zinc-900/90"
      />

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      )}
    </div>
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
  const TYPE_BADGE: Record<string, string> = {
    anime: "bg-pink-950/40 border-pink-800/40 text-pink-400",
    film: "bg-blue-950/40 border-blue-800/40 text-blue-400",
    movie: "bg-emerald-950/40 border-emerald-800/40 text-emerald-400",
  };

  return (
    <div className="border-t border-zinc-800/60 first:border-t-0 p-1">
      <div className="px-3 py-2 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">{label}</p>
        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${TYPE_BADGE[category]}`}>
          {category.toUpperCase()}
        </span>
      </div>
      <div className="space-y-0.5">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${category}/${item.id}`}
            onClick={onItemClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-900/80"
          >
            <div className="relative h-12 w-9 flex-shrink-0 overflow-hidden rounded bg-zinc-800 border border-zinc-800/50">
              <Image src={item.img} alt={item.judul} fill className="object-cover" sizes="36px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">{item.judul}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{item.tahun} • {item.durasi}</p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-1 text-[11px] font-semibold text-yellow-500">
              <span>★</span>
              <span>{item.rating}</span>
            </div>
          </Link>
        ))}
      </div>
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