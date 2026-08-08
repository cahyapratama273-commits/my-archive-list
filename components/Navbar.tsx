"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SearchBar from "./SearchBar";

const MENU_LINKS = [
  { href: "/genre", label: "Genre" },
  { href: "/wishlist", label: "Wishlist" },
];

const CATEGORY_SUBMENU = [
  { href: "/anime", label: "Anime" },
  { href: "/film", label: "Film" },
  { href: "/movie", label: "Movie" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md print:hidden">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2 shrink-0 font-bold text-white transition-colors hover:text-indigo-400"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg shadow-md shadow-indigo-500/20">
            <img src="/Kurumi.png" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <span className="text-lg tracking-tight sm:text-xl font-extrabold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            MyArchiveList
          </span>
        </Link>

        {/* SEARCH BAR (CENTER) */}
        <div className="min-w-0 flex-1 md:max-w-xs">
          <SearchBar />
        </div>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          {/* Dropdown Kategori */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1.5 py-1 text-zinc-300 transition-colors hover:text-white"
            >
              Kategori
              <ChevronIcon className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full z-50 mt-1 w-40 origin-top-left rounded-xl border border-zinc-800 bg-zinc-900/95 p-1.5 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
              {CATEGORY_SUBMENU.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-indigo-600 hover:text-white ${
                    pathname === item.href ? "bg-zinc-800 text-indigo-400" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Links: Genre & Wishlist */}
          {MENU_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`py-1 transition-colors hover:text-white ${
                pathname === item.href ? "text-indigo-400" : "text-zinc-300"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Gear icon for Settings */}
          <Link
            href="/setting"
            className={`p-1.5 rounded-lg transition-colors hover:bg-zinc-800/60 ${
              pathname === "/setting" ? "text-indigo-400" : "text-zinc-400 hover:text-zinc-200"
            }`}
            aria-label="Settings"
          >
            <SettingsIcon className="h-4 w-4" />
          </Link>

          {/* Login/Profile Action Button */}
          {session?.user ? (
            <Link href="/setting" className="shrink-0">
              <img
                src={session.user.image || "/default-avatar.png"}
                alt={session.user.name || "User"}
                className="h-8 w-8 rounded-full border border-indigo-500/50 object-cover ring-2 ring-indigo-500/20 transition hover:scale-105"
              />
            </Link>
          ) : (
            <Link
              href="/setting"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white md:hidden transition-colors"
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </nav>

      {/* MOBILE PANEL OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 top-[53px] z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* MOBILE NAV PANEL */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[53px] z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-4 py-4 shadow-2xl md:hidden">
          <ul className="flex flex-col gap-2 text-sm font-medium">
            <li className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3">
              Kategori
            </li>
            {CATEGORY_SUBMENU.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className={`block rounded-lg px-3 py-2 text-zinc-200 transition-colors hover:bg-zinc-900 ${
                    pathname === item.href ? "bg-indigo-950/40 text-indigo-400" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li className="my-1 border-t border-zinc-850" />

            {MENU_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className={`block rounded-lg px-3 py-2 text-zinc-200 transition-colors hover:bg-zinc-900 ${
                    pathname === item.href ? "bg-indigo-950/40 text-indigo-400" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li>
              <Link
                href="/setting"
                onClick={closeMenu}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-200 transition-colors hover:bg-zinc-900 ${
                  pathname === "/setting" ? "bg-indigo-950/40 text-indigo-400" : ""
                }`}
              >
                <SettingsIcon className="h-4 w-4" />
                <span>Pengaturan</span>
              </Link>
            </li>

            <li className="mt-2 pt-2 border-t border-zinc-850">
              {session?.user ? (
                <div className="flex items-center gap-3 px-3 py-1">
                  <img
                    src={session.user.image || "/default-avatar.png"}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">{session.user.name}</p>
                    <p className="truncate text-[10px] text-zinc-500">{session.user.email}</p>
                  </div>
                </div>
              ) : (
                <Link
                  href="/setting"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500"
                >
                  Masuk dengan Google
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}