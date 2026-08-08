import Image from "next/image";
import DetailButton from "./DetailButton";
import { MediaData, Category } from "@/app/lib/type";

interface CardProps {
  item: MediaData;
  category: Category;
  priority?: boolean;
}

const BADGE_CONFIG: Record<Category, { text: string; color: string }> = {
  anime: { text: "Anime", color: "bg-pink-600/90" },
  film: { text: "Film", color: "bg-blue-600/90" },
  movie: { text: "Movie", color: "bg-emerald-600/90" },
};

export default function Card({ item, category, priority = false }: CardProps) {
  const badge = BADGE_CONFIG[category] || { text: item.tipe, color: "bg-indigo-600/90" };

  // Format durasi / episode agar rapi
  const durationText = category === "anime" && item.episode 
    ? `${item.episode} Eps` 
    : item.durasi.replace("min/ep", "Eps").replace("min", "mnt");

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-1.5 transition-all duration-200 hover:border-zinc-700/80 hover:bg-zinc-900/90 shadow-lg hover:shadow-2xl hover:scale-[1.01]">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-950">
        <Image
          src={item.img}
          alt={item.judul}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges Overlay */}
        <span className={`absolute left-2.5 top-2.5 rounded-lg px-2.5 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase shadow-md backdrop-blur-sm bg-opacity-90 transition-all group-hover:scale-105 cursor-default select-none z-10 ${badge.color}`}>
          {badge.text}
        </span>
        
        <span className="absolute right-2.5 top-2.5 rounded-lg bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-yellow-400 backdrop-blur-md border border-white/5 shadow-md flex items-center gap-0.5 cursor-default select-none z-10">
          ★ {item.rating}
        </span>
      </div>

      {/* Info Content */}
      <div className="flex flex-1 flex-col gap-1.5 px-2 py-3">
        <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors duration-200">
          {item.judul}
        </h3>
        
        <span className="text-[10px] sm:text-xs text-zinc-400/80 font-medium">
          {item.tahun} • {durationText}
        </span>

        {/* Genres */}
        {item.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {item.genres.slice(0, 2).map((genre) => (
              <span 
                key={genre} 
                className="rounded bg-zinc-800/80 border border-zinc-700/30 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-300/90 transition-colors group-hover:border-zinc-700/60"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <DetailButton id={item.id} type={category} className="mt-2.5 w-full" />
      </div>
    </div>
  );
}