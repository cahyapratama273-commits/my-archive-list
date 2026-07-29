// app/wishlist/page.tsx
"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function WishlistPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p className="p-8 text-zinc-400">Loading...</p>;

  if (!session) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-zinc-400">Login dulu untuk lihat wishlist</p>
        <Link href="/setting" className="text-indigo-400 hover:underline">
          Ke Setting →
        </Link>
      </div>
    );
  }

  return (/* render wishlist */);
}