import Image from "next/image";
import DetailButton from "./DetailButton";
import { MediaData, Category } from "@/app/lib/type";

interface CardProps {
  item: MediaData;
  category: Category;
  priority?: boolean;
}

const TYPE_COLOR: Record<string, string> = {
  Anime: "bg-pink-600/90",
  Film: "bg-blue-600/90",
  Movie: "bg-emerald-600/90",
};

export default function Card({ item, category, priority = false }: CardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-colors hover:border-indigo-500">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image
          src={item.img}
          alt={item.judul}
          fill
          priority={priority}
          sizes="(max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-yellow-400">
          ★ {item.rating}
        </span>
        <span
          className={`absolute left-2 top-2 rounded-md px-2 py-1 text-[10px] font-semibold text-white ${
            TYPE_COLOR[item.tipe] ?? "bg-indigo-600/90"
          }`}
        >
          {item.tipe}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-zinc-100">{item.judul}</h3>
        <span className="text-xs text-zinc-400">
          {item.tahun} • {item.durasi}
        </span>

        {item.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-indigo-300">
                {genre}
              </span>
            ))}
          </div>
        )}

        <DetailButton id={item.id} type={category} className="mt-auto w-full" />
      </div>
    </div>
  );
}