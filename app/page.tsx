import Link from "next/link";
import { getPopular } from "@/app/lib/data";
import Card from "@/components/Card";
import { Category } from "@/app/lib/type";

const SECTIONS: { title: string; href: string; category: Category }[] = [
  { title: "Anime Populer", href: "/anime", category: "anime" },
  { title: "Film Populer", href: "/film", category: "film" },
  { title: "Movie Populer", href: "/movie", category: "movie" },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-zinc-950">
      {/* ===== HERO SECTION WITH AMBIENT GLOW ===== */}
      <div className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32">
        {/* Glow Effects */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6366f1] to-[#818cf8] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-4xl px-6 text-center flex flex-col items-center gap-6">
          {/* Badge Capsule */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1 text-[10px] sm:text-xs font-semibold text-zinc-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Platform Katalog Anime, Film & Movie
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-3xl leading-[1.1] sm:leading-[1.1]">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">MyArchiveList</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-400">
            Sebuah website yang menyediakan fitur pencarian untuk Film, Anime & Movies — temukan, jelajahi, dan simpan favorit kamu.
          </p>

          {/* Call to Actions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/anime"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:scale-[1.02] hover:shadow-indigo-600/35 active:scale-[0.98]"
            >
              <CompassIcon className="h-4 w-4" />
              Jelajahi Sekarang
            </Link>
            
            <Link
              href="/genre"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-6 py-3 text-xs sm:text-sm font-bold text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 hover:scale-[1.02] active:scale-[0.98]"
            >
              <TagIcon className="h-4 w-4" />
              Lihat Genre
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-[#818cf8] to-[#4338ca] opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* ===== CONTENT SECTIONS ===== */}
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 pb-20 space-y-12">
        {SECTIONS.map((section) => (
          <section key={section.category} className="group/section">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="h-6 w-1 rounded-full bg-indigo-600 block" />
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {section.title}
                </h2>
              </div>
              <Link 
                href={section.href} 
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-350"
              >
                Lihat semua
                <svg className="h-4 w-4 transition-transform group-hover/section:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {getPopular(section.category, 10).map((item, index) => (
                <Card key={item.id} item={item} category={section.category} priority={index < 2} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}