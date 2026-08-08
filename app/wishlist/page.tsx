"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Card from "@/components/Card";
import { CardSkeletonGrid } from "@/components/CardSkeleton";
import { MediaData, Category } from "@/app/lib/type";
import { apiFetch } from "@/app/lib/api-client";

// Import dataset langsung untuk resolving item dari wishlist
import animeData from "@/data/Anime.json";
import filmData from "@/data/Film.json";
import movieData from "@/data/Movie.json";

interface WishlistItem {
  id: number;
  category: Category;
}

/** Composite key agar tidak ada collision antar kategori */
type CompositeKey = `${Category}-${number}`;

const DATASETS: Record<Category, MediaData[]> = {
  anime: animeData as MediaData[],
  film: filmData as MediaData[],
  movie: movieData as MediaData[],
};

interface ResolvedItem {
  media: MediaData;
  category: Category;
  key: CompositeKey;
}

function resolveWishlist(list: WishlistItem[]): ResolvedItem[] {
  const seen = new Set<CompositeKey>();
  const result: ResolvedItem[] = [];

  for (const wish of list) {
    const compositeKey: CompositeKey = `${wish.category}-${wish.id}`;
    if (seen.has(compositeKey)) continue;
    seen.add(compositeKey);

    const dataset = DATASETS[wish.category];
    if (!dataset) continue;
    const match = dataset.find((x) => x.id === wish.id);
    if (match) {
      result.push({ media: match, category: wish.category, key: compositeKey });
    }
  }

  // Urutkan berdasarkan rating tertinggi
  return result.sort(
    (a, b) => parseFloat(b.media.rating) - parseFloat(a.media.rating)
  );
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const [resolvedItems, setResolvedItems] = useState<ResolvedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    async function loadWishlist() {
      setLoading(true);

      // 1. Ambil wishlist lokal
      let localList: WishlistItem[] = [];
      try {
        const stored = localStorage.getItem("my_archive_wishlist");
        if (stored) localList = JSON.parse(stored);
      } catch {
        localList = [];
      }

      // 2. Jika user login, ambil dari DB dan merge
      if (session?.user?.email) {
        try {
          const res = await apiFetch<{ success: boolean; user: { wishlist: unknown } }>(
            "/api/sync-user",
            { silent: true } // jangan tampilkan error jika user belum di DB
          );

          const cloudRaw = res?.user?.wishlist;
          const cloudList: WishlistItem[] = Array.isArray(cloudRaw)
            ? cloudRaw
            : typeof cloudRaw === "string"
            ? JSON.parse(cloudRaw)
            : [];

          if (cloudList.length > 0) {
            // Merge local + cloud, hindari duplikat
            const merged = new Map<CompositeKey, WishlistItem>();
            localList.forEach((item) =>
              merged.set(`${item.category}-${item.id}`, item)
            );
            cloudList.forEach((item) =>
              merged.set(`${item.category}-${item.id}`, item)
            );

            const mergedList = Array.from(merged.values());
            localList = mergedList;
            localStorage.setItem(
              "my_archive_wishlist",
              JSON.stringify(mergedList)
            );
          }
        } catch {
          // Silent — tetap tampilkan local wishlist
        }
      }

      setResolvedItems(resolveWishlist(localList));
      setLoading(false);
    }

    loadWishlist();
  }, [session, status]);

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header skeleton */}
          <div className="border-b border-zinc-900 pb-6 mb-8 space-y-2.5">
            <div className="h-3 w-24 rounded bg-zinc-800 skeleton-shimmer-outer" />
            <div className="h-8 w-48 rounded bg-zinc-800 skeleton-shimmer-outer" />
            <div className="h-3 w-64 rounded bg-zinc-800/60 skeleton-shimmer-outer" />
          </div>
          <CardSkeletonGrid count={8} />
        </div>
        <style>{`
          .skeleton-shimmer-outer { position: relative; overflow: hidden; }
          .skeleton-shimmer-outer::after {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
            background-size: 200% 100%; animation: shimmer 1.6s infinite;
          }
          @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
      </div>
    );
  }

  // ─── Main Render ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* SCREEN VIEW */}
      <div className="min-h-screen bg-zinc-950 px-4 py-10 sm:px-6 print:hidden">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="border-b border-zinc-900 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-zinc-500 mb-2 flex items-center gap-1.5 font-medium">
                <Link href="/" className="hover:text-zinc-350 transition-colors">Home</Link>
                <span>&gt;</span>
                <span className="text-zinc-350">Wishlist</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Wishlist Saya</h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 font-medium">
                {resolvedItems.length > 0
                  ? `${resolvedItems.length} item tersimpan`
                  : "Kumpulan anime, film, dan movie favorit yang telah Anda simpan."}
              </p>
            </div>
            {resolvedItems.length > 0 && (
              <button
                onClick={() => window.print()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 px-4 py-2.5 text-xs font-bold text-zinc-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Cetak Rekap
              </button>
            )}
          </div>

          {/* Cloud sync banner */}
          {!session && resolvedItems.length > 0 && (
            <div className="mb-6 rounded-xl border border-indigo-950/40 bg-indigo-950/20 p-4 text-xs sm:text-sm text-indigo-300 flex items-center gap-3">
              <svg className="h-5 w-5 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1 font-semibold leading-relaxed">
                Wishlist disimpan secara lokal.{" "}
                <Link href="/setting" className="underline hover:text-indigo-200">
                  Login ke Google
                </Link>{" "}
                untuk mencadangkan ke cloud.
              </div>
            </div>
          )}

          {/* Content */}
          {resolvedItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-850 p-16 text-center">
              <svg className="mx-auto h-12 w-12 text-zinc-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <h3 className="text-sm font-bold text-zinc-350 mb-1">Belum ada item disimpan</h3>
              <p className="text-xs text-zinc-500 mb-4 font-medium">
                Jelajahi katalog dan tambahkan film atau anime ke wishlist kamu.
              </p>
              <Link
                href="/"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500 active:scale-95"
              >
                Jelajahi Sekarang
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {resolvedItems.map(({ media, category, key }) => (
                <Card key={key} item={media} category={category} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PRINT-ONLY VIEW */}
      {resolvedItems.length > 0 && (
        <div className="hidden print:block bg-white text-zinc-950 p-8 font-sans min-h-screen">
          <div className="border-b-2 border-zinc-900 pb-4 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Rekap Wishlist Saya</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Platform Katalog MyArchiveList</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-800">Tanggal Cetak</p>
              <p className="text-xs text-zinc-600 font-medium mt-0.5">
                {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {(["anime", "film", "movie"] as Category[]).map((cat) => {
            const group = resolvedItems.filter((r) => r.category === cat);
            if (group.length === 0) return null;
            const colors = { anime: "pink", film: "blue", movie: "emerald" };
            const c = colors[cat];
            return (
              <div key={cat} className="mb-8">
                <div className={`border-b-2 border-${c}-500 pb-1 mb-3 flex items-center justify-between`}>
                  <h2 className={`text-sm font-extrabold uppercase tracking-wider text-${c}-600`}>
                    Daftar {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </h2>
                  <span className="text-xs font-bold text-zinc-500">{group.length} Item</span>
                </div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-300 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                      <th className="py-2 w-8">No</th>
                      <th className="py-2">Judul</th>
                      <th className="py-2 w-32">{cat === "anime" ? "Studio" : "Sutradara"}</th>
                      <th className="py-2 w-20 text-center">Tahun</th>
                      <th className="py-2 w-20 text-center">Kualitas</th>
                      <th className="py-2 w-20 text-right">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {group.map(({ media }, idx) => (
                      <tr key={media.id} className="text-zinc-800 font-medium">
                        <td className="py-2 text-zinc-400 font-semibold">{idx + 1}</td>
                        <td className="py-2 font-bold text-zinc-950">{media.judul}</td>
                        <td className="py-2 text-zinc-500">
                          {cat === "anime" ? (media.studio || "-") : (media.sutradara || "-")}
                        </td>
                        <td className="py-2 text-center">{media.tahun}</td>
                        <td className="py-2 text-center">
                          <span className="border border-zinc-300 px-1 py-0.5 rounded text-[9px] font-bold uppercase">
                            {media.kualitas}
                          </span>
                        </td>
                        <td className="py-2 text-right font-bold text-zinc-900">★ {media.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}

          <div className="border-t border-zinc-300 pt-4 mt-12 text-center text-[10px] font-semibold text-zinc-400">
            Katalog MyArchiveList. Dicetak secara otomatis dari wishlist pengguna.
          </div>
        </div>
      )}
    </>
  );
}