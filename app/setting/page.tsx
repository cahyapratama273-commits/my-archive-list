"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import Link from "next/link";

async function syncUserToDb(user: {
  id?: string | null;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}) {
  await fetch("/api/sync-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      google_id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    }),
  });
}

export default function SettingPage() {
  const { data: session, status } = useSession();
  const synced = useRef(false);

  // Sync ke DB sekali setelah login
  useEffect(() => {
    if (session?.user && !synced.current) {
      synced.current = true;
      syncUserToDb(session.user).catch(console.error);
    }
  }, [session]);
  if (status === "loading") {
    return (
      <main className="mx-auto max-w-lg px-4 py-12">
        <p className="text-zinc-500">Memuat...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">

      {/* ===== PROFILE CARD ===== */}
      <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        {session ? (
          <div className="flex items-center gap-4">
            <img
              src={session.user?.image || "/default-avatar.png"}
              alt=""
              className="h-16 w-16 rounded-full object-cover ring-2 ring-zinc-700"
            />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-white">
                {session.user?.name || "User"}
              </p>
              <p className="truncate text-sm text-zinc-400">
                {session.user?.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-2xl text-zinc-500">
              ?
            </div>
            <p className="mb-1 font-medium text-white">Belum login</p>
            <p className="mb-4 text-sm text-zinc-400">
              Login untuk sync wishlist ke akunmu
            </p>
            <button
              onClick={() => signIn("google", { callbackUrl: "/setting" })}
              className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
            >
              Login with Google
            </button>
          </div>
        )}
      </section>

      {/* ===== MENU (hanya jika login) ===== */}
      {session && (
        <section className="mb-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <Link
            href="/wishlist"
            className="flex items-center justify-between px-5 py-4 text-sm text-white transition hover:bg-zinc-800"
          >
            <span>Wishlist saya</span>
            <span className="text-zinc-500">→</span>
          </Link>
        </section>
      )}

      {/* ===== LOGOUT (hanya jika login) ===== */}
      {session && (
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full rounded-xl border border-red-900/40 bg-red-950/20 py-3 text-sm font-medium text-red-400 transition hover:bg-red-950/40"
        >
          Logout
        </button>
      )}
    </main>
  );
}