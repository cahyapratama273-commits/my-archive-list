import Image from "next/image";
import { notFound } from "next/navigation";
import { getById } from "@/app/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

const TYPE_COLOR: Record<string, string> = {
  Anime: "bg-pink-600",
  Film: "bg-blue-600",
  Movie: "bg-emerald-600",
};

export default async function AnimeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = getById("anime", Number(id));

  if (!item) notFound();

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-xs flex-shrink-0 overflow-hidden rounded-lg md:mx-0">
          <Image src={item.img} alt={item.judul} fill priority sizes="320px" className="object-cover" />
        </div>

        <div className="flex flex-col gap-4">
          <span
            className={`w-fit rounded-md px-3 py-1 text-xs font-semibold text-white ${
              TYPE_COLOR[item.tipe] ?? "bg-indigo-600"
            }`}
          >
            {item.tipe}
          </span>

          <h1 className="text-3xl font-bold text-indigo-400">{item.judul}</h1>

          <div className="flex flex-wrap gap-2">
            {item.genres.map((genre) => (
              <span key={genre} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-indigo-300">
                {genre}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
            <span>★ {item.rating} / 10</span>
            <span>{item.durasi}</span>
            <span>{item.tahun}</span>
            <span>{item.kualitas}</span>
          </div>

          <p className="text-sm text-zinc-500">Sutradara: {item.sutradara}</p>
          <p className="leading-relaxed text-zinc-300">{item.sinopsis}</p>
        </div>
      </div>
    </div>
  );
}