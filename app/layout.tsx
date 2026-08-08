import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";
import Providers from "../components/Providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyArchiveList",
  description: "List Anime, Film & Movie Favoritmu",
  icons:{
    icon: "/Kurumi.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100 font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-8 mt-auto print:hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        {/* LOGO */}
        <div className="flex items-center gap-2 font-extrabold text-zinc-300">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-600 text-white shadow shadow-indigo-500/20">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
            </svg>
          </div>
          <span className="tracking-tight">MyArchiveList</span>
        </div>


        <p className="text-center sm:text-left font-medium">
          &copy; {new Date().getFullYear()} MyArchiveList. Platform Katalog Anime, Film & Movie.
        </p>

        {/* LINKS */}
        <div className="flex gap-5 font-semibold">
          <a href="./" className="hover:text-zinc-350 transition-colors">Tentang</a>
          <a href="./" className="hover:text-zinc-350 transition-colors">Kebijakan</a>
          <a href="./" className="hover:text-zinc-350 transition-colors">Kontak</a>
        </div>
      </div>
    </footer>
  );
}