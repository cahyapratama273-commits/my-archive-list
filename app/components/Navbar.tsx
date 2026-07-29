"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

const MENU_LINKS = [
  { href: "/genre", label: "Genre" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/setting", label: "Setting" },
];

const CATEGORY_SUBMENU = [
  { href: "/anime", label: "Anime" },
  { href: "/film", label: "Film" },
  { href: "/movie", label: "Movie" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
    <header className="relative sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950 backdrop-blur">
      {/* ===== TOP BAR ===== */}
      <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-3 bg-zinc-950 px-4 py-3">
        <Link
          href="/"
          onClick={closeMenu}
          className="shrink-0 text-lg font-bold text-white hover:text-indigo-400 sm:text-xl"
        >
          MyArchiveList
        </Link>

        <div className="min-w-0 flex-1 md:max-w-xs">
          <SearchBar />
        </div>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 text-sm font-medium md:flex">
          <li className="group relative">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-white hover:bg-indigo-600"
            >
              Kategori
              <ChevronIcon className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <ul className="invisible absolute left-0 top-full z-50 mt-1 w-44 rounded-xl border border-zinc-800 bg-zinc-900 py-1.5 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
              {CATEGORY_SUBMENU.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2.5 text-zinc-200 hover:bg-indigo-600 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {MENU_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-lg px-3 py-2 text-white hover:bg-indigo-600"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white hover:bg-zinc-800 md:hidden"
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      {/* ===== OVERLAY ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 top-[57px] z-10 bg-black/60 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* ===== MOBILE PANEL ===== */}
{/* ===== MOBILE PANEL ===== */}
{isOpen && (
  <div className="absolute left-0 right-0 pt-14 z-10 border-b border-zinc-800 bg-zinc-900 shadow-2xl md:hidden">
    <ul className="flex flex-col px-2 py-2 text-sm font-medium">
      {/* Kategori */}
      <li className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Kategori
      </li>
      {CATEGORY_SUBMENU.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={closeMenu}
            className="block rounded-lg px-3 py-2.5 text-white hover:bg-zinc-800"
          >
            {item.label}
          </Link>
        </li>
      ))}

      <li className="mx-2 my-1 border-t border-zinc-800" />

      {/* Genre / Wishlist / Setting */}
      {MENU_LINKS.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={closeMenu}
            className="block rounded-lg px-3 py-3 text-white hover:bg-zinc-800"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)}
    </header>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}