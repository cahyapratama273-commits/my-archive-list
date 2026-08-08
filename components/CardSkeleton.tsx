/**
 * CardSkeleton — Loading placeholder dengan shimmer animation
 * untuk menggantikan Card saat data belum siap.
 */
export default function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-1.5">
      {/* Poster placeholder */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-900">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>

      {/* Info placeholder */}
      <div className="flex flex-col gap-2 px-2 py-3">
        {/* Title */}
        <div className="h-3 w-4/5 rounded bg-zinc-800 overflow-hidden relative">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
        <div className="h-3 w-3/5 rounded bg-zinc-800 overflow-hidden relative">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
        {/* Meta */}
        <div className="h-2.5 w-1/2 rounded bg-zinc-800/70 overflow-hidden relative mt-0.5">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
        {/* Genre tags */}
        <div className="flex gap-1 mt-1">
          <div className="h-4 w-12 rounded bg-zinc-800/60 overflow-hidden relative">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          <div className="h-4 w-10 rounded bg-zinc-800/60 overflow-hidden relative">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>
        {/* Button */}
        <div className="h-8 w-full rounded-lg bg-zinc-800/50 overflow-hidden relative mt-1.5">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
      </div>

      <style>{`
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.04) 40%,
            rgba(255,255,255,0.08) 50%,
            rgba(255,255,255,0.04) 60%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/**
 * CardSkeletonGrid — Grid dari beberapa CardSkeleton
 */
export function CardSkeletonGrid({
  count = 10,
  cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
}: {
  count?: number;
  cols?: string;
}) {
  return (
    <div className={`grid gap-4 ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
