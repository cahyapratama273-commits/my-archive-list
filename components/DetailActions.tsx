"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MediaData, Category } from "@/app/lib/type";
import { apiFetch } from "@/app/lib/api-client";

interface DetailActionsProps {
  item: MediaData;
  category: Category;
}

interface WishlistItem {
  id: number;
  category: Category;
}

export default function DetailActions({ item, category }: DetailActionsProps) {
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("my_archive_wishlist");
      if (stored) {
        const list: WishlistItem[] = JSON.parse(stored);
        setIsWishlisted(
          list.some((x) => x.id === item.id && x.category === category)
        );
      }
    } catch {
      // ignore parse error
    }
  }, [item.id, category]);

  const toggleWishlist = async () => {
    if (syncing) return;

    let list: WishlistItem[] = [];
    try {
      list = JSON.parse(localStorage.getItem("my_archive_wishlist") || "[]");
    } catch {
      list = [];
    }

    const index = list.findIndex(
      (x) => x.id === item.id && x.category === category
    );
    const wasWishlisted = index > -1;

    if (wasWishlisted) {
      list.splice(index, 1);
    } else {
      list.push({ id: item.id, category });
    }

    // Optimistic UI update
    setIsWishlisted(!wasWishlisted);
    localStorage.setItem("my_archive_wishlist", JSON.stringify(list));

    // Sync ke cloud jika user login
    if (session?.user) {
      setSyncing(true);
      try {
        await apiFetch("/api/sync-wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wishlist: list }),
          showSuccess: !wasWishlisted,
          successMessage: `${item.judul} ditambahkan ke wishlist!`,
        });
      } catch {
        // Jika sync gagal, kembalikan state ke sebelumnya
        setIsWishlisted(wasWishlisted);
        const revertList = wasWishlisted
          ? [...list, { id: item.id, category }]
          : list.filter((x) => !(x.id === item.id && x.category === category));
        localStorage.setItem(
          "my_archive_wishlist",
          JSON.stringify(revertList)
        );
      }
      setSyncing(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 w-full mt-4 max-w-xs sm:max-w-none">
      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        disabled={syncing}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${
          isWishlisted
            ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500"
            : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
        }`}
      >
        {syncing ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <svg
            className="h-4 w-4"
            fill={isWishlisted ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        )}
        <span>
          {syncing
            ? "Menyimpan..."
            : isWishlisted
            ? "Hapus dari Wishlist"
            : "Tambah ke Wishlist"}
        </span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 py-3 text-xs font-bold text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 active:scale-[0.98]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 10.742l4.632-2.316m0 0a3 3 0 100-4.342 3 3 0 000 4.342zm0 4.632l-4.632 2.316m0 0a3 3 0 100 4.342 3 3 0 000-4.342z"
          />
        </svg>
        <span>{copied ? "Link Disalin! ✓" : "Bagikan"}</span>
      </button>
    </div>
  );
}
