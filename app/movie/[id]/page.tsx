import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getById, getSimilar } from "@/app/lib/data";
import DetailActions from "@/components/DetailActions";
import Card from "@/components/Card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = getById("movie", Number(id));

  if (!item) notFound();

  const similar = getSimilar("movie", item.id, 5);

  return (
    <div className="relative min-h-screen bg-zinc-950 px-4 py-10 sm:px-6">
      {/* Ambient Blur Backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[400px] -z-10 overflow-hidden opacity-20 pointer-events-none select-none">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-3xl scale-110"
          style={{ backgroundImage: `url(${item.img})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950" />
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Breadcrumbs */}
        <div className="text-xs text-zinc-500 mb-6 flex flex-wrap items-center gap-1.5 font-medium">
          <Link href="/" className="hover:text-zinc-350 transition-colors">Home</Link>
          <span>&gt;</span>
          <Link href="/movie" className="hover:text-zinc-350 transition-colors">Movie</Link>
          <span>&gt;</span>
          <span className="text-zinc-300 truncate max-w-xs">{item.judul}</span>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row gap-8 sm:gap-10">
          {/* Left Column (Poster + Actions) */}
          <div className="flex flex-col items-center md:items-start shrink-0 w-full max-w-[280px] mx-auto md:mx-0">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900 shadow-2xl">
              <Image src={item.img} alt={item.judul} fill priority sizes="280px" className="object-cover" />
            </div>
            <DetailActions item={item} category="movie" />
          </div>

          {/* Right Column (Info) */}
          <div className="flex-1 flex flex-col gap-5 mt-6 md:mt-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-3 py-1 text-xs font-extrabold tracking-wide uppercase select-none">
                Movie
              </span>
              <span className="rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-400 px-3 py-1 text-xs font-semibold select-none">
                Dirilis
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl leading-tight">
              {item.judul}
            </h1>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5">
              {item.genres.map((genre) => (
                <Link
                  key={genre}
                  href={`/genre?g=${encodeURIComponent(genre)}`}
                  className="rounded-full bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/60 hover:text-white px-3.5 py-1 text-xs font-semibold text-zinc-400 transition-colors"
                >
                  {genre}
                </Link>
              ))}
            </div>

            {/* Stats list */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-xs sm:text-sm font-semibold text-zinc-450">
              <div className="flex items-center gap-1 text-yellow-500">
                <span>★</span>
                <span>{item.rating} <span className="text-zinc-500 font-medium">/ 10</span></span>
              </div>
              <span className="text-zinc-800">•</span>
              <span>{item.durasi.replace("min/ep", "mnt / Eps").replace("min", "mnt")}</span>
              <span className="text-zinc-800">•</span>
              <span>{item.tahun}</span>
              <span className="text-zinc-800">•</span>
              <span className="rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase">{item.kualitas}</span>
              {item.episode && (
                <>
                  <span className="text-zinc-800">•</span>
                  <span>{item.episode} Episode</span>
                </>
              )}
            </div>

            {/* Grid Box Details */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-4 transition-colors hover:border-zinc-850">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 block mb-1">Sutradara</span>
                <span className="text-xs sm:text-sm font-bold text-zinc-200">{item.sutradara || "-"}</span>
              </div>
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-4 transition-colors hover:border-zinc-850">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 block mb-1">Studio</span>
                <span className="text-xs sm:text-sm font-bold text-zinc-200">{item.studio || "-"}</span>
              </div>
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-4 transition-colors hover:border-zinc-850">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 block mb-1">Status</span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-500">Dirilis</span>
              </div>
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-4 transition-colors hover:border-zinc-850">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 block mb-1">Sumber</span>
                <span className="text-xs sm:text-sm font-bold text-zinc-200">Naskah Asli</span>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base border-b border-zinc-900 pb-2">
                <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span>Sinopsis</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-350">{item.sinopsis}</p>
            </div>
          </div>
        </div>

        {/* Similar Movie list */}
        {similar.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <div className="mb-6 flex items-center gap-2.5 border-b border-zinc-900 pb-4">
              <span className="h-6 w-1 rounded-full bg-indigo-600 block" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Movie Serupa
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {similar.map((simItem) => (
                <Card key={simItem.id} item={simItem} category="movie" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}