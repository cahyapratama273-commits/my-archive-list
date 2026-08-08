export default function GenreLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="border-b border-zinc-900 pb-6 mb-8 space-y-2">
          <div className="h-3 w-24 rounded bg-zinc-800 skeleton-shimmer-outer" />
          <div className="h-8 w-48 rounded bg-zinc-800 skeleton-shimmer-outer" />
          <div className="h-3 w-64 rounded bg-zinc-800/60 skeleton-shimmer-outer" />
        </div>

        {/* Genre chips skeleton */}
        <div className="flex flex-wrap gap-2.5">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-full bg-zinc-900 border border-zinc-800 skeleton-shimmer-outer"
              style={{ width: `${60 + (i % 4) * 20}px` }}
            />
          ))}
        </div>
      </div>
      <style>{`
        .skeleton-shimmer-outer { position: relative; overflow: hidden; }
        .skeleton-shimmer-outer::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
          background-size: 200% 100%; animation: shimmer 1.6s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  );
}
