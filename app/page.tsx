import Link from "next/link";
import { getPopular } from "@/app/lib/data";
import Card from "@/app/components/Card";
import { Category } from "@/app/lib/type";

const SECTIONS: { title: string; href: string; category: Category }[] = [
  { title: "Anime Populer", href: "/anime", category: "anime" },
  { title: "Film Populer", href: "/film", category: "film" },
  { title: "Movie Populer", href: "/movie", category: "movie" },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-zinc-950 font-sans">
      <div className="flex flex-col items-center gap-7 px-6 py-16 text-center">
        <h1 className="text-6xl font-bold tracking-tight text-indigo-400">Welcome</h1>
        <h1 className="text-6xl font-bold tracking-tight text-zinc-100">MyArchiveList</h1>
        <p className="text-lg text-zinc-400">
          Sebuah website yang menyediakan fitur Pencarian untuk Film, Anime, & Movies
        </p>
      </div>

      {SECTIONS.map((section) => (
        <section key={section.category} className="px-6 py-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-indigo-400">{section.title}</h2>
              <Link href={section.href} className="text-sm text-indigo-400 transition-colors hover:text-indigo-300">
                Lihat semua &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {getPopular(section.category, 10).map((item, index) => (
                <Card key={item.id} item={item} category={section.category} priority={index < 2} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}