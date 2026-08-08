import { CardSkeletonGrid } from "@/components/CardSkeleton";

export default function MovieLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6 mb-6">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-zinc-800 skeleton-shimmer-outer" />
            <div className="h-8 w-52 rounded bg-zinc-800 skeleton-shimmer-outer" />
            <div className="h-3 w-36 rounded bg-zinc-800/60 skeleton-shimmer-outer" />
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-9 w-16 rounded-lg bg-zinc-800/60 skeleton-shimmer-outer" />
            ))}
          </div>
        </div>
        <div className="h-12 rounded-xl border border-zinc-900 bg-zinc-950 mb-8 skeleton-shimmer-outer" />
        <CardSkeletonGrid count={24} cols="grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4" />
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
