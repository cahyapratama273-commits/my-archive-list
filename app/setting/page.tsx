"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiFetch, emitApiAlert } from "@/app/lib/api-client";

interface DbStatus {
  found: boolean;
  wishlistCount: number;
  checking: boolean;
}

export default function SettingPage() {
  const { data: session, status } = useSession();
  const synced = useRef(false);
  const [dbStatus, setDbStatus] = useState<DbStatus>({
    found: false,
    wishlistCount: 0,
    checking: true,
  });
  const [syncing, setSyncing] = useState(false);

  // ── Cek status DB dan sync saat login ────────────────────────────────────────
  useEffect(() => {
    if (!session?.user) {
      setDbStatus({ found: false, wishlistCount: 0, checking: false });
      return;
    }

    async function checkAndSync() {
      // Cek apakah user sudah ada di DB
      try {
        const res = await apiFetch<{ success: boolean; found: boolean; user: { wishlist: unknown } }>(
          "/api/sync-user",
          { silent: true }
        );
        const wishlist = Array.isArray(res?.user?.wishlist)
          ? res.user.wishlist
          : typeof res?.user?.wishlist === "string"
          ? JSON.parse(res.user.wishlist)
          : [];
        setDbStatus({ found: true, wishlistCount: wishlist.length, checking: false });
      } catch {
        setDbStatus({ found: false, wishlistCount: 0, checking: false });
      }

      // Sync lokal wishlist ke DB (hanya sekali per sesi)
      if (!synced.current) {
        synced.current = true;
        let wishlist: unknown[] = [];
        try {
          const stored = localStorage.getItem("my_archive_wishlist");
          if (stored) wishlist = JSON.parse(stored);
        } catch {}

        try {
          await apiFetch("/api/sync-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wishlist }),
            silent: true,
          });
        } catch {}
      }
    }

    checkAndSync();
  }, [session]);

  // ── Manual sync ───────────────────────────────────────────────────────────────
  async function handleManualSync() {
    setSyncing(true);
    let wishlist: unknown[] = [];
    try {
      const stored = localStorage.getItem("my_archive_wishlist");
      if (stored) wishlist = JSON.parse(stored);
    } catch {}

    try {
      const res = await apiFetch<{ success: boolean; user: { wishlist: unknown[] } }>(
        "/api/sync-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wishlist }),
          showSuccess: true,
          successMessage: "Data berhasil disinkronkan ke database.",
        }
      );
      const wl = Array.isArray(res?.user?.wishlist) ? res.user.wishlist : [];
      setDbStatus({ found: true, wishlistCount: wl.length, checking: false });
    } catch {
      // error sudah ditampilkan oleh apiFetch
    }
    setSyncing(false);
  }

  // ── Loading State ─────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <div className="border-b border-zinc-900 pb-6 mb-8 space-y-2.5">
          <div className="h-3 w-24 rounded bg-zinc-800 skeleton-shimmer-outer" />
          <div className="h-8 w-56 rounded bg-zinc-800 skeleton-shimmer-outer" />
          <div className="h-3 w-72 rounded bg-zinc-800/60 skeleton-shimmer-outer" />
        </div>
        {/* Profile card skeleton */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-zinc-800 skeleton-shimmer-outer shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 rounded bg-zinc-800 skeleton-shimmer-outer" />
              <div className="h-3 w-48 rounded bg-zinc-800/60 skeleton-shimmer-outer" />
              <div className="h-5 w-36 rounded-full bg-zinc-800/60 skeleton-shimmer-outer" />
            </div>
          </div>
        </div>
        <div className="h-14 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 skeleton-shimmer-outer mb-4" />
        <div className="h-11 rounded-xl bg-zinc-800/40 skeleton-shimmer-outer" />
        <style>{`
          .skeleton-shimmer-outer { position: relative; overflow: hidden; }
          .skeleton-shimmer-outer::after {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
            background-size: 200% 100%; animation: shimmer 1.6s infinite;
          }
          @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
      </main>
    );
  }

  // ── Main Render ───────────────────────────────────────────────────────────────
  return (
    <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="border-b border-zinc-900 pb-6 mb-8">
        <div className="text-xs text-zinc-500 mb-2 flex items-center gap-1.5 font-medium">
          <Link href="/" className="hover:text-zinc-350 transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-zinc-350">Pengaturan</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Akun &amp; Pengaturan</h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 font-medium">
          Kelola profil akun, sinkronisasi cloud, dan data wishlist Anda.
        </p>
      </div>

      {/* ── SIGNED IN ─────────────────────────────────────────────────────────── */}
      {session ? (
        <div className="space-y-4">
          {/* Profile Card */}
          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-md">
            <div className="flex items-center gap-4.5">
              <img
                src={session.user?.image || "/default-avatar.png"}
                alt={session.user?.name || "User avatar"}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-500/50 shadow-lg"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-bold text-white leading-snug">
                  {session.user?.name || "User"}
                </p>
                <p className="truncate text-xs font-semibold text-zinc-400 mt-0.5">
                  {session.user?.email}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-400 select-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Terhubung (Google OAuth)
                </div>
              </div>
            </div>
          </section>

          {/* DB Status Panel */}
          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                Status Database
              </h2>
              <button
                onClick={handleManualSync}
                disabled={syncing}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {syncing ? "Menyinkronkan..." : "Sync Ulang"}
              </button>
            </div>

            <div className="space-y-2.5">
              {/* DB Connection Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium">Akun di Database</span>
                {dbStatus.checking ? (
                  <span className="flex items-center gap-1.5 text-zinc-500 font-semibold">
                    <div className="h-3 w-3 animate-spin rounded-full border border-zinc-600 border-t-transparent" />
                    Memeriksa...
                  </span>
                ) : dbStatus.found ? (
                  <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Tersimpan di DB
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 font-bold text-rose-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Belum tersimpan
                  </span>
                )}
              </div>

              {/* Wishlist count */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium">Wishlist di Cloud</span>
                {dbStatus.checking ? (
                  <span className="text-zinc-600 font-semibold">—</span>
                ) : (
                  <span className="font-bold text-zinc-300">
                    {dbStatus.wishlistCount} item
                  </span>
                )}
              </div>

              {/* Warning jika belum tersimpan */}
              {!dbStatus.checking && !dbStatus.found && (
                <div className="mt-2 rounded-lg border border-amber-800/40 bg-amber-950/30 px-3 py-2 text-[11px] font-semibold text-amber-400 leading-relaxed">
                  ⚠️ Akun belum ditemukan di database. Klik &quot;Sync Ulang&quot; untuk menyimpan. Jika masalah berlanjut, pastikan DATABASE_URL sudah dikonfigurasi di Vercel.
                </div>
              )}
            </div>
          </section>

          {/* Wishlist Link */}
          <section className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <Link
              href="/wishlist"
              className="flex items-center justify-between px-6 py-4.5 text-xs sm:text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900/60"
            >
              <div className="flex items-center gap-3">
                <svg className="h-4.5 w-4.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Wishlist Saya</span>
              </div>
              <span className="text-zinc-500 font-bold">→</span>
            </Link>
          </section>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full inline-flex h-11 items-center justify-center rounded-xl border border-rose-900/40 bg-rose-950/20 text-xs sm:text-sm font-bold text-rose-400 hover:bg-rose-950/50 transition-all duration-200 active:scale-[0.98]"
          >
            Keluar (Logout)
          </button>
        </div>
      ) : (
        /* ── SIGNED OUT ─────────────────────────────────────────────────────── */
        <div className="rounded-2xl border border-zinc-850 bg-zinc-900/30 p-6 sm:p-8 backdrop-blur-md text-center space-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Silakan Masuk</h3>
            <p className="text-xs text-zinc-500 mt-1 font-medium">
              Masuk dengan Google untuk menyimpan dan menyinkronkan wishlist ke database cloud.
            </p>
          </div>
          <button
            onClick={() => signIn("google", { callbackUrl: "/setting" })}
            className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-white text-xs sm:text-sm font-bold text-zinc-950 hover:bg-zinc-200 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-white/5 gap-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Masuk dengan Google
          </button>
        </div>
      )}
    </main>
  );
}